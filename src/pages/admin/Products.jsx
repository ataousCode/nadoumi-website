import React, { useState, useEffect } from 'react'
import DataTable from '../../component/common/DataTable.jsx'
import Modal from '../../component/common/Modal.jsx'
import Button from '../../component/common/Button.jsx'
import Container from '../../component/common/Container.jsx'
import ProductForm from '../../component/admin/products/ProductForm.jsx'
import {
  subscribeToProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus
} from '../../api/products.js'
import { getActiveCategories } from '../../api/categories.js'
import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import ConfirmDialog from '../../component/common/ConfirmDialog.jsx'

export default function Products() {
  const { success, error: showError } = useToast()
  const { t } = useI18n()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, productId: null })

  // Fetch categories for lookup
  useEffect(() => {
    getActiveCategories().then(list => {
      const catMap = list.reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {})
      setCategories(catMap)
    })
  }, [])

  // Subscribe to products
  useEffect(() => {
    const unsub = subscribeToProducts((list) => {
      setProducts(list)
    })
    return () => unsub()
  }, [])

  const handleCreate = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setDeleteConfirm({ isOpen: true, productId: id })
  }

  const confirmDelete = async () => {
    if (!deleteConfirm.productId) return
    try {
      await deleteProduct(deleteConfirm.productId)
      success(t('common.toast.deleteSuccess'))
      setDeleteConfirm({ isOpen: false, productId: null })
    } catch (err) {
      console.error('Failed to delete product:', err)
      showError(t('common.toast.deleteError'))
      setDeleteConfirm({ isOpen: false, productId: null })
    }
  }

  const handleToggleStatus = async (product) => {
    try {
      await toggleProductStatus(product.id, !product.enabled)
    } catch (error) {
      console.error('Failed to toggle status:', error)
    }
  }

  const handleSubmit = async (formData, thumbnailFile, carouselFiles) => {
    setIsSubmitting(true)
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData, thumbnailFile, carouselFiles)
        success(t('common.toast.updateSuccess'))
      } else {
        await createProduct(formData, thumbnailFile, carouselFiles)
        success(t('common.toast.saveSuccess'))
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to save product:', err)
      showError(editingProduct ? t('common.toast.updateError') : t('common.toast.saveError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    {
      label: 'Image',
      key: 'thumbnail',
      render: (item) => (
        item.thumbnail ? (
          <img src={item.thumbnail} alt={item.name} className="h-10 w-10 rounded-md object-cover bg-gray-50" />
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
      label: 'Category',
      key: 'categoryId',
      render: (item) => categories[item.categoryId] || 'Unknown'
    },
    {
      label: 'Price',
      key: 'price',
      render: (item) => (
        <div>
          <span className="font-medium">${item.price}</span>
          {item.discount > 0 && (
            <span className="ml-2 text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded">-{item.discount}%</span>
          )}
        </div>
      )
    },
    {
      label: 'Stock',
      key: 'inStock',
      render: (item) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.inStock ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
          }`}>
          {item.inStock ? 'In Stock' : 'Out of Stock'}
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
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your product inventory</p>
            </div>
          </div>
          <Button onClick={handleCreate}>
            + Add Product
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={products}
          searchPlaceholder="Search products..."
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? 'Edit Product' : 'New Product'}
          maxWidth="max-w-4xl"
        >
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </Modal>

        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, productId: null })}
          onConfirm={confirmDelete}
          title={t('common.delete')}
          message="Are you sure you want to delete this product? This action cannot be undone."
          variant="danger"
        />
      </div>
    </Container>
  )
}