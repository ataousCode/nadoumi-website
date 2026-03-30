import React from 'react'

function ServiceHeader({ eyebrow, title, subtitle, align = 'center', className = '' }) {
  const alignment = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align] || 'text-center'

  return (
    <div className={`space-y-2 ${alignment} ${className}`} aria-label="Service header">
      {eyebrow && <p className="text-xs uppercase tracking-widest text-orange-600">{eyebrow}</p>}
      {title && <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>}
      {subtitle && <p className="text-gray-700 max-w-3xl mx-auto">{subtitle}</p>}
    </div>
  )
}

export default ServiceHeader