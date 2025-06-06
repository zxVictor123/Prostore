"use client";

import { shippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { shippingAddressSchema } from "@/lib/validator";
import { useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";

const ShippingAddressForm = ({ address }: { address: shippingAddress }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
  });

  const [isPending, startTransition] = useTransition();
  
  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
    startTransition(async () => {
        const res = await updateUserAddress(values)

        if(!res.success) {
            toast.error(res.message)
            return
        }

        router.push('/payment-method')
    })
  }

  /**
   * 表单字段配置
   */
  const formFields = [
    {
      name: 'fullName',
      label: 'Username',
      placeholder: 'Enter full name'
    },
    {
      name: 'streetAddress',
      label: 'Address',
      placeholder: 'Enter address'
    },
    {
      name: 'city',
      label: 'City',
      placeholder: 'Enter city'
    },
    {
      name: 'postalCode',
      label: 'Postal Code',
      placeholder: 'Enter postal code'
    },
    {
      name: 'country',
      label: 'Country',
      placeholder: 'Enter country'
    }
  ] as const;

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter and address to ship to{" "}
        </p>
        <Form {...form}>
          <form
            method="post"
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {formFields.map((item) => (
              <div key={item.name} className="flex flex-col md:flex-row gap-5">
                <FormField
                  control={form.control}
                  name={item.name}
                  render={({ field }: {
                    field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, typeof item.name>
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <Input placeholder={item.placeholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <div className="flex gap-2 justify-end">
                <Button type='submit' disabled={isPending}>
                    {isPending ? (
                        <Loader className="w-4 h-4 animate-spin"/>
                    ): (
                        <ArrowRight className="w-4 h-4"/>
                    )}{' '}
                    continue
                </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ShippingAddressForm;
