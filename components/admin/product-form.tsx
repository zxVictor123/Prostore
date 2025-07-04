'use client'

import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validator";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const AdminProductForm = ({
    type,
    product,
    productId,
}: {
    type: 'Create' | 'Update';
    product?: Product;
    productId?: string;
}) => {
    const router = useRouter()
    
    const form = useForm<z.infer<typeof insertProductSchema>>({
        resolver: type === 'Update' ? zodResolver(updateProductSchema) : zodResolver(insertProductSchema),
        defaultValues: product && type === 'Update' ? product : productDefaultValues
    })
    return ( 
    <Form {...form}>
        <form className="space-y-8">
            <div className="flex flex-col md:flex-row gap-5">
                {/* Name */}
                {/* Slug */}
            </div>
            <div className="flex flex-col md:flex-row gap-5">
                {/* Category */}
                {/* Brand */}
            </div>
            <div className="flex flex-col md:flex-row gap-5">
                {/* Price */}
                {/* Stock */}
            </div>
            <div className="upload-field flex flex-col md:flex-row gap-5">
                {/* Images */}
            </div>
            <div className="upload-field">
                {/* isFeatured */}
            </div>
            <div>
                {/* Description */}
            </div>
            <div>
                {/* Submit */}
            </div>
        </form>
    </Form> );
}
 
export default AdminProductForm;