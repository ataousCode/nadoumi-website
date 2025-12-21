import React from 'react'
import { Link } from 'react-router-dom'
import { openWhatsAppForProduct } from '../../utils/whatsapp.js'
import { getImageURL } from '../../api/config.js'

/**
 * Reusable Product Card Component
 * Displays product information in a card format
 * 
 * @param {Object} product - Product object
 * @param {boolean} [showBuyButton=false] - Show buy button (default: false for listing pages)
 * @param {string} [className] - Additional CSS classes
 */
function ProductCard({ product, showBuyButton = false, className = '' }) {
  if (!product) return null

  const hasDiscount = product.discount > 0
  const finalPrice = hasDiscount 
    ? product.price 
    : (product.originalPrice || product.price)
  const originalPrice = product.originalPrice || product.price

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    openWhatsAppForProduct(product)
  }

  return (
    <div className={`group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      <Link to={`/products/${product.id || product._id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.thumbnail ? (
            <>
              <img
                src={getImageURL(product.thumbnail)}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  console.error('ProductCard image failed to load:', {
                    productName: product.name,
                    thumbnail: product.thumbnail,
                    imageURL: getImageURL(product.thumbnail)
                  })
                  e.target.style.display = 'none'
                  const fallback = e.target.nextElementSibling
                  if (fallback) {
                    fallback.style.display = 'flex'
                  }
                }}
              />
              <div className="w-full h-full flex items-center justify-center bg-gray-100" style={{ display: 'none' }}>
                <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}

          {/* Stock Badge */}
          {!product.inStock && (
            <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-gray-900">
              ${finalPrice}
            </span>
            {hasDiscount && originalPrice > finalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice}
              </span>
            )}
          </div>

          {/* Keywords/Tags */}
          {product.keywords && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.keywords.split(',').slice(0, 3).map((keyword, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Buy Now Button */}
      {showBuyButton && product.inStock && (
        <div className="px-4 pb-4">
          <button
            onClick={handleBuyNow}
            className="w-full bg-orange-600 text-white font-medium py-2.5 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 01.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Buy Now
          </button>
        </div>
      )}

      {!product.inStock && (
        <div className="px-4 pb-4">
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 font-medium py-2.5 rounded-lg cursor-not-allowed"
          >
            Out of Stock
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductCard

