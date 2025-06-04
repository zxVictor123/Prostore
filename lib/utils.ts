import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {prisma} from '@/db/prisma'

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


// To seed data of different model
type ModelName = 'user' | 'product';

async function seedData(
    model: ModelName,
    data: any[],
    clearExisting: boolean = true
) {
    if (clearExisting) {
        console.log(`清空现有${model}数据...`);
        await (prisma[model] as any).deleteMany();
    }
    
    console.log(`开始插入${model}数据...`);
    const result = await (prisma[model] as any).createMany({
        data: data
    });
    
    console.log(`成功插入 ${result.count} 条${model}数据`);
    return result;
}

export {cn,delay,convertToPlainObject,formatNumberWithDecimal,seedData}

export function formatError(error: any) {
  if(error.name === 'ZodError') {
    // Handle Zod error
    const fieldErrors = error.errors.map((error: any) => error.message)
    return fieldErrors.join('. ')
  } else if(error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
    // Handle Prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field'
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  } else {
    // Handle other errors
    return typeof error.message === 'string' ?  error.message : JSON.stringify(error.message)
  }
}

// Round number to 2 decimal places
export const round2 = (value: number | string) => { 
  if(typeof value === 'number') {
    return Math.round(((value + Number.EPSILON) * 100) / 100)
  }else{
    return Math.round(((Number(value) + Number.EPSILON) * 100) / 100)
  }
 };