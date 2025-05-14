'use client'

import React from 'react'
import Image from 'next/image'
import { APP_NAME } from '@/lib/constants'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className='flex-center flex-col min-h-screen'>
        <Image src='/images/logo.svg'  alt={`${APP_NAME} logo`} width={48} height={48} priority={true}/>
        <div className='p-6 w-1/3 rounded-lg shadow-md dark: shadow-white/50 text-center'>
            <h1 className='text-3xl font-bold mb-4'>Not Found</h1>
            <p className='text-destructive'>Could not find requested page</p>
            <Button variant='outline' className='mt-4 ml-2' onClick={() => (window.location.href = '/')}>Back To Home</Button>
        </div>
    </div>
  )
}
