import { apiRequest, apiRequestFormData } from './config.js'
import { APPLICATION_STATUS } from '../constants/applicationStatus.js'

const API_BASE = '/applications'

// Lookup map — much faster and cleaner than a chain of if-statements
const STATUS_NORMALIZE_MAP = {
  pending:             APPLICATION_STATUS.PENDING,
  received:            APPLICATION_STATUS.RECEIVED,
  under_review:        APPLICATION_STATUS.UNDER_REVIEW,
  underreview:         APPLICATION_STATUS.UNDER_REVIEW,
  interview:           APPLICATION_STATUS.INTERVIEW,
  interview_scheduled: APPLICATION_STATUS.INTERVIEW,
  interviewscheduled:  APPLICATION_STATUS.INTERVIEW,
  interview_passed:    APPLICATION_STATUS.INTERVIEW_PASSED,
  interviewpassed:     APPLICATION_STATUS.INTERVIEW_PASSED,
  interview_failed:    APPLICATION_STATUS.INTERVIEW_FAILED,
  interviewfailed:     APPLICATION_STATUS.INTERVIEW_FAILED,
  accepted:            APPLICATION_STATUS.ACCEPTED,
  rejected:            APPLICATION_STATUS.REJECTED,
  revoked:             APPLICATION_STATUS.REVOKED,
}

function normalizeStatus(status) {
  if (!status) return APPLICATION_STATUS.PENDING
  const normalized = STATUS_NORMALIZE_MAP[status.toLowerCase()]
  if (normalized) return normalized
  if (Object.values(APPLICATION_STATUS).includes(status)) return status
  return APPLICATION_STATUS.PENDING
}

const withNormalizedStatus = (app) => ({ ...app, status: normalizeStatus(app.status) })

export async function listApplications() {
  const apps = await apiRequest(API_BASE)
  return apps.map(withNormalizedStatus)
}

export async function getApplication(id) {
  if (!id) return null
  const app = await apiRequest(`${API_BASE}/${id}`)
  return app ? withNormalizedStatus(app) : null
}

export async function saveApplication(app) {
  return apiRequest(API_BASE, {
    method: 'POST',
    body: JSON.stringify(app),
  })
}

export async function updateApplicationStatus(id, statusUpdate) {
  if (!id) throw new Error('Application ID is required')
  if (!statusUpdate?.status) throw new Error('New status is required')
  return apiRequest(`${API_BASE}/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusUpdate),
  })
}

// Convenience wrapper around updateApplicationStatus
export async function setApplicationStatus(id, status) {
  return updateApplicationStatus(id, { status })
}

export async function getApplicationsByStatus(status) {
  const apps = await apiRequest(`${API_BASE}/status/${status}`)
  return apps.map(withNormalizedStatus)
}

export function subscribeApplications(onChange) {
  listApplications().then(onChange).catch(() => {})
  const intervalId = setInterval(async () => {
    try {
      onChange(await listApplications())
    } catch { /* silent — caller handles stale data */ }
  }, 5000)
  return () => clearInterval(intervalId)
}

export function subscribeApplicationsByStatus(status, onChange) {
  getApplicationsByStatus(status).then(onChange).catch(() => {})
  const intervalId = setInterval(async () => {
    try {
      onChange(await getApplicationsByStatus(status))
    } catch { /* silent */ }
  }, 5000)
  return () => clearInterval(intervalId)
}

export async function deleteApplication(id) {
  if (!id) throw new Error('Application ID is required')
  await apiRequest(`${API_BASE}/${id}`, { method: 'DELETE' })
  return id
}

export async function searchApplications(searchTerm) {
  if (!searchTerm || searchTerm.trim().length < 2) return listApplications()
  const apps = await apiRequest(`${API_BASE}/search/${encodeURIComponent(searchTerm)}`)
  return apps.map(withNormalizedStatus)
}

export async function getStudentApplications() {
  const response = await apiRequest(`${API_BASE}/student/me`)
  const apps = Array.isArray(response) ? response : (response.data || [])
  return apps.map(withNormalizedStatus)
}

export async function getStudentApplication(id) {
  const response = await apiRequest(`${API_BASE}/student/me/${id}`)
  const app = response.data || response
  return app ? withNormalizedStatus(app) : app
}

export async function submitScholarshipApplication(scholarshipId, data) {
  return apiRequest(`${API_BASE}/student/me`, {
    method: 'POST',
    body: JSON.stringify({
      scholarshipId,
      preferences: data.preferences || {},
      documents: data.documents || {},
    }),
  })
}

export async function updateStudentApplication(id, data) {
  const formData = new FormData()
  if (data.preferences) {
    formData.append('preferences', JSON.stringify(data.preferences))
  }
  if (data.documents) {
    Object.keys(data.documents).forEach((key) => {
      if (!data.documents[key]) return
      if (Array.isArray(data.documents[key])) {
        data.documents[key].forEach((file) => formData.append(`documents[${key}]`, file))
      } else {
        formData.append(`documents[${key}]`, data.documents[key])
      }
    })
  }
  return apiRequestFormData(`${API_BASE}/student/me/${id}`, formData, { method: 'PUT' })
}

export async function getApplicationsByScholarship(scholarshipId) {
  const apps = await apiRequest(`${API_BASE}/scholarship/${scholarshipId}`)
  return apps.map(withNormalizedStatus)
}

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

  return response.status ? withNormalizedStatus(response) : response
}
