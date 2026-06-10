import facetsConfig from '#config/facets.config'
import { getRawDataProducts } from '#data/products'
import { getLocale } from '#i18n/locale'
import { getDefaultLocaleCode } from '#i18n/defaultLocale'
import type { FacetResult, Primitives } from '#utils/facets'
import { getFacets } from '#utils/facets'
import { addProductVariants, getProductWithVariants, type LocalizedProductWithVariant, spreadProductVariants } from '#utils/products'
import type * as Fuse from 'fuse.js'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type SelectedFacets = FacetResult

type Context = {
  products: LocalizedProductWithVariant[]
  availableFacets: FacetResult
  selectedFacets: SelectedFacets
  selectFacet: (name: string, value: Primitives | Primitives[]) => void
  currencyCode?: string | null | undefined
}

type Props = Omit<Context, 'availableFacets' | 'selectedFacets' | 'selectFacet'> & {
  children: React.ReactNode
}

const CatalogContext = createContext<Context>({
  products: [],
  availableFacets: {},
  selectedFacets: {},
  selectFacet: () => { }
})

export const useCatalogContext = () => useContext(CatalogContext)

export const CatalogProvider: React.FC<Props> = ({ children, products: initialProducts }) => {
  const router = useRouter()

  const [flattenProducts, setFlattenProducts] = useState(initialProducts)

  const { products: productsWithTaxonomies } = useCatalog(flattenProducts)
  const productsWithPrices = productsWithTaxonomies

  const [query, setQuery] = useState<string | undefined>(undefined)

  const [products, setProducts] = useState<Context['products']>(initialProducts)
  const [availableFacets, setAvailableFacets] = useState<Context['availableFacets']>({})
  const [selectedFacets, setSelectedFacets] = useState<Context['selectedFacets']>({})

  const isFiltering = useMemo(() => Object.entries(selectedFacets).length > 0 || query !== undefined, [selectedFacets, query])

  const productList = useMemo(
    () => isFiltering
      ? productsWithPrices
      : initialProducts
        .map(p => productsWithPrices.find(cp => cp.sku === p.sku))
        .filter((product): product is LocalizedProductWithVariant => Boolean(product)),
    [isFiltering, productsWithPrices, initialProducts]
  )

  useEffect(function fastRender() {
    setProducts(initialProducts)
  }, [initialProducts])

  const selectFacet = useMemo<Context['selectFacet']>(
    () => (name, value) => {
      const facets = { ...selectedFacets }

      facets[name] = facets[name] || []
      const facet = facets[name] || []

      if (Array.isArray(facet)) {
        if (Array.isArray(value)) {
          facets[name] = value
        } else {
          const index = facet.indexOf(value)
          index > -1 ? facet.splice(index, 1) : facet.push(value)
  
          if (facet.length === 0) {
            delete facets[name]
          }
        }
      }

      router.push({
        query: {
          ...router.query,
          facets: JSON.stringify(facets)
        }
      }, undefined, { scroll: false, shallow: true })
    },
    [selectedFacets, router]
  )

  useEffect(function enrichProductsWithVariants() {
    (async () => {
      const rawDataProducts = await getRawDataProducts()
      const products = initialProducts.map(ref => getProductWithVariants(ref.sku, ref._locale, rawDataProducts))
      setFlattenProducts(products)
    })()
  }, [initialProducts])

  useEffect(function manageOnRouterChange() {
    if (typeof router.query.facets === 'string' && router.query.facets !== '') {
      try {
        setSelectedFacets(JSON.parse(router.query.facets ?? '{}'))
      } catch (e) {
        setSelectedFacets({})

        // TODO: add isValidJson method and remove facets from url if it is not.
        console.error('The query param "facets" is not a stringified JSON.', e)
      }
    } else {
      setSelectedFacets({})
    }

    if (typeof router.query.q === 'string') {
      setQuery(router.query.q)
    } else {
      setQuery(undefined)
    }
  }, [router])

  useEffect(function manageSearch() {
    let isMounted = true

    async function runSearch() {
      const resultFromFreeTextSearch = await freeTextSearch(productList, query)
      const result = await facetSearch(resultFromFreeTextSearch, selectedFacets)

      if (isMounted) {
        setAvailableFacets(
          getFacets(spreadProductVariants(resultFromFreeTextSearch))
        )

        // TODO: this could be a configuration
        const uniqByKey = 'variantCode' // 'productCode'

        setProducts(isFiltering ? uniqBy(result, uniqByKey) : result)
      }
    }

    runSearch().catch(console.error)

    return () => {
      isMounted = false
    }
  }, [query, selectedFacets, productList, isFiltering])

  return (
    <CatalogContext.Provider value={{ products, availableFacets, selectedFacets, selectFacet }}>
      {children}
    </CatalogContext.Provider>
  )
}

function useCatalog(initialProducts: LocalizedProductWithVariant[]) {
  const router = useRouter()

  const [latestInitialProducts, setLatestInitialProducts] = useState(initialProducts)
  const [products, setProducts] = useState(initialProducts)

  const hasChanged = useMemo(
    () => JSON.stringify(latestInitialProducts) !== JSON.stringify(initialProducts),
    [initialProducts, latestInitialProducts]
  )

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      const { getRawDataCatalogs } = await import('#data/catalogs')
      const { buildProductDataset } = await import('#data/models/catalog')

      const localeCode = typeof router.query.locale === 'string'
        ? router.query.locale
        : await getDefaultLocaleCode()

      const locale = await getLocale(localeCode)

      const name = locale.country?.catalog || locale.language.catalog
      const rawDataCatalog = (await getRawDataCatalogs()).value.find(catalog => catalog.name === name)

      if (rawDataCatalog) {
        const productDataset = await buildProductDataset(rawDataCatalog, locale.code, initialProducts)

        if (isMounted) {
          const productsWithTaxonomies = Object.values(productDataset)
          setProducts(productsWithTaxonomies.map(product => addProductVariants(product, productsWithTaxonomies)))
          setLatestInitialProducts(initialProducts)
        }
      }
    })()


    return () => {
      isMounted = false
    }
  }, [initialProducts, router.query.locale])

  return {
    products: hasChanged ? initialProducts : products
  }
}

async function freeTextSearch(products: LocalizedProductWithVariant[], query: string | undefined): Promise<LocalizedProductWithVariant[]> {

  if (!query || query === '') {
    return products
  }

  const Fuse = (await import('fuse.js')).default

  const fuse = new Fuse(products, {
    useExtendedSearch: false,
    threshold: .3,
    keys: [
      'name',
      'description'
    ]
  })

  return fuse.search(query)
    .map(r => r.item)
}

async function facetSearch(products: LocalizedProductWithVariant[], facets: SelectedFacets): Promise<LocalizedProductWithVariant[]> {
  const Fuse = (await import('fuse.js')).default

  const facetsWithRangeType = facetsConfig.filter(c => c.appearance === 'priceRange').map(c => c.field)
  const isRangeType = (facetName: string) => facetsWithRangeType.includes(facetName)

  const andExpression: Fuse.Expression[] = []

  const availableFacets: FacetResult = {}

  const fuse = new Fuse(products, {
    useExtendedSearch: true,
    threshold: .3,
    getFn: (obj, path) => {
      const value = Fuse.config.getFn(obj, path)

      const pathWithDots = Array.isArray(path) ? path.join('.') : path

      availableFacets[pathWithDots] = availableFacets[pathWithDots] || []
      availableFacets[pathWithDots] = uniq(availableFacets[pathWithDots].concat(value))

      return value
    },
    keys: Object.keys(facets)
  })

  Object.entries(facets).forEach(([facetName, facetValue]) => {
    if (facetValue) {
      if (isRangeType(facetName)) {
        andExpression.push({
          $or: availableFacets[facetName]
            .filter(v => v >= facetValue[0] && v <= facetValue[1])
            .map(value => ({ $path: `${facetName}`, $val: `="${value}"` }))
        })
      } else {
        andExpression.push({
          $or: facetValue.map(value => ({ $path: `${facetName}`, $val: `="${value}"` }))
        })
      }
    }
  })

  if (andExpression.length <= 0) {
    return products
  }

  return fuse.search({ $and: andExpression })
    .map(r => r.item)
}
