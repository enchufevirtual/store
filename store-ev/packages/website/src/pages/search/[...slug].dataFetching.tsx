import { serverSideSettings } from '#contexts/SettingsContext'
import { getCatalog } from '#data/models/catalog'
import { getRawDataProducts } from '#data/products'
import { getLocale } from '#i18n/locale'
import { getDefaultLocaleCode } from '#i18n/defaultLocale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { findTaxonBySlug, flattenReferencesFromTaxon, getNavigation, getRootNavigationLinks, getSlugs } from '#utils/catalog'
import { getProduct, type LocalizedProductWithVariant } from '#utils/products'
import type { GetServerSideProps, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import type { Props } from './SearchPageComponent'

type Query = ParsedUrlQuery & {
  slug: string[]
  locale?: string
}

export const getStaticPaths = async () => {
  const localeCode = await getDefaultLocaleCode()
  const locale = await getLocale(localeCode)
  const catalog = await getCatalog(locale)
  const slugs = getSlugs(catalog)

  return {
    fallback: false,
    paths: slugs.map(slug => ({
      params: {
        slug: slug.split('/')
      }
    }))
  }
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const localeCode = await getDefaultLocaleCode()
  const { slug } = params!
  const locale = await getLocale(localeCode)
  const catalog = await getCatalog(locale)
  const localeCodes = ['es']

  const taxon = findTaxonBySlug(catalog, slug.join('/'))

  const references = flattenReferencesFromTaxon(taxon.result)

  const rawDataProducts = await getRawDataProducts()

  const products: LocalizedProductWithVariant[] = references.map(ref => {
    const product = getProduct(ref, locale.code, rawDataProducts)

    return {
      ...product,
      variants: [],
      details: [],
      variant: []
    }
  })

  const result = {
    props: {
      localeCodes,
      navigation: getRootNavigationLinks(catalog),
      subNavigation: getNavigation(taxon),
      products,
      ...(await serverSideSettings(localeCode)),
      ...(await serverSideTranslations(localeCode))
    }
  }

  return result
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ res, params }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return getStaticProps({ params })
}
