import React from 'react'
import site from '../../data/site.json'

const images = import.meta.glob('../../assets/images/*', { eager: true })
const resolveImage = (file) => {
  if (!file) return null
  const key = `../../assets/images/${file}`
  return images[key]?.default || null
}

const defaultItems = [
  {
    id: 1,
    title: 'Import & Export Support',
    description:
      'We help businesses source reliably from China, manage quality checks, and coordinate logistics and customs for smooth deliveries.',
    image: 'team0.jpg',
  },
  {
    id: 2,
    title: 'Student Admission Guidance',
    description:
      'International students get end‑to‑end support: program matching, application and visa assistance, plus scholarship guidance.',
    image: 'team1.jpg',
  },
  {
    id: 3,
    title: 'Supplier Verification Day',
    description:
      'On‑site diligence and factory visits to verify suppliers, asses capacity, and ensure compliance with your standards.',
    image: 'team2.jpg',
  },
  {
    id: 4,
    title: 'Quality Inspection & QA',
    description:
      'Pre‑shipment inspections and QA reporting to maintain product quality and reduce risk before export.',
    image: 'team3.jpg',
  },
  {
    id: 5,
    title: 'Logistics & Customs Coordination',
    description:
      'We coordinate shipping schedules and manage customs paperwork so your cargo clears efficiently.',
    image: 'team4.jpg',
  },
  {
    id: 6,
    title: 'Scholarship & Funding Advice',
    description:
      'Personalized guidance to discover scholarship opportunities and plan a sustainable study budget.',
    image: 'team5.jpg',
  },
  {
    id: 7,
    title: 'Community & Partnerships',
    description:
      'We build partnerships that align with our mission to bridge global trade and education opportunities.',
    image: 'team.jpg',
  },
]

function RecentActivity({ title = 'Recent Activity', items = defaultItems, className = '' }) {
  return (
    <section className={`bg-white ${className}`} aria-labelledby="recent-activity-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 id="recent-activity-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          {site?.description && <p className="mt-2 text-gray-700 max-w-3xl mx-auto">{site.description}</p>}
        </div>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {items.map((it) => {
            const img = resolveImage(it.image)
            return (
              <article key={it.id} className="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  {img && (
                    <img src={img} alt={it.title} className="w-full md:w-64 h-40 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">{it.title}</h3>
                    <p className="mt-3 text-gray-700 leading-relaxed">{it.description}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default RecentActivity