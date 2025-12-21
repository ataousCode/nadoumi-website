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
    videoCallPlatform: '',
    videoCallLink: '',
    interviewNotes: '',
    rejectionReason: '',
    rejectionFeedback: '',
    revocationReason: '',
    revocationDetails: '',
    interviewFailureReason: '',
    admissionFile: null,
    jw202File: null,
  })
  
  const [errors, setErrors] = useState({})
  
  // Map legacy status to current status constants
  const normalizedStatus = React.useMemo(() => {
    if (!currentStatus) return APPLICATION_STATUS.PENDING
    
    const statusLower = currentStatus.toLowerCase()
    if (statusLower === 'pending') return APPLICATION_STATUS.PENDING
    if (statusLower === 'received') return APPLICATION_STATUS.RECEIVED
    if (statusLower === 'under_review' || statusLower === 'underreview') return APPLICATION_STATUS.UNDER_REVIEW
    if (statusLower === 'interview' || statusLower === 'interview_scheduled' || statusLower === 'interviewscheduled') return APPLICATION_STATUS.INTERVIEW
    if (statusLower === 'interview_passed' || statusLower === 'interviewpassed') return APPLICATION_STATUS.INTERVIEW_PASSED
    if (statusLower === 'interview_failed' || statusLower === 'interviewfailed') return APPLICATION_STATUS.INTERVIEW_FAILED
    if (statusLower === 'accepted') return APPLICATION_STATUS.ACCEPTED
    if (statusLower === 'rejected') return APPLICATION_STATUS.REJECTED
    if (statusLower === 'revoked') return APPLICATION_STATUS.REVOKED
    
    // If already in correct format, return as is
    if (Object.values(APPLICATION_STATUS).includes(currentStatus)) return currentStatus
    
    return APPLICATION_STATUS.PENDING
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
        videoCallPlatform: '',
        videoCallLink: '',
        interviewNotes: '',
        rejectionReason: '',
        rejectionFeedback: '',
        revocationReason: '',
        revocationDetails: '',
        interviewFailureReason: '',
        admissionFile: null,
        jw202File: null,
      })
      setErrors({})
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    
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
    
    if (formData.status === APPLICATION_STATUS.REVOKED) {
      if (!formData.revocationReason) {
        newErrors.revocationReason = 'Revocation reason is required'
      }
      if (!formData.revocationDetails) {
        newErrors.revocationDetails = 'Revocation details are required'
      }
    }
    
    if (formData.status === APPLICATION_STATUS.INTERVIEW_FAILED) {
      if (!formData.interviewFailureReason) {
        newErrors.interviewFailureReason = 'Interview failure reason is required'
      }
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
    if (formData.status === APPLICATION_STATUS.INTERVIEW) {
      statusUpdate.metadata = {
        interviewDate: formData.interviewDate,
        interviewTime: formData.interviewTime,
        videoCallPlatform: formData.videoCallPlatform || '',
        videoCallLink: formData.videoCallLink || '',
        interviewNotes: formData.interviewNotes || '',
      }
    }
    
    if (formData.status === APPLICATION_STATUS.REJECTED) {
      statusUpdate.metadata = {
        rejectionReason: formData.rejectionReason || '',
        rejectionFeedback: formData.rejectionFeedback || '',
      }
    }
    
    if (formData.status === APPLICATION_STATUS.REVOKED) {
      statusUpdate.metadata = {
        revocationReason: formData.revocationReason || '',
        revocationDetails: formData.revocationDetails || '',
      }
    }
    
    if (formData.status === APPLICATION_STATUS.INTERVIEW_FAILED) {
      statusUpdate.metadata = {
        interviewFailureReason: formData.interviewFailureReason || '',
      }
      // Interview failed automatically becomes rejected
      statusUpdate.status = APPLICATION_STATUS.REJECTED
      statusUpdate.metadata.rejectionReason = 'interview_failed'
      statusUpdate.metadata.rejectionFeedback = formData.interviewFailureReason || 'Interview did not meet requirements'
    }
    
    // Add files for accepted status
    if (formData.status === APPLICATION_STATUS.ACCEPTED) {
      statusUpdate.files = {
        admission: formData.admissionFile,
        jw202: formData.jw202File,
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
          {formData.status === APPLICATION_STATUS.INTERVIEW && (
            <div className="space-y-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  📅 Interview Scheduled
                </h3>
                <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-300">
                  🇨🇳 China Beijing Time
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Interview Date *
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
                    Interview Time (Beijing) *
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
                  Video Call Platform
                </label>
                <select
                  name="videoCallPlatform"
                  value={formData.videoCallPlatform}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                >
                  <option value="">Select Platform</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Tencent Meeting">Tencent Meeting</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Video Call Link
                </label>
                <input
                  type="url"
                  name="videoCallLink"
                  value={formData.videoCallLink}
                  onChange={handleChange}
                  placeholder="https://zoom.us/j/... or https://meeting.tencent.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the meeting link for Zoom, Tencent Meeting, or other platform
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Additional Notes
                </label>
                <textarea
                  name="interviewNotes"
                  value={formData.interviewNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any additional instructions or information for the student..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
          
          {/* Interview Passed fields */}
          {formData.status === APPLICATION_STATUS.INTERVIEW_PASSED && (
            <div className="space-y-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                ✅ Interview Completed
              </h3>
              <p className="text-sm text-gray-700">
                The student has successfully completed the interview. You can proceed to accept or reject based on the interview results.
              </p>
            </div>
          )}
          
          {/* Interview Failed fields */}
          {formData.status === APPLICATION_STATUS.INTERVIEW_FAILED && (
            <div className="space-y-4 p-4 bg-red-50 rounded-xl border-2 border-red-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                ❌ Interview Failed
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                The interview did not meet requirements. The application will be automatically rejected.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Failure Reason *
                </label>
                <textarea
                  name="interviewFailureReason"
                  value={formData.interviewFailureReason}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Explain why the interview did not pass (this will be included in the rejection email to the student)..."
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                    errors.interviewFailureReason ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                  required
                />
                {errors.interviewFailureReason && (
                  <p className="text-red-600 text-sm mt-1">{errors.interviewFailureReason}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Revoked fields */}
          {formData.status === APPLICATION_STATUS.REVOKED && (
            <div className="space-y-4 p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                ⚠️ Application Revoked
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Revoke the application if documents are missing or there are issues that need to be resolved.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Revocation Reason *
                </label>
                <select
                  name="revocationReason"
                  value={formData.revocationReason}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.revocationReason ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                  required
                >
                  <option value="">Select reason</option>
                  <option value="missing_documents">Missing Documents</option>
                  <option value="incomplete_information">Incomplete Information</option>
                  <option value="document_quality">Poor Document Quality</option>
                  <option value="verification_issue">Verification Issue</option>
                  <option value="other">Other</option>
                </select>
                {errors.revocationReason && (
                  <p className="text-red-600 text-sm mt-1">{errors.revocationReason}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Details for Student *
                </label>
                <textarea
                  name="revocationDetails"
                  value={formData.revocationDetails}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Explain what is missing or what needs to be fixed. This will be sent to the student via email..."
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                    errors.revocationDetails ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                  required
                />
                {errors.revocationDetails && (
                  <p className="text-red-600 text-sm mt-1">{errors.revocationDetails}</p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  Be specific about what documents or information are missing so the student can fix the issue.
                </p>
              </div>
            </div>
          )}
          
          {/* Accepted-specific fields - Document uploads */}
          {formData.status === APPLICATION_STATUS.ACCEPTED && (
            <div className="space-y-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                🎉 Application Accepted
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Upload admission letter and JW202 form for the student. They will be notified via email.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Admission Letter (Optional)
                </label>
                <input
                  type="file"
                  name="admissionFile"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload the student's admission letter (PDF, DOC, or DOCX)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  JW202 Form (Optional)
                </label>
                <input
                  type="file"
                  name="jw202File"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload the student's JW202 visa form (PDF, DOC, or DOCX)
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Documents can also be uploaded later from the application detail page. Students will receive email notifications when documents are uploaded.
                </p>
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
                  <option value="interview_failed">Interview Failed</option>
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

