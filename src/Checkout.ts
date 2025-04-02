import { ProductNotFoundError } from "./Errors/ProductNotFoundError";
import { ProductPriceRule } from "./ProductDiscountRule";

type ScanRecord = {
    price: number;
    quantity: number;
};

export class Checkout {
  total: number = 0;

  private scans: Record<string, ScanRecord> = {};

  constructor(private products: Array<ProductPriceRule>) {}
  scan(productSKU: string) {
    const productPrice = this.products.find(
      (x) => x.product.sku === productSKU
    );

    if (!productPrice) throw new ProductNotFoundError(productSKU);

    const { product } = productPrice;
    const existingScan = this.scans[product.sku]
    this.scans[product.sku] = this.recordNewScan(productPrice, existingScan)
    this.total = Object.values(this.scans).reduce((accumulator, scan ) => accumulator + scan.price, 0)
  }

    recordNewScan(productPrice: ProductPriceRule, existingScan: ScanRecord| undefined): ScanRecord {
        if(!existingScan) return {quantity: 1, price: productPrice.product.price}

        const newQuantity = existingScan.quantity +1
        const newPrice = this.calculatePrice(newQuantity, productPrice)

        return {quantity: newQuantity, price: newPrice}
    }
    calculatePrice(quantity: number, productPriceRule: ProductPriceRule): number {
        const {product, discount } = productPriceRule
        const basePrice = product.price * quantity


        const sortedRules = discount.sort((rule1,rule2) =>  rule1.quantity - rule2.quantity).reverse()

        let totalDiscount = 0
        let itemsRemaining = quantity

        while(itemsRemaining) {
            const firstApplicableRule = sortedRules.find(x => x.quantity <= itemsRemaining)
            if(!firstApplicableRule) break

            console.log(firstApplicableRule)
            totalDiscount += firstApplicableRule.discount
            itemsRemaining -= firstApplicableRule.quantity
        }

        return basePrice - totalDiscount

    }
}
