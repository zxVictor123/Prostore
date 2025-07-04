import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/Product/pagination";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteProduct, getAllProducts } from "@/lib/actions/products.actions";
import { formatCurrency, formatId } from "@/lib/utils";
import Link from "next/link";

const AdminProductsPage = async (props: {
    searchParams: Promise<{
        page: string;
        query: string;
        category: string;
    }>
}) => {
    const searchParams = await props.searchParams

    const page = Number(searchParams.page) || 1
    const searchText = searchParams.query || ''
    const category = searchParams.category || ''

    const products = await getAllProducts({
        query: searchText,
        page,
        category,
    })

    console.log('products:',products)

    return ( 
        <div className="space-y-2">
            <div className="flex-between">
                <h1 className="h2-bold">Products</h1>
                <Button asChild variant='default'>
                    <Link href="/admin/products/create">Create Product</Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>NAME</TableHead>
                        <TableHead>PRICE</TableHead>
                        <TableHead>CATEGORY</TableHead>
                        <TableHead>STOCK</TableHead>
                        <TableHead>RATING</TableHead>
                        <TableHead className="w-[100px]">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.data.map(product => (
                        <TableRow key={product.id}>
                            <TableCell>{formatId(product.id)}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="text-rignt">{formatCurrency(product.price.toString())}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>{product.rating.toString()}</TableCell>
                            <TableCell className="flex gap-1">
                                <Button asChild variant='outline' size='sm'>
                                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                                </Button>
                                <DeleteDialog id={product.id} action={deleteProduct}/>
                            </TableCell>
                            
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {products?.totalPages && products.totalPages > 1 && (
                <div className="flex justify-center mt-5">
                    <Pagination page={page} totalPages={products.totalPages}/>
                </div>
            )}
        </div>
     );
}
 
export default AdminProductsPage