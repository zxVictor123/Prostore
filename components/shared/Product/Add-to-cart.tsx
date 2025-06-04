'use client'
import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types"
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddToCart = ({item}: {item: CartItem}) => {
    
    const router = useRouter()

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
    
    return ( 
        <Button className="w-full" type="button" onClick={handleAddToCart}><PlusIcon/> Add To Cart</Button>
     );
}
 
export default AddToCart;