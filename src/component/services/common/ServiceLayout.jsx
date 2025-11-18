import React from 'react'

function ServiceLayout({ children, className = '' }) {
  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </div>
    </section>
  )
}

export default ServiceLayout