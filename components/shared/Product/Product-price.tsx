import { cn } from '@/lib/utils';
import React from 'react'

export default function ProductPrice({value,className}: {value: number; className?: string}) {
    const stringValue = value.toFixed(2);
    const [intValue,floatValue] = stringValue.split('.')

  return (
    <p className={cn('text-2xl',className)}>
        <span className='text-xs align-super'>$</span>
        {intValue}
        <span className='text-xs align-super'> .{floatValue} </span>
    </p>
  )
}
