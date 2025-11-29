import React from 'react'

function Container({ 
  children, 
  className = '', 
  size = 'default',
  as = 'div'
}) {
  const sizes = {
    sm: 'py-8',
    default: 'py-12',
    md: 'py-16',
    lg: 'py-24',
    none: ''
  }
  
  const Component = as
  const sizeClass = sizes[size] || sizes.default
  
  return (
    <Component className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${sizeClass} ${className}`}>
      {children}
    </Component>
  )
}

export default Container
