import { Product } from "../Product"
import { ProductPriceStrategy } from "./ProductPriceStrategy"

export type QuantityBasedDiscountRule = {
  quantity: number
  discount: number
  description: string
}

export class QuantityBasedPriceStrategy implements ProductPriceStrategy {
  constructor(
    public product: Product,
    private discountRules: Array<QuantityBasedDiscountRule>
  ) {
    discountRules
      .sort((rule1, rule2) => rule1.quantity - rule2.quantity)
      .reverse()
  }
  isApplicable(sku: string): boolean {
    return this.product.sku === sku
  }
  calculatePrice(quantity: number): number {
    const basePrice = this.product.price * quantity

    let totalDiscount = 0
    let itemsRemaining = quantity

    while (itemsRemaining) {
      const firstApplicableRule = this.discountRules.find(
        (x) => x.quantity <= itemsRemaining
      )
      if (!firstApplicableRule) break

      console.log(firstApplicableRule, this.product)
      totalDiscount += firstApplicableRule.discount
      itemsRemaining -= firstApplicableRule.quantity
    }

    return basePrice - totalDiscount
  }
}
