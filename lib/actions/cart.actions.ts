"use server";
import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validator";
import { revalidatePath } from "next/cache";

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const addItemToCart = async (data: CartItem) => {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product from database
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    });
    if (!product) throw new Error("Product not found");

    // A.not exist cart
    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId || undefined,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      // TESTING
      console.log("Creating new cart:", newCart);

      // Create cart in database
      await prisma.cart.create({
        data: {
          ...newCart,
          userId: userId || undefined,
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${data.name} added to cart successfully !`,
      };
    } else {
      // B.exist cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );
      // B.1.exist item
      if (existItem) {
        // Check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        // Increase the quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;

        await prisma.cart.update({
          where: {
            id: cart.id,
          },
          data: {
            items: cart.items,
            ...calcPrice(cart.items)
          }
        })
        revalidatePath(`/product/${product?.slug}`);

        return {
        success: true,
        message: `${data.name} updated in cart successfully !`,
      };
      } else {
        // B.2.not exist item
        cart.items.push(item);

        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: cart.items,
            ...calcPrice(cart.items as CartItem[]),
          },
        });

        revalidatePath(`/product/${product?.slug}`);

        return {
        success: true,
        message: `${data.name} added to cart successfully !`,
      };
      }
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  //   Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

// remove item from cart
export async function removeItemFromCart(productId: string) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: productId
      }
    })

    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");
    // Get user cart
    const cart = await getMyCart()
    if(!cart) throw new Error('Cart not found')


      // Check for item
    const exist = (cart.items).find(x => x.productId === productId)
    if(!exist) throw new Error('Item not found')

      // Check if only one in qty
      if(exist.qty === 1) {
        cart.items = cart.items.filter(x => x.productId !== productId)
        await prisma.cart.update({
          where: {
            id: cart.id
          },
          data: {
            items: cart.items,
            ...calcPrice(cart.items)
          }
        })
        revalidatePath(`/product/${product?.slug}`)
        return {
          success: true,
          message: `${exist.name} has been removed from cart`
        }
      }else {
        cart.items.find(x => x.productId === productId)!.qty = exist.qty - 1

        await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: cart.items,
          ...calcPrice(cart.items)
        }
      })

      revalidatePath(`/product/${product?.slug}`)

      return {
        success: true,
        message: `${exist.name}\`quantity has been decreased ! `
      }
      }

      

  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
