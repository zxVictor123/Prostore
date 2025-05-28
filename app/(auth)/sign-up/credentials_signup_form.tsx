'use client'

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signUpDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signUpUser } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const CredentialsSignUpForm = () => {
  const [data,action] = useActionState(signUpUser,{
    success: false,
    message: ''
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const SignUpButton = () => {
    const {pending} = useFormStatus()
    return <Button disabled={pending} className="w-full">{pending ? 'Create Account...' : 'Create Account'}</Button>
  }

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl}/>
      <div className="space-y-6">
        {/* name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="name"
            required
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>
        {/* email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
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
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        {/* confirm password */}
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>

        {/* button */}
        <SignUpButton/>

        {/* error prompt */}
        {data && !data.success && (
          <p className="text-center text-destructive">{data.message}</p>
        )}
        
        {/* already have a account prompt  */}
        <div className="text-sm text-center text-muted-foreground">
            Already have a account?{' '}
            <Link href="/sign-in" target='_self' className="hover:text-black hover:scale-105" >Sign in</Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignUpForm;
