import AddToCart from "@/components/shared/Product/Add-to-cart"
import ProductImages from "@/components/shared/Product/Product-image"
import ProductPrice from "@/components/shared/Product/Product-price"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getMyCart } from "@/lib/actions/cart.actions"
import { getProductBySlug } from "@/lib/actions/products.actions"
import { notFound } from "next/navigation"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const cart = await getMyCart()

  if(!product) {
    notFound()
  }
  return<>
  <div>
    {/* Top */}
  <section>
    <div className="grid grid-cols-1 md:grid-cols-5">
      {/* Image Component */}
      <div className="col-span-2">
        <ProductImages images={product.images}/>
      </div>

      {/* Details Column */}
      <div className="col-span-2 p-5 flex flex-col gap-6">
        <p>{product.brand} {product.category}</p>
        <h1 className="h3-bold">{product.name}</h1>
        <p> {Number(product.rating)} of {product.numReviews} Reviews</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <ProductPrice value={Number(product.price)} className="w-24 rounded-full bg-green-100 text-green-700 px-4 py-2"/>
        </div>
      </div>

      {/* Action Column*/}
      <div>
        <Card>
          <CardContent className="p-4 flex flex-col gap-2">
            {/* Price */}
            <div className="flex justify-between">
              <p><Badge>Price</Badge></p>
              <div>
                <ProductPrice value={Number(product.price)}/>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-between">
              <p><Badge>Status</Badge></p>
              {product.stock > 0 
              ? <Badge variant='outline' className="bg-green-500 text-white">In stock</Badge>
              : <Badge variant='destructive'>Out of stock</Badge>}
            </div>

            {/* Add Button */}
            <div className="mx-auto pt-5">
              {product.stock > 0 && 
            <AddToCart 
            cart= {cart}
            item={{
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price.toString(),
              qty: 1,
              image: product.images![0],
            }}/>}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>

      </div>
    </div>
  </section>

  {/* Bottom Reviews */}
  <div className="flex flex-col">
    <h2 className="h2-bold">Customer Reviews</h2>
    <p>Please sign in to write a review</p>
    <article>

    </article>
  </div>
  </div>
  </>
}