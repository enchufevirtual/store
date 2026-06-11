import { Logo } from '#components/Logo'
import type { Props as NavigationProps } from '#components/Navigation'
import { Navigation } from '#components/Navigation'
import { Link } from '#i18n/Link'

export type HeaderProps = Partial<NavigationProps>

export const Header: React.FC<HeaderProps> = ({ navigation }) => {
  return (
    <header className='border-b-gray-200 border-b pb-4 sticky top-0 bg-white z-50'>
      <nav className='flex items-center justify-between gap-2 py-2'>
        <div className='flex items-center'>
          <Link href='/'><Logo /></Link>
        </div>

        <div className='lg:w-auto flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-4 w-full'>
            {navigation && <Navigation navigation={navigation} className='order-2 lg:order-1' />}
          </div>
        </div>
      </nav>
    </header>
  )
}
