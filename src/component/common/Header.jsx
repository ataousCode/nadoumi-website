import React from 'react'

function Header({ eyebrow, title, subtitle, align = 'left', className = '' }) {
  const alignment = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align] || 'text-left'

  return (
    <div className={`space-y-2 ${alignment} ${className}`}>
      {eyebrow && <p className="text-xs uppercase tracking-widest text-orange-600">{eyebrow}</p>}
      {title && <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>}
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  )
}

export default Header