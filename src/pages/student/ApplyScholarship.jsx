import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Container from '../../component/common/Container.jsx'
import Button from '../../component/common/Button.jsx'
import Input from '../../component/common/Input.jsx'
import Loading from '../../component/admin/Loading.jsx'
import EmptyState from '../../component/admin/EmptyState.jsx'
import { getScholarship } from '../../api/scholarships.js'
import { getStudentProfile } from '../../api/students.js'
import { submitScholarshipApplication } from '../../api/applications.js'
import { uploadDocument } from '../../api/documents.js'
import { useToast } from '../../context/ToastContext.jsx'
import useFileUpload from '../../hooks/service/useFileUpload.js'

const DOCUMENTS_CONFIG = {
  generalRules: {
    maxFileSizeBytes: 100 * 1024 * 1024, // 100MB (for videos)
    maxFileSizeDisplay: '100MB',
  },
  documents: [
    {
      id: 'passportIdPage',
      label: 'Passport ID Page',
      type: 'file',
      required: true,
      accept: '.pdf,.jpg,.jpeg,.png',
      fileMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      note: 'Upload a scanned copy of your passport ID page (PDF or image).',
    },
    {
      id: 'passportPhoto',
      label: 'Passport Sized Photo',
      type: 'file',
      required: true,
      accept: '.jpg,.jpeg,.png',
      fileMimeTypes: ['image/jpeg', 'image/png'],
      note: 'Upload a passport-sized photo (JPG or PNG).',
    },
    {
      id: 'academicTranscript',
      label: 'Academic Transcript (Color Scan)',
      type: 'file',
      required: true,
      accept: '.pdf,.jpg,.jpeg,.png',
      fileMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      note: 'Upload a color scan of your academic transcript (PDF or image).',
    },
    {
      id: 'highestDegreeDiploma',
      label: 'Highest Degree Diploma (Color Scan)',
      type: 'file',
      required: true,
      accept: '.pdf,.jpg,.jpeg,.png',
      fileMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      note: 'Upload a color scan of your highest degree diploma (PDF or image).',
    },
    {
      id: 'physicalExaminationForm',
      label: 'Foreigner Physical Examination Form',
      type: 'file',
      required: true,
      accept: '.pdf,.jpg,.jpeg,.png',
      fileMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      note: 'Upload the Foreigner Physical Examination Form (PDF or image).',
    },
    {
      id: 'nonCriminalRecord',
      label: 'Non-Criminal Record',
      type: 'file',
      required: true,
      accept: '.pdf,.jpg,.jpeg,.png',
      fileMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      note: 'Upload your non-criminal record certificate (PDF or image).',
    },
    {
      id: 'englishProficiency',
      label: 'English Language Proficiency Certificate',
      type: 'file',
      required: true,
      accept: '.pdf,.jpg,.jpeg,.png',
      fileMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      note: 'Upload your English language proficiency certificate (IELTS, TOEFL, etc.) (PDF or image).',
    },
    {
      id: 'bankStatement',
      label: 'Bank Statement',
      type: 'file',
      required: true,
      accept: '.pdf,.jpg,.jpeg,.png',
      fileMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      note: 'Upload your bank statement showing sufficient funds (PDF or image).',
    },
    {
      id: 'studyPlan',
      label: 'Study Plan',
      type: 'file',
      required: true,
      accept: '.pdf,.doc,.docx',
      fileMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      note: 'Upload your study plan document (PDF, DOC, or DOCX).',
    },
    {
      id: 'selfIntroductionVideo',
      label: 'Self Introduction Video (3 minutes)',
      type: 'file',
      required: true,
      accept: '.mp4,.mov,.avi,.mkv',
      fileMimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'],
      note: 'Upload your self-introduction video (maximum 3 minutes). Accepted formats: MP4, MOV, AVI, MKV.',
    },
  ],
}

function DocumentUpload({ doc, files, errors, onChange }) {
  const file = files[doc.id]
  const fileErrors = errors[doc.id] || []
  const hasFile = file && (Array.isArray(file) ? file.length > 0 : true)

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {doc.label}
        {doc.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {hasFile && (
        <div className="mb-3 flex items-center gap-2 text-sm text-green-700">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>
            {Array.isArray(file) ? `${file.length} file(s) uploaded` : 'File uploaded'}
          </span>
        </div>
      )}

      <input
        type="file"
        accept={doc.accept}
        multiple={doc.type === 'file-multiple'}
        onChange={(e) => onChange(doc.id, e.target.files)}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
      />

      {doc.required && !hasFile && (
        <p className="mt-2 text-xs text-gray-500">Required document</p>
      )}

      {fileErrors.length > 0 && (
        <ul className="mt-2 text-sm text-red-600 space-y-1">
          {fileErrors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function ApplyScholarship() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [scholarship, setScholarship] = useState(null)
  const [studentProfile, setStudentProfile] = useState(null)
  
  // Form data
  const [formData, setFormData] = useState({
    gpa: '',
    currentInstitution: '',
    currentDegree: '',
    expectedGraduation: '',
    motivation: '',
    preferredStartDate: '',
  })
  
  const { files, errors: fileErrors, setFilesFor } = useFileUpload(DOCUMENTS_CONFIG)
  const [formErrors, setFormErrors] = useState({})

  const steps = [
    { title: 'Personal Info', description: 'Review your information' },
    { title: 'Academic Info', description: 'Your academic background' },
    { title: 'Documents', description: 'Upload required documents' },
    { title: 'Review', description: 'Review and submit' },
  ]

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [scholarshipData, profile] = await Promise.all([
          getScholarship(id),
          getStudentProfile(),
        ])
        setScholarship(scholarshipData)
        setStudentProfile(profile)
        
        // Pre-fill form with profile data
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            currentInstitution: profile.profile?.education?.[0]?.institution || '',
            currentDegree: profile.profile?.education?.[0]?.degree || '',
          }))
        }
      } catch (err) {
        showError('Failed to load scholarship information')
        navigate('/scholarships')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate, showError])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileChange = (docId, fileList) => {
    setFilesFor(docId, fileList)
  }

  const validateStep = (stepNum) => {
    const errors = {}
    
    if (stepNum === 1) {
      // Academic info validation
      if (!formData.gpa || parseFloat(formData.gpa) < 0 || parseFloat(formData.gpa) > 4) {
        errors.gpa = 'Please enter a valid GPA (0-4.0)'
      }
      if (!formData.motivation || formData.motivation.trim().length < 50) {
        errors.motivation = 'Motivation statement must be at least 50 characters'
      }
    }
    
    if (stepNum === 2) {
      // Documents validation
      const requiredDocs = DOCUMENTS_CONFIG.documents.filter((d) => d.required)
      for (const doc of requiredDocs) {
        const file = files[doc.id]
        if (!file || (Array.isArray(file) && file.length === 0)) {
          errors[doc.id] = `${doc.label} is required`
        }
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      setStep(2) // Go back to documents step
      return
    }

    setSubmitting(true)
    try {
      // Generate temporary application ID for document uploads
      const tempApplicationId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Upload documents first
      const documentUrls = {}
      const docDefs = DOCUMENTS_CONFIG.documents
      let uploadCount = 0
      const totalUploads = docDefs.reduce((acc, doc) => {
        const file = files[doc.id]
        if (!file) return acc
        return acc + (Array.isArray(file) ? file.length : 1)
      }, 0)

      for (const doc of docDefs) {
        const file = files[doc.id]
        if (!file) continue

        try {
          if (doc.type === 'file-multiple') {
            const uploaded = []
            for (const f of Array.from(file)) {
              uploadCount++
              const res = await uploadDocument(
                f,
                tempApplicationId,
                `${doc.id}-${f.name}`,
                {
                  onProgress: ({ percent }) => {
                    // Progress feedback could be added here
                  },
                }
              )
              // Extract path from response
              const path = res.path || res.url
              if (path) {
                uploaded.push(path)
              }
            }
            if (uploaded.length > 0) {
              documentUrls[doc.id] = uploaded
            }
          } else {
            const f = Array.isArray(file) ? file[0] : file
            uploadCount++
            const res = await uploadDocument(
              f,
              tempApplicationId,
              `${doc.id}-${f.name}`,
              {
                onProgress: ({ percent }) => {
                  // Progress feedback could be added here
                },
              }
            )
            // Extract path from response
            const path = res.path || res.url
            if (path) {
              documentUrls[doc.id] = path
            }
          }
        } catch (uploadErr) {
          console.error(`Failed to upload ${doc.id}:`, uploadErr)
          throw new Error(`Failed to upload ${doc.label}. Please try again.`)
        }
      }

      // Submit application with document URLs
      const response = await submitScholarshipApplication(id, {
        preferences: {
          gpa: parseFloat(formData.gpa),
          currentInstitution: formData.currentInstitution,
          currentDegree: formData.currentDegree,
          expectedGraduation: formData.expectedGraduation,
          motivation: formData.motivation,
          preferredStartDate: formData.preferredStartDate,
        },
        documents: documentUrls,
      })

      // Handle response format
      const application = response.data || response
      
      success('Application submitted successfully!')
      navigate('/student/applications')
    } catch (err) {
      showError(err?.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container className="py-12">
        <Loading label="Loading scholarship..." />
      </Container>
    )
  }

  if (!scholarship) {
    return (
      <Container className="py-12">
        <EmptyState
          title="Scholarship not found"
          message="The scholarship you're trying to apply for doesn't exist."
        >
          <Button variant="primary" onClick={() => navigate('/scholarships')}>
            Browse Scholarships
          </Button>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(`/scholarships/${id}`)}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium mb-6"
        >
          ← Back to Scholarship
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Apply for Scholarship</h1>
          <p className="text-gray-600 mt-2">{scholarship.title}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      i === step
                        ? 'bg-orange-600 text-white'
                        : i < step
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {i < step ? '✓' : i + 1}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className="text-sm font-medium text-gray-900">{s.title}</div>
                    <div className="text-xs text-gray-500">{s.description}</div>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      i < step ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
          {/* Step 0: Personal Information */}
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-600">
                Please review your personal information. You can update it in your profile.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <p className="mt-1 text-gray-900">{studentProfile?.firstName || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <p className="mt-1 text-gray-900">{studentProfile?.lastName || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{studentProfile?.email || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <p className="mt-1 text-gray-900">{studentProfile?.country || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Passport Number</label>
                  <p className="mt-1 text-gray-900">{studentProfile?.passportNumber || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-gray-900">{studentProfile?.phone || '—'}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/student/profile')}
                >
                  Update Profile
                </Button>
              </div>
            </div>
          )}

          {/* Step 1: Academic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Academic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="number"
                  label="GPA (0-4.0)"
                  name="gpa"
                  value={formData.gpa}
                  onChange={(e) => handleChange('gpa', e.target.value)}
                  error={formErrors.gpa}
                  required
                  min="0"
                  max="4"
                  step="0.01"
                  placeholder="3.5"
                />

                <Input
                  type="text"
                  label="Current Institution"
                  name="currentInstitution"
                  value={formData.currentInstitution}
                  onChange={(e) => handleChange('currentInstitution', e.target.value)}
                  error={formErrors.currentInstitution}
                  placeholder="University name"
                />

                <Input
                  type="text"
                  label="Current Degree"
                  name="currentDegree"
                  value={formData.currentDegree}
                  onChange={(e) => handleChange('currentDegree', e.target.value)}
                  error={formErrors.currentDegree}
                  placeholder="e.g., Bachelor of Science"
                />

                <Input
                  type="date"
                  label="Expected Graduation Date"
                  name="expectedGraduation"
                  value={formData.expectedGraduation}
                  onChange={(e) => handleChange('expectedGraduation', e.target.value)}
                  error={formErrors.expectedGraduation}
                />

                <Input
                  type="date"
                  label="Preferred Start Date"
                  name="preferredStartDate"
                  value={formData.preferredStartDate}
                  onChange={(e) => handleChange('preferredStartDate', e.target.value)}
                  error={formErrors.preferredStartDate}
                />
              </div>

              <div>
                <Input
                  type="textarea"
                  label="Motivation Statement"
                  name="motivation"
                  value={formData.motivation}
                  onChange={(e) => handleChange('motivation', e.target.value)}
                  error={formErrors.motivation}
                  required
                  rows={6}
                  placeholder="Explain why you're interested in this scholarship and how it will help you achieve your academic goals (minimum 50 characters)..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.motivation.length} / 50 characters minimum
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Required Documents</h2>
              <p className="text-sm text-gray-600">
                Please upload all required documents. Accepted formats: PDF, JPG, PNG (max 10MB per file)
              </p>
              
              <div className="space-y-4">
                {DOCUMENTS_CONFIG.documents.map((doc) => (
                  <DocumentUpload
                    key={doc.id}
                    doc={doc}
                    files={files}
                    errors={fileErrors}
                    onChange={handleFileChange}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Review Your Application</h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Scholarship</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{scholarship.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {scholarship.university?.name}
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Academic Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">GPA:</span>
                      <span className="font-medium">{formData.gpa || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Institution:</span>
                      <span className="font-medium">{formData.currentInstitution || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Degree:</span>
                      <span className="font-medium">{formData.currentDegree || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Graduation:</span>
                      <span className="font-medium">
                        {formData.expectedGraduation
                          ? new Date(formData.expectedGraduation).toLocaleDateString()
                          : '—'}
                      </span>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Documents</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    {DOCUMENTS_CONFIG.documents.map((doc) => {
                      const file = files[doc.id]
                      const hasFile = file && (Array.isArray(file) ? file.length > 0 : true)
                      return (
                        <div key={doc.id} className="flex justify-between items-center">
                          <span className="text-gray-600">{doc.label}:</span>
                          <span className={hasFile ? 'text-green-600 font-medium' : 'text-red-600'}>
                            {hasFile
                              ? Array.isArray(file)
                                ? `${file.length} file(s)`
                                : 'Uploaded'
                              : doc.required
                              ? 'Missing (Required)'
                              : 'Not uploaded'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={step === 0 ? () => navigate(`/scholarships/${id}`) : handleBack}
              disabled={submitting}
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </Button>

            <div className="flex gap-3">
              {step < steps.length - 1 ? (
                <Button variant="primary" onClick={handleNext} disabled={submitting}>
                  Next Step →
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                  ariaLabel="Submit application"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
