import React from 'react'

function MissionVion({
  missionTitle = 'Our Mission',
  missionText = 'To bridge global opportunities through trusted trade and education consulting.',
  visionTitle = 'Our Vision',
  visionText = 'A world where businesses and students thrive beyond borders with confidence.',
  promiseTitle = 'Our Promise',
  promiseText = 'We deliver with integrity, transparency, and measurable impact for every client.',
  className = '',
}) {
  return (
    <section className={`bg-gradient-to-br from-white via-orange-50 to-white ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-orange-100 bg-white/90 shadow-sm p-10">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg">M</div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900">{missionTitle}</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">{missionText}</p>
          </div>
          <div className="rounded-2xl border border-orange-100 bg-white/90 shadow-sm p-10">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg">V</div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900">{visionTitle}</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">{visionText}</p>
          </div>
          <div className="rounded-2xl border border-orange-100 bg-white/90 shadow-sm p-10">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg">P</div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900">{promiseTitle}</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">{promiseText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MissionVion