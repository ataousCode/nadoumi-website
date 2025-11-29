import React, { useState, useEffect, useMemo } from 'react'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import {
  getNextStatuses,
  getStatusMetadata,
  getRequiredFields,
  APPLICATION_STATUS,
} from '../../constants/applicationStatus.js'

/**
 * Modal for changing application status
 * Includes conditional fields based on selected status
 * 
 * @param {object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close modal callback
 * @param {Function} props.onSubmit - Submit callback (receives statusUpdate object)
 * @param {string} props.currentStatus - Current application status
 * @param {object} [props.application] - Full application object (for context)
 * @param {boolean} [props.isLoading=false] - Loading state
 */
function StatusChangeModal({
  isOpen,
  onClose,
  onSubmit,
  currentStatus,
  application = null,
  isLoading = false,
}) {
  const { t } = useI18n()
  
  const [formData, setFormData] = useState({
    status: '',
    note: '',
    interviewDate: '',
    interviewTime: '',
    interviewLocation: '',
    interviewLink: '',
    interviewNotes: '',
    rejectionReason: '',
    rejectionFeedback: '',
  })
  
  const [errors, setErrors] = useState({})
  
  // Map legacy status to current status constants
  const normalizedStatus = React.useMemo(() => {
    // Handle legacy statuses
    if (currentStatus === 'received') return APPLICATION_STATUS.PENDING
    if (currentStatus === 'underReview') return APPLICATION_STATUS.UNDER_REVIEW
    if (currentStatus === 'interviewScheduled') return APPLICATION_STATUS.INTERVIEW_SCHEDULED
    if (currentStatus === 'interviewPassed') return APPLICATION_STATUS.INTERVIEW_PASSED
    if (currentStatus === 'accepted') return APPLICATION_STATUS.ACCEPTED
    if (currentStatus === 'rejected') return APPLICATION_STATUS.REJECTED
    return currentStatus
  }, [currentStatus])
  
  // Get next statuses based on normalized status
  const nextStatuses = React.useMemo(() => {
    console.log('StatusChangeModal - Current Status:', currentStatus, '→ Normalized:', normalizedStatus)
    const statuses = getNextStatuses(normalizedStatus)
    console.log('StatusChangeModal - Next Statuses:', statuses)
    return statuses
  }, [currentStatus, normalizedStatus])
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        status: '',
        note: '',
        interviewDate: '',
        interviewTime: '',
        interviewLocation: '',
        interviewLink: '',
        interviewNotes: '',
        rejectionReason: '',
        rejectionFeedback: '',
      })
      setErrors({})
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.status) {
      newErrors.status = t('validation.required', { field: t('admin.applications.newStatus') })
    }
    
    const requiredFields = getRequiredFields(formData.status)
    
    if (requiredFields.includes('interviewDate') && !formData.interviewDate) {
      newErrors.interviewDate = t('validation.required', { field: t('admin.applications.interviewDate') })
    }
    
    if (requiredFields.includes('interviewTime') && !formData.interviewTime) {
      newErrors.interviewTime = t('validation.required', { field: t('admin.applications.interviewTime') })
    }
    
    return newErrors
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Build status update object
    const statusUpdate = {
      status: formData.status,
      note: formData.note || '',
      metadata: {},
    }
    
    // Add status-specific metadata
    if (formData.status === APPLICATION_STATUS.INTERVIEW_SCHEDULED) {
      statusUpdate.metadata = {
        interviewDate: formData.interviewDate,
        interviewTime: formData.interviewTime,
        interviewLocation: formData.interviewLocation || '',
        interviewLink: formData.interviewLink || '',
        interviewNotes: formData.interviewNotes || '',
      }
    }
    
    if (formData.status === APPLICATION_STATUS.REJECTED) {
      statusUpdate.metadata = {
        rejectionReason: formData.rejectionReason || '',
        rejectionFeedback: formData.rejectionFeedback || '',
      }
    }
    
    onSubmit(statusUpdate)
  }
  
  const selectedMetadata = formData.status ? getStatusMetadata(formData.status) : null
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('admin.applications.changeStatus')}
          </h2>
          {application && (
            <p className="text-sm text-gray-600 mt-1">
              {application.personalInfo?.firstName} {application.personalInfo?.lastName}
            </p>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('admin.applications.newStatus')} *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`
                w-full px-4 py-3 rounded-xl border-2
                ${errors.status ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                transition-all
              `}
              disabled={isLoading}
            >
              <option value="">{t('admin.applications.selectStatus')}</option>
              {nextStatuses.map((status) => {
                const metadata = getStatusMetadata(status)
                return (
                  <option key={status} value={status}>
                    {metadata.icon} {t(metadata.label)}
                  </option>
                )
              })}
            </select>
            {errors.status && (
              <p className="text-red-600 text-sm mt-1">{errors.status}</p>
            )}
            
            {/* Status description */}
            {selectedMetadata && (
              <p className="text-sm text-gray-600 mt-2">
                {t(selectedMetadata.description)}
              </p>
            )}
          </div>
          
          {/* Admin note */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('admin.applications.adminNote')}
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              placeholder={t('admin.applications.adminNotePlaceholder')}
              className="
                w-full px-4 py-3 rounded-xl border-2 border-gray-200
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                resize-none transition-all
              "
              disabled={isLoading}
            />
          </div>
          
          {/* Interview-specific fields */}
          {formData.status === APPLICATION_STATUS.INTERVIEW_SCHEDULED && (
            <div className="space-y-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                📅 {t('admin.applications.interviewDetails')}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    {t('admin.applications.interviewDate')} *
                  </label>
                  <input
                    type="date"
                    name="interviewDate"
                    value={formData.interviewDate}
                    onChange={handleChange}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${errors.interviewDate ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                      focus:outline-none focus:ring-2 focus:ring-orange-500
                    `}
                    disabled={isLoading}
                  />
                  {errors.interviewDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.interviewDate}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    {t('admin.applications.interviewTime')} *
                  </label>
                  <input
                    type="time"
                    name="interviewTime"
                    value={formData.interviewTime}
                    onChange={handleChange}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${errors.interviewTime ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                      focus:outline-none focus:ring-2 focus:ring-orange-500
                    `}
                    disabled={isLoading}
                  />
                  {errors.interviewTime && (
                    <p className="text-red-600 text-sm mt-1">{errors.interviewTime}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  {t('admin.applications.interviewLocation')}
                </label>
                <input
                  type="text"
                  name="interviewLocation"
                  value={formData.interviewLocation}
                  onChange={handleChange}
                  placeholder={t('admin.applications.interviewLocationPlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  {t('admin.applications.interviewLink')}
                </label>
                <input
                  type="url"
                  name="interviewLink"
                  value={formData.interviewLink}
                  onChange={handleChange}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  {t('admin.applications.additionalNotes')}
                </label>
                <textarea
                  name="interviewNotes"
                  value={formData.interviewNotes}
                  onChange={handleChange}
                  rows={2}
                  placeholder={t('admin.applications.additionalNotesPlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
          
          {/* Rejection-specific fields */}
          {formData.status === APPLICATION_STATUS.REJECTED && (
            <div className="space-y-4 p-4 bg-red-50 rounded-xl border-2 border-red-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                ❌ {t('admin.applications.rejectionDetails')}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  {t('admin.applications.rejectionReason')}
                </label>
                <select
                  name="rejectionReason"
                  value={formData.rejectionReason}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                >
                  <option value="">{t('admin.applications.selectReason')}</option>
                  <option value="incomplete">{t('admin.applications.reasonIncomplete')}</option>
                  <option value="not_qualified">{t('admin.applications.reasonNotQualified')}</option>
                  <option value="capacity">{t('admin.applications.reasonCapacity')}</option>
                  <option value="other">{t('admin.applications.reasonOther')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  {t('admin.applications.feedbackToStudent')}
                </label>
                <textarea
                  name="rejectionFeedback"
                  value={formData.rejectionFeedback}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t('admin.applications.feedbackPlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-600 mt-1">
                  {t('admin.applications.feedbackNote')}
                </p>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isLoading ? t('common.submitting') : t('admin.applications.updateStatus')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StatusChangeModal

