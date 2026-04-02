import React from 'react'
import { cn } from '../../utils/cn'

function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ariaLabel, 
  type = 'button', 
  shadow = false, 
  isLoading = false,
  disabled = false,
  ...props 
}) {
  const base = 'inline-flex items-center gap-2 justify-center font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider text-[11px]'
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
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  )
}

export default Button