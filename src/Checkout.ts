import { ProductNotFoundError } from "./Errors/ProductNotFoundError"
import { ProductPriceStrategy } from "./ProductPriceStrategy"

type ScanRecord = {
  price: number
  quantity: number
}

export class Checkout {
  total: number = 0

  private scans: Record<string, ScanRecord> = {}

  constructor(private productPriceRules: Array<ProductPriceStrategy>) {}
  scan(productSKU: string) {
    const productPrice = this.productPriceRules.find((x) =>
      x.isApplicable(productSKU)
    )

    if (!productPrice) throw new ProductNotFoundError(productSKU)

    const { product } = productPrice
    const existingScan = this.scans[product.sku]
    this.scans[product.sku] = this.recordNewScan(productPrice, existingScan)
    this.total = this.calculateTotalPrice(this.scans)
  }

  recordNewScan(
    productPrice: ProductPriceStrategy,
    existingScan: ScanRecord | undefined
  ): ScanRecord {
    if (!existingScan)
      return { quantity: 1, price: productPrice.calculatePrice(1) }

    const newQuantity = existingScan.quantity + 1
    const newPrice = productPrice.calculatePrice(newQuantity)

    return { quantity: newQuantity, price: newPrice }
  }

  private calculateTotalPrice(scans: Record<string, ScanRecord>): number {
    return Object.values(scans).reduce(
      (accumulator, scan) => accumulator + scan.price,
      0
    )
  }
}
