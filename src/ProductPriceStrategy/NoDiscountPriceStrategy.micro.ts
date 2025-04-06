import { assertThat } from "mismatched"
import { Product } from "../Product"
import { NoDiscountPriceStrategy } from "./NoDiscountPriceStrategy"
import { ProductPriceStrategy } from "./ProductPriceStrategy"

describe("NoDiscountPriceStrategy", () => {
  let priceStrategy: ProductPriceStrategy
  const product: Product = { sku: "A", price: 50 }

  beforeAll(() => {
    priceStrategy = new NoDiscountPriceStrategy(product)
  })

  it("Single Item", () => assertThat(priceStrategy.calculatePrice(1)).is(product.price))
  it("Two Items", () => assertThat(priceStrategy.calculatePrice(2)).is(product.price * 2))
  it("Three Items", () => assertThat(priceStrategy.calculatePrice(3)).is(product.price * 3))
})
