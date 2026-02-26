import React, { useState, useEffect } from 'react'
import Input from '../../common/Input.jsx'
import Button from '../../common/Button.jsx'
import { getUniversities } from '../../../api/universities.js'
import { UNIVERSITY_STATUS, UNIVERSITY_TYPE } from '../../../constants/enums.js'

const STATUS_OPTIONS = Object.entries(UNIVERSITY_STATUS).map(([key, value]) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1)
}))

const TYPE_OPTIONS = Object.entries(UNIVERSITY_TYPE).map(([key, value]) => ({
  value,
  label: value
}))

function UniversityForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [activeSection, setActiveSection] = useState('basic')
  const [formData, setFormData] = useState({
    name: '',
    nameInChinese: '',
    logo: '',
    bannerImage: '',
    city: '',
    province: '',
    type: UNIVERSITY_TYPE.PUBLIC,
    foundedYear: '',
    totalStudents: '',
    internationalStudents: '',
    facultyCount: '',
    numberOfPrograms: 0,
    description: '',
    advantages: [],
    status: UNIVERSITY_STATUS.ACTIVE,
    rankings: [],
    albums: []
  })

  const [newAdvantage, setNewAdvantage] = useState('')
  const [newRanking, setNewRanking] = useState({ name: '', value: '', icon: '' })
  const [newAlbum, setNewAlbum] = useState({ title: '', images: [] })
  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        nameInChinese: initialData.nameInChinese || '',
        logo: initialData.logo || '',
        bannerImage: initialData.bannerImage || '',
        city: initialData.city || '',
        province: initialData.province || '',
        type: initialData.type || UNIVERSITY_TYPE.PUBLIC,
        foundedYear: initialData.foundedYear || '',
        totalStudents: initialData.totalStudents || '',
        internationalStudents: initialData.internationalStudents || '',
        facultyCount: initialData.facultyCount || '',
        numberOfPrograms: initialData.numberOfPrograms || 0,
        description: initialData.description || '',
        advantages: initialData.advantages || [],
        status: initialData.status || UNIVERSITY_STATUS.ACTIVE,
        rankings: initialData.rankings || [],
        albums: initialData.albums || []
      })
    }
  }, [initialData])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddAdvantage = () => {
    if (newAdvantage.trim()) {
      setFormData(prev => ({
        ...prev,
        advantages: [...prev.advantages, newAdvantage.trim()]
      }))
      setNewAdvantage('')
    }
  }

  const handleRemoveAdvantage = (index) => {
    setFormData(prev => ({
      ...prev,
      advantages: prev.advantages.filter((_, i) => i !== index)
    }))
  }

  const handleAddRanking = () => {
    if (newRanking.name && newRanking.value) {
      setFormData(prev => ({
        ...prev,
        rankings: [...prev.rankings, { ...newRanking }]
      }))
      setNewRanking({ name: '', value: '', icon: '' })
    }
  }

  const handleRemoveRanking = (index) => {
    setFormData(prev => ({
      ...prev,
      rankings: prev.rankings.filter((_, i) => i !== index)
    }))
  }

  const handleAddImageToAlbum = () => {
    if (newImageUrl.trim()) {
      setNewAlbum(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }))
      setNewImageUrl('')
    }
  }

  const handleRemoveImageFromAlbum = (index) => {
    setNewAlbum(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleAddAlbum = () => {
    if (newAlbum.title && newAlbum.images.length > 0) {
      setFormData(prev => ({
        ...prev,
        albums: [...prev.albums, { ...newAlbum }]
      }))
      setNewAlbum({ title: '', images: [] })
    }
  }

  const handleRemoveAlbum = (index) => {
    setFormData(prev => ({
      ...prev,
      albums: prev.albums.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      totalStudents: formData.totalStudents ? parseInt(formData.totalStudents) : undefined,
      internationalStudents: formData.internationalStudents ? parseInt(formData.internationalStudents) : undefined,
      facultyCount: formData.facultyCount ? parseInt(formData.facultyCount) : undefined,
      numberOfPrograms: parseInt(formData.numberOfPrograms) || 0,
      foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined
    }
    onSubmit(submitData)
  }

  const sections = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'details', label: 'Details' },
    { id: 'advantages', label: 'Advantages' },
    { id: 'rankings', label: 'Rankings' },
    { id: 'albums', label: 'Photo Albums' }
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
                id="name"
                label="University Name (English)"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
              <Input
                id="nameInChinese"
                label="University Name (Chinese)"
                value={formData.nameInChinese}
                onChange={(e) => handleChange('nameInChinese', e.target.value)}
              />
              <Input
                id="logo"
                label="Logo URL"
                value={formData.logo}
                onChange={(e) => handleChange('logo', e.target.value)}
              />
              <Input
                id="bannerImage"
                label="Cover Photo / Banner Image URL"
                value={formData.bannerImage}
                onChange={(e) => handleChange('bannerImage', e.target.value)}
              />
              <Input
                id="city"
                label="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
              <Input
                id="province"
                label="Province"
                value={formData.province}
                onChange={(e) => handleChange('province', e.target.value)}
              />
              <Input
                id="type"
                type="select"
                label="Type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                options={[
                  { value: '', label: 'Select Type' },
                  ...TYPE_OPTIONS
                ]}
              />
              <Input
                id="status"
                type="select"
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                options={[
                  { value: '', label: 'Select Status' },
                  ...STATUS_OPTIONS
                ]}
              />
            </div>
          </div>
        )}

        {/* Details */}
        {activeSection === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="foundedYear"
                label="Founded Year"
                type="number"
                value={formData.foundedYear}
                onChange={(e) => handleChange('foundedYear', e.target.value)}
              />
              <Input
                id="totalStudents"
                label="Total Students"
                type="number"
                value={formData.totalStudents}
                onChange={(e) => handleChange('totalStudents', e.target.value)}
              />
              <Input
                id="internationalStudents"
                label="International Students"
                type="number"
                value={formData.internationalStudents}
                onChange={(e) => handleChange('internationalStudents', e.target.value)}
              />
              <Input
                id="facultyCount"
                label="Faculty Count"
                type="number"
                value={formData.facultyCount}
                onChange={(e) => handleChange('facultyCount', e.target.value)}
              />
              <Input
                id="numberOfPrograms"
                label="Number of Programs"
                type="number"
                value={formData.numberOfPrograms}
                onChange={(e) => handleChange('numberOfPrograms', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter university description..."
              />
            </div>
          </div>
        )}

        {/* Advantages */}
        {activeSection === 'advantages' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advantages
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newAdvantage}
                  onChange={(e) => setNewAdvantage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAdvantage())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter advantage..."
                />
                <Button type="button" onClick={handleAddAdvantage}>Add</Button>
              </div>
              <div className="space-y-2">
                {formData.advantages.map((advantage, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{advantage}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdvantage(index)}
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

        {/* Rankings */}
        {activeSection === 'rankings' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rankings
              </label>
              <div className="space-y-3 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newRanking.name}
                    onChange={(e) => setNewRanking(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ranking Name"
                  />
                  <input
                    type="text"
                    value={newRanking.value}
                    onChange={(e) => setNewRanking(prev => ({ ...prev, value: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ranking Value"
                  />
                  <input
                    type="text"
                    value={newRanking.icon}
                    onChange={(e) => setNewRanking(prev => ({ ...prev, icon: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Icon (emoji/unicode)"
                  />
                </div>
                <Button type="button" onClick={handleAddRanking}>Add Ranking</Button>
              </div>
              <div className="space-y-2">
                {formData.rankings.map((ranking, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">
                      {ranking.icon && <span className="mr-2">{ranking.icon}</span>}
                      {ranking.name}: {ranking.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRanking(index)}
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

        {/* Photo Albums */}
        {activeSection === 'albums' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo Albums
              </label>
              <div className="space-y-4 mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAlbum.title}
                    onChange={(e) => setNewAlbum(prev => ({ ...prev, title: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Album Title"
                  />
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageToAlbum())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Image URL"
                  />
                  <Button type="button" onClick={handleAddImageToAlbum}>Add Image</Button>
                </div>
                {newAlbum.images.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {newAlbum.title || 'Untitled Album'} ({newAlbum.images.length} images)
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newAlbum.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img src={img} alt={`Preview ${idx + 1}`} className="w-16 h-16 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImageFromAlbum(idx)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button type="button" onClick={handleAddAlbum} size="sm">Add Album</Button>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {formData.albums.map((album, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{album.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAlbum(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Album
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {album.images && album.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`${album.title} ${idx + 1}`} className="w-16 h-16 object-cover rounded" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  )
}

export default UniversityForm
