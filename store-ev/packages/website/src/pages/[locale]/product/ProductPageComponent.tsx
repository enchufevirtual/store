import { Accordion } from '#components/Accordion'
import { Carousel } from '#components/Carousel'
// Price component removed — using product price from data
import type { HeaderProps } from '#components/Header'
import { Page } from '#components/Page'
import { VariantSelector } from '#components/VariantSelector'
// Auth and Settings contexts not required in simplified Spanish-only build
import type { LocalizedProduct, LocalizedProductWithVariant } from '#utils/products'
import { getProductUrl } from '#utils/url'
// Cart components removed for simplified Spanish-only version
import type { NextPage } from 'next'
import { useI18n } from 'next-localization'
import { useMemo, useState } from 'react'

const VerifiedBadge = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
  >
    <defs>
      <linearGradient id="vb-meta-grad" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#1D74FE" />
        <stop offset="100%" stopColor="#0062D1" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#vb-meta-grad)" />
    <path d="M8.5 12.3l2.2 2.2 4.8-4.8" stroke="#FFFFFF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

export type Props = HeaderProps & {
  product: LocalizedProductWithVariant
  localeCodes: string[]
}

export const ProductPageComponent: NextPage<Props> = ({ navigation: links, product, localeCodes }) => {
  const i18n = useI18n()
  const [currentProduct, setCurrentProduct] = useState<LocalizedProduct>(product.variants[0])

  const whatsappNumber = '593987212423'
  const whatsappMessage = encodeURIComponent(`Hola, quiero comprar el producto ${currentProduct?.name ?? product.name}. ¿Está disponible?`)
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  const productDetailsText = useMemo(() => {
    const description = currentProduct?.description || product.description || ''
    const skuCode = currentProduct?.productCode || product.productCode || ''
    
    // Mapa de especificaciones únicas por productCode
    const specsMap: Record<string, Array<{ label: string; value: string }>> = {
      'HDDADA4T': [
        { label: 'Capacidad', value: '4TB' },
        { label: 'Protección', value: 'Resistencia a golpes, caídas y vibraciones' },
        { label: 'Conectividad', value: 'USB 3.0' },
        { label: 'Velocidad', value: '5400 RPM' },
        { label: 'Casos de uso', value: 'Copias de seguridad, almacenamiento externo portátil' }
      ],
      'HDDADA1T': [
        { label: 'Capacidad', value: '1TB' },
        { label: 'Protección', value: 'Resistencia a golpes, caídas y vibraciones' },
        { label: 'Conectividad', value: 'USB 3.0' },
        { label: 'Velocidad', value: '5400 RPM' },
        { label: 'Casos de uso', value: 'Copias de seguridad, almacenamiento externo portátil' }
      ],
      'HDDADA2T': [
        { label: 'Capacidad', value: '2TB' },
        { label: 'Protección', value: 'Resistencia a golpes, caídas y vibraciones' },
        { label: 'Conectividad', value: 'USB 3.0' },
        { label: 'Velocidad', value: '5400 RPM' },
        { label: 'Casos de uso', value: 'Copias de seguridad, almacenamiento externo portátil' }
      ],
      'FMESNDZ5': [
        { label: 'Capacidad', value: '16GB' },
        { label: 'Protección', value: 'Diseño duradero compacto' },
        { label: 'Conectividad', value: 'USB 2.0' },
        { label: 'Velocidad', value: 'Hasta 12 MB/s lectura' },
        { label: 'Casos de uso', value: 'Transferencia de documentos, archivos portátiles' }
      ],
      'FMESNDZ3': [
        { label: 'Capacidad', value: '32GB' },
        { label: 'Protección', value: 'Diseño duradero compacto' },
        { label: 'Conectividad', value: 'USB 2.0' },
        { label: 'Velocidad', value: 'Hasta 12 MB/s lectura' },
        { label: 'Casos de uso', value: 'Transferencia de documentos, archivos portátiles' }
      ],
      'FMESNUZ4': [
        { label: 'Capacidad', value: '32GB' },
        { label: 'Protección', value: 'Cuerpo duradero resistente' },
        { label: 'Conectividad', value: 'USB 3.0' },
        { label: 'Velocidad', value: 'Hasta 150 MB/s lectura' },
        { label: 'Casos de uso', value: 'Almacenamiento rápido, transferencia de multimedia' }
      ],
      'FMESNPZ4': [
        { label: 'Capacidad', value: '64GB' },
        { label: 'Protección', value: 'Estructura reforzada metálica' },
        { label: 'Conectividad', value: 'USB 3.0' },
        { label: 'Velocidad', value: 'Hasta 200 MB/s lectura' },
        { label: 'Casos de uso', value: 'Archivos grandes, transferencia rápida profesional' }
      ],
      'FMESNDZ4': [
        { label: 'Capacidad', value: '64GB' },
        { label: 'Protección', value: 'Cuerpo duradero resistente' },
        { label: 'Conectividad', value: 'USB 3.0' },
        { label: 'Velocidad', value: 'Hasta 150 MB/s lectura' },
        { label: 'Casos de uso', value: 'Almacenamiento rápido, transferencia de multimedia' }
      ],
      'FMESNDZI': [
        { label: 'Capacidad', value: '64GB' },
        { label: 'Protección', value: 'Diseño resistente apto para estudiantes' },
        { label: 'Conectividad', value: 'USB 2.0' },
        { label: 'Velocidad', value: 'Hasta 10 MB/s lectura' },
        { label: 'Casos de uso', value: 'Almacenamiento educativo, archivos de estudiantes' }
      ],
      'FMEADAPP': [
        { label: 'Capacidad', value: '256GB' },
        { label: 'Protección', value: 'Cuerpo metálico duradero y confiable' },
        { label: 'Conectividad', value: 'USB 3.2 Gen1' },
        { label: 'Velocidad', value: 'Hasta 100 MB/s lectura' },
        { label: 'Casos de uso', value: 'Almacenamiento masivo profesional, archivos corporativos' }
      ],
      'FMESWDZ4': [
        { label: 'Capacidad', value: '128GB' },
        { label: 'Protección', value: 'Cuerpo duradero resistente' },
        { label: 'Conectividad', value: 'USB 3.0' },
        { label: 'Velocidad', value: 'Hasta 150 MB/s lectura' },
        { label: 'Casos de uso', value: 'Almacenamiento rápido, transferencia de multimedia' }
      ],
      'FMEADAUR': [
        { label: 'Capacidad', value: '256GB' },
        { label: 'Protección', value: 'Cuerpo metálico duradero y confiable' },
        { label: 'Conectividad', value: 'USB 3.2 Gen1' },
        { label: 'Velocidad', value: 'Hasta 100 MB/s lectura' },
        { label: 'Casos de uso', value: 'Almacenamiento masivo profesional, archivos corporativos' }
      ],
      'CABXXXSDATA': [
        { label: 'Tipo de conector', value: 'Serial DB-9' },
        { label: 'Longitud', value: '0.38 cm' },
        { label: 'Casos de uso', value: 'Conexión de dispositivos legacy, comunicación serie' },
        { label: 'Material', value: 'PVC recubierto' },
        { label: 'Compatibilidad', value: 'Puertos seriales tradicionales' }
      ],
      'CABXXXCRDCT62MT': [
        { label: 'Tipo de conector', value: 'RJ45 Cat6' },
        { label: 'Longitud', value: '2 metros' },
        { label: 'Velocidad máxima', value: '10 Gbps' },
        { label: 'Casos de uso', value: 'Conexión de redes, internet de banda ancha' },
        { label: 'Material', value: 'Cobre y PVC' }
      ],
      'CABXXXCRDCT63MT': [
        { label: 'Tipo de conector', value: 'RJ45 Cat6' },
        { label: 'Longitud', value: '3 metros' },
        { label: 'Velocidad máxima', value: '10 Gbps' },
        { label: 'Casos de uso', value: 'Conexión de redes, internet de banda ancha' },
        { label: 'Material', value: 'Cobre y PVC' }
      ],
      'CABXXXCRDCT610M': [
        { label: 'Tipo de conector', value: 'RJ45 Cat6' },
        { label: 'Longitud', value: '10 metros' },
        { label: 'Velocidad máxima', value: '10 Gbps' },
        { label: 'Casos de uso', value: 'Conexión de redes en espacios amplios, internet de banda ancha' },
        { label: 'Material', value: 'Cobre y PVC' }
      ],
      'CABARGCB-0047BK': [
        { label: 'Tipo de conector', value: 'USB Type-C' },
        { label: 'Longitud', value: '1.8 metros' },
        { label: 'Potencia de carga', value: '65W' },
        { label: 'Casos de uso', value: 'Carga rápida, transferencia de datos de alta velocidad' },
        { label: 'Material', value: 'Nylon trenzado con conectores metálicos' }
      ]
    }

    const specs = specsMap[skuCode] || []

    return (
      <div className='space-y-4 text-sm leading-7 text-gray-700'>
        <p>{description}</p>
        {specs.length > 0 && (
          <ul className='list-disc list-inside space-y-2'>
            {specs.map((spec, idx) => (
              <li key={idx}><strong>{spec.label}:</strong> {spec.value}</li>
            ))}
          </ul>
        )}
      </div>
    )
  }, [currentProduct, product])

  const slides = useMemo(() => product.images.lg.map(image => <img key={image} src={image} alt={product.name} className='w-full' />), [product])

  return (
    <Page
      localeCodes={localeCodes}
      navigation={links}
      canonical={getProductUrl(product.variants[0])}
      title={product.name}
      description={product.description}
    >
      <div className='flex flex-col lg:flex-row gap-6 lg:gap-24 xl:gap-48 mt-12 lg:mt-24'>

        <div className=' basis-1/2'>
          <Carousel slides={slides} />
        </div>

        <div className='grow-0 shrink basis-1/2'>
          <h1 className='text-3xl mb-6'>{product.name}</h1>

          <div className="flex items-baseline gap-3 mt-4">
            {currentProduct?.price?.discount ? (
              <>
                <span className="text-gray-500 line-through text-lg">
                  {currentProduct.price.amount_cents} 
                </span>
                <span className="text-xl font-bold text-black">
                  {currentProduct.price.discount}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-black">
                {currentProduct?.price?.formatted_amount}
              </span>
            )}
          </div>

          <hr className='text-gray-100 my-8' />

          <VariantSelector product={product} onChange={setCurrentProduct} />

          <div className='border-b border-b-gray-400 mt-12'>
            <Accordion data-testid='product-detail' title={<div className='font-extrabold'>{i18n.t('product.description')}</div>}>
              <div className='mt-6 mb-8'>
                {productDetailsText}
              </div>
            </Accordion>

            {
              product.details?.map(detail => (
                <Accordion key={detail.title} data-testid='product-detail' title={<div className='font-extrabold'>{detail.title}</div>}>
                  <div className='mt-6 mb-8'>{detail.content}</div>
                </Accordion>
              ))
            }
          </div>

          <a
            href={whatsappLink}
            target='_blank'
            rel='noopener noreferrer'
            className='block w-full mt-8 h-14 px-6 font-semibold rounded-md text-black bg-white border border-black hover:bg-gray-100 text-center flex items-center justify-center'
          >
            <span className='inline-flex items-center gap-3'>
              <span>Comprar por</span>
              <span className='inline-flex items-center gap-2'>
                <span>WhatsApp</span>
                <VerifiedBadge className='w-5 h-5' />
              </span>
            </span>
          </a>
        </div>

      </div>
    </Page>
  )
}
