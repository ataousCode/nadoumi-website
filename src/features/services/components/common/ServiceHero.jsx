import React from 'react'

function ServiceHero({
  eyebrow = 'Our Services',
  title = 'Professional Solutions Tailored to You',
  subtitle = 'Expert guidance for Import & Export and Student Admission, delivered with clarity and care.',
  align = 'center',
  actions = [],
}) {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-center text-center'
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className={`flex flex-col ${alignment} max-w-3xl mx-auto`}>
          {eyebrow && <span className="uppercase tracking-wider text-orange-600 font-semibold">{eyebrow}</span>}
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-4 text-lg sm:text-xl text-gray-700">{subtitle}</p>}
          {Array.isArray(actions) && actions.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {actions.map((a, i) => (
                <a
                  key={i}
                  href={a.href}
                  className={`inline-block px-6 py-3 rounded-md font-semibold shadow ${a.variant === 'secondary' ? 'bg-white text-orange-700 border border-orange-200 hover:bg-orange-50' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                >
                  {a.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ServiceHero