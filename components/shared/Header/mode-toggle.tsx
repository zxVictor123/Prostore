'use client'
import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes";
import { SunIcon,MoonIcon,SunMoon } from "lucide-react";
import { CheckboxItem } from "@radix-ui/react-dropdown-menu";

const ModeToggle = () => {
    const [mounted,setMounted] = useState(false)
    const {theme,setTheme} = useTheme()

    useEffect(() => {
        setMounted(true)
    },[])
    if(!mounted) {
        return null
    }

    const themeItem = [
        {
            id: 1,
            theme: 'system',
            icon: <SunMoon size={20}/>,
            name: 'system',
        },
        {
            id: 2,
            theme: 'light',
            icon: <SunIcon size={20}/>,
            name: 'light',
        },
        {
            id: 3,
            theme: 'dark',
            icon: <MoonIcon size={20}/>,
            name: 'dark',
        }
    ]
    return(
        // 主题下拉菜单
        <DropdownMenu>
            {/* 触发按钮 */}
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className="focus-visible:ring-0 focus-visible:ring-offset-0">
                    {theme === 'system' ? (
                        <SunIcon/>
                    ): theme === 'dark' ? (
                        <MoonIcon/>
                    ): (
                        <SunIcon/>
                    )}
                </Button>
            </DropdownMenuTrigger>
            {/* 主题选项区 */}
            <DropdownMenuContent>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {/* 遍历渲染主题项 */}
                {themeItem.map(item => 
                <CheckboxItem 
                checked= {theme === item.theme}
                onClick={() => setTheme(item.theme)}
                className="pl-2 flex items-center gap-2 py-0.5 cursor-default"
                key={item.id}
                >
                    {item.icon}
                    <span>{item.name}</span>
                </CheckboxItem>)}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
 
export default ModeToggle;