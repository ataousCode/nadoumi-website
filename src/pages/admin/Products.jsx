import React, { useState, useEffect, useMemo } from 'react'
import Modal from '../../component/common/Modal.jsx'
import Button from '../../component/common/Button.jsx'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import ProductForm from '../../component/admin/products/ProductForm.jsx'
import Filters from '../../component/common/Filters.jsx'
import {
  subscribeToProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus
} from '../../api/products.js'
import { getActiveCategories } from '../../api/categories.js'
import { useToast } from '../../context/ToastContext.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import ConfirmDialog from '../../component/common/ConfirmDialog.jsx'
import { getImageURL } from '../../api/config.js'

export default function Products() {
  const { success, error: showError } = useToast()
  const { t } = useI18n()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, productId: null })
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'all',
  })

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

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(query) ||
        p.keywords?.toLowerCase().includes(query) ||
        categories[p.categoryId]?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(p => p.categoryId === filters.category)
    }

    // Status filter
    if (filters.status === 'active') {
      filtered = filtered.filter(p => p.enabled)
    } else if (filters.status === 'disabled') {
      filtered = filtered.filter(p => !p.enabled)
    } else if (filters.status === 'inStock') {
      filtered = filtered.filter(p => p.inStock)
    } else if (filters.status === 'outOfStock') {
      filtered = filtered.filter(p => !p.inStock)
    }

    return filtered
  }, [products, filters, categories])

  // Prepare filter options
  const filterConfig = useMemo(() => [
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: Object.entries(categories).map(([id, name]) => ({ value: id, label: name })),
      placeholder: 'All categories',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Products' },
        { value: 'active', label: 'Active Only' },
        { value: 'disabled', label: 'Disabled Only' },
        { value: 'inStock', label: 'In Stock' },
        { value: 'outOfStock', label: 'Out of Stock' },
      ],
      placeholder: 'All Products',
    },
  ], [categories])

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
      showError(err?.message || t('common.toast.deleteError'))
      setDeleteConfirm({ isOpen: false, productId: null })
    }
  }

  const handleToggleStatus = async (product) => {
    try {
      await toggleProductStatus(product.id, !product.enabled)
      success(product.enabled ? 'Product disabled' : 'Product enabled')
    } catch (error) {
      console.error('Failed to toggle status:', error)
      showError(error?.message || 'Failed to toggle status')
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
      setEditingProduct(null)
    } catch (err) {
      console.error('Failed to save product:', err)
      const errorMessage = err?.message || err?.response?.error?.message || (editingProduct ? t('common.toast.updateError') : t('common.toast.saveError'))
      showError(errorMessage)
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
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Button>
        </div>

        {/* Main Content with Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6 lg:gap-8 items-start">
          {/* Filters Sidebar */}
          <div className="order-2 lg:order-1">
            <Filters
              values={filters}
              onChange={setFilters}
              onReset={() => setFilters({ search: '', category: '', status: 'all' })}
              searchPlaceholder="Search by name or keywords"
              filters={filterConfig}
            />
          </div>

          {/* Products Grid */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Total Products</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{products.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Active</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {products.filter(p => p.enabled).length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">In Stock</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {products.filter(p => p.inStock).length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Showing</div>
            <div className="text-2xl font-bold text-orange-600 mt-1">{filteredProducts.length}</div>
          </div>
        </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.category || filters.status !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Get started by creating a new product'}
            </p>
            {!filters.search && !filters.category && filters.status === 'all' && (
              <div className="mt-6">
                <Button onClick={handleCreate}>Add Product</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {product.thumbnail ? (
                    <img
                      src={getImageURL(product.thumbnail)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        console.error('Failed to load product image:', getImageURL(product.thumbnail))
                        e.target.style.display = 'none'
                        const fallback = e.target.nextElementSibling
                        if (fallback) {
                          fallback.style.display = 'flex'
                        }
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200" style={{ display: product.thumbnail ? 'none' : 'flex' }}>
                    <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {/* Status Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {!product.enabled && (
                      <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-md">
                        Disabled
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="px-2 py-1 text-xs font-semibold bg-gray-800 text-white rounded-md">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-md">
                        -{product.discount}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {categories[product.categoryId] || 'Uncategorized'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(product)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        product.enabled
                          ? 'text-orange-600 hover:bg-orange-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {product.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingProduct(null)
          }}
          title={editingProduct ? 'Edit Product' : 'New Product'}
          maxWidth="max-w-4xl"
        >
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false)
              setEditingProduct(null)
            }}
            isSubmitting={isSubmitting}
          />
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, productId: null })}
          onConfirm={confirmDelete}
          title={t('common.delete')}
          message="Are you sure you want to delete this product? This action cannot be undone."
          variant="danger"
        />
      </div>
    </AdminLayout>
  )
}
