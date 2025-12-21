import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../../component/common/Container.jsx'
import Button from '../../component/common/Button.jsx'
import Input from '../../component/common/Input.jsx'
import { forgotPassword } from '../../api/students.js'
import { useToast } from '../../context/ToastContext.jsx'
import logoUrl from '../../assets/icons/logo.jpg'

export default function ForgotPassword() {
  const { success, error: showError } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setErrors({ email: 'Email is required' })
      return
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    setLoading(true)
    setErrors({})
    
    try {
      await forgotPassword(email)
      setSubmitted(true)
      success('If the email exists, a password reset link has been sent to your inbox.')
    } catch (err) {
      // Don't reveal if email exists for security
      setSubmitted(true)
      // Still show success message for security (don't reveal if email exists)
      success('If the email exists, a password reset link has been sent to your inbox.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Container className="py-12 md:py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
              <p className="text-gray-600 mb-6">
                If an account with <strong>{email}</strong> exists, we've sent you a password reset link.
                Please check your email and click the link to reset your password.
              </p>
              <div className="w-full space-y-3">
                <Link to="/login" className="block">
                  <Button variant="primary" className="w-full" ariaLabel="Back to login">
                    Back to Login
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setEmail('')
                  }}
                  className="w-full text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Try another email
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <img src={logoUrl} alt="Logo" className="h-12 w-12 mb-3 rounded-md" />
            <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
            <p className="text-sm text-gray-600 mt-1">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) {
                  setErrors({})
                }
              }}
              error={errors.email}
              required
              placeholder="your.email@example.com"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              ariaLabel="Send reset link"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}

