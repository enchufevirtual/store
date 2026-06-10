import { Link } from '#i18n/Link'
import type { LocalizedProductWithVariant } from '#utils/products'
import { getProductUrl } from '#utils/url'

type Props = {
  product: LocalizedProductWithVariant
  useCommerceLayer?: false
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div className='group relative'>
      <Link href={getProductUrl(product)}>
        <div className='relative w-full h-80 rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1'>
          <img loading='lazy' src={product.images.sm[0]} alt={product.name} className='w-full h-full object-center object-contain' />
        </div>
        <h3 className='mt-6 text-base text-black font-medium'>{product.name}</h3>
        <div className="mt-2 flex gap-2 items-baseline">
          {product.price?.discount ? (
            <>
              <span className="text-gray-500 line-through text-sm">
                {product.price?.amount_cents}
              </span>
              <span className="text-black font-semibold">
                {product.price?.discount}
              </span>
            </>
          ) : (
            <span className="text-black font-medium">
              {product.price?.formatted_amount}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}
