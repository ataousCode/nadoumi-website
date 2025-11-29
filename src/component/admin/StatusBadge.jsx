import React from 'react'
import { getStatusMetadata } from '../../constants/applicationStatus.js'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

/**
 * Reusable status badge component
 * Displays application status with appropriate colors and icons
 * 
 * @param {object} props
 * @param {string} props.status - Application status
 * @param {boolean} [props.showIcon=true] - Whether to show the status icon
 * @param {string} [props.size='md'] - Badge size ('sm', 'md', 'lg')
 * @param {string} [props.className=''] - Additional CSS classes
 */
function StatusBadge({ status, showIcon = true, size = 'md', className = '' }) {
  const { t } = useI18n()
  const metadata = getStatusMetadata(status)
  
  // Size variants
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }
  
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${metadata.bgColor} ${metadata.textColor} ${metadata.borderColor}
        border
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      title={t(metadata.description)}
    >
      {showIcon && <span className="text-sm">{metadata.icon}</span>}
      <span>{t(metadata.label)}</span>
    </span>
  )
}

export default StatusBadge
