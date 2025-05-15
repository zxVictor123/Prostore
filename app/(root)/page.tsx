import ProductList from "@/components/shared/Product/Product-list";
import sampleData from "@/db/sample-data";

export default function Home() {
  console.log(sampleData)
  return <>
      <ProductList data={sampleData.products} title='Newest Arrival' limit={4}/>

  </>
  ;
}
