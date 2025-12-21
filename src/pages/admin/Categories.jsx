import React, { useState, useEffect, useMemo } from 'react'
import Modal from '../../component/common/Modal.jsx'
import Button from '../../component/common/Button.jsx'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import CategoryForm from '../../component/admin/categories/CategoryForm.jsx'
import Filters from '../../component/common/Filters.jsx'
import { getImageURL } from '../../api/config.js'
import {
  subscribeToCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
} from '../../api/categories.js'
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
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  })

  // Subscribe to categories
  useEffect(() => {
    const unsub = subscribeToCategories((list) => {
      setCategories(list)
    })
    return () => unsub()
  }, [])

  // Filter categories
  const filteredCategories = useMemo(() => {
    let filtered = [...categories]

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (filters.status === 'active') {
      filtered = filtered.filter(c => c.enabled)
    } else if (filters.status === 'disabled') {
      filtered = filtered.filter(c => !c.enabled)
    }

    return filtered
  }, [categories, filters])

  // Prepare filter options
  const filterConfig = useMemo(() => [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Categories' },
        { value: 'active', label: 'Active Only' },
        { value: 'disabled', label: 'Disabled Only' },
      ],
      placeholder: 'All Categories',
    },
  ], [])

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
      success(category.enabled ? 'Category disabled' : 'Category enabled')
    } catch (error) {
      console.error('Failed to toggle status:', error)
      showError(error?.message || 'Failed to toggle status')
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
      setEditingCategory(null)
    } catch (err) {
      console.error('Failed to save category:', err)
      showError(editingCategory ? t('common.toast.updateError') : t('common.toast.saveError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product categories</p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </Button>
        </div>

        {/* Main Content with Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6 lg:gap-8 items-start">
          {/* Filters Sidebar */}
          <div className="order-2 lg:order-1">
            <Filters
              values={filters}
              onChange={setFilters}
              onReset={() => setFilters({ search: '', status: 'all' })}
              searchPlaceholder="Search categories..."
              filters={filterConfig}
            />
          </div>

          {/* Categories Grid */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-sm text-gray-500">Total Categories</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-sm text-gray-500">Active</div>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {categories.filter(c => c.enabled).length}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-sm text-gray-500">Disabled</div>
                <div className="text-2xl font-bold text-red-600 mt-1">
                  {categories.filter(c => !c.enabled).length}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-sm text-gray-500">Showing</div>
                <div className="text-2xl font-bold text-orange-600 mt-1">{filteredCategories.length}</div>
              </div>
            </div>

            {/* Categories Grid */}
            {filteredCategories.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filters.search || filters.status !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Get started by creating a new category'}
                </p>
                {!filters.search && filters.status === 'all' && (
                  <div className="mt-6">
                    <Button onClick={handleCreate}>Add Category</Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id || category._id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Small Icon */}
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                          {category.icon ? (
                            <img
                              src={getImageURL(category.icon)}
                              alt={category.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Failed to load category icon:', getImageURL(category.icon))
                                e.target.style.display = 'none'
                                const fallback = e.target.nextElementSibling
                                if (fallback) {
                                  fallback.style.display = 'flex'
                                }
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200" style={{ display: category.icon ? 'none' : 'flex' }}>
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                        </div>
                        {/* Status Badge */}
                        <div className="absolute -top-1 -right-1">
                          <span className={`inline-flex items-center rounded-full w-3 h-3 ${
                            category.enabled 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                          }`} title={category.enabled ? 'Active' : 'Disabled'} />
                        </div>
                      </div>

                      {/* Category Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                            {category.description}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">•</span>
                          <button
                            onClick={() => handleToggleStatus(category)}
                            className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                              category.enabled
                                ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'
                                : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                            }`}
                          >
                            {category.enabled ? 'Disable' : 'Enable'}
                          </button>
                          <span className="text-gray-300">•</span>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-xs font-medium text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingCategory(null)
          }}
          title={editingCategory ? 'Edit Category' : 'New Category'}
        >
          <CategoryForm
            initialData={editingCategory}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false)
              setEditingCategory(null)
            }}
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
    </AdminLayout>
  )
}
