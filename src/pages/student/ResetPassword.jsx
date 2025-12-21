import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Container from '../../component/common/Container.jsx'
import Button from '../../component/common/Button.jsx'
import Input from '../../component/common/Input.jsx'
import { resetPassword } from '../../api/students.js'
import { useToast } from '../../context/ToastContext.jsx'
import logoUrl from '../../assets/icons/logo.jpg'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { success, error: showError } = useToast()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [token, setToken] = useState('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      showError('Invalid reset link. Please request a new password reset.')
      navigate('/student/forgot-password')
      return
    }
    setToken(tokenParam)
  }, [searchParams, navigate, showError])

  const validateForm = () => {
    const newErrors = {}

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and a number'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await resetPassword(token, password)
      success('Password reset successfully! You can now login with your new password.')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      const errorMessage = err?.message || 'Failed to reset password'
      if (errorMessage.includes('Invalid') || errorMessage.includes('expired')) {
        showError('This reset link is invalid or has expired. Please request a new one.')
        navigate('/student/forgot-password')
      } else {
        showError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return null // Will redirect in useEffect
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <img src={logoUrl} alt="Logo" className="h-12 w-12 mb-3 rounded-md" />
            <h1 className="text-2xl font-bold text-gray-900">Reset Your Password</h1>
            <p className="text-sm text-gray-600 mt-1">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="password"
              label="New Password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: '' }))
                }
              }}
              error={errors.password}
              required
            />

            <Input
              type="password"
              label="Confirm New Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }))
                }
              }}
              error={errors.confirmPassword}
              required
            />

            <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters long</li>
                <li>Contains at least one uppercase letter</li>
                <li>Contains at least one lowercase letter</li>
                <li>Contains at least one number</li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              ariaLabel="Reset password"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}

