/**
 * Status Configuration Utilities
 * Enhanced status styling and configuration for UI components
 */
import { APPLICATION_STATUS, getStatusMetadata } from './applicationStatus.js'

/**
 * Enhanced status configuration with Tailwind CSS classes
 * Optimized for card layouts and badges
 */
export const STATUS_CONFIG = {
  [APPLICATION_STATUS.PENDING]: {
    label: 'Pending',
    color: 'yellow',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    icon: '⏳',
    description: 'Your application is awaiting review',
    badgeBg: 'bg-yellow-100',
    badgeText: 'text-yellow-800',
  },
  [APPLICATION_STATUS.RECEIVED]: {
    label: 'Received',
    color: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: '📥',
    description: 'Application received and logged',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
  },
  [APPLICATION_STATUS.UNDER_REVIEW]: {
    label: 'Under Review',
    color: 'purple',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    icon: '🔍',
    description: 'Being reviewed by our team',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
  },
  [APPLICATION_STATUS.INTERVIEW]: {
    label: 'Interview Scheduled',
    color: 'indigo',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    icon: '💼',
    description: 'Interview has been scheduled',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
  },
  [APPLICATION_STATUS.INTERVIEW_PASSED]: {
    label: 'Interview Passed',
    color: 'green',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: '✅',
    description: 'Successfully passed the interview',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-800',
  },
  [APPLICATION_STATUS.INTERVIEW_FAILED]: {
    label: 'Interview Not Successful',
    color: 'red',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: '❌',
    description: 'Interview did not meet requirements',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-800',
  },
  [APPLICATION_STATUS.ACCEPTED]: {
    label: 'Accepted',
    color: 'green',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: '🎉',
    description: 'Application accepted! Congratulations!',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-800',
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: 'Rejected',
    color: 'red',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: '✖️',
    description: 'Application was not successful',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-800',
  },
  [APPLICATION_STATUS.REVOKED]: {
    label: 'Revoked',
    color: 'orange',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    icon: '⚠️',
    description: 'Application has been revoked',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-800',
  },
}

/**
 * Get status configuration with styling classes
 * @param {string} status - Application status
 * @returns {object} Status configuration with CSS classes
 */
export function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG[APPLICATION_STATUS.PENDING]
}

/**
 * Get status badge classes (for smaller inline badges)
 * @param {string} status - Application status
 * @returns {object} Badge-specific classes
 */
export function getStatusBadgeClasses(status) {
  const config = getStatusConfig(status)
  return {
    bg: config.badgeBg,
    text: config.badgeText,
    icon: config.icon,
    label: config.label,
  }
}

/**
 * Get status card classes (for larger card layouts)
 * @param {string} status - Application status
 * @returns {object} Card-specific classes
 */
export function getStatusCardClasses(status) {
  const config = getStatusConfig(status)
  return {
    bg: config.bg,
    border: config.border,
    text: config.text,
    icon: config.icon,
    label: config.label,
    description: config.description,
  }
}

/**
 * Check if status is positive/successful
 * @param {string} status - Application status
 * @returns {boolean}
 */
export function isPositiveStatus(status) {
  return [
    APPLICATION_STATUS.ACCEPTED,
    APPLICATION_STATUS.INTERVIEW_PASSED,
    APPLICATION_STATUS.INTERVIEW,
  ].includes(status)
}

/**
 * Check if status is negative/unsuccessful
 * @param {string} status - Application status
 * @returns {boolean}
 */
export function isNegativeStatus(status) {
  return [
    APPLICATION_STATUS.REJECTED,
    APPLICATION_STATUS.INTERVIEW_FAILED,
    APPLICATION_STATUS.REVOKED,
  ].includes(status)
}

/**
 * Check if status is in progress
 * @param {string} status - Application status
 * @returns {boolean}
 */
export function isInProgressStatus(status) {
  return [
    APPLICATION_STATUS.PENDING,
    APPLICATION_STATUS.RECEIVED,
    APPLICATION_STATUS.UNDER_REVIEW,
  ].includes(status)
}

/**
 * Get all status configurations
 * @returns {object} All status configurations
 */
export function getAllStatusConfigs() {
  return STATUS_CONFIG
}

