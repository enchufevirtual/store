import { EnchufeVirtualGlyph } from '#assets/icons'
import { useSettingsContext } from '#contexts/SettingsContext'

export const Logo: React.FC<React.JSX.IntrinsicElements['div']> = ({ className = '', ...props }) => {
  const settings = useSettingsContext()

  return (
    <div {...props} className={`text-black ${className}`}>
      {
        settings.organization?.logo_url ? (
          <img alt={`${settings.organization?.name} logo`} src={settings.organization?.logo_url} className='h-10' />
        ) : (
          <>
            <EnchufeVirtualGlyph width={32} className='m-1 inline' aria-label='Enchufe Virtual logomark' />
            <h1 className='text-lg font-bold inline'>Enchufe Virtual</h1>
          </>

        )
      }
    </div>
  )
}
