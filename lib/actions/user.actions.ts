'use server'

import { signInFormSchema, signUpFormSchema } from "../validator"
import { signIn, signOut} from '@/auth'
import { prisma } from "@/db/prisma"
import { hashSync } from "bcrypt-ts-edge"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { formatError } from "../utils"

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