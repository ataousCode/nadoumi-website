import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Container from '../component/common/Container.jsx'
import Button from '../component/common/Button.jsx'
import InfoTable from '../component/common/InfoTable.jsx'
import FeeStructure from '../component/common/FeeStructure.jsx'
import ApplicationDocumentsList from '../component/common/ApplicationDocumentsList.jsx'
import { getScholarship } from '../api/scholarships.js'
import Loading from '../component/admin/Loading.jsx'
import EmptyState from '../component/admin/EmptyState.jsx'
import useStudentAuth from '../hooks/student/useStudentAuth.js'
import { getImageURL } from '../api/config.js'

function formatDate(value) {
  if (!value) return 'N/A'
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return 'N/A'
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch {
    return 'N/A'
  }
}

function isDeadlineApproaching(deadline) {
  if (!deadline) return false
  try {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
    return daysUntil <= 30 && daysUntil >= 0
  } catch {
    return false
  }
}

export default function ScholarshipDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useStudentAuth()
  const [scholarship, setScholarship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const s = await getScholarship(id)
        if (!cancelled) setScholarship(s)
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load scholarship', err)
          setError(err?.message || 'Failed to load scholarship')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (id) load()
    return () => {
      cancelled = true
    }
  }, [id])

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/scholarships/${id}/apply` } })
      return
    }
    navigate(`/scholarships/${id}/apply`, { state: { from: location.pathname } })
  }

  const handleBack = () => {
    if (location.state?.fromList) {
      navigate(-1)
    } else {
      navigate('/scholarships')
    }
  }

  if (loading) {
    return (
      <Container className="py-10">
        <Loading label="Loading scholarship..." />
      </Container>
    )
  }

  if (error || !scholarship) {
    return (
      <Container className="py-10">
        <EmptyState
          title="Scholarship not found"
          message={error || 'The scholarship you are looking for does not exist or is no longer available.'}
        >
          <Button variant="primary" size="sm" type="button" onClick={() => navigate('/scholarships')}>
            Back to scholarships
          </Button>
        </EmptyState>
      </Container>
    )
  }

  const university = scholarship.universityRef || scholarship.university || {}
  const bannerImage = university.bannerImage || university.logo
  const applicantRequirements = scholarship.applicantRequirements || {}
  const applicationDeadline = scholarship.applicationDeadline
  const deadlineApproaching = isDeadlineApproaching(applicationDeadline)

  // Program Details - Basic Information
  const programBasicInfo = {
    'Field': scholarship.field || 'N/A',
    'Program name': scholarship.programName || scholarship.title || 'N/A',
    'Degree': scholarship.degree || `${scholarship.duration || 'N/A'} ${scholarship.programCategory || ''}`,
    'Intake': scholarship.intake || 'N/A',
    'Application deadline': applicationDeadline ? (
      <span className={deadlineApproaching ? 'text-red-600 font-semibold' : ''}>
        {formatDate(applicationDeadline)}
      </span>
    ) : 'N/A'
  }

  // Program Details - Scholarship Information
  const scholarshipInfo = {
    'Scholarship type': scholarship.scholarshipCategory || scholarship.category || 'N/A',
    'Scholarship duration': scholarship.scholarshipDuration 
      ? `${scholarship.scholarshipDuration} years`
      : scholarship.duration || 'N/A',
    'Original tuition fee': scholarship.originalTuitionFee 
      ? `${Number(scholarship.originalTuitionFee).toLocaleString()} RMB/year`
      : 'N/A',
    'Tuition fee after scholarship': scholarship.tuitionFeeAfterScholarship 
      ? `${Number(scholarship.tuitionFeeAfterScholarship).toLocaleString()} RMB/year`
      : 'N/A',
    'Accommodation fee after scholarship': scholarship.accommodationFeeAfterScholarship?.quad !== undefined
      ? `Quad: ${scholarship.accommodationFeeAfterScholarship.quad || 0} RMB/year`
      : 'N/A'
  }

  // Applicant Requirements
  const applicantReqData = {
    'Age (years old)': applicantRequirements.ageMin && applicantRequirements.ageMax
      ? `${applicantRequirements.ageMin} to ${applicantRequirements.ageMax}`
      : applicantRequirements.ageMin
      ? `Minimum ${applicantRequirements.ageMin}`
      : applicantRequirements.ageMax
      ? `Maximum ${applicantRequirements.ageMax}`
      : 'N/A',
    'Whether accept students who have ever been to China': applicantRequirements.acceptStudentsBeenToChina !== undefined
      ? applicantRequirements.acceptStudentsBeenToChina ? 'Yes' : 'No'
      : 'N/A',
    'Whether minors are accepted': applicantRequirements.acceptMinors !== undefined
      ? applicantRequirements.acceptMinors ? 'Yes' : 'No'
      : 'N/A',
    'Acceptable student\'s current location': applicantRequirements.acceptableLocations
      ? Array.isArray(applicantRequirements.acceptableLocations) && applicantRequirements.acceptableLocations[0] === 'unlimited'
        ? 'Unlimited'
        : Array.isArray(applicantRequirements.acceptableLocations)
        ? applicantRequirements.acceptableLocations.join(', ')
        : applicantRequirements.acceptableLocations
      : 'N/A',
    'Score requirements': applicantRequirements.scoreRequirements?.gpa || applicantRequirements.scoreRequirements?.languageTest
      ? [
          applicantRequirements.scoreRequirements.gpa ? `GPA: ${applicantRequirements.scoreRequirements.gpa}` : null,
          applicantRequirements.scoreRequirements.languageTest || null,
          applicantRequirements.scoreRequirements.other || null
        ].filter(Boolean).join(', ') || 'None'
      : 'None'
  }

  return (
    <Container className="py-8 md:py-12">
      <button
        type="button"
        onClick={handleBack}
        className="text-sm text-orange-600 hover:text-orange-700 font-medium mb-6"
      >
        ← Back
      </button>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header/Banner Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8" style={{ minHeight: '400px' }}>
          {bannerImage ? (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${getImageURL(bannerImage)})`,
                filter: 'brightness(0.7)'
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-800" />
          )}
          <div className="relative bg-gradient-to-r from-black/70 to-black/40 p-8 md:p-12">
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
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{scholarship.title}</h1>
                <div className="space-y-2 text-sm md:text-base">
                  {university.name && (
                    <p className="text-lg font-semibold">{university.name}</p>
                  )}
                  {university.city && university.province && (
                    <p>City: {university.city}, {university.province}</p>
                  )}
                  {scholarship.scholarshipCategory && (
                    <p>Scholarship Type: {scholarship.scholarshipCategory}</p>
                  )}
                  {scholarship.programCategory && (
                    <p>Program Category: {scholarship.programCategory}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleApply}
                className="flex-shrink-0 px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 rounded-lg font-semibold transition-colors shadow-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Program Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Program Details</h2>
          
          <div className="space-y-6">
            <InfoTable title="Basic Information" data={programBasicInfo} className="!bg-transparent !border-0 !p-0" />
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scholarship Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">Scholarship type:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {scholarship.scholarshipCategory || scholarship.category || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">Scholarship duration:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {scholarship.scholarshipDuration ? `${scholarship.scholarshipDuration} years` : scholarship.duration || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">Original tuition fee:</span>
                  <span className="text-sm font-medium text-red-600">
                    {scholarship.originalTuitionFee 
                      ? `${Number(scholarship.originalTuitionFee).toLocaleString()} RMB/year`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">Tuition fee after scholarship:</span>
                  <span className="text-sm font-medium text-red-600">
                    {scholarship.tuitionFeeAfterScholarship 
                      ? `${Number(scholarship.tuitionFeeAfterScholarship).toLocaleString()} RMB/year`
                      : 'N/A'}
                  </span>
                </div>
                {scholarship.scholarshipPolicy && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Scholarship Policy:</span> {scholarship.scholarshipPolicy}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Application Requirements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Requirements</h2>
          
          <div className="space-y-6">
            <InfoTable title="Applicant Requirements" data={applicantReqData} className="!bg-transparent !border-0 !p-0" />
            
            <ApplicationDocumentsList 
              documents={scholarship.applicationDocuments}
              additionalDocuments={scholarship.additionalDocuments}
            />
          </div>
        </div>

        {/* Fee Structure */}
        {scholarship.feeStructure && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fee Structure</h2>
            <FeeStructure feeStructure={scholarship.feeStructure} />
            
            {scholarship.specialNotes && scholarship.specialNotes.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Notes</h3>
                <ul className="space-y-2">
                  {scholarship.specialNotes.map((note, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Legacy Support - Show old format if new format not available */}
        {!scholarship.feeStructure && (scholarship.originalTuitionFee || scholarship.tuitionFeeAfterScholarship) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fee Structure</h2>
            <FeeStructure 
              feeStructure={{
                universityFees: {
                  originalTuitionFee: scholarship.originalTuitionFee,
                  tuitionFeeAfterScholarship: scholarship.tuitionFeeAfterScholarship,
                  accommodationFees: scholarship.accommodationFee,
                  accommodationFeesAfterScholarship: scholarship.accommodationFeeAfterScholarship
                },
                nadoumiFees: {
                  applicationFee: 500,
                  serviceFee: 'Depend on agent level'
                }
              }}
            />
          </div>
        )}
      </div>
    </Container>
  )
}
