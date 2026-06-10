import { EnchufeVirtualGlyph } from '#assets/icons'
import { Container } from '#components/Container'
import { Link } from '#i18n/Link'

export const Footer: React.FC = () => {
  return (
    <div className='grow py-8 lg:p-16 mt-24 bg-gray-50'>
      <Container>
        <div className='flex flex-col items-center gap-6'>
          <div className='flex gap-4 items-center justify-center'>
            <a href="https://www.facebook.com/enchufevirtual" target="_blank" rel="noopener noreferrer">
              <img src="/icons/facebook.svg" alt="Facebook" width={20} height={20} />
            </a>
            <a href="https://www.linkedin.com/company/enchufevirtual" target="_blank" rel="noopener noreferrer">
              <img src="/icons/linkedin.svg" alt="LinkedIn" width={20} height={20} />
            </a>
            <a href="https://www.github.com/enchufevirtual" target="_blank" rel="noopener noreferrer">
              <img src="/icons/github.svg" alt="GitHub" width={20} height={20} />
            </a>
          </div>

          <div className='w-full mt-6 py-6 border-y border-y-gray-100 text-xs flex flex-col items-center md:flex-row md:justify-center md:divide-x md:divide-gray-100'>
            <div className='py-2 md:py-0 md:px-4 text-center'>
              <Link href='/terms-and-conditions'>Términos y condiciones</Link>
            </div>
            <div className='py-2 md:py-0 md:px-4 text-center'>
              <Link href='/cookies-and-privacy'>Cookies y privacidad</Link>
            </div>
          </div>

          <div className='w-full mt-12 flex justify-center items-center flex-col gap-6'>
            <div className='text-gray-500 flex flex-col md:flex-row gap-4 items-center justify-center text-center'>
              <EnchufeVirtualGlyph aria-label='Enchufe Virtual logomark' width={32} />
              <div className='text-xs leading-relaxed'>
                © 2026 Enchufe Virtual. Todos los derechos reservados.<br />
                Tienda de tecnología respaldada por distribuidoras autorizadas y certificadas en Ecuador.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
