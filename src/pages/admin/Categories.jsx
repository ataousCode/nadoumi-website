import React, { useState, useEffect } from 'react'
import DataTable from '../../component/common/DataTable.jsx'
import Modal from '../../component/common/Modal.jsx'
import Button from '../../component/common/Button.jsx'
import Container from '../../component/common/Container.jsx'
import CategoryForm from '../../component/admin/categories/CategoryForm.jsx'
import {
  subscribeToCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
} from '../../api/categories.js'
import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import ConfirmDialog from '../../component/common/ConfirmDialog.jsx'

export default function Categories() {
  const { success, error: showError } = useToast()
  const { t } = useI18n()
  const [categories, setCategories] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, categoryId: null })

  // Subscribe to categories
  useEffect(() => {
    const unsub = subscribeToCategories((list) => {
      setCategories(list)
    })
    return () => unsub()
  }, [])

  const handleCreate = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setDeleteConfirm({ isOpen: true, categoryId: id })
  }

  const confirmDelete = async () => {
    if (!deleteConfirm.categoryId) return
    try {
      await deleteCategory(deleteConfirm.categoryId)
      success(t('common.toast.deleteSuccess'))
      setDeleteConfirm({ isOpen: false, categoryId: null })
    } catch (err) {
      console.error('Failed to delete category:', err)
      showError(t('common.toast.deleteError'))
      setDeleteConfirm({ isOpen: false, categoryId: null })
    }
  }

  const handleToggleStatus = async (category) => {
    try {
      await toggleCategoryStatus(category.id, !category.enabled)
    } catch (error) {
      console.error('Failed to toggle status:', error)
    }
  }

  const handleSubmit = async (formData, iconFile) => {
    setIsSubmitting(true)
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData, iconFile)
        success(t('common.toast.updateSuccess'))
      } else {
        await createCategory(formData, iconFile)
        success(t('common.toast.saveSuccess'))
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to save category:', err)
      showError(editingCategory ? t('common.toast.updateError') : t('common.toast.saveError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    {
      label: 'Icon',
      key: 'icon',
      render: (item) => (
        item.icon ? (
          <img src={item.icon} alt={item.name} className="h-10 w-10 rounded-md object-cover bg-gray-50" />
        ) : (
          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )
      )
    },
    { label: 'Name', key: 'name', className: 'font-medium' },
    {
      label: 'Description',
      key: 'description',
      render: (item) => (
        <span className="text-gray-500 truncate max-w-xs block" title={item.description}>
          {item.description || '-'}
        </span>
      )
    },
    {
      label: 'Status',
      key: 'enabled',
      render: (item) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.enabled ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
          }`}>
          {item.enabled ? 'Active' : 'Disabled'}
        </span>
      )
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
            className={`${item.enabled ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'} text-sm font-medium`}
          >
            {item.enabled ? 'Disable' : 'Enable'}
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-red-600 hover:text-red-900 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      )
    }
  ]

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Back to Dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
              <p className="mt-1 text-sm text-gray-500">Manage product categories</p>
            </div>
          </div>
          <Button onClick={handleCreate}>
            + Add Category
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={categories}
          searchPlaceholder="Search categories..."
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCategory ? 'Edit Category' : 'New Category'}
        >
          <CategoryForm
            initialData={editingCategory}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </Modal>

        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, categoryId: null })}
          onConfirm={confirmDelete}
          title={t('common.delete')}
          message="Are you sure you want to delete this category? This action cannot be undone."
          variant="danger"
        />
      </div>
    </Container>
  )
}