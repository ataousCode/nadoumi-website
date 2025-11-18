import React, { useState } from 'react'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

function FAQ({ items = [], title, className = '' }) {
  const [openId, setOpenId] = useState(null)
  const { t } = useI18n()
  const resolvedTitle = title || t('services.faq')

  return (
    <section className={`bg-white ${className}`} aria-labelledby="faq-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">{resolvedTitle}</h2>
        </div>
        <div className="mt-8 space-y-4">
          {items.map((q) => {
            const isOpen = openId === q.id
            return (
              <div key={q.id} className="rounded-xl border border-orange-100 bg-white shadow-sm overflow-hidden">
                <button
                  className="w-full text-left px-6 py-4 flex items-center justify-between"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : q.id)}
                >
                  <span className="font-semibold text-gray-900">{q.question}</span>
                  <span className="text-gray-500">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-gray-700">{q.answer}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQ