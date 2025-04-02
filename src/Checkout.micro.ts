import { assertThat } from "mismatched";
import { Checkout } from "./Checkout";
import { ProductNotFoundError } from "./Errors/ProductNotFoundError";
import { ProductA, ProductB, ProductC, ProductD } from "./Product";

describe("Checkout", () => {
  let checkout: Checkout;
  beforeEach(() => {
    checkout = new Checkout([
      {
        product: ProductA,
        discount: [
          {
            quantity: 3,
            discount: 20,
            description: "Discount applied for Quantity of 3",
          },
        ],
      },
      {
        product: ProductB,
        discount: [
          {
            quantity: 2,
            discount: 15,
            description: "Discount applied for Quantity of 2",
          },
        ],
      },
      { product: ProductC, discount: [] },
      { product: ProductD, discount: [] },
    ]);
  });

  it("no products scanned", () => {
    assertThat(checkout.total).is(0);
  });

  describe("scan single product", () => {
    it("Un Expected product scanned", () => {
      assertThat(() => checkout.scan("Z")).throws(
        new ProductNotFoundError("Z")
      );
    });

    it("scan product A", () => {
      checkout.scan("A");
      assertThat(checkout.total).is(50);
    });

    it("scan product B", () => {
      checkout.scan("B");
      assertThat(checkout.total).is(30);
    });

    it("scan product C", () => {
      checkout.scan("C");
      assertThat(checkout.total).is(20);
    });

    it("scan product D", () => {
      checkout.scan("D");
      assertThat(checkout.total).is(15);
    });
  });

  describe("Product A Price Rules", () => {
    it("Unit Price", () => {
      checkout.scan("A");
      assertThat(checkout.total).is(ProductA.price);
    });

    it("Double Unit Price", () => {
      checkout.scan("A");
      checkout.scan("A");
      assertThat(checkout.total).is(2 * ProductA.price);
    });

    it("Discount applied for Quantity of 3 ", () => {
      checkout.scan("A");
      checkout.scan("A");
      checkout.scan("A");
      assertThat(checkout.total).is(130);
    });

    it("Single Item plus, Discount for remaining 3", () => {
      checkout.scan("A");
      checkout.scan("A");
      checkout.scan("A");
      checkout.scan("A");
      assertThat(checkout.total).is(130 + ProductA.price);
    });
  });

  describe("Product B Price Rules", () => {
    it("Unit Price", () => {
      checkout.scan("B");
      assertThat(checkout.total).is(ProductB.price);
    });

    it("Double Unit Price", () => {
      checkout.scan("B");
      checkout.scan("B");
      assertThat(checkout.total).is(45);
    });

    it("Discount applied for Quantity of 3 ", () => {
      checkout.scan("B");
      checkout.scan("B");
      checkout.scan("B");
      assertThat(checkout.total).is(45 + ProductB.price);
    });
  });

  describe("Price Totals", () => {
    const price = (items: string) => {
      Array.from(items).forEach((c) => checkout.scan(c));
      return checkout.total;
    };

    describe("Manual Example", () => {
      it("No Scan", () => assertThat(price("")).is(0));
      it("A", () => assertThat(price("A")).is(50));
      it("AB", () => assertThat(price("AB")).is(80));
      it("CDBA", () => assertThat(price("CDBA")).is(115));
    });

    describe("Data Driven Example", () => {
      [
        { scan: "", price: 0 },
        { scan: "A", price: 50 },
        { scan: "AB", price: 80 },
        { scan: "CDBA", price: 115 },

        { scan: "AA", price: 100 },
        { scan: "AAA", price: 130 },
        { scan: "AAAA", price: 180 },
        { scan: "AAAAA", price: 230 },
        { scan: "AAAAAA", price: 260 },

        { scan: "AAAB", price: 160 },
        { scan: "AAABB", price: 175 },
        { scan: "AAABBD", price: 190 },
        { scan: "DABABA", price: 190 },

      ].forEach((testCase) => {
        it(`Scan: ${testCase.scan}`, () =>
          assertThat(price(testCase.scan)).is(testCase.price));
      });
    });
  });
});
