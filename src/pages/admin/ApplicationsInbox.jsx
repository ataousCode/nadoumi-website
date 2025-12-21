import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import StatusBadge from '../../component/admin/StatusBadge.jsx'
import StatusChangeModal from '../../component/admin/StatusChangeModal.jsx'
import DeleteConfirmModal from '../../component/admin/DeleteConfirmModal.jsx'
import useApplications from '../../hooks/admin/useApplications.js'
import useApplicationStatus from '../../hooks/admin/useApplicationStatus.js'
import useApplicationDelete from '../../hooks/admin/useApplicationDelete.js'
import useAdminAuth from '../../hooks/admin/useAdminAuth.js'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import { getAllStatuses } from '../../constants/applicationStatus.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function ApplicationsInbox() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  const { user } = useAdminAuth()
  
  const [filterStatus, setFilterStatus] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  const { applications, isLoading, error, refetch, totalCount, filteredCount } = useApplications({
    filterStatus,
    searchTerm,
    realtime: true,
  })
  
  // Pagination calculations
  const totalPages = Math.ceil(applications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedApplications = applications.slice(startIndex, endIndex)
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filterStatus, searchTerm])
  
  const { updateStatus, isLoading: isUpdating, reset: resetUpdate } = useApplicationStatus()
  const { deleteApp, isLoading: isDeleting, error: deleteError, reset: resetDelete, canDeleteApplication } = useApplicationDelete()
  
  // Handle status change
  const handleStatusChange = async (statusUpdate) => {
    if (!selectedApp) return
    
    try {
      const appId = selectedApp.applicationId || selectedApp.id || selectedApp._id
      
      // If status is ACCEPTED and files are provided, upload them first
      if (statusUpdate.status === 'accepted' && statusUpdate.files) {
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
            setShowStatusModal(false)
            setSelectedApp(null)
            resetUpdate()
            success(t('admin.applications.statusUpdated'))
            return
          }
        }
        
        if (updated) {
          setShowStatusModal(false)
          setSelectedApp(null)
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
          setShowStatusModal(false)
          setSelectedApp(null)
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
    if (!selectedApp) return
    
    try {
      const appId = selectedApp.applicationId || selectedApp.id || selectedApp._id
      const deleteSuccess = await deleteApp(appId)
      
      if (deleteSuccess) {
        setShowDeleteModal(false)
        setSelectedApp(null)
        resetDelete()
        success(t('admin.applications.deleted'))
      } else {
        const errorMsg = deleteError || t('admin.applications.deleteFailed')
        showError(errorMsg)
        console.error('Delete error:', deleteError)
      }
    } catch (err) {
      console.error('Delete error:', err)
      showError(err?.message || t('admin.applications.deleteFailed'))
    }
  }
  
  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString()
    } catch {
      return 'N/A'
    }
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600 text-sm mt-1">
              Showing {applications.length} of {totalCount || applications.length} applications
            </p>
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm font-medium text-orange-600 border-2 border-orange-200 rounded-xl hover:bg-orange-50 transition-colors"
          >
            🔄 {t('admin.applications.actions.refresh')}
          </button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder={t('admin.applications.filters.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={filterStatus || ''}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">{t('admin.applications.filters.all')}</option>
            {getAllStatuses().map((status) => (
              <option key={status} value={status}>
                {t(`status.${status.toLowerCase().replace(/_/g, '')}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Applications list */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('admin.applications.noApplications')}</p>
          </div>
        ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.email')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.applications.submittedAt')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedApplications.map((app) => {
                  // Extract name and email from populated student or legacy fields
                  const student = app.student || {}
                  const applicant = app.applicant || {}
                  const fields = app.fields || {}
                  const fullName = student.firstName && student.lastName
                    ? `${student.firstName} ${student.lastName}`
                    : `${applicant.firstName || fields.firstName || ''} ${applicant.lastName || fields.lastName || ''}`.trim() || 'N/A'
                  const email = student.email || applicant.email || fields.email || 'N/A'
                  
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">{app.applicationId || app.id || app._id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(app.submittedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => navigate(`/admin/applications/${app.applicationId || app.id || app._id}`)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          {t('admin.applications.actions.view')}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApp(app)
                            setShowStatusModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {t('admin.applications.actions.changeStatus')}
                        </button>
                        {canDeleteApplication(app.status) && (
                          <button
                            onClick={() => {
                              setSelectedApp(app)
                              setShowDeleteModal(true)
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            {t('admin.applications.actions.delete')}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {t('admin.applications.pagination.page', {
                  current: currentPage,
                  total: totalPages,
                })}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('admin.applications.pagination.previous')}
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('admin.applications.pagination.next')}
                </button>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Status Change Modal */}
        <StatusChangeModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false)
          setSelectedApp(null)
          resetUpdate()
        }}
        onSubmit={handleStatusChange}
        currentStatus={selectedApp?.status}
        application={selectedApp}
        isLoading={isUpdating}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedApp(null)
          resetDelete()
        }}
        onConfirm={handleDelete}
        application={selectedApp}
        isLoading={isDeleting}
      />
      </div>
    </AdminLayout>
  )
}