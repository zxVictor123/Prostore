import React from 'react'
import loader from '@/assets/loader.gif'
import Image from 'next/image'


function LoadingPage() {
  return (
    <div className='flex-center h-screen'>
        <Image src={loader} alt="Loading..." width={150} height={150}/>
    </div>
  )
}

export default LoadingPage