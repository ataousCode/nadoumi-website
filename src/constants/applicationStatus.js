/**
 * Application status constants and workflow logic
 * Central source of truth for all application status-related functionality
 */

// Status enum - use these constants throughout the app
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  RECEIVED: 'received',
  UNDER_REVIEW: 'under_review',
  INTERVIEW: 'interview',
  INTERVIEW_PASSED: 'interview_passed',
  INTERVIEW_FAILED: 'interview_failed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  REVOKED: 'revoked',
}

// Status metadata: display name, color, icon, description
export const STATUS_METADATA = {
  [APPLICATION_STATUS.PENDING]: {
    label: 'Pending',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300',
    icon: '⏳',
    description: 'Application is pending review',
  },
  [APPLICATION_STATUS.RECEIVED]: {
    label: 'Received',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    icon: '📬',
    description: 'Application has been received',
  },
  [APPLICATION_STATUS.UNDER_REVIEW]: {
    label: 'Under Review',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    icon: '👁️',
    description: 'Application is under review',
  },
  [APPLICATION_STATUS.INTERVIEW]: {
    label: 'Interview',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-300',
    icon: '📅',
    description: 'Interview scheduled',
  },
  [APPLICATION_STATUS.ACCEPTED]: {
    label: 'Accepted',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    icon: '🎉',
    description: 'Application has been accepted',
  },
  [APPLICATION_STATUS.INTERVIEW_PASSED]: {
    label: 'Interview Completed',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    icon: '✅',
    description: 'Interview completed successfully',
  },
  [APPLICATION_STATUS.INTERVIEW_FAILED]: {
    label: 'Interview Failed',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    icon: '❌',
    description: 'Interview did not pass',
  },
  [APPLICATION_STATUS.ACCEPTED]: {
    label: 'Accepted',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    icon: '🎉',
    description: 'Application has been accepted',
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: 'Rejected',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    icon: '❌',
    description: 'Application has been rejected',
  },
  [APPLICATION_STATUS.REVOKED]: {
    label: 'Revoked',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-300',
    icon: '⚠️',
    description: 'Application has been revoked due to missing documents or issues',
  },
}

// Define allowed status transitions (workflow)
export const ALLOWED_TRANSITIONS = {
  [APPLICATION_STATUS.PENDING]: [
    APPLICATION_STATUS.RECEIVED,
    APPLICATION_STATUS.UNDER_REVIEW,
    APPLICATION_STATUS.REJECTED,
    APPLICATION_STATUS.REVOKED,
  ],
  [APPLICATION_STATUS.RECEIVED]: [
    APPLICATION_STATUS.UNDER_REVIEW,
    APPLICATION_STATUS.REJECTED,
    APPLICATION_STATUS.REVOKED,
  ],
  [APPLICATION_STATUS.UNDER_REVIEW]: [
    APPLICATION_STATUS.INTERVIEW,
    APPLICATION_STATUS.ACCEPTED,
    APPLICATION_STATUS.REJECTED,
    APPLICATION_STATUS.REVOKED,
  ],
  [APPLICATION_STATUS.INTERVIEW]: [
    APPLICATION_STATUS.INTERVIEW_PASSED,
    APPLICATION_STATUS.INTERVIEW_FAILED,
    APPLICATION_STATUS.ACCEPTED,
    APPLICATION_STATUS.REJECTED,
  ],
  [APPLICATION_STATUS.INTERVIEW_PASSED]: [
    APPLICATION_STATUS.ACCEPTED,
    APPLICATION_STATUS.REJECTED,
  ],
  [APPLICATION_STATUS.INTERVIEW_FAILED]: [
    APPLICATION_STATUS.REJECTED,
  ],
  [APPLICATION_STATUS.ACCEPTED]: [], // Terminal state
  [APPLICATION_STATUS.REJECTED]: [], // Terminal state
  [APPLICATION_STATUS.REVOKED]: [
    APPLICATION_STATUS.PENDING,
    APPLICATION_STATUS.RECEIVED,
    APPLICATION_STATUS.UNDER_REVIEW,
  ],
}

// Statuses that are considered "terminal" (cannot be changed)
export const TERMINAL_STATUSES = [
  APPLICATION_STATUS.ACCEPTED,
  APPLICATION_STATUS.REJECTED,
]

// Statuses that allow deletion
export const DELETABLE_STATUSES = TERMINAL_STATUSES

// Statuses that require additional fields
export const STATUS_REQUIRED_FIELDS = {
  [APPLICATION_STATUS.INTERVIEW]: ['interviewDate', 'interviewTime'],
  [APPLICATION_STATUS.REJECTED]: [], // rejectionReason is optional
  [APPLICATION_STATUS.REVOKED]: [], // revocationReason is optional but recommended
  [APPLICATION_STATUS.INTERVIEW_FAILED]: [], // failureReason is optional
}

/**
 * Check if a status transition is allowed
 * @param {string} currentStatus - Current application status
 * @param {string} newStatus - Desired new status
 * @returns {boolean} - Whether the transition is valid
 */
export function isTransitionAllowed(currentStatus, newStatus) {
  if (!currentStatus || !newStatus) return false
  if (currentStatus === newStatus) return false // No change
  
  const allowedNextStatuses = ALLOWED_TRANSITIONS[currentStatus] || []
  return allowedNextStatuses.includes(newStatus)
}

/**
 * Get all possible next statuses for a given current status
 * @param {string} currentStatus - Current application status
 * @returns {string[]} - Array of allowed next statuses
 */
export function getNextStatuses(currentStatus) {
  return ALLOWED_TRANSITIONS[currentStatus] || []
}

/**
 * Check if a status is terminal (cannot be changed)
 * @param {string} status - Status to check
 * @returns {boolean} - Whether the status is terminal
 */
export function isTerminalStatus(status) {
  return TERMINAL_STATUSES.includes(status)
}

/**
 * Check if an application with given status can be deleted
 * @param {string} status - Application status
 * @returns {boolean} - Whether deletion is allowed
 */
export function canDelete(status) {
  return DELETABLE_STATUSES.includes(status)
}

/**
 * Get required fields for a status transition
 * @param {string} newStatus - New status
 * @returns {string[]} - Array of required field names
 */
export function getRequiredFields(newStatus) {
  return STATUS_REQUIRED_FIELDS[newStatus] || []
}

/**
 * Get status metadata (label, color, icon, etc.)
 * @param {string} status - Application status
 * @returns {object} - Status metadata
 */
export function getStatusMetadata(status) {
  return STATUS_METADATA[status] || STATUS_METADATA[APPLICATION_STATUS.PENDING]
}

/**
 * Get all statuses in order
 * @returns {string[]} - Array of all status values
 */
export function getAllStatuses() {
  return Object.values(APPLICATION_STATUS)
}

