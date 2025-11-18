import React from 'react'

function Button({ variant = 'primary', size = 'md', children, className = '', ariaLabel, type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed'
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  }
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600',
    secondary: 'border-2 border-orange-500 text-black hover:bg-orange-50',
    ghost: 'text-black hover:bg-orange-50',
  }
  const composed = `${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`

  return (
    <button type={type} className={composed} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  )
}

export default Button