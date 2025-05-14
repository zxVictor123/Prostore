import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const delay =  (ms: number) =>  {
  return new Promise(resolve => setTimeout(resolve,ms))
}
export {cn,delay}