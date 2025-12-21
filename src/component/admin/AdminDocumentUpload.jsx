import React, { useState } from 'react'
import { useToast } from '../../context/ToastContext.jsx'
import { uploadAdminDocument } from '../../api/applications.js'
import DocumentViewer from '../common/DocumentViewer.jsx'

export default function AdminDocumentUpload({ application, onUploadSuccess }) {
  const { success, error: showError } = useToast()
  const [uploading, setUploading] = useState({ admission: false, jw202: false })
  const [viewingDocument, setViewingDocument] = useState(null)
  
  const appId = application?.applicationId || application?.id || application?._id
  
  const handleFileUpload = async (documentType, file) => {
    if (!file) return
    
    if (!appId) {
      showError('Application ID is required')
      return
    }
    
    setUploading(prev => ({ ...prev, [documentType]: true }))
    
    try {
      const updated = await uploadAdminDocument(appId, file, documentType)
      success(`${documentType === 'admission' ? 'Admission' : 'JW202'} document uploaded successfully`)
      if (onUploadSuccess) {
        onUploadSuccess(updated)
      }
    } catch (err) {
      console.error('Upload error:', err)
      showError(err?.message || `Failed to upload ${documentType} document`)
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }))
    }
  }
  
  const getDocumentUrl = (path) => {
    if (!path) return null
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
    const filePath = path.replace('/uploads/', '')
    return `${API_BASE_URL}/documents/file/${filePath}`
  }
  
  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  
  const admissionDoc = application?.admissionDocument
  const jw202Doc = application?.jw202Document
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Admin Documents</h3>
      <p className="text-sm text-gray-600">
        Upload admission letter and JW202 form for accepted applications. Students will be notified via email.
      </p>
      
      {/* Admission Document */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Admission Letter</h4>
            <p className="text-sm text-gray-600">Upload the student's admission letter</p>
          </div>
          {admissionDoc && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
              ✓ Uploaded
            </span>
          )}
        </div>
        
        {admissionDoc ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {admissionDoc.path.split('/').pop() || 'Admission Letter'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Uploaded {admissionDoc.uploadedAt ? new Date(admissionDoc.uploadedAt).toLocaleDateString() : 'N/A'}
                  {admissionDoc.uploadedBy && ` by ${admissionDoc.uploadedBy}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const doc = {
                      path: admissionDoc.path,
                      url: getDocumentUrl(admissionDoc.path),
                      name: 'Admission Letter',
                      type: 'PDF'
                    }
                    setViewingDocument(doc)
                  }}
                  className="px-3 py-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium border border-orange-300 rounded-lg hover:bg-orange-50"
                >
                  View
                </button>
                <a
                  href={getDocumentUrl(admissionDoc.path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                  Download
                </a>
              </div>
            </div>
            <label className="block">
              <span className="text-sm text-gray-600">Replace document:</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload('admission', file)
                }}
                disabled={uploading.admission}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50"
              />
            </label>
          </div>
        ) : (
          <label className="block">
            <span className="text-sm text-gray-600 mb-2 block">Select file to upload:</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload('admission', file)
              }}
              disabled={uploading.admission}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50"
            />
          </label>
        )}
        
        {uploading.admission && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
            Uploading...
          </div>
        )}
      </div>
      
      {/* JW202 Document */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">JW202 Form</h4>
            <p className="text-sm text-gray-600">Upload the student's JW202 visa form</p>
          </div>
          {jw202Doc && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
              ✓ Uploaded
            </span>
          )}
        </div>
        
        {jw202Doc ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {jw202Doc.path.split('/').pop() || 'JW202 Form'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Uploaded {jw202Doc.uploadedAt ? new Date(jw202Doc.uploadedAt).toLocaleDateString() : 'N/A'}
                  {jw202Doc.uploadedBy && ` by ${jw202Doc.uploadedBy}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const doc = {
                      path: jw202Doc.path,
                      url: getDocumentUrl(jw202Doc.path),
                      name: 'JW202 Form',
                      type: 'PDF'
                    }
                    setViewingDocument(doc)
                  }}
                  className="px-3 py-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium border border-orange-300 rounded-lg hover:bg-orange-50"
                >
                  View
                </button>
                <a
                  href={getDocumentUrl(jw202Doc.path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                  Download
                </a>
              </div>
            </div>
            <label className="block">
              <span className="text-sm text-gray-600">Replace document:</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload('jw202', file)
                }}
                disabled={uploading.jw202}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50"
              />
            </label>
          </div>
        ) : (
          <label className="block">
            <span className="text-sm text-gray-600 mb-2 block">Select file to upload:</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload('jw202', file)
              }}
              disabled={uploading.jw202}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50"
            />
          </label>
        )}
        
        {uploading.jw202 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
            Uploading...
          </div>
        )}
      </div>
      
      <DocumentViewer
        isOpen={!!viewingDocument}
        onClose={() => setViewingDocument(null)}
        document={viewingDocument}
      />
    </div>
  )
}

