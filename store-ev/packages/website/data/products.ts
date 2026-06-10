import { fetchJsonData } from '#utils/data'
import { memoize } from '#utils/memoize'
import { type RawDataProduct as BaseRawDataProduct, rawDataProducts_schema } from '@commercelayer/demo-store-types'

export interface Price {
  type?: string
  id?: string
  amount_cents?: string
  discount?: string
  formatted_amount?: string
  created_at?: string
  updated_at?: string
}

export const getRawDataProducts = memoize(
  async function(): Promise<RawDataProduct[]> {
    // TODO: this should be unserializable
    return rawDataProducts_schema.parse(
      await fetchJsonData('products')
    )
  }
)

export type RawDataProduct = BaseRawDataProduct & {
  available?: boolean
  price?: Price
}
