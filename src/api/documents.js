// MongoDB-backed documents API
import { apiRequest, apiRequestFormData, API_BASE_URL } from './config.js'

// Get base URL without /api for static file serving
const getBaseUrl = () => {
  const base = API_BASE_URL.replace('/api', '').replace(/\/$/, '') // Remove trailing slash
  return base
}

/**
 * Upload a document
 */
export async function uploadDocument(file, applicationId, filename, { timeoutMs = 120000, onProgress } = {}) {
  if (!file) throw new Error('File is required')
  
  const formData = new FormData()
  formData.append('file', file)
  if (filename) {
    formData.append('filename', filename)
  }

  // Note: Progress tracking would need XMLHttpRequest for real progress
  // This is a simplified version
  const response = await apiRequestFormData(`documents/${applicationId}`, formData, {
    method: 'POST',
  })

  return { path: response.path }
}

/**
 * Get document URLs for an application
 * First tries to get from application.documents (stored paths)
 * Falls back to fetching from file system
 */
export async function getDocumentUrls(application) {
  if (!application) return []
  
  // First, try to get documents from application.documents (stored paths from submission)
  const appDocuments = application.documents || {}
  const documentList = []
  
  // Flatten documents object - it can have keys like passport, transcripts (array), etc.
  Object.entries(appDocuments).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((path, index) => {
        if (path && typeof path === 'string') {
          const fileName = path.split('/').pop() || `${key}_${index + 1}`
          // Normalize path - ensure it starts with /uploads
          let docPath = path.trim()
          if (!docPath.startsWith('/uploads')) {
            docPath = docPath.startsWith('/') ? `/uploads${docPath}` : `/uploads/${docPath}`
          }
          // Use API route for serving documents to ensure they're accessible
          const filePath = docPath.replace('/uploads/', '')
          const fullUrl = `${API_BASE_URL}/documents/file/${filePath}`
          documentList.push({
            path: docPath,
            url: fullUrl,
            name: fileName,
            type: getFileType(path),
            category: key
          })
        }
      })
    } else if (value && typeof value === 'string') {
      // Normalize path - ensure it starts with /uploads
      let docPath = value.trim()
      if (!docPath.startsWith('/uploads')) {
        docPath = docPath.startsWith('/') ? `/uploads${docPath}` : `/uploads/${docPath}`
      }
      // Use API route for serving documents to ensure they're accessible
      const filePath = docPath.replace('/uploads/', '')
      const fullUrl = `${API_BASE_URL}/documents/file/${filePath}`
      documentList.push({
        path: docPath,
        url: fullUrl,
        name: value.split('/').pop() || key,
        type: getFileType(value),
        category: key
      })
    }
  })
  
  // If we found documents in the application object, try to enrich with file system data
  if (documentList.length > 0) {
    // Try to get file sizes from file system for documents we found
    const applicationId = application?.applicationId || application?.id || application?.docId || null
    if (applicationId) {
      try {
        const fsDocuments = await apiRequest(`documents/${applicationId}`)
        const fsMap = new Map()
        fsDocuments.forEach(doc => {
          fsMap.set(doc.path, doc)
        })
        
        // Enrich documentList with file system data
        return documentList.map(doc => {
          const fsDoc = fsMap.get(doc.path)
          return {
            ...doc,
            size: fsDoc?.size || doc.size,
            type: doc.type || fsDoc?.type || getFileType(doc.path)
          }
        })
      } catch (error) {
        console.error('Error enriching documents with file system data:', error)
        // Return documents without file system data
      }
    }
    return documentList
  }
  
  // Otherwise, try to fetch from file system (legacy support)
  const applicationId = application?.applicationId || application?.id || application?.docId || null
  if (!applicationId) return []

  try {
    const documents = await apiRequest(`documents/${applicationId}`)
    return documents.map(doc => {
      // Normalize path - ensure it starts with /uploads
      let docPath = (doc.path || '').trim()
      if (!docPath.startsWith('/uploads')) {
        docPath = docPath.startsWith('/') ? `/uploads${docPath}` : `/uploads/${docPath}`
      }
      // Use API route for serving documents to ensure they're accessible
      const filePath = docPath.replace('/uploads/', '')
      const fullUrl = doc.url || `${API_BASE_URL}/documents/file/${filePath}`
      return {
        path: docPath,
        url: fullUrl,
        name: doc.name || docPath.split('/').pop(),
        type: doc.type || getFileType(docPath),
        size: doc.size
      }
    })
  } catch (error) {
    console.error('Error fetching document URLs:', error)
    return []
  }
}

function getFileType(path) {
  if (!path) return 'Unknown'
  const ext = path.split('.').pop()?.toLowerCase()
  const typeMap = {
    'pdf': 'PDF',
    'jpg': 'Image',
    'jpeg': 'Image',
    'png': 'Image',
    'gif': 'Image',
    'webp': 'Image',
    'doc': 'Document',
    'docx': 'Document',
    'mp4': 'Video',
    'mov': 'Video',
    'avi': 'Video',
    'mkv': 'Video'
  }
  return typeMap[ext] || 'File'
}
