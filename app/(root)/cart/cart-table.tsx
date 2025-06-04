'use client'

import { Cart } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";

const CartTable = ({cart}: {cart?: Cart}) => {
    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    return (
        <>
            <h1 className="py-4 h2-bold">Shopping Cart</h1>
            {!cart || cart.items.length === 0 ? (
                <div>
                    Cart is empty. <Link href="/">Go Shopping</Link>
                </div>
            ): (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">Table</div>
                </div>
            )
        } 
        </>
    );
}
 
export default CartTable;