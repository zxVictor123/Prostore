import {z} from 'zod'
import { cartItemSchema, insertCartSchema, insertOrderItemSchema, insertOrderSchema, insertProductSchema, shippingAddressSchema } from "@/lib/validator";

export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: string;
    createAt: Date;
    numReviews: number;
}

export type CartItem = z.infer<typeof cartItemSchema>
export type Cart = z.infer<typeof insertCartSchema>
export type shippingAddress = z.infer<typeof shippingAddressSchema>
export type OrderItem = z.infer<typeof insertOrderItemSchema>
export type Order = z.infer<typeof insertOrderSchema> & {
    id: string,
    createdAt: Date,
    isPaid: boolean,
    paidAt: Date | null,
    isDelivered: boolean,
    deliveredAt: Date | null,
    orderItems: OrderItem[],
    user: {name: string, email: string}
}