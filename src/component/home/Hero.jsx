import React from 'react'
import Button from '../common/Button.jsx'
import site from '../../data/site.json'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

const images = import.meta.glob('../../assets/images/*', { eager: true })
const resolveImage = (src) => {
  if (!src) return images['../../assets/images/team.jpg']?.default || images['../../assets/images/founder.jpg']?.default
  const file = src.startsWith('/') ? src.split('/').pop() : src
  const key = `../../assets/images/${file}`
  return images[key]?.default || src
}

function Hero({
  title = 'Your Gateway to',
  highlight = 'Global Trade',
  subtitle = site?.tagline,
  description = 'Connecting businesses worldwide with seamless import/export solutions and helping students achieve their academic dreams in China.',
  imageSrc,
  fit = 'cover',
  position = 'center',
  primaryText = 'Explore Services',
  primaryHref = '/services',
  secondaryText = 'Browse Scholarships',
  secondaryHref = '/scholarships',
  stats,
  className = '',
}) {
  const navigate = useNavigate()
  const go = (href) => navigate(href)
  const { t } = useI18n()
  const bg = resolveImage(imageSrc)
  const bgClass = fit === 'contain' ? 'bg-contain bg-no-repeat' : 'bg-cover'
  const style = { backgroundImage: `url(${bg})`, backgroundPosition: position }
  const defaultStats = [
    { value: '50+', label: t('home.stats.countries') },
    { value: '1000+', label: t('home.stats.clients') },
    { value: '10+', label: t('home.stats.years') },
    { value: '98%', label: t('home.stats.success') },
  ]

  return (
    <section className={`relative ${className}`}>
      <div
        className={`absolute inset-0 ${bgClass}`}
        style={style}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-[85vh] py-12 flex flex-col items-center justify-center text-center text-white">
          {subtitle && <p className="text-orange-300 font-semibold">{subtitle}</p>}
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold">
            {title} <span className="text-orange-400">{highlight}</span>
          </h1>
          {description && <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-100">{description}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg" ariaLabel={primaryText} onClick={() => go(primaryHref)}>
              {primaryText}
            </Button>
            <Button variant="secondary" size="lg" className="text-white border-white hover:bg-white/10" ariaLabel={secondaryText} onClick={() => go(secondaryHref)}>
              {secondaryText}
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {(stats || defaultStats).map((s) => (
              <div key={s.label} className="text-left sm:text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-orange-400">{s.value}</div>
                <div className="mt-1 text-sm text-gray-100">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero