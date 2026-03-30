import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

function Link({
    to,
    children,
    className = '',
    variant = 'default',
    size = 'md',
    external = false,
    ...props
}) {
    const variants = {
        default: 'text-orange-600 hover:text-orange-700 hover:underline',
        button: 'inline-block bg-orange-600 text-white font-semibold rounded-md shadow hover:bg-orange-700 transition-colors',
        buttonSecondary: 'inline-block bg-white text-orange-700 font-semibold rounded-md border-2 border-orange-200 hover:bg-orange-50 transition-colors'
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg'
    }

    const variantClass = variants[variant] || variants.default
    const sizeClass = variant.includes('button') ? sizes[size] || sizes.md : ''

    if (external) {
        return (
            <a
                href={to}
                className={`${variantClass} ${sizeClass} ${className}`}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {children}
            </a>
        )
    }

    return (
        <RouterLink
            to={to}
            className={`${variantClass} ${sizeClass} ${className}`}
            {...props}
        >
            {children}
        </RouterLink>
    )
}

export default Link
