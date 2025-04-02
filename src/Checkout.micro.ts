import { Checkout } from "./Checkout"
import { assertThat, match } from "mismatched"

describe("Checkout", ()=>{
    it("exists", ()=>{
        const checkout = new Checkout()
        assertThat(checkout).isNot(undefined)
    })

    describe("scan product", () =>{
        let checkout: Checkout
        beforeEach(() => {
            checkout = new Checkout()
        })

        it("scan single product", () =>{
            checkout.scan("A")
            assertThat(checkout.total).is(50)
        })
    })
})