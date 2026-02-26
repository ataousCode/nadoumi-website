import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import StatusBadge from '../../component/admin/StatusBadge.jsx'
import StatusTimeline from '../../component/admin/StatusTimeline.jsx'
import StatusChangeModal from '../../component/admin/StatusChangeModal.jsx'
import DeleteConfirmModal from '../../component/admin/DeleteConfirmModal.jsx'
import ApplicationDetail from '../../component/admin/ApplicationDetail.jsx'
import DocumentList from '../../component/admin/DocumentList.jsx'
import AdminDocumentUpload from '../../component/admin/AdminDocumentUpload.jsx'
import ErrorBoundary from '../../component/admin/ErrorBoundary.jsx'
import useApplicationStatus from '../../hooks/admin/useApplicationStatus.js'
import useApplicationDelete from '../../hooks/admin/useApplicationDelete.js'
import useAdminAuth from '../../hooks/admin/useAdminAuth.js'
import { getApplication } from '../../api/applications.js'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { APPLICATION_STATUS } from '../../constants/applicationStatus.js'

export default function ApplicationDetailPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { id } = useParams()
  const { success, error: showError } = useToast()
  const { user } = useAdminAuth()
  
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { updateStatus, isLoading: isUpdating, reset: resetUpdate } = useApplicationStatus()
  const { deleteApp, isLoading: isDeleting, error: deleteError, reset: resetDelete, canDeleteApplication } = useApplicationDelete()

  // Load application
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const app = await getApplication(id)
        if (mounted) setItem(app)
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load application')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  // Handle status change
  const handleStatusChange = async (statusUpdate) => {
    if (!item) return
    
    try {
      const appId = item.applicationId || item.id || item._id
      
      // If status is ACCEPTED and files are provided, upload them first
      if (statusUpdate.status === APPLICATION_STATUS.ACCEPTED && statusUpdate.files) {
        const { files, ...statusData } = statusUpdate
        
        // First update the status
        const updated = await updateStatus(appId, {
          ...statusData,
          adminEmail: user?.email || 'admin',
        })
        
        // Then upload files if provided
        if (updated && files) {
          const { uploadAdminDocument } = await import('../../api/applications.js')
          
          if (files.admission) {
            try {
              await uploadAdminDocument(appId, files.admission, 'admission')
            } catch (uploadErr) {
              console.error('Failed to upload admission document:', uploadErr)
              // Continue even if upload fails
            }
          }
          
          if (files.jw202) {
            try {
              await uploadAdminDocument(appId, files.jw202, 'jw202')
            } catch (uploadErr) {
              console.error('Failed to upload JW202 document:', uploadErr)
              // Continue even if upload fails
            }
          }
          
          // Reload the application to get updated document info
          const { getApplication } = await import('../../api/applications.js')
          const refreshed = await getApplication(appId)
          if (refreshed) {
            setItem(refreshed)
            setShowStatusModal(false)
            resetUpdate()
            success(t('admin.applications.statusUpdated'))
            return
          }
        }
        
        if (updated) {
          setItem(updated)
          setShowStatusModal(false)
          resetUpdate()
          success(t('admin.applications.statusUpdated'))
        } else {
          showError(t('admin.applications.statusUpdateFailed'))
        }
      } else {
        // Normal status update without files
        const updated = await updateStatus(appId, {
          ...statusUpdate,
          adminEmail: user?.email || 'admin',
        })
        
        if (updated) {
          setItem(updated)
          setShowStatusModal(false)
          resetUpdate()
          success(t('admin.applications.statusUpdated'))
        } else {
          showError(t('admin.applications.statusUpdateFailed'))
        }
      }
    } catch (err) {
      console.error('Status update error:', err)
      showError(err?.message || t('admin.applications.statusUpdateFailed'))
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!item) return
    
    try {
      const appId = item.applicationId || item.id || item._id
      const deleteSuccess = await deleteApp(appId)
      
      if (deleteSuccess) {
        success(t('admin.applications.deleted'))
        navigate('/admin/applications')
      } else {
        const errorMsg = deleteError || t('admin.applications.deleteFailed')
        showError(errorMsg)
        console.error('Delete error:', deleteError)
        resetDelete()
      }
    } catch (err) {
      console.error('Delete error:', err)
      showError(err?.message || t('admin.applications.deleteFailed'))
      resetDelete()
    }
  }

  return (
    <AdminLayout>
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}
      
      {!loading && !item && (
        <div className="text-center py-12">
          <p className="text-gray-600">{t('admin.applications.noApplications')}</p>
        </div>
      )}
      
      {!loading && item && (
        <ErrorBoundary>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {item.student?.firstName && item.student?.lastName
                    ? `${item.student.firstName} ${item.student.lastName}`
                    : item.personalInfo?.firstName && item.personalInfo?.lastName
                    ? `${item.personalInfo.firstName} ${item.personalInfo.lastName}`
                    : item.applicant?.firstName && item.applicant?.lastName
                    ? `${item.applicant.firstName} ${item.applicant.lastName}`
                    : 'Application'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {t('admin.applications.id')}: {item.applicationId || item.id || item._id}
                </p>
              </div>
              <StatusBadge status={item.status} size="lg" />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(true)}
                className="px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors"
              >
                {t('admin.applications.changeStatus')}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
              >
                {t('admin.applications.deleteApplication')}
              </button>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('admin.applications.statusHistory')}
              </h2>
              <StatusTimeline statusHistory={item.statusHistory || []} />
            </div>

            {/* Application Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('admin.applications.studentInfo.title')}
              </h2>
              <ApplicationDetail application={item} />
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('admin.applications.studentInfo.documents')}
              </h2>
              <DocumentList application={item} />
            </div>

            {/* Admin Documents Upload (only for accepted applications) */}
            {(item.status === 'accepted' || item.status === 'ACCEPTED') && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <AdminDocumentUpload 
                  application={item} 
                  onUploadSuccess={(updated) => {
                    setItem(updated)
                    success('Application updated successfully')
                  }}
                />
              </div>
            )}
          </div>
        </ErrorBoundary>
      )}

      {/* Status Change Modal */}
      <StatusChangeModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false)
          resetUpdate()
        }}
        onSubmit={handleStatusChange}
        currentStatus={item?.status}
        application={item}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          resetDelete()
        }}
        onConfirm={handleDelete}
        application={item}
        isLoading={isDeleting}
      />
    </AdminLayout>
  )
}