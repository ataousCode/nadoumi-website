import React, { useState, useEffect } from 'react'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import DataTable from '../../component/common/DataTable.jsx'
import Modal from '../../component/common/Modal.jsx'
import Button from '../../component/common/Button.jsx'
import ConfirmDialog from '../../component/common/ConfirmDialog.jsx'
import UniversityForm from '../../component/admin/universities/UniversityForm.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import {
  getUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  updateUniversityStatus
} from '../../api/universities.js'

export default function Universities() {
  const { success, error: showError } = useToast()
  const { t } = useI18n()
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUniversity, setEditingUniversity] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, universityId: null })

  useEffect(() => {
    loadUniversities()
  }, [])

  const loadUniversities = async () => {
    try {
      setLoading(true)
      const response = await getUniversities({ limit: 100 })
      const data = response.data || response
      const universitiesList = Array.isArray(data.universities) 
        ? data.universities 
        : (Array.isArray(data) ? data : [])
      setUniversities(universitiesList)
    } catch (err) {
      showError('Failed to load universities')
      setUniversities([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingUniversity(null)
    setIsModalOpen(true)
  }

  const handleEdit = (university) => {
    setEditingUniversity(university)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setDeleteConfirm({ isOpen: true, universityId: id })
  }

  const confirmDelete = async () => {
    if (!deleteConfirm.universityId) return
    try {
      await deleteUniversity(deleteConfirm.universityId)
      success('University deleted successfully')
      setDeleteConfirm({ isOpen: false, universityId: null })
      loadUniversities()
    } catch (err) {
      showError('Failed to delete university')
      setDeleteConfirm({ isOpen: false, universityId: null })
    }
  }

  const handleToggleStatus = async (university) => {
    try {
      const newStatus = university.status === 'active' ? 'inactive' : 'active'
      await updateUniversityStatus(university._id || university.id || university.universityId, newStatus)
      success(`University ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
      loadUniversities()
    } catch (err) {
      showError('Failed to update status')
    }
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (editingUniversity) {
        await updateUniversity(editingUniversity._id || editingUniversity.id || editingUniversity.universityId, formData)
        success('University updated successfully')
      } else {
        await createUniversity(formData)
        success('University created successfully')
      }
      setIsModalOpen(false)
      loadUniversities()
    } catch (err) {
      showError(editingUniversity ? 'Failed to update university' : 'Failed to create university')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (university) => (
        <div>
          <div className="font-medium text-gray-900">{university.name}</div>
          {university.nameInChinese && (
            <div className="text-sm text-gray-500">{university.nameInChinese}</div>
          )}
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (university) => (
        <div className="text-sm text-gray-600">
          {university.city && university.province 
            ? `${university.city}, ${university.province}`
            : university.city || university.province || 'N/A'}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (university) => (
        <span className="text-sm text-gray-600">{university.type || 'N/A'}</span>
      )
    },
    {
      key: 'programs',
      label: 'Programs',
      render: (university) => (
        <span className="text-sm text-gray-600">{university.numberOfPrograms || 0}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (university) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
          university.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : university.status === 'inactive'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {university.status || 'draft'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (university) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(university)}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handleToggleStatus(university)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {university.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={() => handleDelete(university._id || university.id || university.universityId)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Universities</h1>
            <p className="text-sm text-gray-600 mt-1">Manage universities and their information</p>
          </div>
          <Button variant="primary" onClick={handleCreate}>
            + Add University
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={universities}
          loading={loading}
          emptyMessage="No universities found"
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingUniversity(null)
          }}
          title={editingUniversity ? 'Edit University' : 'Create University'}
        >
          <UniversityForm
            initialData={editingUniversity}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false)
              setEditingUniversity(null)
            }}
            isSubmitting={isSubmitting}
          />
        </Modal>

        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, universityId: null })}
          onConfirm={confirmDelete}
          title="Delete University"
          message="Are you sure you want to delete this university? This action cannot be undone."
        />
      </div>
    </AdminLayout>
  )
}

