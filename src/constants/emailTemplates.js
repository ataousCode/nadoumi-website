/**
 * Email template configurations for application status notifications
 * Centralized email template definitions following DRY principles
 */

import { APPLICATION_STATUS } from './applicationStatus.js'

/**
 * Email template configurations
 * Each template includes subject key and body key for i18n
 */
export const EMAIL_TEMPLATES = {
  // Student notifications (on status change)
  [APPLICATION_STATUS.PENDING]: {
    to: 'student',
    subjectKey: 'email.student.pending.subject',
    bodyKey: 'email.student.pending.body',
    includeApplicationId: true,
    priority: 'normal',
  },
  [APPLICATION_STATUS.UNDER_REVIEW]: {
    to: 'student',
    subjectKey: 'email.student.underReview.subject',
    bodyKey: 'email.student.underReview.body',
    includeApplicationId: true,
    priority: 'normal',
  },
  [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: {
    to: 'student',
    subjectKey: 'email.student.interviewScheduled.subject',
    bodyKey: 'email.student.interviewScheduled.body',
    includeApplicationId: true,
    includeInterviewDetails: true,
    attachCalendarInvite: true,
    priority: 'high',
  },
  [APPLICATION_STATUS.INTERVIEW_PASSED]: {
    to: 'student',
    subjectKey: 'email.student.interviewPassed.subject',
    bodyKey: 'email.student.interviewPassed.body',
    includeApplicationId: true,
    priority: 'normal',
  },
  [APPLICATION_STATUS.ACCEPTED]: {
    to: 'student',
    subjectKey: 'email.student.accepted.subject',
    bodyKey: 'email.student.accepted.body',
    includeApplicationId: true,
    includeEnrollmentInstructions: true,
    priority: 'high',
  },
  [APPLICATION_STATUS.REJECTED]: {
    to: 'student',
    subjectKey: 'email.student.rejected.subject',
    bodyKey: 'email.student.rejected.body',
    includeApplicationId: true,
    includeFeedback: true,
    priority: 'normal',
  },
  
  // Admin notifications
  NEW_APPLICATION: {
    to: 'admin',
    subjectKey: 'email.admin.newApplication.subject',
    bodyKey: 'email.admin.newApplication.body',
    includeApplicationId: true,
    includeApplicationSummary: true,
    includeReviewLink: true,
    priority: 'high',
  },
}

/**
 * Email service configuration
 */
export const EMAIL_CONFIG = {
  // Sender information
  from: {
    email: 'noreply@nadoumi.com',
    name: 'Nadoumi Education',
  },
  
  // Reply-to address
  replyTo: {
    email: 'info@nadoumi.com',
    name: 'Nadoumi Support',
  },
  
  // Admin email addresses (from environment variables)
  adminEmails: [
    process.env.VITE_ADMIN_EMAIL,
    process.env.VITE_ADMIN_EMAIL_SECONDARY,
  ].filter(Boolean),
  
  // Branding
  brandColor: '#ea580c', // Orange-600
  logoUrl: 'https://nadoumi.com/logo.jpg',
  websiteUrl: 'https://nadoumi.com',
  
  // Footer links
  footerLinks: {
    website: 'https://nadoumi.com',
    contact: 'https://nadoumi.com/contact',
    privacy: 'https://nadoumi.com/privacy',
  },
}

/**
 * Get email template configuration for a given status
 * @param {string} status - Application status
 * @returns {object|null} - Email template config or null
 */
export function getEmailTemplate(status) {
  return EMAIL_TEMPLATES[status] || null
}

/**
 * Get admin notification template
 * @returns {object} - Email template config
 */
export function getAdminNotificationTemplate() {
  return EMAIL_TEMPLATES.NEW_APPLICATION
}

/**
 * Check if status change triggers email
 * @param {string} status - Application status
 * @returns {boolean} - Whether email should be sent
 */
export function shouldSendEmail(status) {
  return EMAIL_TEMPLATES[status] !== undefined
}

