import { Checkout } from "./Checkout"
import { assertThat, match } from "mismatched"

describe("Checkout", ()=>{
    let checkout: Checkout
    beforeEach(() => {
        checkout = new Checkout()
    })

    it("no products scanned", () =>{
        assertThat(checkout.total).is(0)
    })

    describe("scan single product", () =>{
        it("scan product A", ()=>{
            checkout.scan("A")
            assertThat(checkout.total).is(50)
        })

        it("scan product B", ()=>{
            checkout.scan("B")
            assertThat(checkout.total).is(80)
        })

        it("scan product C", ()=>{
            checkout.scan("C")
            assertThat(checkout.total).is(20)
        })

        it("scan product D", ()=>{
            checkout.scan("D")
            assertThat(checkout.total).is(15)
        })
    })
})