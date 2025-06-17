'use server'

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { formatError } from "../utils"
import { auth } from "@/auth"
import { getMyCart } from "./cart.actions"
import { getUserById } from "./user.actions"

export async function createOrder() {
    try{
        const session = await auth()
        if(!session) throw new Error('User is not authenticated')

        const cart = await getMyCart()
        const userId = session.user?.id
        if(!userId) throw new Error('User not found')
        
        const user = await getUserById(userId)
        
    }catch(error) {
        if(isRedirectError(error)) throw error
        return {success: false, message: formatError(error)}
    }
}