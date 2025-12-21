import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../../component/common/Container.jsx'
import Button from '../../component/common/Button.jsx'
import Input from '../../component/common/Input.jsx'
import useStudentAuth from '../../hooks/student/useStudentAuth.js'
import { getStudentProfile, updateStudentProfile, changePassword, uploadProfilePicture } from '../../api/students.js'
import { getStudentApplications } from '../../api/applications.js'
import { useToast } from '../../context/ToastContext.jsx'
import Loading from '../../component/admin/Loading.jsx'
import StatusBadge from '../../component/admin/StatusBadge.jsx'
import { getImageURL } from '../../api/config.js'

export default function StudentProfile() {
  const navigate = useNavigate()
  const { student: authStudent, loading: authLoading } = useStudentAuth()
  const { success, error: showError } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    country: '',
    passportNumber: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [applications, setApplications] = useState([])
  const [loadingApplications, setLoadingApplications] = useState(false)
  const [profilePicture, setProfilePicture] = useState('')
  const [uploadingPicture, setUploadingPicture] = useState(false)

  useEffect(() => {
    if (!authLoading && !authStudent) {
      navigate('/login')
      return
    }

    async function loadProfile() {
      try {
        const profile = await getStudentProfile()
        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          phone: profile.phone || '',
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
          nationality: profile.nationality || '',
          country: profile.country || '',
          passportNumber: profile.passportNumber || '',
        })
        setProfilePicture(profile.profilePicture || '')
      } catch (err) {
        showError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (authStudent) {
      loadProfile()
      loadApplications()
    }
  }, [authStudent, authLoading, navigate, showError])

  async function loadApplications() {
    setLoadingApplications(true)
    try {
      const apps = await getStudentApplications()
      setApplications(apps || [])
    } catch (err) {
      console.error('Failed to load applications:', err)
    } finally {
      setLoadingApplications(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validatePassword = () => {
    const newErrors = {}
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and a number'
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateStudentProfile(formData)
      success('Profile updated successfully!')
    } catch (err) {
      showError(err?.message || 'Failed to update profile')
      if (err.errors) {
        setErrors(err.errors)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (!validatePassword()) {
      return
    }

    setSaving(true)
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)
      success('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (err) {
      showError(err?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <Container className="py-12">
        <Loading label="Loading profile..." />
      </Container>
    )
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                activeTab === 'profile'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                activeTab === 'applications'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                activeTab === 'password'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Change Password
            </button>
          </nav>
        </div>

        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
              <div className="relative">
                {profilePicture ? (
                  <img 
                    src={getImageURL(profilePicture)}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-100 shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const fallback = e.target.nextElementSibling
                      if (fallback) {
                        fallback.style.display = 'flex'
                      }
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center border-4 border-orange-100 shadow-md">
                    <span className="text-3xl font-bold text-white">
                      {formData.firstName?.[0] || authStudent?.firstName?.[0] || 'S'}
                    </span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-700 transition-colors shadow-lg">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      
                      if (file.size > 5 * 1024 * 1024) {
                        showError('Image size must be less than 5MB')
                        return
                      }
                      
                      setUploadingPicture(true)
                      try {
                        const result = await uploadProfilePicture(file)
                        setProfilePicture(result.profilePicture)
                        success('Profile picture updated successfully!')
                        // Refresh student data
                        const profile = await getStudentProfile()
                        setProfilePicture(profile.profilePicture || '')
                      } catch (err) {
                        showError(err?.message || 'Failed to upload profile picture')
                      } finally {
                        setUploadingPicture(false)
                      }
                    }}
                    disabled={uploadingPicture}
                  />
                  {uploadingPicture ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </label>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-sm text-gray-600">{authStudent?.email}</p>
                <p className="text-xs text-gray-500 mt-1">Click the camera icon to upload a new profile picture</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="text"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
                required
              />

              <Input
                type="text"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
                required
              />

              <Input
                type="email"
                label="Email"
                name="email"
                value={authStudent?.email || ''}
                disabled
                className="bg-gray-50"
              />

              <Input
                type="tel"
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="+1234567890"
              />

              <Input
                type="text"
                label="Country"
                name="country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                error={errors.country}
                placeholder="e.g., United States"
                required
              />

              <Input
                type="text"
                label="Passport Number"
                name="passportNumber"
                value={formData.passportNumber}
                disabled
                className="bg-gray-50"
                placeholder="A12345678"
              />

              <Input
                type="date"
                label="Date of Birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                error={errors.dateOfBirth}
              />

              <Input
                type="text"
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                error={errors.nationality}
                placeholder="e.g., United States"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                ariaLabel="Save profile"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/student/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Applications</h2>
            
            {loadingApplications ? (
              <Loading label="Loading applications..." />
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">You haven't submitted any applications yet.</p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/scholarships')}
                >
                  Browse Scholarships
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => {
                  const interviewDetails = app.interviewDetails || {}
                  const isInterview = app.status === 'INTERVIEW' || app.status === 'interview' || app.status === 'interview_scheduled'
                  
                  return (
                    <div
                      key={app._id || app.id || app.applicationId}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {app.scholarship?.title || 'Scholarship Application'}
                          </h3>
                          {app.scholarship?.university?.name && (
                            <p className="text-sm text-gray-600 mb-2">
                              {app.scholarship.university.name}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}
                            </span>
                            {app.applicationId && (
                              <span>ID: {app.applicationId}</span>
                            )}
                          </div>
                          
                          {/* Interview Details Section */}
                          {isInterview && interviewDetails && (
                            <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                📅 Interview Scheduled
                                <span className="text-xs font-normal text-gray-600 bg-white px-2 py-1 rounded border border-gray-300">
                                  🇨🇳 China Beijing Time
                                </span>
                              </h4>
                              
                              <div className="space-y-2 text-sm">
                                {interviewDetails.date && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="font-medium text-gray-900">
                                      {new Date(interviewDetails.date).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                    </span>
                                  </div>
                                )}
                                
                                {interviewDetails.time && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Time:</span>
                                    <span className="font-medium text-gray-900">
                                      {interviewDetails.time} (Beijing Time)
                                    </span>
                                  </div>
                                )}
                                
                                {interviewDetails.videoCallPlatform && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Platform:</span>
                                    <span className="font-medium text-gray-900">
                                      {interviewDetails.videoCallPlatform}
                                    </span>
                                  </div>
                                )}
                                
                                {interviewDetails.videoCallLink && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Meeting Link:</span>
                                    <a
                                      href={interviewDetails.videoCallLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-orange-600 hover:text-orange-700 font-medium underline"
                                    >
                                      Join Meeting
                                    </a>
                                  </div>
                                )}
                                
                                {interviewDetails.notes && (
                                  <div className="mt-3 pt-3 border-t border-purple-300">
                                    <p className="text-gray-700">
                                      <span className="font-medium">Additional Notes:</span> {interviewDetails.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Admin Documents Section (for accepted applications) */}
                          {(app.status === 'accepted' || app.status === 'ACCEPTED') && 
                           (app.admissionDocument || app.jw202Document) && (
                            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                📄 Official Documents
                              </h4>
                              
                              <div className="space-y-3">
                                {app.admissionDocument && (
                                  <div className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                                    <span className="text-sm font-medium text-gray-900">Admission Letter</span>
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/documents/file/${app.admissionDocument.path.replace('/uploads/', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-orange-600 hover:text-orange-700 font-medium underline"
                                      >
                                        Download
                                      </a>
                                    </div>
                                  </div>
                                )}
                                
                                {app.jw202Document && (
                                  <div className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                                    <span className="text-sm font-medium text-gray-900">JW202 Form</span>
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/documents/file/${app.jw202Document.path.replace('/uploads/', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-orange-600 hover:text-orange-700 font-medium underline"
                                      >
                                        Download
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={app.status} size="sm" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/student/applications/${app._id || app.id || app.applicationId}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-6">
            <Input
              type="password"
              label="Current Password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              error={errors.currentPassword}
              required
            />

            <Input
              type="password"
              label="New Password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              error={errors.newPassword}
              required
            />

            <Input
              type="password"
              label="Confirm New Password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              required
            />

            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters long</li>
                <li>Contains at least one uppercase letter</li>
                <li>Contains at least one lowercase letter</li>
                <li>Contains at least one number</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                ariaLabel="Change password"
              >
                {saving ? 'Changing...' : 'Change Password'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/student/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </Container>
  )
}

