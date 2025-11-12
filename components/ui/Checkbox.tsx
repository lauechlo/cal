'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  colorClass?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, colorClass = 'border-gray-300', ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 border-2 rounded transition-all',
              'peer-checked:bg-current peer-checked:border-current',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
              'group-hover:border-gray-400',
              colorClass,
              className
            )}
          >
            <Check
              className={cn(
                'w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'opacity-0 peer-checked:opacity-100 transition-opacity'
              )}
              strokeWidth={3}
            />
          </div>
        </div>
        {label && (
          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {label}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
