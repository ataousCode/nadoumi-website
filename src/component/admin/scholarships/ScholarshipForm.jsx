import React, { useState, useEffect } from 'react'
import Input from '../../common/Input.jsx'
import Button from '../../common/Button.jsx'
import { getUniversities } from '../../../api/universities.js'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'closed', label: 'Closed' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

const PROGRAM_CATEGORIES = [
  { value: 'Language', label: 'Language' },
  { value: 'Bachelor', label: 'Bachelor' },
  { value: 'Master', label: 'Master' },
  { value: 'PhD', label: 'PhD' }
]

const SCHOLARSHIP_CATEGORIES = [
  { value: 'Self-funded', label: 'Self-funded' },
  { value: 'Partial', label: 'Partial' },
  { value: 'CSC', label: 'CSC' },
  { value: 'Province', label: 'Province' },
  { value: 'Universities', label: 'Universities' },
  { value: 'HSK', label: 'HSK' },
  { value: 'Other', label: 'Other' }
]

function ScholarshipForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [activeSection, setActiveSection] = useState('basic')
  const [formData, setFormData] = useState({
    title: '',
    titleInChinese: '',
    description: '',
    category: '',
    tags: '',
    status: 'draft',
    applicationDeadline: '',
    startDate: '',
    duration: '',
    availableSlots: 1,
    programCategory: 'Bachelor',
    field: '',
    programName: '',
    degree: '',
    intake: '',
    scholarshipCategory: 'Partial',
    scholarshipDuration: '',
    originalTuitionFee: '',
    tuitionFeeAfterScholarship: '',
    accommodationFee: { quad: '', double: '', single: '' },
    accommodationFeeAfterScholarship: { quad: '', double: '', single: '' },
    scholarshipPolicy: '',
    applicantRequirements: {
      ageMin: '',
      ageMax: '',
      acceptStudentsBeenToChina: false,
      acceptMinors: false,
      acceptableLocations: [],
      scoreRequirements: { gpa: '', languageTest: '', other: '' },
      otherRequirements: ''
    },
    applicationDocuments: [],
    additionalDocuments: [],
    feeStructure: {
      universityFees: {
        originalTuitionFee: '',
        tuitionFeeAfterScholarship: '',
        accommodationFees: { quad: '', double: '', single: '' },
        accommodationFeesAfterScholarship: { quad: '', double: '', single: '' },
        otherFees: []
      },
      nadoumiFees: {
        applicationFee: '',
        serviceFee: '',
        starAgentServiceFee: ''
      }
    },
    specialNotes: [],
    university: {
      name: '',
      country: '',
      city: '',
      website: '',
      logo: '',
      universityId: ''
    },
    universityRef: '',
    requirements: {
      minGPA: '',
      requiredLanguages: '',
      requiredDegrees: '',
      ageLimit: '',
      nationalityRestrictions: ''
    },
    benefits: {
      tuitionCoverage: '',
      livingStipend: '',
      travelAllowance: false,
      healthInsurance: false,
      other: ''
    }
  })

  const [newDocument, setNewDocument] = useState({ name: '', description: '', required: true, downloadLink: '', specialConditions: '' })
  const [newAdditionalDoc, setNewAdditionalDoc] = useState({ name: '', description: '', required: true, condition: '' })
  const [newNote, setNewNote] = useState('')
  const [newOtherFee, setNewOtherFee] = useState({ name: '', amount: '', description: '' })
  const [acceptableLocationInput, setAcceptableLocationInput] = useState('')
  const [universities, setUniversities] = useState([])
  const [universitiesLoading, setUniversitiesLoading] = useState(true)

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setUniversitiesLoading(true)
        const response = await getUniversities({ limit: 100, status: 'active' })
        const data = response.data || response
        const universitiesList = Array.isArray(data.universities) 
          ? data.universities 
          : (Array.isArray(data) ? data : [])
        setUniversities(universitiesList)
      } catch (err) {
        console.error('Failed to load universities:', err)
        setUniversities([])
      } finally {
        setUniversitiesLoading(false)
      }
    }
    loadUniversities()
  }, [])

  useEffect(() => {
    if (initialData) {
      const data = {
        title: initialData.title || '',
        titleInChinese: initialData.titleInChinese || '',
        description: initialData.description || '',
        category: initialData.category || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
        status: initialData.status || 'draft',
        applicationDeadline: initialData.applicationDeadline ? new Date(initialData.applicationDeadline).toISOString().split('T')[0] : '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        duration: initialData.duration || '',
        availableSlots: initialData.availableSlots || 1,
        programCategory: initialData.programCategory || 'Bachelor',
        field: initialData.field || '',
        programName: initialData.programName || '',
        degree: initialData.degree || '',
        intake: initialData.intake || '',
        scholarshipCategory: initialData.scholarshipCategory || 'Partial',
        scholarshipDuration: initialData.scholarshipDuration || '',
        originalTuitionFee: initialData.originalTuitionFee || '',
        tuitionFeeAfterScholarship: initialData.tuitionFeeAfterScholarship || '',
        accommodationFee: initialData.accommodationFee || { quad: '', double: '', single: '' },
        accommodationFeeAfterScholarship: initialData.accommodationFeeAfterScholarship || { quad: '', double: '', single: '' },
        scholarshipPolicy: initialData.scholarshipPolicy || '',
        applicantRequirements: {
          ageMin: initialData.applicantRequirements?.ageMin || '',
          ageMax: initialData.applicantRequirements?.ageMax || '',
          acceptStudentsBeenToChina: initialData.applicantRequirements?.acceptStudentsBeenToChina || false,
          acceptMinors: initialData.applicantRequirements?.acceptMinors || false,
          acceptableLocations: initialData.applicantRequirements?.acceptableLocations || [],
          scoreRequirements: initialData.applicantRequirements?.scoreRequirements || { gpa: '', languageTest: '', other: '' },
          otherRequirements: initialData.applicantRequirements?.otherRequirements || ''
        },
        applicationDocuments: initialData.applicationDocuments || [],
        additionalDocuments: initialData.additionalDocuments || [],
        feeStructure: initialData.feeStructure || {
          universityFees: {
            originalTuitionFee: '',
            tuitionFeeAfterScholarship: '',
            accommodationFees: { quad: '', double: '', single: '' },
            accommodationFeesAfterScholarship: { quad: '', double: '', single: '' },
            otherFees: []
          },
          nadoumiFees: {
            applicationFee: '',
            serviceFee: '',
            starAgentServiceFee: ''
          }
        },
        specialNotes: initialData.specialNotes || [],
        university: initialData.university || {
          name: '',
          country: '',
          city: '',
          website: '',
          logo: '',
          universityId: ''
        },
        universityRef: initialData.universityRef?._id || initialData.universityRef || '',
        requirements: initialData.requirements || {
          minGPA: '',
          requiredLanguages: '',
          requiredDegrees: '',
          ageLimit: '',
          nationalityRestrictions: ''
        },
        benefits: initialData.benefits || {
          tuitionCoverage: '',
          livingStipend: '',
          travelAllowance: false,
          healthInsurance: false,
          other: ''
        }
      }
      setFormData(data)
    }
  }, [initialData])

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const parts = field.split('.')
      setFormData(prev => {
        const newData = { ...prev }
        let current = newData
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {}
          current = current[parts[i]]
        }
        current[parts[parts.length - 1]] = value
        return newData
      })
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleAddDocument = () => {
    if (newDocument.name.trim()) {
      setFormData(prev => ({
        ...prev,
        applicationDocuments: [...prev.applicationDocuments, { ...newDocument }]
      }))
      setNewDocument({ name: '', description: '', required: true, downloadLink: '', specialConditions: '' })
    }
  }

  const handleRemoveDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      applicationDocuments: prev.applicationDocuments.filter((_, i) => i !== index)
    }))
  }

  const handleAddAdditionalDocument = () => {
    if (newAdditionalDoc.name.trim()) {
      setFormData(prev => ({
        ...prev,
        additionalDocuments: [...prev.additionalDocuments, { ...newAdditionalDoc }]
      }))
      setNewAdditionalDoc({ name: '', description: '', required: true, condition: '' })
    }
  }

  const handleRemoveAdditionalDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter((_, i) => i !== index)
    }))
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      setFormData(prev => ({
        ...prev,
        specialNotes: [...prev.specialNotes, newNote.trim()]
      }))
      setNewNote('')
    }
  }

  const handleRemoveNote = (index) => {
    setFormData(prev => ({
      ...prev,
      specialNotes: prev.specialNotes.filter((_, i) => i !== index)
    }))
  }

  const handleAddLocation = () => {
    if (acceptableLocationInput.trim() && acceptableLocationInput.trim().toLowerCase() !== 'unlimited') {
      setFormData(prev => ({
        ...prev,
        applicantRequirements: {
          ...prev.applicantRequirements,
          acceptableLocations: [...prev.applicantRequirements.acceptableLocations, acceptableLocationInput.trim()]
        }
      }))
      setAcceptableLocationInput('')
    } else if (acceptableLocationInput.trim().toLowerCase() === 'unlimited') {
      setFormData(prev => ({
        ...prev,
        applicantRequirements: {
          ...prev.applicantRequirements,
          acceptableLocations: ['unlimited']
        }
      }))
      setAcceptableLocationInput('')
    }
  }

  const handleRemoveLocation = (index) => {
    setFormData(prev => ({
      ...prev,
      applicantRequirements: {
        ...prev.applicantRequirements,
        acceptableLocations: prev.applicantRequirements.acceptableLocations.filter((_, i) => i !== index)
      }
    }))
  }

  const handleAddOtherFee = () => {
    if (newOtherFee.name.trim() && newOtherFee.amount.trim()) {
      setFormData(prev => ({
        ...prev,
        feeStructure: {
          ...prev.feeStructure,
          universityFees: {
            ...prev.feeStructure.universityFees,
            otherFees: [...prev.feeStructure.universityFees.otherFees, {
              name: newOtherFee.name,
              amount: parseFloat(newOtherFee.amount),
              description: newOtherFee.description
            }]
          }
        }
      }))
      setNewOtherFee({ name: '', amount: '', description: '' })
    }
  }

  const handleRemoveOtherFee = (index) => {
    setFormData(prev => ({
      ...prev,
      feeStructure: {
        ...prev.feeStructure,
        universityFees: {
          ...prev.feeStructure.universityFees,
          otherFees: prev.feeStructure.universityFees.otherFees.filter((_, i) => i !== index)
        }
      }
    }))
  }

  const handleUniversitySelect = (universityId) => {
    if (!universityId) {
      setFormData(prev => ({
        ...prev,
        universityRef: '',
        university: {
          name: '',
          country: '',
          city: '',
          website: '',
          logo: '',
          universityId: ''
        }
      }))
      return
    }

    const selectedUniversity = universities.find(u => 
      (u._id || u.id || u.universityId) === universityId
    )

    if (selectedUniversity) {
      setFormData(prev => ({
        ...prev,
        universityRef: selectedUniversity._id || selectedUniversity.id || selectedUniversity.universityId,
        university: {
          name: selectedUniversity.name || '',
          country: selectedUniversity.country || selectedUniversity.province || '',
          city: selectedUniversity.city || '',
          website: selectedUniversity.website || '',
          logo: selectedUniversity.logo || '',
          universityId: selectedUniversity.universityId || selectedUniversity._id || selectedUniversity.id || ''
        }
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : undefined,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      scholarshipDuration: formData.scholarshipDuration ? parseInt(formData.scholarshipDuration) : undefined,
      originalTuitionFee: formData.originalTuitionFee ? parseFloat(formData.originalTuitionFee) : undefined,
      tuitionFeeAfterScholarship: formData.tuitionFeeAfterScholarship ? parseFloat(formData.tuitionFeeAfterScholarship) : undefined,
      accommodationFee: {
        quad: formData.accommodationFee.quad ? parseFloat(formData.accommodationFee.quad) : undefined,
        double: formData.accommodationFee.double ? parseFloat(formData.accommodationFee.double) : undefined,
        single: formData.accommodationFee.single ? parseFloat(formData.accommodationFee.single) : undefined
      },
      accommodationFeeAfterScholarship: {
        quad: formData.accommodationFeeAfterScholarship.quad ? parseFloat(formData.accommodationFeeAfterScholarship.quad) : undefined,
        double: formData.accommodationFeeAfterScholarship.double ? parseFloat(formData.accommodationFeeAfterScholarship.double) : undefined,
        single: formData.accommodationFeeAfterScholarship.single ? parseFloat(formData.accommodationFeeAfterScholarship.single) : undefined
      },
      applicantRequirements: {
        ...formData.applicantRequirements,
        ageMin: formData.applicantRequirements.ageMin ? parseInt(formData.applicantRequirements.ageMin) : undefined,
        ageMax: formData.applicantRequirements.ageMax ? parseInt(formData.applicantRequirements.ageMax) : undefined,
        scoreRequirements: {
          gpa: formData.applicantRequirements.scoreRequirements.gpa ? parseFloat(formData.applicantRequirements.scoreRequirements.gpa) : undefined,
          languageTest: formData.applicantRequirements.scoreRequirements.languageTest || undefined,
          other: formData.applicantRequirements.scoreRequirements.other || undefined
        }
      },
      feeStructure: {
        universityFees: {
          originalTuitionFee: formData.feeStructure.universityFees.originalTuitionFee ? parseFloat(formData.feeStructure.universityFees.originalTuitionFee) : undefined,
          tuitionFeeAfterScholarship: formData.feeStructure.universityFees.tuitionFeeAfterScholarship ? parseFloat(formData.feeStructure.universityFees.tuitionFeeAfterScholarship) : undefined,
          accommodationFees: {
            quad: formData.feeStructure.universityFees.accommodationFees.quad ? parseFloat(formData.feeStructure.universityFees.accommodationFees.quad) : undefined,
            double: formData.feeStructure.universityFees.accommodationFees.double ? parseFloat(formData.feeStructure.universityFees.accommodationFees.double) : undefined,
            single: formData.feeStructure.universityFees.accommodationFees.single ? parseFloat(formData.feeStructure.universityFees.accommodationFees.single) : undefined
          },
          accommodationFeesAfterScholarship: {
            quad: formData.feeStructure.universityFees.accommodationFeesAfterScholarship.quad ? parseFloat(formData.feeStructure.universityFees.accommodationFeesAfterScholarship.quad) : undefined,
            double: formData.feeStructure.universityFees.accommodationFeesAfterScholarship.double ? parseFloat(formData.feeStructure.universityFees.accommodationFeesAfterScholarship.double) : undefined,
            single: formData.feeStructure.universityFees.accommodationFeesAfterScholarship.single ? parseFloat(formData.feeStructure.universityFees.accommodationFeesAfterScholarship.single) : undefined
          },
          otherFees: formData.feeStructure.universityFees.otherFees || []
        },
        nadoumiFees: {
          applicationFee: formData.feeStructure.nadoumiFees.applicationFee ? parseFloat(formData.feeStructure.nadoumiFees.applicationFee) : undefined,
          serviceFee: formData.feeStructure.nadoumiFees.serviceFee || undefined,
          starAgentServiceFee: formData.feeStructure.nadoumiFees.starAgentServiceFee ? parseFloat(formData.feeStructure.nadoumiFees.starAgentServiceFee) : undefined
        }
      },
      availableSlots: parseInt(formData.availableSlots) || 1,
      universityRef: formData.universityRef || undefined,
      requirements: {
        ...formData.requirements,
        minGPA: formData.requirements.minGPA ? parseFloat(formData.requirements.minGPA) : undefined,
        ageLimit: formData.requirements.ageLimit ? parseInt(formData.requirements.ageLimit) : undefined,
        requiredLanguages: formData.requirements.requiredLanguages ? formData.requirements.requiredLanguages.split(',').map(l => l.trim()).filter(Boolean) : [],
        requiredDegrees: formData.requirements.requiredDegrees ? formData.requirements.requiredDegrees.split(',').map(d => d.trim()).filter(Boolean) : [],
        nationalityRestrictions: formData.requirements.nationalityRestrictions ? formData.requirements.nationalityRestrictions.split(',').map(n => n.trim()).filter(Boolean) : []
      },
      benefits: {
        ...formData.benefits,
        tuitionCoverage: formData.benefits.tuitionCoverage ? parseInt(formData.benefits.tuitionCoverage) : undefined,
        livingStipend: formData.benefits.livingStipend ? parseFloat(formData.benefits.livingStipend) : undefined,
        other: formData.benefits.other ? formData.benefits.other.split(',').map(o => o.trim()).filter(Boolean) : []
      }
    }

    onSubmit(submitData)
  }

  const sections = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'program', label: 'Program Details' },
    { id: 'scholarship', label: 'Scholarship Info' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'documents', label: 'Documents' },
    { id: 'fees', label: 'Fee Structure' },
    { id: 'university', label: 'University' },
    { id: 'legacy', label: 'Legacy Fields' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`py-2 px-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeSection === section.id
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="max-h-[60vh] overflow-y-auto space-y-6">
        {/* Basic Information */}
        {activeSection === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                label="Title (English)"
                name="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
              <Input
                type="text"
                label="Title (Chinese)"
                name="titleInChinese"
                value={formData.titleInChinese}
                onChange={(e) => handleChange('titleInChinese', e.target.value)}
              />
              <Input
                type="text"
                label="Category"
                name="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              />
              <Input
                type="select"
                label="Status"
                name="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                options={[
                  { value: '', label: 'Select Status' },
                  ...STATUS_OPTIONS
                ]}
              />
              <Input
                type="date"
                label="Application Deadline"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={(e) => handleChange('applicationDeadline', e.target.value)}
                required
              />
              <Input
                type="date"
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
              <Input
                type="text"
                label="Tags (comma-separated)"
                name="tags"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="e.g., STEM, Full Scholarship"
              />
              <Input
                type="number"
                label="Available Slots"
                name="availableSlots"
                value={formData.availableSlots}
                onChange={(e) => handleChange('availableSlots', e.target.value)}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 min-h-[100px]"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Program Details */}
        {activeSection === 'program' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="select"
                label="Program Category"
                name="programCategory"
                value={formData.programCategory}
                onChange={(e) => handleChange('programCategory', e.target.value)}
                options={[
                  { value: '', label: 'Select Category' },
                  ...PROGRAM_CATEGORIES
                ]}
                required
              />
              <Input
                type="text"
                label="Field"
                name="field"
                value={formData.field}
                onChange={(e) => handleChange('field', e.target.value)}
                placeholder="e.g., Engineering, Arts, Science"
              />
              <Input
                type="text"
                label="Program Name"
                name="programName"
                value={formData.programName}
                onChange={(e) => handleChange('programName', e.target.value)}
                placeholder="e.g., Computer Science and Technology"
              />
              <Input
                type="text"
                label="Degree"
                name="degree"
                value={formData.degree}
                onChange={(e) => handleChange('degree', e.target.value)}
                placeholder="e.g., 4 years of Bachelor course"
              />
              <Input
                type="number"
                label="Duration (years)"
                name="duration"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
              />
              <Input
                type="text"
                label="Intake"
                name="intake"
                value={formData.intake}
                onChange={(e) => handleChange('intake', e.target.value)}
                placeholder="e.g., 2026 Autumn"
              />
            </div>
          </div>
        )}

        {/* Scholarship Information */}
        {activeSection === 'scholarship' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="select"
                label="Scholarship Category"
                name="scholarshipCategory"
                value={formData.scholarshipCategory}
                onChange={(e) => handleChange('scholarshipCategory', e.target.value)}
                options={[
                  { value: '', label: 'Select Category' },
                  ...SCHOLARSHIP_CATEGORIES
                ]}
              />
              <Input
                type="number"
                label="Scholarship Duration (years)"
                name="scholarshipDuration"
                value={formData.scholarshipDuration}
                onChange={(e) => handleChange('scholarshipDuration', e.target.value)}
              />
              <Input
                type="number"
                label="Original Tuition Fee (RMB/year)"
                name="originalTuitionFee"
                value={formData.originalTuitionFee}
                onChange={(e) => handleChange('originalTuitionFee', e.target.value)}
              />
              <Input
                type="number"
                label="Tuition Fee After Scholarship (RMB/year)"
                name="tuitionFeeAfterScholarship"
                value={formData.tuitionFeeAfterScholarship}
                onChange={(e) => handleChange('tuitionFeeAfterScholarship', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Fees (Original)</label>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="number"
                  label="Quad Room (RMB/year)"
                  name="accommodationFee.quad"
                  value={formData.accommodationFee.quad}
                  onChange={(e) => handleChange('accommodationFee.quad', e.target.value)}
                />
                <Input
                  type="number"
                  label="Double Room (RMB/year)"
                  name="accommodationFee.double"
                  value={formData.accommodationFee.double}
                  onChange={(e) => handleChange('accommodationFee.double', e.target.value)}
                />
                <Input
                  type="number"
                  label="Single Room (RMB/year)"
                  name="accommodationFee.single"
                  value={formData.accommodationFee.single}
                  onChange={(e) => handleChange('accommodationFee.single', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Fees (After Scholarship)</label>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="number"
                  label="Quad Room (RMB/year)"
                  name="accommodationFeeAfterScholarship.quad"
                  value={formData.accommodationFeeAfterScholarship.quad}
                  onChange={(e) => handleChange('accommodationFeeAfterScholarship.quad', e.target.value)}
                />
                <Input
                  type="number"
                  label="Double Room (RMB/year)"
                  name="accommodationFeeAfterScholarship.double"
                  value={formData.accommodationFeeAfterScholarship.double}
                  onChange={(e) => handleChange('accommodationFeeAfterScholarship.double', e.target.value)}
                />
                <Input
                  type="number"
                  label="Single Room (RMB/year)"
                  name="accommodationFeeAfterScholarship.single"
                  value={formData.accommodationFeeAfterScholarship.single}
                  onChange={(e) => handleChange('accommodationFeeAfterScholarship.single', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scholarship Policy</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 min-h-[100px]"
                value={formData.scholarshipPolicy}
                onChange={(e) => handleChange('scholarshipPolicy', e.target.value)}
                placeholder="Describe the scholarship policy..."
              />
            </div>
          </div>
        )}

        {/* Applicant Requirements */}
        {activeSection === 'requirements' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Minimum Age"
                name="applicantRequirements.ageMin"
                value={formData.applicantRequirements.ageMin}
                onChange={(e) => handleChange('applicantRequirements.ageMin', e.target.value)}
              />
              <Input
                type="number"
                label="Maximum Age"
                name="applicantRequirements.ageMax"
                value={formData.applicantRequirements.ageMax}
                onChange={(e) => handleChange('applicantRequirements.ageMax', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.applicantRequirements.acceptStudentsBeenToChina}
                  onChange={(e) => handleChange('applicantRequirements.acceptStudentsBeenToChina', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Accept students who have been to China</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.applicantRequirements.acceptMinors}
                  onChange={(e) => handleChange('applicantRequirements.acceptMinors', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Accept minors</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Acceptable Student's Current Location</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={acceptableLocationInput}
                  onChange={(e) => setAcceptableLocationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLocation())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter location or 'unlimited'"
                />
                <Button type="button" onClick={handleAddLocation}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.applicantRequirements.acceptableLocations.map((loc, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm">
                    {loc}
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="number"
                label="GPA Requirement"
                name="applicantRequirements.scoreRequirements.gpa"
                value={formData.applicantRequirements.scoreRequirements.gpa}
                onChange={(e) => handleChange('applicantRequirements.scoreRequirements.gpa', e.target.value)}
                step="0.1"
              />
              <Input
                type="text"
                label="Language Test Requirement"
                name="applicantRequirements.scoreRequirements.languageTest"
                value={formData.applicantRequirements.scoreRequirements.languageTest}
                onChange={(e) => handleChange('applicantRequirements.scoreRequirements.languageTest', e.target.value)}
                placeholder="e.g., IELTS 6.0, TOEFL 80"
              />
              <Input
                type="text"
                label="Other Score Requirements"
                name="applicantRequirements.scoreRequirements.other"
                value={formData.applicantRequirements.scoreRequirements.other}
                onChange={(e) => handleChange('applicantRequirements.scoreRequirements.other', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Requirements</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 min-h-[80px]"
                value={formData.applicantRequirements.otherRequirements}
                onChange={(e) => handleChange('applicantRequirements.otherRequirements', e.target.value)}
                placeholder="Additional requirements..."
              />
            </div>
          </div>
        )}

        {/* Application Documents */}
        {activeSection === 'documents' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Documents</h3>
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Document Name"
                  />
                  <input
                    type="text"
                    value={newDocument.downloadLink}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, downloadLink: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Download Link (optional)"
                  />
                </div>
                <textarea
                  value={newDocument.description}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Description"
                  rows={2}
                />
                <textarea
                  value={newDocument.specialConditions}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, specialConditions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Special Conditions (optional)"
                  rows={2}
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newDocument.required}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, required: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Required</span>
                  </label>
                  <Button type="button" onClick={handleAddDocument}>Add Document</Button>
                </div>
              </div>
              <div className="space-y-2">
                {formData.applicationDocuments.map((doc, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{doc.name}</span>
                        {doc.required && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>}
                      </div>
                      {doc.description && <p className="text-sm text-gray-600 mt-1">{doc.description}</p>}
                      {doc.specialConditions && <p className="text-xs text-orange-600 mt-1 italic">{doc.specialConditions}</p>}
                      {doc.downloadLink && (
                        <a href={doc.downloadLink} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-600 hover:underline mt-1 block">
                          Download Link
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(index)}
                      className="text-red-600 hover:text-red-700 text-sm ml-4"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Documents (Conditional)</h3>
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newAdditionalDoc.name}
                    onChange={(e) => setNewAdditionalDoc(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Document Name"
                  />
                  <input
                    type="text"
                    value={newAdditionalDoc.condition}
                    onChange={(e) => setNewAdditionalDoc(prev => ({ ...prev, condition: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Condition (e.g., transfer student only)"
                  />
                </div>
                <textarea
                  value={newAdditionalDoc.description}
                  onChange={(e) => setNewAdditionalDoc(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Description"
                  rows={2}
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newAdditionalDoc.required}
                      onChange={(e) => setNewAdditionalDoc(prev => ({ ...prev, required: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Required</span>
                  </label>
                  <Button type="button" onClick={handleAddAdditionalDocument}>Add Additional Document</Button>
                </div>
              </div>
              <div className="space-y-2">
                {formData.additionalDocuments.map((doc, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{doc.name}</span>
                        {doc.required && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>}
                      </div>
                      {doc.description && <p className="text-sm text-gray-600 mt-1">{doc.description}</p>}
                      {doc.condition && <p className="text-xs text-orange-600 mt-1 italic">Condition: {doc.condition}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalDocument(index)}
                      className="text-red-600 hover:text-red-700 text-sm ml-4"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Fee Structure */}
        {activeSection === 'fees' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">University Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Original Tuition Fee (RMB/year)"
                  name="feeStructure.universityFees.originalTuitionFee"
                  value={formData.feeStructure.universityFees.originalTuitionFee}
                  onChange={(e) => handleChange('feeStructure.universityFees.originalTuitionFee', e.target.value)}
                />
                <Input
                  type="number"
                  label="Tuition Fee After Scholarship (RMB/year)"
                  name="feeStructure.universityFees.tuitionFeeAfterScholarship"
                  value={formData.feeStructure.universityFees.tuitionFeeAfterScholarship}
                  onChange={(e) => handleChange('feeStructure.universityFees.tuitionFeeAfterScholarship', e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Fees (Original)</label>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    type="number"
                    label="Quad"
                    name="feeStructure.universityFees.accommodationFees.quad"
                    value={formData.feeStructure.universityFees.accommodationFees.quad}
                    onChange={(e) => handleChange('feeStructure.universityFees.accommodationFees.quad', e.target.value)}
                  />
                  <Input
                    type="number"
                    label="Double"
                    name="feeStructure.universityFees.accommodationFees.double"
                    value={formData.feeStructure.universityFees.accommodationFees.double}
                    onChange={(e) => handleChange('feeStructure.universityFees.accommodationFees.double', e.target.value)}
                  />
                  <Input
                    type="number"
                    label="Single"
                    name="feeStructure.universityFees.accommodationFees.single"
                    value={formData.feeStructure.universityFees.accommodationFees.single}
                    onChange={(e) => handleChange('feeStructure.universityFees.accommodationFees.single', e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Fees (After Scholarship)</label>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    type="number"
                    label="Quad"
                    name="feeStructure.universityFees.accommodationFeesAfterScholarship.quad"
                    value={formData.feeStructure.universityFees.accommodationFeesAfterScholarship.quad}
                    onChange={(e) => handleChange('feeStructure.universityFees.accommodationFeesAfterScholarship.quad', e.target.value)}
                  />
                  <Input
                    type="number"
                    label="Double"
                    name="feeStructure.universityFees.accommodationFeesAfterScholarship.double"
                    value={formData.feeStructure.universityFees.accommodationFeesAfterScholarship.double}
                    onChange={(e) => handleChange('feeStructure.universityFees.accommodationFeesAfterScholarship.double', e.target.value)}
                  />
                  <Input
                    type="number"
                    label="Single"
                    name="feeStructure.universityFees.accommodationFeesAfterScholarship.single"
                    value={formData.feeStructure.universityFees.accommodationFeesAfterScholarship.single}
                    onChange={(e) => handleChange('feeStructure.universityFees.accommodationFeesAfterScholarship.single', e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Other Fees</label>
                <div className="space-y-2 mb-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newOtherFee.name}
                      onChange={(e) => setNewOtherFee(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Fee Name"
                    />
                    <input
                      type="number"
                      value={newOtherFee.amount}
                      onChange={(e) => setNewOtherFee(prev => ({ ...prev, amount: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Amount (RMB)"
                    />
                    <input
                      type="text"
                      value={newOtherFee.description}
                      onChange={(e) => setNewOtherFee(prev => ({ ...prev, description: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Description"
                    />
                  </div>
                  <Button type="button" onClick={handleAddOtherFee} size="sm">Add Other Fee</Button>
                </div>
                <div className="space-y-2">
                  {formData.feeStructure.universityFees.otherFees.map((fee, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded flex items-center justify-between">
                      <span className="text-sm text-gray-700">{fee.name}: {fee.amount} RMB - {fee.description}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOtherFee(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nadoumi Agent Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Application Fee (RMB)"
                  name="feeStructure.nadoumiFees.applicationFee"
                  value={formData.feeStructure.nadoumiFees.applicationFee}
                  onChange={(e) => handleChange('feeStructure.nadoumiFees.applicationFee', e.target.value)}
                />
                <Input
                  type="text"
                  label="Service Fee"
                  name="feeStructure.nadoumiFees.serviceFee"
                  value={formData.feeStructure.nadoumiFees.serviceFee}
                  onChange={(e) => handleChange('feeStructure.nadoumiFees.serviceFee', e.target.value)}
                  placeholder="e.g., Depend on agent level"
                />
                <Input
                  type="number"
                  label="Star Agent Service Fee (RMB)"
                  name="feeStructure.nadoumiFees.starAgentServiceFee"
                  value={formData.feeStructure.nadoumiFees.starAgentServiceFee}
                  onChange={(e) => handleChange('feeStructure.nadoumiFees.starAgentServiceFee', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNote())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter special note..."
                />
                <Button type="button" onClick={handleAddNote}>Add</Button>
              </div>
              <div className="space-y-2">
                {formData.specialNotes.map((note, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{note}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNote(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* University Information */}
        {activeSection === 'university' && (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-orange-800 font-medium mb-2">
                Select an existing university to automatically fill the fields below, or enter manually.
              </p>
              <Input
                type="select"
                label="Select University"
                name="universityRef"
                value={formData.universityRef}
                onChange={(e) => handleUniversitySelect(e.target.value)}
                disabled={universitiesLoading}
                options={[
                  { value: '', label: universitiesLoading ? 'Loading universities...' : 'Select a university (optional)' },
                  ...universities.map(u => ({
                    value: u._id || u.id || u.universityId,
                    label: `${u.name}${u.city ? ` - ${u.city}` : ''}`
                  }))
                ]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                label="University Name"
                name="university.name"
                value={formData.university.name}
                onChange={(e) => handleChange('university.name', e.target.value)}
                required
              />
              <Input
                type="text"
                label="Country"
                name="university.country"
                value={formData.university.country}
                onChange={(e) => handleChange('university.country', e.target.value)}
                required
              />
              <Input
                type="text"
                label="City"
                name="university.city"
                value={formData.university.city}
                onChange={(e) => handleChange('university.city', e.target.value)}
              />
              <Input
                type="url"
                label="Website"
                name="university.website"
                value={formData.university.website}
                onChange={(e) => handleChange('university.website', e.target.value)}
              />
              <Input
                type="url"
                label="Logo URL"
                name="university.logo"
                value={formData.university.logo}
                onChange={(e) => handleChange('university.logo', e.target.value)}
              />
            </div>
            {formData.universityRef && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  ✓ Linked to University: {formData.university.name || 'Selected university'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Legacy Fields (for backward compatibility) */}
        {activeSection === 'legacy' && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legacy Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Minimum GPA"
                  name="requirements.minGPA"
                  value={formData.requirements.minGPA}
                  onChange={(e) => handleChange('requirements.minGPA', e.target.value)}
                  step="0.1"
                  min="0"
                  max="4"
                />
                <Input
                  type="number"
                  label="Age Limit"
                  name="requirements.ageLimit"
                  value={formData.requirements.ageLimit}
                  onChange={(e) => handleChange('requirements.ageLimit', e.target.value)}
                />
                <Input
                  type="text"
                  label="Required Languages (comma-separated)"
                  name="requirements.requiredLanguages"
                  value={formData.requirements.requiredLanguages}
                  onChange={(e) => handleChange('requirements.requiredLanguages', e.target.value)}
                  placeholder="e.g., English, Chinese"
                />
                <Input
                  type="text"
                  label="Required Degrees (comma-separated)"
                  name="requirements.requiredDegrees"
                  value={formData.requirements.requiredDegrees}
                  onChange={(e) => handleChange('requirements.requiredDegrees', e.target.value)}
                  placeholder="e.g., Bachelor, Master"
                />
                <Input
                  type="text"
                  label="Nationality Restrictions (comma-separated)"
                  name="requirements.nationalityRestrictions"
                  value={formData.requirements.nationalityRestrictions}
                  onChange={(e) => handleChange('requirements.nationalityRestrictions', e.target.value)}
                  placeholder="Leave empty if no restrictions"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legacy Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Tuition Coverage (%)"
                  name="benefits.tuitionCoverage"
                  value={formData.benefits.tuitionCoverage}
                  onChange={(e) => handleChange('benefits.tuitionCoverage', e.target.value)}
                  min="0"
                  max="100"
                />
                <Input
                  type="number"
                  label="Living Stipend (per month)"
                  name="benefits.livingStipend"
                  value={formData.benefits.livingStipend}
                  onChange={(e) => handleChange('benefits.livingStipend', e.target.value)}
                  step="0.01"
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.benefits.travelAllowance}
                      onChange={(e) => handleChange('benefits.travelAllowance', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Travel Allowance</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.benefits.healthInsurance}
                      onChange={(e) => handleChange('benefits.healthInsurance', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Health Insurance</span>
                  </label>
                </div>
                <Input
                  type="text"
                  label="Other Benefits (comma-separated)"
                  name="benefits.other"
                  value={formData.benefits.other}
                  onChange={(e) => handleChange('benefits.other', e.target.value)}
                  placeholder="e.g., Accommodation, Meal Plan"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  )
}

export default ScholarshipForm
