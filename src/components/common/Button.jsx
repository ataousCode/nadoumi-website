import React from 'react'
import { cn } from '../../utils/cn'

function Button({ variant = 'primary', size = 'md', children, className = '', ariaLabel, type = 'button', shadow = false, ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider text-[11px]'
  const sizes = {
    sm: 'px-4 py-2 rounded-xl',
    md: 'px-6 py-3 rounded-2xl',
    lg: 'px-8 py-4 rounded-2xl text-[11px]',
  }
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/10',
    secondary: 'bg-gray-50 border border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-100',
    ghost: 'text-gray-500 hover:text-orange-600 hover:bg-orange-50/50 rounded-xl',
  }

  return (
    <button
      type={type}
      className={cn(base, sizes[size], variants[variant], shadow && 'shadow-xl', className)}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button