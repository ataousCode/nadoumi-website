import React from 'react'

function Card({
    children,
    className = '',
    variant = 'default',
    padding = 'default',
    onClick,
    hover = false
}) {
    const variants = {
        default: 'bg-white border-orange-100',
        highlighted: 'bg-orange-50 border-orange-200',
        success: 'bg-green-50 border-green-500',
        error: 'bg-red-50 border-red-200'
    }

    const paddings = {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8'
    }

    const variantClass = variants[variant] || variants.default
    const paddingClass = paddings[padding] || paddings.default
    const hoverClass = hover ? 'transition-all hover:shadow-lg hover:border-orange-300' : ''
    const clickableClass = onClick ? 'cursor-pointer' : ''

    return (
        <div
            className={`rounded-xl border ${variantClass} ${paddingClass} ${hoverClass} ${clickableClass} ${className}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </div>
    )
}

export default Card
