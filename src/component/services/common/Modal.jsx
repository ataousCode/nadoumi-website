import React, { useEffect } from 'react'

function Modal({ open = false, title, children, onClose, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const sizeClass = {
    sm: 'max-w-lg',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
  }[size] || 'max-w-xl'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true"></div>
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Details'}
        className={`relative w-full ${sizeClass} mx-4 sm:mx-6 md:mx-8 bg-white rounded-xl shadow-lg border border-orange-100`}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            {title && <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Close"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>
          <div className="mt-4 text-gray-700 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal