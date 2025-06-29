import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {prisma} from '@/db/prisma'
import qs from 'query-string'

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

 const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
 })

//  Format currency using the formatter above
export const formatCurrency = (amount: number | string | null) => {
  if(typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount)
  }else if(typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount))
  } else {
    return 'NAN'
  }
 };

//  Shorten UUID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`
}

console.log(formatId('6769e6a5-1d1e-4106-8817-413e08287061'))

// Format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

/**
 * 递归将对象中的所有 Decimal 字段转换为字符串
 * @param obj 需要转换的对象
 * @returns 转换后的对象
 */
export function convertDecimalFieldsToString<T extends Record<string, any>>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(convertDecimalFieldsToString) as any;
  }
  if (obj && typeof obj === "object") {
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const value = obj[key];
      // 检查是否为 Decimal 实例
      if (value && typeof value === "object" && typeof value.toString === "function" && value.constructor?.name === "Decimal") {
        result[key] = value.toString();
      } else {
        result[key] = convertDecimalFieldsToString(value);
      }
    }
    return result as T;
  }
  return obj;
}

// Form the pagination links
export const formUrlQuery = ({params, key, value}: {params: string; key: string; value: string | null}) => { 

  const query = qs.parse(params)

  query[key] = value

  return qs.stringifyUrl(
    {
    url: window.location.pathname,
    query,
  }, {
    skipNull: true
  }
)
 };