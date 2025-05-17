import ProductList from "@/components/shared/Product/Product-list";
import { getLatestProducts } from "@/lib/actions/products.actions";

export default async function Home() {
  const product = await getLatestProducts()
  
  return <>
      <ProductList data={product} title='Newest Arrival'/>

  </>
  ;
}
