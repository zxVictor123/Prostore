import React from 'react'
import ModeToggle from '../shared/Header/mode-toggle'
import { Button } from '../ui/button'
import Link from 'next/link'
import { EllipsisVertical, ShoppingCart, UserIcon } from 'lucide-react'
import { Sheet,SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet'

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
            <Button asChild>
                <Link href="/sign-in">
                    <UserIcon/> Sign In
                </Link>
            </Button>
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
                    
                    <Button asChild>
                        <Link href="/sign-in">
                            <UserIcon/> Sign In
                        </Link>
                    </Button>

                    <SheetDescription>haha</SheetDescription>
                </SheetContent>
            </Sheet>
        </nav>
    </div>
  )
}
