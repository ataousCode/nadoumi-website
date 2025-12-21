import React, { useState, useEffect } from 'react'
import AdminLayout from '../../component/admin/AdminLayout.jsx'
import Input from '../../component/common/Input.jsx'
import Button from '../../component/common/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import useAdminAuth from '../../hooks/admin/useAdminAuth.js'
import { apiRequest, apiRequestFormData, getImageURL } from '../../api/config.js'

export default function Settings() {
  const { success, error: showError } = useToast()
  const { t } = useI18n()
  const { user } = useAdminAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: ''
  })
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setProfileLoading(true)
      const response = await apiRequest('/admin/me')
      const data = response.data || response
      setProfileData({
        name: data.name || '',
        email: data.email || '',
        profilePicture: data.profilePicture || ''
      })
    } catch (err) {
      showError('Failed to load profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateProfile = () => {
    const newErrors = {}
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number'
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!validateProfile()) return

    setLoading(true)
    try {
      await apiRequest('/admin/me', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      })
      success(t('common.toast.updateSuccess'))
    } catch (err) {
      showError(err?.message || t('common.toast.updateError'))
      if (err.errors) {
        setErrors(err.errors)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!validatePassword()) return

    setLoading(true)
    try {
      await apiRequest('/admin/me/password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })
      success('Password updated successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      showError(err?.message || 'Failed to update password')
      if (err.errors) {
        setErrors(err.errors)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
                  activeTab === 'profile'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
                  activeTab === 'password'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Change Password
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {profileLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading profile...</div>
                ) : (
                  <>
                    {/* Profile Picture Section */}
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                      <div className="relative">
                        {profileData.profilePicture ? (
                          <img 
                            src={getImageURL(profileData.profilePicture)}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-orange-100 shadow-md"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              const fallback = e.target.nextElementSibling
                              if (fallback) fallback.style.display = 'flex'
                            }}
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center border-4 border-orange-100 shadow-md">
                            <span className="text-3xl font-bold text-white">
                              {profileData.name?.[0] || user?.name?.[0] || 'A'}
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
                                const formData = new FormData()
                                formData.append('profilePicture', file)
                                const result = await apiRequestFormData('/admin/me/profile-picture', formData)
                                setProfileData(prev => ({ ...prev, profilePicture: result.profilePicture }))
                                success('Profile picture updated successfully!')
                                await loadProfile()
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
                        <h3 className="text-lg font-semibold text-gray-900">{profileData.name || 'Admin'}</h3>
                        <p className="text-sm text-gray-600">{profileData.email}</p>
                        <p className="text-xs text-gray-500 mt-1">Click the camera icon to upload a new profile picture</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        label="Name"
                        name="name"
                        value={profileData.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        error={errors.name}
                        required
                      />
                      <Input
                        type="email"
                        label="Email"
                        name="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        error={errors.email}
                        required
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => loadProfile()}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-4">
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
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        })
                        setErrors({})
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

