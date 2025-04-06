import { assertThat } from "mismatched"
import { Product } from "../Product"
import { ProductPriceStrategy } from "./ProductPriceStrategy"
import { QuantityBasedPriceStrategy } from "./QuantityBasedPriceStrategy"

describe("QuantityBasedPriceStrategy", () => {
  let priceStrategy: ProductPriceStrategy
  const product: Product = { sku: "A", price: 50 }

  beforeAll(() => {
    priceStrategy = new QuantityBasedPriceStrategy(product, [
      { quantity: 3, discount: 20, description: "Discount for 3 Items of 20" },
      { quantity: 5, discount: 30, description: "Discount for 5 Items of 30" }
    ])
  })

  it("Single Item", () => assertThat(priceStrategy.calculatePrice(1)).is(product.price))
  it("Two Items", () => assertThat(priceStrategy.calculatePrice(2)).is(product.price * 2))
  it("Three Items", () => assertThat(priceStrategy.calculatePrice(3)).is(130))
  it("Four Items", () => assertThat(priceStrategy.calculatePrice(4)).is(130 + product.price))
  it("Five Items", () => assertThat(priceStrategy.calculatePrice(5)).is(product.price * 5 - 30))
  it("Six Items", () =>
    assertThat(priceStrategy.calculatePrice(6))
      .withMessage("Does not minimise price")
      .is(product.price * 6 - 30))
})
