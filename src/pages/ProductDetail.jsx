import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, subscribeToEnabledProducts } from '../api/products.js'
import { getActiveCategories } from '../api/categories.js'
import ProductCard from '../component/products/ProductCard.jsx'
import { openWhatsAppForProduct } from '../utils/whatsapp.js'
import { useI18n } from '../i18n/LocaleProvider.jsx'
import { getImageURL } from '../api/config.js'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [error, setError] = useState(null)

  // Fetch categories
  useEffect(() => {
    getActiveCategories()
      .then(setCategories)
      .catch(console.error)
  }, [])

  // Subscribe to all products for similar products
  useEffect(() => {
    const unsubscribe = subscribeToEnabledProducts((list) => {
      setAllProducts(list)
    })
    return () => unsubscribe()
  }, [])

  // Fetch product details
  useEffect(() => {
    if (!id) return

    setLoading(true)
    setError(null)

    getProduct(id)
      .then((productData) => {
        if (!productData) {
          setError('Product not found')
          setLoading(false)
          return
        }

        // Normalize ID
        if (!productData.id && productData._id) {
          productData.id = productData._id.toString()
        }

        if (!productData.enabled) {
          setError('Product not available')
          setLoading(false)
          return
        }

        setProduct(productData)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching product:', err)
        setError('Failed to load product')
        setLoading(false)
      })
  }, [id])

  // Get similar/recommended products (same category, excluding current product)
  // If no products in same category, show other enabled products
  const similarProducts = useMemo(() => {
    if (!product || allProducts.length === 0) return []
    
    const productId = product.id || product._id

    // First, try to get products from the same category
    const sameCategory = allProducts.filter(p => {
      const pId = p.id || p._id
      return pId !== productId && 
        p.categoryId === product.categoryId &&
        p.enabled
    })

    // If we have products in the same category, use them
    if (sameCategory.length > 0) {
      return sameCategory.slice(0, 4)
    }

    // Otherwise, show other enabled products (excluding current)
    return allProducts
      .filter(p => {
        const pId = p.id || p._id
        return pId !== productId && p.enabled
      })
      .slice(0, 4)
  }, [product, allProducts])

  // Get category name
  const categoryName = useMemo(() => {
    if (!product || categories.length === 0) return ''
    const category = categories.find(c => c.id === product.categoryId)
    return category?.name || ''
  }, [product, categories])

  // Get all product images (thumbnail + carousel)
  const productImages = useMemo(() => {
    if (!product) return []
    const images = []
    if (product.thumbnail) {
      images.push(getImageURL(product.thumbnail))
    }
    if (product.carousel && Array.isArray(product.carousel) && product.carousel.length > 0) {
      images.push(...product.carousel.map(img => getImageURL(img)))
    }
    return images
  }, [product])

  const hasDiscount = product?.discount > 0
  const finalPrice = hasDiscount 
    ? product?.price 
    : (product?.originalPrice || product?.price)
  const originalPrice = product?.originalPrice || product?.price

  const handleBuyNow = () => {
    if (product) {
      openWhatsAppForProduct(product, `I would like to purchase: ${product.name}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-orange-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">{t('common.loading', 'Loading...')}</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || t('products.notFound', 'Product Not Found')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('products.notFoundMessage', 'The product you are looking for does not exist or is no longer available.')}
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            {t('products.backToProducts', 'Back to Products')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-orange-600">
              {t('products.home', 'Home')}
            </button>
            <span>/</span>
            <button onClick={() => navigate('/products')} className="hover:text-orange-600">
              {t('products.title', 'Products')}
            </button>
            {categoryName && (
              <>
                <span>/</span>
                <span className="text-gray-400">{categoryName}</span>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {productImages.length > 0 ? (
                  <img
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Failed to load product image:', productImages[selectedImageIndex])
                      e.target.style.display = 'none'
                      const fallback = e.target.nextElementSibling
                      if (fallback) {
                        fallback.style.display = 'flex'
                      }
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center" style={{ display: productImages.length > 0 ? 'none' : 'flex' }}>
                  <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-orange-600 ring-2 ring-orange-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Failed to load thumbnail image:', image)
                          e.target.style.display = 'none'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category */}
              {categoryName && (
                <div className="text-sm text-orange-600 font-medium">
                  {categoryName}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${finalPrice}
                </span>
                {hasDiscount && originalPrice > finalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${originalPrice}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t('products.inStock', 'In Stock')}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {t('products.outOfStock', 'Out of Stock')}
                  </span>
                )}
              </div>

              {/* Keywords */}
              {product.keywords && (
                <div className="flex flex-wrap gap-2">
                  {product.keywords.split(',').map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Details */}
              {product.details && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('products.details', 'Product Details')}
                  </h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {product.details}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                {product.weight && (
                  <div>
                    <span className="text-sm text-gray-600">{t('products.weight', 'Weight')}:</span>
                    <p className="font-medium text-gray-900">{product.weight}</p>
                  </div>
                )}
                {product.reservationTime && (
                  <div>
                    <span className="text-sm text-gray-600">{t('products.reservationTime', 'Reservation Time')}:</span>
                    <p className="font-medium text-gray-900">{product.reservationTime}</p>
                  </div>
                )}
              </div>

              {/* Buy Now Button */}
              <div className="pt-4">
                {product.inStock ? (
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-orange-600 text-white font-semibold py-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-3 text-lg"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 01.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    {t('products.buyNow', 'Buy Now via WhatsApp')}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-semibold py-4 rounded-lg cursor-not-allowed text-lg"
                  >
                    {t('products.outOfStock', 'Out of Stock')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar/Recommended Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {t('products.similarProducts', 'Similar Products')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('products.similarProductsSubtitle', 'You might also like these products')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map(similarProduct => (
                <ProductCard 
                  key={similarProduct.id || similarProduct._id} 
                  product={similarProduct} 
                  showBuyButton={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail

