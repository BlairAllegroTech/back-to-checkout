export class ProductNotFoundError extends Error {
  constructor(public readonly sku: string) {
    super("Product Not Found")
    this.name = this.constructor.name
    Object.setPrototypeOf(this, ProductNotFoundError.prototype)
  }
}
