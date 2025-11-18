import React from 'react'
import site from '../../data/site.json'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

const images = import.meta.glob('../../assets/images/*', { eager: true })
const resolveImage = (src) => {
  if (!src) return images['../../assets/images/team.jpg']?.default || images['../../assets/images/founder.jpg']?.default
  const file = src.startsWith('/') ? src.split('/').pop() : src
  const key = `../../assets/images/${file}`
  return images[key]?.default || src
}

function AboutHero({
  title = `About ${site?.companyName || 'Our Company'}`,
  highlight = 'Our Story',
  subtitle = site?.tagline,
  description = 'We’re a team dedicated to bridging global opportunities through trusted trade and education consulting.',
  imageSrc,
  fit = 'cover',
  position = 'center',
  className = '',
}) {
  const { t } = useI18n()
  const bg = resolveImage(imageSrc)
  const bgClass = fit === 'contain' ? 'bg-contain bg-no-repeat' : 'bg-cover'
  const style = { backgroundImage: `url(${bg})`, backgroundPosition: position }
  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 ${bgClass}`}
        style={style}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-[80vh] py-12 flex flex-col items-center justify-center text-center text-white">
          {subtitle && <p className="text-orange-300 font-semibold">{subtitle}</p>}
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold">
            {title} <span className="text-orange-400">{highlight}</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-100">{description || t('about.hero.description')}</p>
        </div>
      </div>
    </section>
  )
}

export default AboutHero