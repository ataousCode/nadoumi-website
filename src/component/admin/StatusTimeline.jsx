import React from 'react'
import { getStatusMetadata } from '../../constants/applicationStatus.js'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

/**
 * Status timeline component
 * Displays the history of status changes for an application
 * 
 * @param {object} props
 * @param {Array} props.statusHistory - Array of status history entries
 * @param {string} [props.className=''] - Additional CSS classes
 */
function StatusTimeline({ statusHistory = [], className = '' }) {
  const { t, locale } = useI18n()
  
  if (!Array.isArray(statusHistory) || statusHistory.length === 0) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        {t('admin.applications.noHistory')}
      </div>
    )
  }
  
  // Format timestamp based on locale
  const formatDate = (timestamp) => {
    try {
      if (!timestamp) return ''
      
      // Handle Firestore Timestamp
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    } catch (_) {
      return ''
    }
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      {statusHistory.map((entry, index) => {
        const metadata = getStatusMetadata(entry.status)
        const isLatest = index === statusHistory.length - 1
        
        return (
          <div key={index} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  bg-green-100 text-green-700
                  ${isLatest ? 'ring-4 ring-green-200 shadow-lg' : ''}
                  font-medium border-2 border-green-300
                `}
              >
                {metadata.icon}
              </div>
              {index < statusHistory.length - 1 && (
                <div className="w-1 h-full min-h-[2rem] bg-gradient-to-b from-green-400 to-green-300 mt-2 rounded-full" />
              )}
            </div>
            
            {/* Timeline content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {t(metadata.label)}
                  </h4>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {formatDate(entry.timestamp)}
                  </p>
                </div>
                {isLatest && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-300">
                    {t('admin.applications.currentStatus')}
                  </span>
                )}
              </div>
              
              {/* Admin note */}
              {entry.note && (
                <p className="text-sm text-gray-700 mt-2 bg-green-50 rounded-lg p-3 border border-green-200">
                  <span className="font-medium text-green-800">{t('admin.applications.note')}:</span> {entry.note}
                </p>
              )}
              
              {/* Admin who made the change */}
              {entry.adminEmail && (
                <p className="text-xs text-gray-500 mt-2">
                  {t('admin.applications.changedBy')}: {entry.adminEmail}
                </p>
              )}
              
              {/* Status-specific metadata */}
              {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                <div className="mt-2 text-sm space-y-1">
                  {entry.metadata.interviewDate && (
                    <p className="text-gray-700">
                      <span className="font-medium">{t('admin.applications.interviewDate')}:</span>{' '}
                      {entry.metadata.interviewDate} {entry.metadata.interviewTime}
                    </p>
                  )}
                  {entry.metadata.interviewLocation && (
                    <p className="text-gray-700">
                      <span className="font-medium">{t('admin.applications.location')}:</span>{' '}
                      {entry.metadata.interviewLocation}
                    </p>
                  )}
                  {entry.metadata.interviewLink && (
                    <p className="text-gray-700">
                      <span className="font-medium">{t('admin.applications.link')}:</span>{' '}
                      <a
                        href={entry.metadata.interviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:underline"
                      >
                        {entry.metadata.interviewLink}
                      </a>
                    </p>
                  )}
                  {entry.metadata.rejectionReason && (
                    <p className="text-gray-700">
                      <span className="font-medium">{t('admin.applications.reason')}:</span>{' '}
                      {entry.metadata.rejectionReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatusTimeline

