'use client'

import { Button } from "@/components/ui/button";
import { reviewFormDefaultValues } from "@/lib/constants";
import { insertReviewSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ReveiwForm = ({
    userId,
    productId,
    onReviewSubmitted,
}: {
    userId: string;
    productId: string;
    onReviewSubmitted?: () => void;
}) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof insertReviewSchema>>({
        resolver: zodResolver(insertReviewSchema),
        defaultValues: reviewFormDefaultValues
    })
    
    const handleFormOpen = () => {
        setOpen(true)
    }

    return ( <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={handleFormOpen} variant={'default'}>
            Write a review
        </Button>
    </Dialog> );
}
 
export default ReveiwForm;