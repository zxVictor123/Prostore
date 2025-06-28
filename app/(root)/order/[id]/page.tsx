import { getOrderById } from "@/lib/actions/order.action"
import { notFound } from "next/navigation"
import OrderDetailsTable from "./order-details-table"
import { convertDecimalFieldsToString } from "@/lib/utils"
import type { OrderItem, shippingAddress } from "@/types"

const OrderDetailsPage = async (props: {
    params: Promise<{
        id: string
    }>
}) => {
    const {id} = await props.params
    const order = await getOrderById(id)
    if(!order || !order.shippingAddress || !order.user || !order.user.email) notFound()

    const orderFixed = convertDecimalFieldsToString(order)

    return (
      <OrderDetailsTable
        order={{
          ...orderFixed,
          itemsPrice: orderFixed.itemsPrice.toString(),
          shippingPrice: orderFixed.shippingPrice.toString(),
          taxPrice: orderFixed.taxPrice.toString(),
          totalPrice: orderFixed.totalPrice.toString(),
          shippingAddress: orderFixed.shippingAddress as shippingAddress,
          orderItems: ((orderFixed.orderitems as unknown) as OrderItem[])?.map((item) => ({
            name: item.name,
            image: item.image,
            productId: item.productId,
            slug: item.slug,
            qty: item.qty,
            price: item.price.toString(),
          })),
          user: {
            name: (orderFixed.user as { name: string; email: string }).name,
            email: (orderFixed.user as { name: string; email: string }).email,
          },
        }} 
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      />
    );
}
 
export default OrderDetailsPage;