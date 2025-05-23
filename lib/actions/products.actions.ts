import {prisma} from '@/db/prisma'
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

export async function getLatestProducts() {

    
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { createAt: 'desc'}
    })

    const jsData = convertToPlainObject(data)
    
    return jsData.map(product => ({
        ...product,
        price: product.price.toString(),
        rating: product.rating.toString(),
    }))
    
}

export async function getProductBySlug(slug:string) {
    return await prisma.product.findFirst({
        where: {
            slug: slug
        }
    })
}