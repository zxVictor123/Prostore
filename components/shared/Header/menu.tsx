import React from 'react'
import ModeToggle from './mode-toggle'
import { Button } from '../../ui/button'
import Link from 'next/link'
import { EllipsisVertical, ShoppingCart } from 'lucide-react'
import { Sheet,SheetContent, SheetTitle, SheetTrigger } from '../../ui/sheet'
import UserButton from './user-button'

export default function Menu() {
  return (
    <div className='flex justify-end gap-3'>
        {/* 大屏幕菜单直接显示 */}
        <nav className='hidden md:flex w-full max-w-xs gap-1'>
            <ModeToggle/>
            <Button asChild variant='ghost'>
                <Link href="/cart">
                    <ShoppingCart/> Cart
                </Link>
            </Button>
            <UserButton/>
        </nav>
        {/* 小屏幕三点式菜单 */}
        <nav className='md:hidden'>
            <Sheet>
                <SheetTrigger className='align-middle'>
                    <EllipsisVertical/>
                </SheetTrigger>

                <SheetContent className='flex flex-col items-start'>
                    <SheetTitle>Menu</SheetTitle>

                    <ModeToggle/>

                    <Button asChild variant='ghost'>
                        <Link href="/cart">
                            <ShoppingCart/> Cart
                        </Link>
                    </Button>
                    
                    <UserButton/>

                </SheetContent>
            </Sheet>
        </nav>
    </div>
  )
}
