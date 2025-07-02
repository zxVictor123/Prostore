"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validator";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import { Decimal } from "../generated/prisma/runtime/library";


export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const cart = await getMyCart();
    const userId = session.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    // Create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    // Create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      const insertedOrder = await tx.order.create({ data: order });
      // Create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }

      // Clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

// Get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
}

// Create new paypal order
export async function createPayPalOrder(orderId: string) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
        // Create paypal order
        const paypalOrder = await paypal.createOrder(Number(order.totalPrice))

        // Update order with paypal order id
        await prisma.order.update({
            where: {id: orderId},
            data: {
                paymentResult: {
                    id: paypalOrder.id,
                    email_address: '',
                    status: '',
                    pricePaid: 0,
                }
            }
        })

        return {
            success: true,
            message: 'Item order created successfully',
            data: paypalOrder.id
        }
    } else {
        throw new Error('Order not found')
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Approve paypal order and update order to paid
export async function approvePayPalOrder(
  orderId: string,
  data: {orderID: string}
) {
  try{
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found')
      
    const captureData = await paypal.capturePayment(data.orderID)

    if (!captureData || captureData.id !== (order.paymentResult as PaymentResult).id || captureData.status !== 'COMPLETED') {
      throw new Error('Error in PayPal payment')
    }

    // 使用可选链操作符安全地获取支付金额
    const pricePaid = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || 
                     captureData.purchase_units?.[0]?.payments?.amount?.value || 
                     '0'

    // Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer?.email_address || captureData.payer_email_address || '',
        pricePaid: pricePaid,
      }
    })

    revalidatePath(`/order/${orderId}`)

    return {success: true, message: 'Payment completed successfully'}
  }catch(error){
    return {success: false, message: formatError(error)}
  }
}


// Update order to paid
async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string,
  paymentResult: PaymentResult,
}) {
  // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        orderitems: true,
      }
    });

    if (!order) throw new Error('Order not found')

    if (order.isPaid) throw new Error('Order is already paid')

    // Transaction to update order and account for product stock
    await prisma.$transaction(async (tx) => {
      // Iterate over products and update stock
      for (const item of order.orderitems) {
        await tx.product.update({
          where: {id: item.productId},
          data: {stock: {increment: -item.qty}}
        })
      }

      // Set the order to paid
      await tx.order.update({
        where: {id: orderId},
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult
        }
      })
    })

    // Get updated order after transaction
    const updatedOrder = await prisma.order.findFirst({
      where: {id: orderId},
      include: {
        orderitems: true,
        user: {select: {name: true, email: true}}
      }
    })

    if (!updatedOrder) throw new Error('Order not found')
}

// Get user's orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth()

  if (!session) throw new Error('User is not authorized')

  const data = await prisma.order.findMany({
    where: {userId: session?.user?.id},
    orderBy: {createdAt: 'desc'},
    take: limit,
    skip: (page -1) * limit,
  })

  const dataCount = await prisma.order.count({
    where: {userId: session?.user?.id}
  })

  return {
    data,
    totalPages: Math.ceil(dataCount / limit)
  }
}

type SalesDataType = {
  month: string;
  totalSales: number;
}[]

// Get sales data and order summary
export async function getOrderSummary() {
  // Get counts for each resource
  const ordersCount = await prisma.order.count()
  const productsCount = await prisma.product.count()
  const usersCount = await prisma.user.count()

  // Caluculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: {totalPrice: true}
  })

  // Get monthly sales
  const saleDataRaw = await prisma.$queryRaw<
  Array<{month: string; totalSales: Decimal}>>`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`

  const salesData: SalesDataType = saleDataRaw.map(entry => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }))

  // Get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: {createdAt: 'desc'},
    include: {
      user: {select: {name: true}}
    },
    take: 6,
  })
  
  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  }
}

// Get all orders
export async function getAllOrders(
  {
  page,
  }: {
    page: number;
  }
) {
  const limit = PAGE_SIZE
  const data = await prisma.order.findMany({
    orderBy: {createdAt: 'desc'},
    take: limit,
    skip: (page - 1) * limit,
    include: {user: {select: {name: true}}}
  })

  const dataCount = await prisma.order.count()

  return {
    data,
    totalPages: Math.ceil(dataCount / limit)
  }
}