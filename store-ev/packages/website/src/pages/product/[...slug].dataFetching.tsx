import { flattenReferencesFromCatalog } from '#utils/catalog'
import { getRawDataProducts } from '#data/products'
import { getLocale } from '#i18n/locale'
import { getDefaultLocaleCode } from '#i18n/defaultLocale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { getRootNavigationLinks } from '#utils/catalog'
import { getProductWithVariants, spreadProductVariants } from '#utils/products'
import { productSlugRegExp } from '#config/general.config'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import type { Props } from '../[locale]/product/ProductPageComponent'
import { serverSideSettings } from '#contexts/SettingsContext'
import { getCatalog } from '#data/models/catalog'

type Query = ParsedUrlQuery & {
  slug: string[]
}

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  const localeCode = await getDefaultLocaleCode()
  const locale = await getLocale(localeCode)
  const catalog = await getCatalog(locale)

  const references = flattenReferencesFromCatalog(catalog)

  const rawDataProducts = await getRawDataProducts()
  const products = references.map(ref => getProductWithVariants(ref, locale.code, rawDataProducts))

  const flattenProducts = spreadProductVariants(products)

  return {
    fallback: false,
    paths: flattenProducts.map(product => ({
      params: {
        slug: product.slug.split('/'),
        locale: ''
      } as Query
    }))
  }
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const localeCode = await getDefaultLocaleCode()
  const { slug } = params!
  const locale = await getLocale(localeCode)
  const catalog = await getCatalog(locale)
  const localeCodes = ['es']

  const productSlug = slug.join('/')
  const productCode = productSlug.match(productSlugRegExp)?.[1]

  if (!productCode) {
    throw new Error(`"productSlugRegExp" is not properly configured. Cannot apply RegExp "${productSlugRegExp}" to the given product slug "${productSlug}"`)
  }

  const rawDataProducts = await getRawDataProducts()

  return {
    props: {
      localeCodes,
      navigation: getRootNavigationLinks(catalog),
      product: getProductWithVariants(productCode, locale.code, rawDataProducts),
      ...(await serverSideSettings(localeCode)),
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ res, params }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return getStaticProps({ params })
}
