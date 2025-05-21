import { getProductBySlug } from "@/lib/actions/products.actions"
import Image from "next/image"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const findProduct = await getProductBySlug(slug)
  console.log('根据slug找到了对应product信息如下:',findProduct)
  return<>
  <Image src={findProduct?.images[0]} alt="productImage" width={200} height={200} />
  </>
}