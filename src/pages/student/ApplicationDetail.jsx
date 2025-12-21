import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Container from '../../component/common/Container.jsx'
import Loading from '../../component/admin/Loading.jsx'
import EmptyState from '../../component/admin/EmptyState.jsx'
import Button from '../../component/common/Button.jsx'
import DocumentViewer from '../../component/common/DocumentViewer.jsx'
import StatusBadge from '../../component/admin/StatusBadge.jsx'
import { getStudentApplication } from '../../api/applications.js'
import { getDocumentUrls } from '../../api/documents.js'
import { APPLICATION_STATUS } from '../../constants/applicationStatus.js'

function formatDate(value) {
  if (!value) return '—'
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return '—'
  }
}

function Section({ title, children }) {
  if (!children) return null
  return (
    <section className="border border-gray-200 rounded-xl bg-white p-4 md:p-5 shadow-sm">
      <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-3">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [documents, setDocuments] = useState([])
  const [viewingDocument, setViewingDocument] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const app = await getStudentApplication(id)
        if (!cancelled) {
          setApplication(app)
          // Load documents
          const docs = await getDocumentUrls(app)
          setDocuments(docs)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load application', err)
          setError(err?.message || 'Failed to load application')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (id) load()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <Container className="py-12">
        <Loading label="Loading application..." />
      </Container>
    )
  }

  if (error || !application) {
    return (
      <Container className="py-12">
        <EmptyState
          title="Application not found"
          message={error || 'The application you are looking for does not exist.'}
        >
          <Button variant="primary" size="sm" onClick={() => navigate('/student/applications')}>
            Back to Applications
          </Button>
        </EmptyState>
      </Container>
    )
  }

  const { scholarship = {} } = application

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => navigate('/student/applications')}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium mb-6"
        >
          ← Back to Applications
        </button>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Application Details
            </h1>
            <p className="text-gray-600 mt-2">
              {scholarship.title || 'Scholarship Application'}
            </p>
          </div>
          <StatusBadge status={application.status} size="md" />
        </div>

        <div className="space-y-6">
          {/* Scholarship Information */}
          {scholarship && (
            <Section title="Scholarship Information">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Scholarship:</span>
                  <p className="text-gray-900">{scholarship.title}</p>
                </div>
                {scholarship.university?.name && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">University:</span>
                    <p className="text-gray-900">
                      {scholarship.university.name}
                      {scholarship.university.country && (
                        <span className="text-gray-600"> · {scholarship.university.country}</span>
                      )}
                    </p>
                  </div>
                )}
                {scholarship.category && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <p className="text-gray-900">{scholarship.category}</p>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Application Status & Timeline */}
          <Section title="Application Status">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Status</span>
                <StatusBadge status={application.status} size="sm" />
              </div>
              
              {/* Interview Details */}
              {(application.status === APPLICATION_STATUS.INTERVIEW || application.status === 'interview') && application.interviewDetails && (
                <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    📅 Interview Scheduled
                    <span className="text-xs font-normal text-gray-600 bg-white px-2 py-1 rounded border border-gray-300">
                      🇨🇳 China Beijing Time
                    </span>
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    {application.interviewDetails.date && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(application.interviewDetails.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}
                    
                    {application.interviewDetails.time && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium text-gray-900">
                          {application.interviewDetails.time} (Beijing Time)
                        </span>
                      </div>
                    )}
                    
                    {application.interviewDetails.videoCallPlatform && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform:</span>
                        <span className="font-medium text-gray-900">
                          {application.interviewDetails.videoCallPlatform}
                        </span>
                      </div>
                    )}
                    
                    {application.interviewDetails.videoCallLink && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Meeting Link:</span>
                        <a
                          href={application.interviewDetails.videoCallLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:text-orange-700 font-medium underline"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}
                    
                    {application.interviewDetails.notes && (
                      <div className="mt-3 pt-3 border-t border-purple-300">
                        <p className="text-gray-700">
                          <span className="font-medium">Additional Notes:</span> {application.interviewDetails.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                    <p className="text-xs text-gray-500">{formatDate(application.createdAt)}</p>
                  </div>
                </div>
                {application.updatedAt && application.updatedAt !== application.createdAt && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-xs text-gray-500">{formatDate(application.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* Preferences */}
          {application.preferences && Object.keys(application.preferences).length > 0 && (
            <Section title="Your Preferences">
              <div className="space-y-2">
                {Object.entries(application.preferences).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <Section title="Uploaded Documents">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">File</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Size</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {documents.map((doc, index) => (
                      <tr key={doc.path || index}>
                        <td className="px-4 py-3 text-gray-900 break-words">{doc.name || 'Document'}</td>
                        <td className="px-4 py-3 text-gray-700">{doc.type || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-700">{formatFileSize(doc.size)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setViewingDocument(doc)}
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                          >
                            View Document →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Admin Documents (Admission & JW202) - Only for accepted applications */}
          {(application.status === APPLICATION_STATUS.ACCEPTED || application.status === 'accepted') && 
           (application.admissionDocument || application.jw202Document) && (
            <Section title="Official Documents">
              <div className="space-y-4">
                {application.admissionDocument && (
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          📄 Admission Letter
                        </h4>
                        <p className="text-sm text-gray-600">
                          Uploaded {application.admissionDocument.uploadedAt 
                            ? new Date(application.admissionDocument.uploadedAt).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
                            const filePath = application.admissionDocument.path.replace('/uploads/', '')
                            const doc = {
                              path: application.admissionDocument.path,
                              url: `${API_BASE_URL}/documents/file/${filePath}`,
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
                          href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/documents/file/${application.admissionDocument.path.replace('/uploads/', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-300 rounded-lg hover:bg-blue-50"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                {application.jw202Document && (
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          📄 JW202 Form
                        </h4>
                        <p className="text-sm text-gray-600">
                          Uploaded {application.jw202Document.uploadedAt 
                            ? new Date(application.jw202Document.uploadedAt).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
                            const filePath = application.jw202Document.path.replace('/uploads/', '')
                            const doc = {
                              path: application.jw202Document.path,
                              url: `${API_BASE_URL}/documents/file/${filePath}`,
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
                          href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/documents/file/${application.jw202Document.path.replace('/uploads/', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-300 rounded-lg hover:bg-blue-50"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Admin Notes */}
          {application.adminNotes && (
            <Section title="Admin Notes">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {application.adminNotes}
              </p>
            </Section>
          )}
        </div>
        
        <DocumentViewer
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          document={viewingDocument}
        />
      </div>
    </Container>
  )
}

function formatFileSize(bytes) {
  if (!bytes) return 'N/A'
  if (typeof bytes === 'string') return bytes
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

