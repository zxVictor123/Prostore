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