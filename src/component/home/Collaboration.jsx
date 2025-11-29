import React from 'react'
import Container from '../common/Container.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

// Import images using Vite's glob pattern
const images = import.meta.glob('../../assets/images/*', { eager: true })

/**
 * Resolve image path to actual imported image
 */
const resolveImage = (imageName) => {
  const key = `../../assets/images/${imageName}`
  return images[key]?.default || `/src/assets/images/${imageName}`
}

/**
 * Collaboration Section Component
 * Displays collaboration images
 */
function Collaboration({ className = '' }) {
  const { t } = useI18n()

  // Collaboration images
  const collaborationImages = [
    'team7.jpg',
    'team8.jpg',
    'team9.jpg',
    'team10.jpg',
    'team11.jpg',
    'team12.jpg',
    'team13.jpg',
  ]

  return (
    <section className={`bg-gray-50 ${className}`}>
      <Container size="md">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {t('home.collaboration.title', 'Let\'s Collaborate')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home.collaboration.subtitle', 'Join us in building successful partnerships and creating lasting impact together.')}
          </p>
        </div>

        {/* Collaboration Images Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {collaborationImages.map((imageName, index) => {
            const imageSrc = resolveImage(imageName)
            return (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={imageSrc}
                  alt={`${t('home.collaboration.imageAlt', 'Collaboration')} ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback if image doesn't load
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default Collaboration

