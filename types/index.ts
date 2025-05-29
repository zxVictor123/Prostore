import {z} from 'zod'
import { cartItemSchema, insertCartSchema, insertProductSchema } from "@/lib/validator";

export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: string;
    createAt: Date;
    numReviews: number;
}

export type CartItem = z.infer<typeof cartItemSchema>
export type Cart = z.infer<typeof insertCartSchema>