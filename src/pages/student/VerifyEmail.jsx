import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Container from '../../component/common/Container.jsx'
import Button from '../../component/common/Button.jsx'
import Input from '../../component/common/Input.jsx'
import useStudentAuth from '../../hooks/student/useStudentAuth.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyEmail, resendOTP, loading, error: authError } = useStudentAuth()
  const { success, error: showError } = useToast()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!email) {
      navigate('/student/register')
    }
  }, [email, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await verifyEmail(email, otp)
      if (result?.token) {
        success('Email verified successfully!')
        navigate('/student/dashboard')
      }
    } catch (err) {
      showError(authError || 'Verification failed. Please try again.')
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await resendOTP(email)
      success('Verification code has been resent to your email.')
    } catch (err) {
      showError('Failed to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-sm text-gray-600 mt-2">
              We've sent a 6-digit verification code to <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {authError && (
              <div role="alert" className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
                {authError}
              </div>
            )}

            <Input
              type="email"
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
            />

            <Input
              type="text"
              label="Verification Code"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              placeholder="123456"
              maxLength={6}
            />

            <div className="text-xs text-gray-500 text-center">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
              >
                {resending ? 'Resending...' : 'Resend Code'}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || otp.length !== 6}
              ariaLabel="Verify email"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}

