'use client'

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signInDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const CredentialsSignInForm = () => {
  const [data,action] = useActionState(signInWithCredentials,{
    success: false,
    message: ''
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const SignInButton = () => {
    const {pending} = useFormStatus()
    return <Button disabled={pending} className="w-full">{pending ? 'Sign In...' : 'Sign In'}</Button>
  }

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl}/>
      <div className="space-y-6">
        {/* email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>

        {/* password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>

        {/* button */}
        <SignInButton/>

        {/* error prompt */}
        {data && !data.success && (
          <p className="text-center text-destructive">{data.message}</p>
        )}
        
        {/* no account prompt  */}
        <div className="text-sm text-center text-muted-foreground">
            Don`t have an account?{' '}
            <Link href="/sign-up" target='_self' className="hover:text-black hover:scale-105" >Sign up</Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
