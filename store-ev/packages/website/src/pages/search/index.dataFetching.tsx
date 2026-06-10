import { serverSideSettings } from '#contexts/SettingsContext'
import { getCatalog } from '#data/models/catalog'
import { getLocale } from '#i18n/locale'
import { getDefaultLocaleCode } from '#i18n/defaultLocale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { getRootNavigationLinks } from '#utils/catalog'
import type { GetServerSideProps, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import type { Props } from './SearchPageComponent'

type Query = ParsedUrlQuery

// No getStaticPaths needed for static /search index page in Spanish-only site

export const getStaticProps: GetStaticProps<Props, Query> = async () => {
  const localeCode = await getDefaultLocaleCode()
  const locale = await getLocale(localeCode)
  const catalog = await getCatalog(locale)

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      products: [],
      searching: true,
      localeCodes: ['es'],
      ...(await serverSideSettings(localeCode)),
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ res }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return getStaticProps({})
}
