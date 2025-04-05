export class ProductNotFoundError extends Error {
  constructor(public readonly sku: string) {
    super("Product Not Found")
  }
}
