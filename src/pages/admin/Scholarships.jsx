import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import DataTable from '../../component/common/DataTable.jsx'
import Modal from '../../component/common/Modal.jsx'
import Button from '../../component/common/Button.jsx'
import ConfirmDialog from '../../component/common/ConfirmDialog.jsx'
import ScholarshipForm from '../../component/admin/scholarships/ScholarshipForm.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import {
  getScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  updateScholarshipStatus
} from '../../api/scholarships.js'

export default function Scholarships() {
  const { success, error: showError } = useToast()
  const { t } = useI18n()
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingScholarship, setEditingScholarship] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, scholarshipId: null })

  useEffect(() => {
    loadScholarships()
  }, [])

  const loadScholarships = async () => {
    try {
      setLoading(true)
      const response = await getScholarships({ limit: 100 })
      const data = response.data || response
      const scholarships = Array.isArray(data.scholarships) ? data.scholarships : (Array.isArray(data) ? data : [])
      setScholarships(scholarships)
    } catch (err) {
      showError('Failed to load scholarships')
      setScholarships([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingScholarship(null)
    setIsModalOpen(true)
  }

  const handleEdit = (scholarship) => {
    setEditingScholarship(scholarship)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setDeleteConfirm({ isOpen: true, scholarshipId: id })
  }

  const confirmDelete = async () => {
    if (!deleteConfirm.scholarshipId) return
    try {
      await deleteScholarship(deleteConfirm.scholarshipId)
      success(t('common.toast.deleteSuccess'))
      setDeleteConfirm({ isOpen: false, scholarshipId: null })
      loadScholarships()
    } catch (err) {
      showError(t('common.toast.deleteError'))
      setDeleteConfirm({ isOpen: false, scholarshipId: null })
    }
  }

  const handleToggleStatus = async (scholarship) => {
    try {
      const newStatus = scholarship.status === 'published' ? 'draft' : 'published'
      await updateScholarshipStatus(scholarship._id || scholarship.id, newStatus)
      success(`Scholarship ${newStatus === 'published' ? 'published' : 'unpublished'}`)
      loadScholarships()
    } catch (err) {
      showError('Failed to update status')
    }
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (editingScholarship) {
        await updateScholarship(editingScholarship._id || editingScholarship.id, formData)
        success(t('common.toast.updateSuccess'))
      } else {
        await createScholarship(formData)
        success(t('common.toast.saveSuccess'))
      }
      setIsModalOpen(false)
      loadScholarships()
    } catch (err) {
      showError(editingScholarship ? t('common.toast.updateError') : t('common.toast.saveError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString()
  }

  const columns = [
    {
      label: 'Title',
      key: 'title',
      className: 'font-medium'
    },
    {
      label: 'University',
      key: 'university',
      render: (item) => item.university?.name || '-'
    },
    {
      label: 'Country',
      key: 'country',
      render: (item) => item.university?.country || '-'
    },
    {
      label: 'Deadline',
      key: 'applicationDeadline',
      render: (item) => formatDate(item.applicationDeadline)
    },
    {
      label: 'Status',
      key: 'status',
      render: (item) => {
        const statusColors = {
          draft: 'bg-gray-100 text-gray-700',
          published: 'bg-green-50 text-green-700',
          closed: 'bg-red-50 text-red-700'
        }
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[item.status] || statusColors.draft}`}>
            {item.status || 'draft'}
          </span>
        )
      }
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            Edit
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => handleToggleStatus(item)}
            className={`${item.status === 'published' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'} text-sm font-medium`}
          >
            {item.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => handleDelete(item._id || item.id)}
            className="text-red-600 hover:text-red-900 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Scholarships</h1>
          <Button onClick={handleCreate}>
            + Add Scholarship
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading scholarships...</div>
        ) : (
          <DataTable
            columns={columns}
            data={scholarships}
            searchPlaceholder="Search scholarships..."
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingScholarship ? 'Edit Scholarship' : 'New Scholarship'}
          maxWidth="max-w-4xl"
        >
          <ScholarshipForm
            initialData={editingScholarship}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </Modal>

        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, scholarshipId: null })}
          onConfirm={confirmDelete}
          title={t('common.delete')}
          message="Are you sure you want to delete this scholarship? This action cannot be undone."
          variant="danger"
        />
      </div>
    </AdminLayout>
  )
}

