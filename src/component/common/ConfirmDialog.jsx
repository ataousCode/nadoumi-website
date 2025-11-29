import React, { useState, useEffect } from 'react'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

/**
 * Reusable confirmation dialog component
 * 
 * @param {object} props
 * @param {boolean} props.isOpen - Whether dialog is open
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onConfirm - Confirm callback
 * @param {string} props.title - Dialog title
 * @param {string|React.ReactNode} props.message - Dialog message
 * @param {string} [props.confirmText] - Confirm button text (default: "Confirm")
 * @param {string} [props.cancelText] - Cancel button text (default: "Cancel")
 * @param {string} [props.variant='danger'] - Variant: 'danger' | 'warning' | 'info'
 * @param {boolean} [props.isLoading=false] - Loading state
 * @param {boolean} [props.requireConfirmation=false] - Require typing confirmation phrase
 * @param {string} [props.confirmationPhrase] - Phrase to type if requireConfirmation is true
 * @param {React.ReactNode} [props.children] - Additional content to display
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger',
  isLoading = false,
  requireConfirmation = false,
  confirmationPhrase,
  children,
}) {
  const { t } = useI18n()
  const [confirmationText, setConfirmationText] = useState('')

  // Reset confirmation text when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmationText('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const defaultPhrase = confirmationPhrase || 'CONFIRM'
  const isConfirmed = !requireConfirmation || confirmationText === defaultPhrase

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm()
    }
  }

  const handleClose = () => {
    setConfirmationText('')
    onClose()
  }

  // Variant styles
  const variantStyles = {
    danger: {
      headerBg: 'bg-red-50',
      headerBorder: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      buttonBg: 'bg-red-600',
      buttonHover: 'hover:bg-red-700',
    },
    warning: {
      headerBg: 'bg-amber-50',
      headerBorder: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      buttonBg: 'bg-amber-600',
      buttonHover: 'hover:bg-amber-700',
    },
    info: {
      headerBg: 'bg-blue-50',
      headerBorder: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700',
    },
  }

  const styles = variantStyles[variant] || variantStyles.danger

  // Icons
  const getIcon = () => {
    if (variant === 'danger') {
      return (
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      )
    } else if (variant === 'warning') {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      )
    } else {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className={`${styles.headerBg} border-b ${styles.headerBorder} px-6 py-4 rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
              <svg
                className={`w-6 h-6 ${styles.iconColor}`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {getIcon()}
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Message */}
          {message && (
            <div className="text-sm text-gray-700">
              {typeof message === 'string' ? <p>{message}</p> : message}
            </div>
          )}

          {/* Children content */}
          {children}

          {/* Confirmation input */}
          {requireConfirmation && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('common.typeToConfirm', { phrase: defaultPhrase })}
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={defaultPhrase}
                className="
                  w-full px-4 py-3 rounded-xl border-2 border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                  font-mono text-center text-lg tracking-wider
                  transition-all
                "
                disabled={isLoading}
                autoFocus
              />
              {confirmationText && !isConfirmed && (
                <p className="text-red-600 text-sm mt-2 text-center">
                  {t('common.confirmationMismatch')}
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText || t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isConfirmed || isLoading}
              className={`
                flex-1 px-6 py-3 rounded-xl ${styles.buttonBg} text-white font-medium
                ${styles.buttonHover} transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              `}
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isLoading ? t('common.processing') : (confirmText || t('common.confirm'))}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

