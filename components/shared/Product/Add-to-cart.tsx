'use client'
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types"
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddToCart = ({cart,item} : {cart: Cart, item: CartItem}) => {
    
    const router = useRouter()
    // add to cart
    const handleAddToCart = async () => {
        const res = await addItemToCart(item)
        // handle error add to cart
        if(!res.success) {
            toast.error(res.message)
            return
        }

        // handle success add to cart
        toast.success(res.message,{
            action: {
                label: 'Go To Cart',
                onClick: () => router.push('/cart')
            }
        })
    }
    const handleRemoveFromCart = async () => {
        const res = await removeItemFromCart(item.productId)
        // handle error add to cart
        if(!res.success) {
            toast.error(res.message)
            return
        }

        // handle success add to cart
        toast.success(res.message,{
            action: {
                label: 'Go To Cart',
                onClick: () => router.push('/cart')
            }
        })
    }

    const existItem = cart && cart.items.find(x => x.productId === item.productId)

    return existItem ? (
        <>
            <Button type="button" variant='outline' onClick={handleRemoveFromCart}>
                <Minus className="h-4 w-4" />
            </Button>
            <span className="p-2">{cart.items.find(x => x.productId === item.productId)?.qty}</span>
            <Button type="button" variant='outline' onClick={handleAddToCart}>
                <Plus className="h-4 w-4" />
            </Button>
        </>
    ) : (
        <Button className="w-full" type="button" onClick={handleAddToCart}>
            <Plus/> Add to Cart
        </Button>
    )
}
 
export default AddToCart;