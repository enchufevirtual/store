import NextLink from 'next/link'
import type { UrlObject } from 'url'

declare type Url = string | UrlObject;

type LinkProps = Omit<Parameters<typeof NextLink>[0], 'locale' | 'href'>
  & (
    | { href: Url }
    | { locale: string }
  )

function isUrlAbsolute(url: string) {
  return (url.indexOf('://') > 0 || url.indexOf('//') === 0)
}

export const Link: React.FC<LinkProps> = ({ children, ...props }) => {
  if ('locale' in props) {
    const { locale, ...otherProps } = props
    return <NextLink {...otherProps} href='/'>{children}</NextLink>
  }

  if (typeof props.href !== 'string' || isUrlAbsolute(props.href.toString())) {
    return <NextLink {...props} href={props.href}>{children}</NextLink>
  }

  const href = props.href

  if (href === '/') {
    return <NextLink {...props} href='/'>{children}</NextLink>
  }

  const normalizedHref = href.startsWith('/') ? href : `/${href}`

  return <NextLink {...props} href={normalizedHref.replace(/^[\/]+/, '/')}>
    {children}
  </NextLink>
}
