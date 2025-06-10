import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import PaymentMethodFormPage from "./payment-method-form";
import CheckOutSteps from "@/components/shared/checkOutSteps";

export const metadata: Metadata = {
    title: 'Select Payment Method '
}

const PaymentMethodPage = async () => {
    const session = await auth()
    const userId = session?.user?.id

    if(!userId) throw new Error ('User not found')

    const user = await getUserById(userId)

    return <> 
    <CheckOutSteps current={2}/>
    <PaymentMethodFormPage preferredPaymentMethod = {user.paymentMethod}/>
 </>;
}
 
export default PaymentMethodPage;