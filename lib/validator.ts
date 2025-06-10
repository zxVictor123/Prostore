import {z} from 'zod'
import { formatNumberWithDecimal } from './utils'
import { PAYMENT_METHODS } from './constants'

const currency = z.string().refine(
    value => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    'Price must have exactly two decimal places',
)

export const insertProductSchema = z.object({
    name: z.string().min(3,'Name must be at least 3 characters'),
    slug: z.string().min(3,'Slug must be at least 3 characters'),
    category: z.string().min(3,'Category must be at least 3 characters'),
    brand: z.string().min(3,'Brand must be at least 3 characters'),
    description: z.string().min(3,'Description must be at least 3 characters'),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1,'Product must have at least one image'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency,
})

export const signInFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
})
export const signUpFormSchema = z.object({
    name: z.string().min(1,'name must be at least 1 character'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password don`t match",
    path: ['confirmPassword'],
}) 

// Cart Schemas
export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'name is required'),
    slug: z.string().min(1, 'Slug is required'),
    qty: z.number().int().nonnegative('Quatity must be a positive number'),
    image: z.string().min(1, 'Product is required'),
    price: currency,
})

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart id is required'),
    userId: z.string().optional().nullable(),
})

// Schema for the shipping address
export const shippingAddressSchema = z.object({
    fullName: z.string().min(1,'fullName must not be empty'),
    streetAddress: z.string().min(1,'streetAddress must not be empty'),
    city: z.string().min(1,'city must not be empty'),
    postalCode: z.string().min(1,'postalCode must not be empty'),
    country: z.string().min(1,'country must not be empty'),
    lat: z.number().optional(),
    lng: z.number().optional(),
})

// Schema for payment method
export const paymentMethodSchema = z.object({
    type: z.string().min(1,'Payment method is required')
}).refine(data => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid payment method',
})