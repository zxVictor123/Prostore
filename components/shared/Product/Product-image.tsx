'use client'

import React from 'react'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function ProductImages({images}: {images: string[]}) {
    const [current,setCurrent] = useState(0)
  return (
    <div className='space-y-4 min-h-[300px] object-center object-cover'>
        <Image src={images[current]} alt="alt" width={1000} height={1000} />
        <div className='flex gap-3'>
            {images.map((image,index) => 
            <div key={image} onClick={() => setCurrent(index)}>
                <Image src={image} alt="productImage" width={100} height={100} className={cn('border',current === index ? 'border-orange-400 scale-105' : 'border-border cursor-pointer')}/>    
            </div>)}
        </div>
    </div>
  )
}
