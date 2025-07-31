"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validator";
import { z } from "zod";
import { Prisma } from "../generated/prisma";
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createAt: "desc" },
  });

  const jsData = convertToPlainObject(data);

  return jsData.map((product: any) => ({
    ...product,
    price: product.price.toString(),
    rating: product.rating.toString(),
  }));
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {
      slug: slug,
    },
  });
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  const queryFilter =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const categoryFilter =
    category && category !== "all"
      ? {
          category,
        }
      : {};

  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
        ? { price: "desc" }
        : sort === "high rating"
        ? { rating: "desc" }
        : sort === "low rating"
        ? { rating: "asc" }
        : { createAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    const res = await prisma.product.delete({
      where: { id },
    });

    if (!res) throw new Error("Product not exists");

    revalidatePath("/admin/products");

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create a product
export const createProduct = async (
  data: z.infer<typeof insertProductSchema>
) => {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

// update a product
export const updateProduct = async (
  data: z.infer<typeof updateProductSchema>
) => {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

//  Get single product by it's ID
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });

  return convertToPlainObject(data);
}

// Get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: { createAt: "desc" },
    take: 4,
  });

  return convertToPlainObject(data);
}
