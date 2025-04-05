import { Product } from "../Product"
import { ProductPriceStrategy } from "./ProductPriceStrategy"

export class NoDiscountPriceStrategy implements ProductPriceStrategy {
  constructor(public product: Product) {}

  isApplicable(sku: string): boolean {
    return this.product.sku === sku
  }
  calculatePrice(quantity: number): number {
    return this.product.price * quantity
  }
}
