// MongoDB-backed applications API
import { apiRequest, apiRequestFormData } from './config.js'
import { APPLICATION_STATUS } from '../constants/applicationStatus.js'

const API_BASE = '/applications'

/**
 * Get all applications
 */
function normalizeStatus(status) {
  if (!status) return APPLICATION_STATUS.PENDING
  const statusLower = status.toLowerCase()
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
  if (Object.values(APPLICATION_STATUS).includes(status)) return status
  return APPLICATION_STATUS.PENDING
}

export async function listApplications() {
  const apps = await apiRequest(API_BASE)
  return apps.map(app => {
    app.status = normalizeStatus(app.status)
    return app
  })
}

/**
 * Get a single application
 */
export async function getApplication(id) {
  if (!id) return null
  const app = await apiRequest(`${API_BASE}/${id}`)
  if (!app) return null
  
  app.status = normalizeStatus(app.status)
  
  return app
}

/**
 * Save/Submit application
 */
export async function saveApplication(app) {
  const response = await apiRequest(API_BASE, {
    method: 'POST',
    body: JSON.stringify(app),
  })
  return response
}

/**
 * Update application status
 */
export async function updateApplicationStatus(id, statusUpdate) {
  if (!id) throw new Error('Application ID is required')
  if (!statusUpdate?.status) throw new Error('New status is required')
  
  return apiRequest(`${API_BASE}/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusUpdate),
  })
}

/**
 * Legacy simple status update
 */
export async function setApplicationStatus(id, status) {
  return updateApplicationStatus(id, { status })
}

/**
 * Set application synced documents
 */
export async function setApplicationSyncedDocuments(id, entries) {
  // This would need to be implemented in the backend if needed
  // For now, documents are handled separately
  return { id, documents: { synced: entries } }
}

/**
 * Subscribe to applications (polling-based)
 */
export function subscribeApplications(onChange) {
  let intervalId = setInterval(async () => {
    try {
      const apps = await listApplications()
      onChange(apps)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }, 5000)

  listApplications().then(onChange).catch(console.error)

  return () => clearInterval(intervalId)
}

/**
 * Get applications by status
 */
export async function getApplicationsByStatus(status) {
  const apps = await apiRequest(`${API_BASE}/status/${status}`)
  return apps.map(app => {
    app.status = normalizeStatus(app.status)
    return app
  })
}

/**
 * Subscribe to applications by status (polling-based)
 */
export function subscribeApplicationsByStatus(status, onChange) {
  let intervalId = setInterval(async () => {
    try {
      const apps = await getApplicationsByStatus(status)
      onChange(apps)
    } catch (error) {
      console.error('Error fetching applications by status:', error)
    }
  }, 5000)

  getApplicationsByStatus(status).then(onChange).catch(console.error)

  return () => clearInterval(intervalId)
}

/**
 * Delete application
 */
export async function deleteApplication(id) {
  if (!id) throw new Error('Application ID is required')
  
  try {
    await apiRequest(`${API_BASE}/${id}`, { method: 'DELETE' })
    return id
  } catch (error) {
    console.error(`Failed to delete application ${id}:`, error)
    throw new Error(error.message || 'Failed to delete application')
  }
}

/**
 * Search applications
 */
export async function searchApplications(searchTerm) {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return listApplications()
  }
  
  const apps = await apiRequest(`${API_BASE}/search/${encodeURIComponent(searchTerm)}`)
  return apps.map(app => {
    app.status = normalizeStatus(app.status)
    return app
  })
}

/**
 * Get student's applications
 */
export async function getStudentApplications() {
  const response = await apiRequest(`${API_BASE}/student/me`)
  // Backend returns array directly or { success: true, data: [...] }
  const apps = Array.isArray(response) ? response : (response.data || [])
  return apps.map(app => {
    app.status = normalizeStatus(app.status)
    return app
  })
}

/**
 * Get single student application
 */
export async function getStudentApplication(id) {
  const response = await apiRequest(`${API_BASE}/student/me/${id}`)
  // Backend returns object directly or { success: true, data: {...} }
  const app = response.data || response
  if (app) {
    app.status = normalizeStatus(app.status)
  }
  return app
}

/**
 * Submit application for scholarship
 */
export async function submitScholarshipApplication(scholarshipId, data) {
  // Backend expects JSON with scholarshipId, preferences, and documents (URLs)
  const response = await apiRequest(`${API_BASE}/student/me`, {
    method: 'POST',
    body: JSON.stringify({
      scholarshipId,
      preferences: data.preferences || {},
      documents: data.documents || {},
    }),
  })
  
  // Backend returns application directly or { success: true, data: {...} }
  return response
}

/**
 * Update student application (before review)
 */
export async function updateStudentApplication(id, data) {
  const formData = new FormData()
  if (data.preferences) {
    formData.append('preferences', JSON.stringify(data.preferences))
  }
  if (data.documents) {
    Object.keys(data.documents).forEach(key => {
      if (data.documents[key]) {
        if (Array.isArray(data.documents[key])) {
          data.documents[key].forEach(file => {
            formData.append(`documents[${key}]`, file)
          })
        } else {
          formData.append(`documents[${key}]`, data.documents[key])
        }
      }
    })
  }

  return apiRequestFormData(`${API_BASE}/student/me/${id}`, formData, { method: 'PUT' })
}

/**
 * Get applications by scholarship (admin)
 */
export async function getApplicationsByScholarship(scholarshipId) {
  const apps = await apiRequest(`${API_BASE}/scholarship/${scholarshipId}`)
  return apps.map(app => {
    app.status = normalizeStatus(app.status)
    return app
  })
}

/**
 * Upload admin document (admission or JW202) for accepted application
 */
export async function uploadAdminDocument(applicationId, file, documentType) {
  if (!file) throw new Error('File is required')
  if (!['admission', 'jw202'].includes(documentType)) {
    throw new Error('Document type must be "admission" or "jw202"')
  }
  
  const formData = new FormData()
  formData.append('file', file)
  formData.append('documentType', documentType)
  
  const response = await apiRequestFormData(`${API_BASE}/${applicationId}/admin-documents`, formData, {
    method: 'PUT',
  })
  
  if (response.status) {
    response.status = normalizeStatus(response.status)
  }
  
  return response
}
