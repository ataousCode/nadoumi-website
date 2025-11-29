// Firebase Firestore-backed applications API
import { db, storage } from './admissionFirebase.js'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { ref, deleteObject, listAll } from 'firebase/storage'
import { APPLICATION_STATUS, isTransitionAllowed } from '../constants/applicationStatus.js'

const applicationsCol = collection(db, 'applications')

export async function listApplications() {
  const q = query(applicationsCol, orderBy('submittedAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => {
    const data = d.data()
    // Normalize legacy status values
    if (data.status === 'received') {
      data.status = APPLICATION_STATUS.PENDING
    }
    return { id: d.id, ...data }
  })
}

export async function getApplication(id) {
  if (!id) return null
  const ref = doc(applicationsCol, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  
  const data = snap.data()
  
  // Normalize legacy status values
  if (data.status === 'received') {
    data.status = APPLICATION_STATUS.PENDING
  }
  
  return { id: snap.id, ...data }
}

/**
 * Generate unique application ID: 3 uppercase letters + YEAR + sequential number
 * Format: NAD2025123456
 */
function generateApplicationId() {
  const now = new Date()
  const year = now.getFullYear()
  const timestamp = now.getTime()
  // Use last 6 digits of timestamp for uniqueness
  const sequence = String(timestamp).slice(-6)
  return `NAD${year}${sequence}`
}

export async function saveApplication(app) {
  const id = app?.id || generateApplicationId()
  const ref = doc(applicationsCol, id)
  const timestamp = Timestamp.now()
  
  // Initialize with PENDING status and status history
  const data = {
    ...app,
    id,
    status: app.status || APPLICATION_STATUS.PENDING,
    submittedAt: app.submittedAt || timestamp,
    updatedAt: timestamp,
    statusHistory: app.statusHistory || [{
      status: APPLICATION_STATUS.PENDING,
      timestamp,
      note: 'Application submitted',
    }],
  }
  
  await setDoc(ref, data)
  return { id }
}

/**
 * Update application status with validation, history tracking, and metadata
 * @param {string} id - Application ID
 * @param {object} statusUpdate - Status update data
 * @param {string} statusUpdate.status - New status
 * @param {string} [statusUpdate.note] - Admin note
 * @param {string} [statusUpdate.adminEmail] - Admin who made the change
 * @param {object} [statusUpdate.metadata] - Additional metadata (interview details, rejection reason, etc.)
 * @returns {Promise<object>} - Updated application
 */
export async function updateApplicationStatus(id, statusUpdate) {
  if (!id) throw new Error('Application ID is required')
  if (!statusUpdate?.status) throw new Error('New status is required')
  
  const ref = doc(applicationsCol, id)
  const snap = await getDoc(ref)
  
  if (!snap.exists()) {
    throw new Error('Application not found')
  }
  
  const currentApp = snap.data()
  const currentStatus = currentApp.status
  const newStatus = statusUpdate.status
  
  // Validate status transition
  if (!isTransitionAllowed(currentStatus, newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`)
  }
  
  const timestamp = Timestamp.now()
  
  // Build status history entry
  const historyEntry = {
    status: newStatus,
    timestamp,
    note: statusUpdate.note || '',
    adminEmail: statusUpdate.adminEmail || 'unknown',
    metadata: statusUpdate.metadata || {},
  }
  
  // Update application
  const updates = {
    status: newStatus,
    updatedAt: timestamp,
    statusHistory: [...(currentApp.statusHistory || []), historyEntry],
  }
  
  // Add status-specific metadata
  if (newStatus === APPLICATION_STATUS.INTERVIEW_SCHEDULED && statusUpdate.metadata) {
    updates.interviewDetails = {
      date: statusUpdate.metadata.interviewDate || null,
      time: statusUpdate.metadata.interviewTime || null,
      location: statusUpdate.metadata.interviewLocation || null,
      link: statusUpdate.metadata.interviewLink || null,
      notes: statusUpdate.metadata.interviewNotes || null,
      scheduledAt: timestamp,
    }
  }
  
  if (newStatus === APPLICATION_STATUS.REJECTED && statusUpdate.metadata?.rejectionReason) {
    updates.rejectionDetails = {
      reason: statusUpdate.metadata.rejectionReason,
      feedback: statusUpdate.metadata.rejectionFeedback || null,
      rejectedAt: timestamp,
    }
  }
  
  if (newStatus === APPLICATION_STATUS.ACCEPTED) {
    updates.acceptedAt = timestamp
  }
  
  await updateDoc(ref, updates)
  
  const updated = await getDoc(ref)
  return updated.exists() ? { id: updated.id, ...updated.data() } : null
}

/**
 * Legacy simple status update (deprecated - use updateApplicationStatus instead)
 */
export async function setApplicationStatus(id, status) {
  return updateApplicationStatus(id, { status })
}

// Persist a normalized array of document entries under documents.synced.
// Each entry should be { path, name, size, type }.
export async function setApplicationSyncedDocuments(id, entries) {
  if (!id) throw new Error('Application ID is required')
  const ref = doc(applicationsCol, id)
  // Read current to merge safely
  const snap = await getDoc(ref)
  const current = snap.exists() ? snap.data() : {}
  const nextDocs = { ...(current.documents || {}), synced: Array.isArray(entries) ? entries : [] }
  await updateDoc(ref, { documents: nextDocs })
  const updated = await getDoc(ref)
  return updated.exists() ? { id: updated.id, ...updated.data() } : null
}

export function subscribeApplications(onChange) {
  const q = query(applicationsCol, orderBy('submittedAt', 'desc'))
  const unsub = onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => {
      const data = d.data()
      // Normalize legacy status values
      if (data.status === 'received') {
        data.status = APPLICATION_STATUS.PENDING
      }
      return { id: d.id, ...data }
    })
    try { onChange(list) } catch (_) { /* noop */ }
  })
  return unsub
}

/**
 * Get applications filtered by status
 * @param {string} status - Application status to filter by
 * @returns {Promise<Array>} - List of applications
 */
export async function getApplicationsByStatus(status) {
  const q = query(
    applicationsCol,
    where('status', '==', status),
    orderBy('submittedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Subscribe to applications filtered by status
 * @param {string} status - Application status to filter by
 * @param {Function} onChange - Callback function
 * @returns {Function} - Unsubscribe function
 */
export function subscribeApplicationsByStatus(status, onChange) {
  // Only use where clause - orderBy will be done client-side to avoid composite index requirement
  const q = query(
    applicationsCol,
    where('status', '==', status)
  )
  const unsub = onSnapshot(q, (snapshot) => {
    const list = snapshot.docs
      .map((d) => {
        const data = d.data()
        // Normalize legacy status values
        if (data.status === 'received') {
          data.status = APPLICATION_STATUS.PENDING
        }
        return { id: d.id, ...data }
      })
      .sort((a, b) => {
        // Client-side sorting by submittedAt descending
        const aTime = a.submittedAt?.toMillis?.() || a.submittedAt || 0
        const bTime = b.submittedAt?.toMillis?.() || b.submittedAt || 0
        return bTime - aTime
      })
    try { onChange(list) } catch (_) { /* noop */ }
  })
  return unsub
}

/**
 * Delete application and all associated documents from Storage
 * @param {string} id - Application ID
 * @returns {Promise<void>}
 */
export async function deleteApplication(id) {
  if (!id) throw new Error('Application ID is required')
  
  try {
    // First, delete all documents from Firebase Storage
    const folderRef = ref(storage, `applications/${id}`)
    
    // List all files in the application folder
    try {
      const listResult = await listAll(folderRef)
      
      // Delete all files
      const deletePromises = listResult.items.map((itemRef) => 
        deleteObject(itemRef).catch((err) => {
          console.warn(`Failed to delete file ${itemRef.fullPath}:`, err)
        })
      )
      
      // Delete all files in subfolders
      for (const prefixRef of listResult.prefixes) {
        const subList = await listAll(prefixRef)
        const subDeletePromises = subList.items.map((itemRef) =>
          deleteObject(itemRef).catch((err) => {
            console.warn(`Failed to delete file ${itemRef.fullPath}:`, err)
          })
        )
        deletePromises.push(...subDeletePromises)
      }
      
      await Promise.all(deletePromises)
    } catch (storageErr) {
      // If folder doesn't exist or other storage error, log but continue
      console.warn(`Storage deletion warning for application ${id}:`, storageErr)
    }
    
    // Then, delete the Firestore document
    const ref = doc(applicationsCol, id)
    await deleteDoc(ref)
    
    return { success: true, id }
  } catch (error) {
    console.error(`Failed to delete application ${id}:`, error)
    throw new Error(`Failed to delete application: ${error.message}`)
  }
}

/**
 * Search applications by student name or email
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} - List of matching applications
 */
export async function searchApplications(searchTerm) {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return listApplications()
  }
  
  // Firestore doesn't support full-text search, so we fetch all and filter client-side
  // For production, consider using Algolia or similar search service
  const allApplications = await listApplications()
  const term = searchTerm.toLowerCase().trim()
  
  return allApplications.filter((app) => {
    const personalInfo = app.personalInfo || {}
    const contactInfo = app.contactInfo || {}
    
    const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.toLowerCase()
    const email = (contactInfo.email || '').toLowerCase()
    const phone = (contactInfo.phone || '').toLowerCase()
    const applicationId = (app.id || '').toLowerCase()
    
    return (
      fullName.includes(term) ||
      email.includes(term) ||
      phone.includes(term) ||
      applicationId.includes(term)
    )
  })
}