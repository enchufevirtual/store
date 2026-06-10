import { serverSideSettings } from '#contexts/SettingsContext'
import { getCatalog } from '#data/models/catalog'
import { getLocale } from '#i18n/locale'
import { getDefaultLocaleCode } from '#i18n/defaultLocale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { getRootNavigationLinks } from '#utils/catalog'
import { getPages } from '#utils/pages'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import type { Props } from './[locale]/CustomPageComponent'

type Query = ParsedUrlQuery & {
  slug?: string[]
}

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  const localeCode = await getDefaultLocaleCode()
  const pages = await getPages(localeCode)

  return {
    fallback: false,
    paths: pages
      .filter(page => page.slug && page.slug !== '')
      .map(page => ({
        params: {
          slug: page.slug.split('/'),
          locale: ''
        } as Query
      }))
  }
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const localeCode = await getDefaultLocaleCode()
  const { slug } = params ?? {}
  const locale = await getLocale(localeCode)
  const catalog = await getCatalog(locale)

  const pages = await getPages(localeCode)
  const page = pages.find(page => page.slug === (slug ? slug.join('/') : ''))

  if (!page) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      page,
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
