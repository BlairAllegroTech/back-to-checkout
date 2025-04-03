import { assertThat } from "mismatched";
import { Checkout } from "./Checkout";
import { ProductNotFoundError } from "./Errors/ProductNotFoundError";
import { Product, ProductA, ProductB, ProductC, ProductD } from "./Product";
import { Thespian, TMocked } from "thespian"
import { someFixture } from "@chrysalis-it/some-fixture"
import {
  NoDiscountPriceStrategy,
  ProductPriceStrategy,
  QuantityBasedPriceStrategy,
} from "./ProductPriceStrategy";

describe("Checkout", () => {
  describe("Karta Checkout Test Cases", () => {
    let checkout: Checkout;
    beforeEach(() => {
      checkout = new Checkout([
        new QuantityBasedPriceStrategy(ProductA, [
          {
            quantity: 3,
            discount: 20,
            description: "Discount applied for Quantity of 3",
          },
        ]),
        new QuantityBasedPriceStrategy(ProductB, [
          {
            quantity: 2,
            discount: 15,
            description: "Discount applied for Quantity of 2",
          },
        ]),
        new NoDiscountPriceStrategy(ProductC),
        new NoDiscountPriceStrategy(ProductD),
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

  // Now that we are injecting price strategies and seperating concers the tests can also be refactored
  // As we can test price calculations for each strategy
  // Here we only test recording scans updateing total price
  describe("Refactored tests", ()=>{
    let mocks: Thespian
    let checkout: Checkout;
    let someProduct1: Product
    let someProductPriceStrategy1: TMocked<ProductPriceStrategy>
    let someProductPriceStrategy2: TMocked<ProductPriceStrategy>
    beforeEach(() => {
      mocks = new Thespian()
      someProduct1 = someFixture.someObjectOfType<Product>({
        sku: "A",
      })

      someProductPriceStrategy1 = mocks.mock("someProductPriceStrategy1")
      someProductPriceStrategy2 = mocks.mock("someProductPriceStrategy2")
      checkout = new Checkout([someProductPriceStrategy1.object, someProductPriceStrategy2.object]);
    })

    afterAll(() => mocks.verify())

    it("Does not find missing price strategy", ()=>{
      someProductPriceStrategy1.setup(x => x.isApplicable("B")).returns(() => false)
      someProductPriceStrategy2.setup(x => x.isApplicable("B")).returns(() => false)
      assertThat(() => checkout.scan("B")).throws( new ProductNotFoundError("B"))
    })

    it("Total Price of Single Product", ()=>{
      // given
      const somePrice = someFixture.someUniqueNumber()
      someProductPriceStrategy1.setup(x => x.isApplicable(someProduct1.sku)).returns(() => true)
      someProductPriceStrategy1.setup(x => x.product).timesAtLeast(1).returns(() => someProduct1)
      someProductPriceStrategy1.setup(x => x.calculatePrice(1)).returns(() => somePrice)

      // when
      checkout.scan(someProduct1.sku)

      // then
      assertThat(checkout.total).is(somePrice)
    })

    it("Total Price of Single Product, multi scan", ()=>{
      // given

      const somePriceScan = someFixture.someUniqueNumber()
      someProductPriceStrategy1.setup(x => x.isApplicable(someProduct1.sku)).times(2).returns(() => true)
      someProductPriceStrategy1.setup(x => x.product).times(2).returns(() => someProduct1)
      someProductPriceStrategy1.setup(x => x.calculatePrice(1)).returns(() => someFixture.someUniqueNumber())
      someProductPriceStrategy1.setup(x => x.calculatePrice(2)).returns(() => somePriceScan)

      // when
      checkout.scan(someProduct1.sku)
      checkout.scan(someProduct1.sku)

      // then
      assertThat(checkout.total).is(somePriceScan)
    })

    it("Total Price of Multiple Products Calculated", ()=>{
      // given
      const somePrice1 = someFixture.someUniqueNumber()
      const somePrice2 = someFixture.someUniqueNumber()
      const someProduct2 = someFixture.someObjectOfType<Product>({
        sku: "D",
      })

      // Scan#1
      someProductPriceStrategy1.setup(x => x.isApplicable(someProduct1.sku)).returns(() => true)
      someProductPriceStrategy1.setup(x => x.product).timesAtLeast(1).returns(() => someProduct1)
      someProductPriceStrategy1.setup(x => x.calculatePrice(1)).returns(() => somePrice1)

      // Scan#2
      someProductPriceStrategy1.setup(x => x.isApplicable(someProduct2.sku)).returns(() => false)
      someProductPriceStrategy2.setup(x => x.isApplicable(someProduct2.sku)).returns(() => true)
      someProductPriceStrategy2.setup(x => x.product).timesAtLeast(1).returns(() => someProduct2)
      someProductPriceStrategy2.setup(x => x.calculatePrice(1)).returns(() => somePrice2)

      // when
      checkout.scan(someProduct1.sku)
      checkout.scan(someProduct2.sku)

      // then
      assertThat(checkout.total).is(somePrice1 + somePrice2)
    })
  })
});