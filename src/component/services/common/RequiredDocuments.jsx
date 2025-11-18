import React from 'react'

function RequiredDocuments({ title = 'What to Provide', note = '', documents = [] }) {
  const list = Array.isArray(documents) ? documents : []
  return (
    <section className="mt-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        {note && <p className="mt-2 text-gray-700">{note}</p>}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((doc, i) => (
            <div key={i} className="rounded-xl border border-orange-100 p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">{doc}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RequiredDocuments