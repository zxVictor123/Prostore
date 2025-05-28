import logo from "@/public/images/logo.svg";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CredentialsSignUpForm from "./credentials_signup_form";

export const metadata: Metadata = {
  title: "Sign Up",
};

const signUpPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();
  if (session?.user) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="h-screen flex-center">
      <div className="w-1/4 bg-background p-6 border border-border rounded-2xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <Image src={logo} alt="logo" width={80} height={80} />
          <h3 className="h3-bold">Sign Up</h3>
          <p className="text-gray-500">Create your account</p>
        </div>
        <CredentialsSignUpForm />
      </div>
    </div>
  );
};

export default signUpPage;
