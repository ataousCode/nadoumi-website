import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import StatusBadge from '../../component/admin/StatusBadge.jsx'
import StatusTimeline from '../../component/admin/StatusTimeline.jsx'
import StatusChangeModal from '../../component/admin/StatusChangeModal.jsx'
import DeleteConfirmModal from '../../component/admin/DeleteConfirmModal.jsx'
import ApplicationDetail from '../../component/admin/ApplicationDetail.jsx'
import DocumentList from '../../component/admin/DocumentList.jsx'
import ErrorBoundary from '../../component/admin/ErrorBoundary.jsx'
import useApplicationStatus from '../../hooks/admin/useApplicationStatus.js'
import useApplicationDelete from '../../hooks/admin/useApplicationDelete.js'
import { getApplication } from '../../api/applications.js'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import { auth } from '../../api/admissionFirebase.js'

export default function ApplicationDetailPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { id } = useParams()
  
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
    
    const updated = await updateStatus(item.id, {
      ...statusUpdate,
      adminEmail: auth.currentUser?.email || 'admin',
    })
    
    if (updated) {
      setItem(updated)
      setShowStatusModal(false)
      resetUpdate()
      alert(t('admin.applications.statusUpdated'))
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!item) return
    
    const success = await deleteApp(item.id)
    
    if (success) {
      alert(t('admin.applications.deleted'))
      navigate('/admin/applications')
    } else {
      alert(deleteError || t('admin.applications.deleteFailed'))
      resetDelete()
    }
  }

  return (
    <AdminLayout title={t('admin.applications.detail')}>
      <button type="button" className="mb-4 text-orange-600 font-medium hover:underline" onClick={() => navigate(-1)}>
        ← {t('admin.applications.list')}
      </button>

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
                  {item.personalInfo?.firstName} {item.personalInfo?.lastName}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {t('admin.applications.id')}: {item.id}
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