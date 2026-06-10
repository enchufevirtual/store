import { CustomPageComponent } from './[locale]/CustomPageComponent'
import { serverSideSettings } from '#contexts/SettingsContext'
import { getCatalog } from '#data/models/catalog'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { getPages } from '#utils/pages'
import { getRootNavigationLinks } from '#utils/catalog'
import type { GetStaticProps, NextPage } from 'next'

import type { CustomPage } from '#utils/pages'
import type { HeaderProps } from '#components/Header'

export type Props = HeaderProps & {
  page: CustomPage
}

const HomePage: NextPage<Props> = ({ page, navigation }) => {
  return (
    <CustomPageComponent
      navigation={navigation}
      page={page}
    />
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const localeCode = "es"
  const locale = await getLocale(localeCode)
  const catalog = await getCatalog(locale)
  const pages = await getPages(localeCode)
  const page = pages.find(page => page.slug === '')

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

export default HomePage
