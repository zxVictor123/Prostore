'use server'

import { signInFormSchema } from "../validator"
import { signIn, signOut} from '@/auth'
import { isRedirectError } from "next/dist/client/components/redirect-error"

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