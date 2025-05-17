import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const delay =  (ms: number) =>  {
  return new Promise(resolve => setTimeout(resolve,ms))
}

// Convert prisma object into a regular JS object
function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

const formatNumberWithDecimal = (num: number): string => {
  const [int,decimal] = num.toString().split('.')
  return decimal ? `${int}.${decimal.padEnd(2,'0')}` : `${int}.00`
}

export {cn,delay,convertToPlainObject,formatNumberWithDecimal}