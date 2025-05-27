import CredentialsSignInForm from "./credentials-signin-form";
import logo from "@/public/images/logo.svg";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
export const metadata: Metadata = {
  title: "Sign In",
};

const page = async (props: {
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
          <h3 className="h3-bold">Sign In</h3>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        <CredentialsSignInForm />
      </div>
    </div>
  );
};

export default page;
