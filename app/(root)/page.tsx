import DealCountdown from "@/components/deal-countdown";
import IconBoxes from "@/components/icon-boxes";
import ProductCarousel from "@/components/shared/Product/product-carousel";
import ProductList from "@/components/shared/Product/Product-list";
import { getFeaturedProducts, getLatestProducts } from "@/lib/actions/products.actions";

export default async function Home() {
  const product = await getLatestProducts()
  const featuredProducts = await getFeaturedProducts()

  return <>
  {featuredProducts.length > 0 && (
    <ProductCarousel data={featuredProducts.map(p => ({...p, rating: p.rating.toString(), price: p.price.toString()}))}/>
  )}
      <ProductList data={product} title='Newest Arrival'/>
      <DealCountdown/>
      <IconBoxes/>
  </>
  ;
}
