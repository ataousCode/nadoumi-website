import React, { useState, useEffect, useMemo } from 'react'
import { subscribeToEnabledProducts } from '../api/products.js'
import { getActiveCategories } from '../api/categories.js'
import ProductCard from '../component/products/ProductCard.jsx'
import { useI18n } from '../i18n/LocaleProvider.jsx'
import Container from '../component/common/Container.jsx'
import Filters from '../component/common/Filters.jsx'
import Loading from '../component/admin/Loading.jsx'
import EmptyState from '../component/admin/EmptyState.jsx'

function Products() {
  const { t } = useI18n()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'name',
  })

  // Fetch categories
  useEffect(() => {
    getActiveCategories()
      .then(setCategories)
      .catch(console.error)
  }, [])

  // Subscribe to enabled products
  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToEnabledProducts((list) => {
      console.log('Products received:', list.length, 'products')
      // Debug: Check product thumbnails and log details
      list.forEach(product => {
        if (!product.thumbnail) {
          console.warn('⚠️ Product missing thumbnail:', {
            id: product.id || product._id,
            name: product.name
          })
        } else {
          console.log('✅ Product has thumbnail:', {
            id: product.id || product._id,
            name: product.name,
            thumbnail: product.thumbnail
          })
        }
      })
      setProducts(list)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filter by search query
    if (filters.search?.trim()) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.keywords?.toLowerCase().includes(query) ||
        product.details?.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => product.categoryId === filters.category)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0)
        case 'price-desc':
          return (b.price || 0) - (a.price || 0)
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '')
      }
    })

    return filtered
  }, [products, filters])

  // Prepare filter options
  const filterConfig = useMemo(() => [
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: categories.map(cat => ({ value: cat.id, label: cat.name })),
      placeholder: t('products.allCategories', 'All Categories'),
    },
    {
      key: 'sort',
      label: 'Sort By',
      type: 'select',
      options: [
        { value: 'name', label: t('products.sort.name', 'Name (A-Z)') },
        { value: 'price-asc', label: t('products.sort.priceAsc', 'Price: Low to High') },
        { value: 'price-desc', label: t('products.sort.priceDesc', 'Price: High to Low') },
      ],
      placeholder: t('products.sort.name', 'Name (A-Z)'),
    },
  ], [categories, t])

  return (
    <Container className="py-8 md:py-10 lg:py-12">
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {t('products.title', 'Our Products')}
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          {t('products.subtitle', 'Discover our amazing collection of products')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6 lg:gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="order-2 lg:order-1">
          <Filters
            values={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: '', category: '', sort: 'name' })}
            searchPlaceholder={t('products.searchPlaceholder', 'Search products...')}
            filters={filterConfig}
          />
        </div>

        {/* Products Grid */}
        <div className="order-1 lg:order-2">
          {loading ? (
            <div className="py-10">
              <Loading label={t('common.loading', 'Loading...')} />
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <EmptyState
                  title={t('products.noProducts', 'No products found')}
                  message={
                    filters.search || filters.category
                      ? t('products.noProductsFiltered', 'Try adjusting your filters')
                      : t('products.noProductsAvailable', 'No products available at the moment')
                  }
                />
              ) : (
                <>
                  {/* Results count */}
                  <div className="mb-6 text-sm text-gray-600">
                    {t('products.showing', 'Showing')} {filteredProducts.length} {t('products.of', 'of')} {products.length} {t('products.products', 'products')}
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredProducts.map(product => {
                      // Debug: Log product data
                      if (!product.thumbnail) {
                        console.warn('Product without thumbnail:', {
                          id: product.id || product._id,
                          name: product.name,
                          product: product
                        })
                      }
                      return (
                        <ProductCard key={product.id || product._id} product={product} />
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  )
}

export default Products

