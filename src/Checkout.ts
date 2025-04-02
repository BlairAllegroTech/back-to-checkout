export class Checkout {
  total: number = 0;

  scan(productSKU: string) {
    if (productSKU === "A") this.total = 50;
    if (productSKU === "B") this.total = 80;
    if (productSKU === "C") this.total = 20;
    if (productSKU === "D") this.total = 15;
  }
}
