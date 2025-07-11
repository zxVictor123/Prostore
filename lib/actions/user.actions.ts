'use server'

import { paymentMethodSchema, shippingAddressSchema, signInFormSchema, signUpFormSchema } from "../validator"
import { auth, signIn, signOut} from '@/auth'
import { prisma } from "@/db/prisma"
import { hashSync } from "bcrypt-ts-edge"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { formatError } from "../utils"
import { shippingAddress } from "@/types"
import { z } from "zod"

// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown,formData: FormData) {
    try {
        // verify that the format is correct
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        })

        await signIn('credentials',user)

        return {success: true, message: 'Signed in successfully'}
    }catch(error) {
        if(isRedirectError(error))
            throw error
    }
    return { success: false, message: 'Invalid email or password'}
    
}

export async function signOutUser() {
    await signOut()
}

export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        // verify the format of imformation
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        })
        // write to the database
        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashSync(user.password, 10),
            }
        })
        // sign in
        await signIn('credentials', {
            email: user.email,
            password: user.password,
        })
        return {success: true, message: 'Sign up seccessfully'}
    }catch(error) {
        console.log(error)
        if (isRedirectError(error)) {
            throw error
        }
        return {success: false, message: formatError(error)}
    }
}

export const getUserById = async (userId: string) => {
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })
    if(!user) throw new Error('User not found')
    return user
}

export const updateUserAddress = async (data: shippingAddress) => {
    try {
        // find currentUser and get its id through session
        const session = await auth()
        const currentUser = await prisma.user.findFirst({
            where: {id: session?.user?.id}
        })
        if(!currentUser) throw new Error('User not found')

        // update database
        const address = shippingAddressSchema.parse(data)
        await prisma.user.update({
            where: {id: currentUser.id},
            data: {address}
        })

        return {success: true, message: 'User address updated successfully'}
    }catch(error) {
        return {success: false, message: formatError(error)}
    }
}

// Update user`s payment method
export const updateUserPaymentMethod = async (data: z.infer<typeof paymentMethodSchema>) => { 
    try{
        const session = await auth()
        const currentUser = await prisma.user.findFirst({
            where: {id: session?.user?.id}
        })
        if(!currentUser) throw new Error('User not found')
        
        const paymentMethod = paymentMethodSchema.parse(data)
        await prisma.user.update({
            where: {id: currentUser.id},
            data: {paymentMethod: paymentMethod.type}
        })
        return {success: true, message: 'Updated user payment method successfully'}
    }catch(error){
        return {success: false, message: formatError(error)}
    }
 };


//  Update the user profile
export const updateProfile = async (user: {name: string, email: string}) => { 
    try{
        const session = await auth()

        const currentUser = await prisma.user.findFirst({
            where: {
                id: session?.user?.id
            }
        })

        if(!currentUser) throw new Error('User not found')

        await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                name: user.name,
            }
        })

        return{success: true, message: 'User profile updated successfully'}
    }catch(error) {
        return {success: false, message: formatError(error)}
    }
 };