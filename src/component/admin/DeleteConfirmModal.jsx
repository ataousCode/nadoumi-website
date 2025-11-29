import React, { useState } from 'react'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

/**
 * Confirmation modal for deleting applications
 * Requires user to type confirmation phrase to prevent accidental deletion
 * 
 * @param {object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close modal callback
 * @param {Function} props.onConfirm - Confirm deletion callback
 * @param {object} [props.application] - Application to delete
 * @param {boolean} [props.isLoading=false] - Loading state
 * @param {boolean} [props.requireConfirmation=true] - Require typing confirmation phrase
 */
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  application = null,
  isLoading = false,
  requireConfirmation = true,
}) {
  const { t } = useI18n()
  const [confirmationText, setConfirmationText] = useState('')
  
  if (!isOpen) return null
  
  const confirmationPhrase = 'DELETE'
  const isConfirmed = !requireConfirmation || confirmationText === confirmationPhrase
  
  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm()
    }
  }
  
  const handleClose = () => {
    setConfirmationText('')
    onClose()
  }
  
  const studentName = application
    ? `${application.personalInfo?.firstName || ''} ${application.personalInfo?.lastName || ''}`.trim()
    : ''
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header with warning icon */}
        <div className="bg-red-50 border-b border-red-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {t('admin.applications.deleteConfirmTitle')}
              </h2>
              <p className="text-sm text-red-700 mt-0.5">
                {t('admin.applications.deleteWarning')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Application info */}
          {application && (
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">
                {t('admin.applications.deletingApplication')}:
              </p>
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">{t('common.name')}:</span> {studentName}
                </p>
                <p>
                  <span className="font-medium">{t('common.email')}:</span>{' '}
                  {application.contactInfo?.email || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">{t('admin.applications.id')}:</span> {application.id}
                </p>
                <p>
                  <span className="font-medium">{t('common.status')}:</span>{' '}
                  <span className="font-semibold text-red-600">{application.status}</span>
                </p>
              </div>
            </div>
          )}
          
          {/* Warning message */}
          <div className="text-sm text-gray-700 space-y-2">
            <p className="font-medium text-gray-900">
              {t('admin.applications.deleteConfirmMessage')}:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
              <li>{t('admin.applications.deleteItem1')}</li>
              <li>{t('admin.applications.deleteItem2')}</li>
              <li>{t('admin.applications.deleteItem3')}</li>
            </ul>
          </div>
          
          {/* Confirmation input */}
          {requireConfirmation && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('admin.applications.typeToConfirm', { phrase: confirmationPhrase })}
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={confirmationPhrase}
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
                  {t('admin.applications.confirmationMismatch')}
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
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isConfirmed || isLoading}
              className="
                flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-medium
                hover:bg-red-700 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isLoading ? t('common.deleting') : t('admin.applications.deleteButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal

