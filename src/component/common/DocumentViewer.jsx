import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function DocumentViewer({ isOpen, onClose, document }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Reset loading state when document changes
  useEffect(() => {
    if (document?.url && isOpen) {
      setLoading(true)
      setError('')
      console.log('Loading document:', document.url)
    }
  }, [document?.url, isOpen])

  if (!isOpen || !document) return null

  const handleDownload = () => {
    if (typeof window === 'undefined') return
    const link = window.document.createElement('a')
    link.href = document.url
    link.download = document.name || 'document'
    link.target = '_blank'
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
  }

  const isImage = document.type === 'Image' || /\.(jpg|jpeg|png|gif|webp)$/i.test(document.url || '')
  const isPDF = document.type === 'PDF' || /\.pdf$/i.test(document.url || '')
  const isVideo = document.type === 'Video' || /\.(mp4|mov|avi|mkv)$/i.test(document.url || '')

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{document.name || 'Document'}</h3>
            {document.type && (
              <p className="text-sm text-gray-500 mt-1">
                {document.type}
                {document.size && ` · ${formatFileSize(document.size)}`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading document...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Download Instead
                </button>
              </div>
            </div>
          )}

          {!error && (
            <>
              {isImage && (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={document.url}
                    alt={document.name}
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setLoading(false)
                      setError('Failed to load image')
                    }}
                  />
                </div>
              )}
              
              {isPDF && (
                <div className="w-full h-full">
                  <iframe
                    src={document.url}
                    className="w-full h-full min-h-[600px] border-0"
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setLoading(false)
                      setError('Failed to load PDF')
                    }}
                    title={document.name}
                  />
                </div>
              )}

              {isVideo && (
                <div className="flex items-center justify-center h-full">
                  <video
                    src={document.url}
                    controls
                    className="max-w-full max-h-full"
                    onLoadedData={() => setLoading(false)}
                    onError={() => {
                      setLoading(false)
                      setError('Failed to load video')
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {!isImage && !isPDF && !isVideo && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      Download File
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    typeof window !== 'undefined' ? window.document.body : null
  )
}

function formatFileSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

