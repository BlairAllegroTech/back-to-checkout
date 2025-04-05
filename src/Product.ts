export type ProductSKU = "A" | "B" | "C" | "D"
export type Product = {
  sku: ProductSKU
  price: number
}

export const ProductA: Product = { sku: "A", price: 50 }
export const ProductB: Product = { sku: "B", price: 30 }
export const ProductC: Product = { sku: "C", price: 20 }
export const ProductD: Product = { sku: "D", price: 15 }
