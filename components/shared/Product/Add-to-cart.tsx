"use client";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const AddToCart = ({ cart, item }: { cart: Cart; item: CartItem }) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  // add to cart
  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      // handle error add to cart
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      // handle success add to cart
      toast.success(res.message, {
        action: {
          label: "Go To Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      // handle error add to cart
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      // handle success add to cart
      toast.success(res.message, {
        action: {
          label: "Go To Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (<Loader className="w-4 h-4 animate-spin"/>) : <Minus className="h-4 w-4" />}
      </Button>
      <span className="p-2">
        {cart.items.find((x) => x.productId === item.productId)?.qty}
      </span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (<Loader className="w-4 h-4 animate-spin"/>) : <Plus className="h-4 w-4" />}
      </Button>
    </>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add to Cart
    </Button>
  );
};

export default AddToCart;
