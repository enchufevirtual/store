import { serverSideSettings } from '#contexts/SettingsContext'
import { getCatalog } from '#data/models/catalog'
import { getDefaultLocaleCode } from '#i18n/defaultLocale'
import { getLocale, getLocaleCodes } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#utils/catalog'
import { getPages } from '#utils/pages'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import type { Props } from './CustomPageComponent'

type Query = {
  locale: string
  slug?: string[]
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths(async localeCode => {

    const pages = await getPages(localeCode)

    return {
      fallback: false,
      paths: pages.map(page => ({
        params: {
          slug: page.slug.split('/')
        }
      }))
    }
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale: localeParam, slug } = params!
  const localeCodes = await getLocaleCodes()
  const isLocaleValid = localeCodes.includes(localeParam)
  const localeCode = isLocaleValid ? localeParam : await getDefaultLocaleCode()
  const locale = await getLocale(localeCode)
  const catalog = await getCatalog(locale)

  const resolvedSlug = isLocaleValid ? (slug ? slug.join('/') : '') : [localeParam, ...(slug ?? [])].join('/')
  const pages = await getPages(localeCode)
  const page = pages.find(page => page.slug === resolvedSlug)

  if (!page) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      page,
      localeCodes,
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
