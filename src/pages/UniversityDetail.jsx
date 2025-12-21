import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Container from '../component/common/Container.jsx'
import InfoTable from '../component/common/InfoTable.jsx'
import Loading from '../component/admin/Loading.jsx'
import { getUniversity } from '../api/universities.js'
import { getImageURL } from '../api/config.js'

export default function UniversityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [university, setUniversity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('introduction')

  useEffect(() => {
    const loadUniversity = async () => {
      try {
        setLoading(true)
        const data = await getUniversity(id)
        setUniversity(data)
      } catch (err) {
        console.error('Failed to load university:', err)
        setError(err?.message || 'Failed to load university')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadUniversity()
    }
  }, [id])

  if (loading) {
    return (
      <Container className="py-12">
        <Loading label="Loading university..." />
      </Container>
    )
  }

  if (error || !university) {
    return (
      <Container className="py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'University not found'}</p>
          <button
            onClick={() => navigate('/universities')}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Back to Universities
          </button>
        </div>
      </Container>
    )
  }

  const basicInfo = {
    'City': university.city && university.province 
      ? `${university.city}, ${university.province}`
      : university.city || university.province || 'N/A',
    'Founded in': university.foundedYear || 'N/A',
    'Type': university.type || 'N/A',
    'Number of total students': university.totalStudents?.toLocaleString() || 'N/A',
    'Number of international students': university.internationalStudents?.toLocaleString() || 'N/A',
    'Number of faculty': university.facultyCount?.toLocaleString() || 'N/A',
    'Number of programs': university.numberOfPrograms || 0
  }

  return (
    <Container className="py-8 md:py-12">
      {/* Header/Banner Section */}
      <div className="relative rounded-2xl overflow-hidden mb-8" style={{ minHeight: '400px' }}>
        {university.bannerImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${getImageURL(university.bannerImage)})`,
              filter: 'brightness(0.7)'
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-800" />
        )}
        <div className="relative bg-gradient-to-r from-black/70 to-black/40 p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {university.logo && (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white p-2 flex-shrink-0">
                  <img 
                    src={getImageURL(university.logo)} 
                    alt={university.name}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              )}
              <div className="flex-1 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{university.name}</h1>
                <div className="space-y-2 text-sm md:text-base">
                  {university.city && university.province && (
                    <p>City: {university.city}, {university.province}</p>
                  )}
                  {university.numberOfPrograms !== undefined && (
                    <p>Number of programs: {university.numberOfPrograms}</p>
                  )}
                  {university.type && (
                    <p>Type: {university.type}</p>
                  )}
                </div>
              </div>
              {university.rankings && university.rankings.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {university.rankings.map((ranking, index) => (
                    <div 
                      key={index}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-xs md:text-sm"
                    >
                      {ranking.icon && (
                        <span className="mr-2">{ranking.icon}</span>
                      )}
                      {ranking.name}: {ranking.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['introduction', 'advantages', 'albums', 'programs', 'scholarships'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'introduction' && (
            <>
              <InfoTable title="Basic Information" data={basicInfo} />
              {university.description && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About {university.name}</h3>
                  <div 
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: university.description }}
                  />
                </div>
              )}
            </>
          )}

          {activeTab === 'advantages' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Advantages</h3>
              {university.advantages && university.advantages.length > 0 ? (
                <ul className="space-y-3">
                  {university.advantages.map((advantage, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-orange-600 mt-1">✓</span>
                      <span className="text-gray-700">{advantage}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No advantages listed.</p>
              )}
            </div>
          )}

          {activeTab === 'albums' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Albums</h3>
              {university.albums && university.albums.length > 0 ? (
                <div className="space-y-6">
                  {university.albums.map((album, index) => (
                    <div key={index}>
                      <h4 className="text-md font-medium text-gray-900 mb-3">{album.title || `Album ${index + 1}`}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {album.images && album.images.map((image, imgIndex) => (
                          <div 
                            key={imgIndex}
                            className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => window.open(image, '_blank')}
                          >
                            <img 
                              src={getImageURL(image)} 
                              alt={`${album.title} - Image ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No photo albums available.</p>
              )}
            </div>
          )}

          {activeTab === 'programs' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Programs</h3>
              {university.programs && university.programs.length > 0 ? (
                <div className="space-y-4">
                  {university.programs.map((program) => (
                    <div 
                      key={program._id || program.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-sm transition cursor-pointer"
                      onClick={() => navigate(`/scholarships/${program._id || program.id}`)}
                    >
                      <h4 className="font-semibold text-gray-900">{program.title || program.programName}</h4>
                      {program.programCategory && (
                        <p className="text-sm text-gray-600 mt-1">Category: {program.programCategory}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No programs available.</p>
              )}
            </div>
          )}

          {activeTab === 'scholarships' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scholarships</h3>
              {university.scholarships && university.scholarships.length > 0 ? (
                <div className="space-y-4">
                  {university.scholarships.map((scholarship) => (
                    <div 
                      key={scholarship._id || scholarship.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-sm transition cursor-pointer"
                      onClick={() => navigate(`/scholarships/${scholarship._id || scholarship.id}`)}
                    >
                      <h4 className="font-semibold text-gray-900">{scholarship.title}</h4>
                      {scholarship.scholarshipCategory && (
                        <p className="text-sm text-gray-600 mt-1">Type: {scholarship.scholarshipCategory}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No scholarships available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

