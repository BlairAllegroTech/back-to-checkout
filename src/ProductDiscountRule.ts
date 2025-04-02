import { Product } from "./Product"

export type QuantityBasedDiscountRule = {
 quantity: number,
 discount: number
 description: string
}

export type ProductPriceRule = {
    product: Product,
    discount: Array<QuantityBasedDiscountRule>

}