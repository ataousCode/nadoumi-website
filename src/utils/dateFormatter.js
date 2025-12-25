/**
 * Date Formatting Utilities
 * Centralized date formatting functions for consistent display
 */

/**
 * Format date to readable string
 * @param {string|Date} value - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date or fallback
 */
export function formatDate(value, options = {}) {
  if (!value) return '—'
  
  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    
    const defaultOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...options
    }
    
    return date.toLocaleDateString('en-US', defaultOptions)
  } catch {
    return '—'
  }
}

/**
 * Format date with full month name
 * @param {string|Date} value - Date to format
 * @returns {string} Formatted date (e.g., "December 25, 2025")
 */
export function formatDateLong(value) {
  return formatDate(value, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Format date as short string
 * @param {string|Date} value - Date to format
 * @returns {string} Formatted date (e.g., "12/25/2025")
 */
export function formatDateShort(value) {
  return formatDate(value, {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })
}

/**
 * Format date with time
 * @param {string|Date} value - Date to format
 * @returns {string} Formatted date and time (e.g., "Dec 25, 2025, 2:30 PM")
 */
export function formatDateTime(value) {
  return formatDate(value, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} value - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(value) {
  if (!value) return '—'
  
  try {
    const date = new Date(value)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? 'day' : 'days'} ago`
    }
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800)
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
    }
    
    // For older dates, show the actual date
    return formatDate(value)
  } catch {
    return '—'
  }
}

/**
 * Format time only (e.g., "2:30 PM")
 * @param {string|Date} value - Date to format
 * @returns {string} Formatted time
 */
export function formatTime(value) {
  if (!value) return '—'
  
  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return '—'
  }
}

/**
 * Check if date is in the past
 * @param {string|Date} value - Date to check
 * @returns {boolean} True if date is in the past
 */
export function isPast(value) {
  if (!value) return false
  try {
    return new Date(value) < new Date()
  } catch {
    return false
  }
}

/**
 * Check if date is in the future
 * @param {string|Date} value - Date to check
 * @returns {boolean} True if date is in the future
 */
export function isFuture(value) {
  if (!value) return false
  try {
    return new Date(value) > new Date()
  } catch {
    return false
  }
}

/**
 * Check if date is today
 * @param {string|Date} value - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(value) {
  if (!value) return false
  try {
    const date = new Date(value)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  } catch {
    return false
  }
}

/**
 * Check if deadline is approaching (within days threshold)
 * @param {string|Date} value - Date to check
 * @param {number} daysThreshold - Number of days to consider "approaching" (default: 7)
 * @returns {boolean} True if deadline is approaching
 */
export function isDeadlineApproaching(value, daysThreshold = 7) {
  if (!value) return false
  try {
    const date = new Date(value)
    const now = new Date()
    const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24))
    return diffInDays > 0 && diffInDays <= daysThreshold
  } catch {
    return false
  }
}

/**
 * Get days until deadline
 * @param {string|Date} value - Deadline date
 * @returns {number|null} Number of days until deadline (negative if passed)
 */
export function getDaysUntil(value) {
  if (!value) return null
  try {
    const date = new Date(value)
    const now = new Date()
    return Math.ceil((date - now) / (1000 * 60 * 60 * 24))
  } catch {
    return null
  }
}

/**
 * Format deadline with context (e.g., "in 3 days", "2 days ago")
 * @param {string|Date} value - Deadline date
 * @returns {string} Formatted deadline with context
 */
export function formatDeadline(value) {
  const days = getDaysUntil(value)
  if (days === null) return '—'
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days > 0) return `in ${days} ${days === 1 ? 'day' : 'days'}`
  return `${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'} ago`
}

/**
 * Get month and year (e.g., "December 2025")
 * @param {string|Date} value - Date to format
 * @returns {string} Month and year
 */
export function formatMonthYear(value) {
  return formatDate(value, {
    month: 'long',
    year: 'numeric'
  })
}

/**
 * Get age from birthdate
 * @param {string|Date} birthdate - Birthdate
 * @returns {number|null} Age in years
 */
export function calculateAge(birthdate) {
  if (!birthdate) return null
  try {
    const birth = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  } catch {
    return null
  }
}

