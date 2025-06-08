import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address-form";
import { shippingAddress } from "@/types";
import CheckOutSteps from "@/components/shared/checkOutSteps";

export const metadata: Metadata = {
    title: 'Shipping Address'
}

const ShippingAddressPage = async () => {
    // get userId from session to get User
    const cart = await getMyCart()

    if(!cart || cart.items.length === 0) redirect('/cart')

    const session = await auth()

    const userId = session?.user?.id

    if(!userId) throw new Error('No User ID')

    const user = await getUserById(userId)
    
    
    return ( 
    <>
        <CheckOutSteps current={1}/>
        <ShippingAddressForm address={user.address as shippingAddress}/>
    </>
 );
}
 
export default ShippingAddressPage;