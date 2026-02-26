/**
 * Centralized source of truth for all enums and statuses
 * Synchronized with the Prisma backend schema
 */

export const UNIVERSITY_TYPE = {
  PUBLIC: 'Public',
  PRIVATE: 'Private',
}

export const UNIVERSITY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
}

export const PROGRAM_CATEGORY = {
  LANGUAGE: 'Language',
  BACHELOR: 'Bachelor',
  MASTER: 'Master',
  PHD: 'PhD',
}

export const SCHOLARSHIP_CATEGORY = {
  SELF_FUNDED: 'Self-funded',
  PARTIAL: 'Partial',
  CSC: 'CSC',
  PROVINCE: 'Province',
  UNIVERSITIES: 'Universities',
  HSK: 'HSK',
  TYPE_A: 'Type A',
  TYPE_B: 'Type B',
  TYPE_C: 'Type C',
  OTHER: 'Other',
}

export const SCHOLARSHIP_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

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
  WAITLISTED: 'waitlisted',
}

// UI Metadata for badges and labels
export const STATUS_UI = {
  UNIVERSITY: {
    [UNIVERSITY_STATUS.ACTIVE]: { label: 'Active', color: 'bg-green-100 text-green-700' },
    [UNIVERSITY_STATUS.INACTIVE]: { label: 'Inactive', color: 'bg-red-100 text-red-700' },
    [UNIVERSITY_STATUS.DRAFT]: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  },
  SCHOLARSHIP: {
    [SCHOLARSHIP_STATUS.DRAFT]: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
    [SCHOLARSHIP_STATUS.PUBLISHED]: { label: 'Published', color: 'bg-green-100 text-green-700' },
    [SCHOLARSHIP_STATUS.ACTIVE]: { label: 'Active', color: 'bg-green-100 text-green-700' },
    [SCHOLARSHIP_STATUS.CLOSED]: { label: 'Closed', color: 'bg-red-100 text-red-700' },
    [SCHOLARSHIP_STATUS.INACTIVE]: { label: 'Inactive', color: 'bg-red-100 text-red-700' },
  },
}
