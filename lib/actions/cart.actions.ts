import { CartItem } from "@/types";

export const addItemToCart = async (item: CartItem) => {

    return {
        success: true,
        message: `${item.name} added to cart successfully !`,
    }
}