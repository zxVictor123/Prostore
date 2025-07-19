import { Metadata } from "next";
import { getProductById } from "@/lib/actions/products.actions";
import { notFound } from "next/navigation";
import AdminProductForm from "@/components/admin/product-form";

export const metadata: Metadata = {
    title: 'Update Product'
}

const AdminProductUpdatePage = async (props: {
    params: Promise<{
        id: string
    }>
}) => {
    const {id} = await props.params

    const product = await getProductById(id)

    if (!product) return notFound()

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="h2-bold">Update Product</h1>

            <AdminProductForm type="Update" product={{...product, price: product.price.toString(),rating: product.rating.toString()}} productId = {product.id}/>
        </div>
    )
}

export default AdminProductUpdatePage