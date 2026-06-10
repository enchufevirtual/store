import { Logo } from '#components/Logo'
import type { Props as NavigationProps } from '#components/Navigation'
import { Navigation } from '#components/Navigation'
import { Search } from '#components/Search'
import { Link } from '#i18n/Link'

export type HeaderProps = Partial<NavigationProps>

export const Header: React.FC<HeaderProps> = ({ navigation }) => {
  return (
    <header className='border-b-gray-200 border-b pb-4 sticky top-0 bg-white z-50'>
      <nav className='flex flex-col lg:flex-row items-center justify-between gap-4 py-4'>
        <div className='flex items-center'>
          <Link href='/'><Logo /></Link>
        </div>

        <div className='w-full lg:w-auto flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-4 w-full'>
            <Search className='order-1 grow lg:grow-0 w-full lg:w-auto' />
            {navigation && <Navigation navigation={navigation} className='order-2 lg:order-1' />}
          </div>
        </div>
      </nav>
    </header>
  )
}
