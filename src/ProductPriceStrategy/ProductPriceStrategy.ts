import { Product } from "../Product"

export interface ProductPriceStrategy {
    get product(): Product
    isApplicable(sku: string): boolean
    calculatePrice(quantity: number): number
}


