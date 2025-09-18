import { getOrderById } from "@/lib/actions/order.action"
import { notFound } from "next/navigation"
import OrderDetailsTable from "./order-details-table"
import { convertDecimalFieldsToString } from "@/lib/utils"
import type { OrderItem, shippingAddress } from "@/types"
import { auth } from "@/auth"
import Stripe from 'stripe'

const OrderDetailsPage = async (props: {
    params: Promise<{
        id: string
    }>
}) => {
    const {id} = await props.params
    const order = await getOrderById(id)
    if(!order || !order.shippingAddress || !order.user || !order.user.email) notFound()

    const orderFixed = convertDecimalFieldsToString(order)

    const session = await auth()

    let client_secret = null

    // Check if is not paid and using stripe
    if (order.paymentMethod === 'Stripe' && !order.isPaid) {
      // Init stripe instance
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(order.totalPrice) * 100),
        currency: 'USD',
        metadata: {orderId: order.id}
      })
      client_secret = paymentIntent.client_secret
    }

    return (
      <OrderDetailsTable
        order={{
          ...orderFixed,
          itemsPrice: orderFixed.itemsPrice.toString(),
          shippingPrice: orderFixed.shippingPrice.toString(),
          taxPrice: orderFixed.taxPrice.toString(),
          totalPrice: orderFixed.totalPrice.toString(),
          shippingAddress: orderFixed.shippingAddress as shippingAddress,
          orderItems: ((orderFixed.orderItems as unknown) as OrderItem[])?.map((item) => ({
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
        stripeClientSecret={client_secret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin = { session?.user?.role === 'admin' || false }
      />
    );
}
 
export default OrderDetailsPage;