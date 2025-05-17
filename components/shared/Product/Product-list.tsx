import React from 'react'
import ProductCard from './Product-card';
import { Product } from '@/types';

export default function ProductList({data,title}: {data: Product[];title?: string;}) {

  return (
    <div className='my-10'>
        <h2 className='h2-bold mb-4'>{title}</h2>
        {data.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {data.map((product: Product) => <div key={product.slug}><ProductCard product={product}/></div>)}
            </div>
        ) : (
            <p> No products found</p>
        )}
    </div>
  )
}
