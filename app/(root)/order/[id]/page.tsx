import { getOrderById } from "@/lib/actions/order.action"
import { notFound } from "next/navigation"

const OrderDetailsPage = async (props: {
    params: Promise<{
        id: string
    }>
}) => {
    const {id} = await props.params
    const order = await getOrderById(id)
    if(!order) notFound()
        
    return ( <>OrderDetailsPage {id}</> );
}
 
export default OrderDetailsPage;