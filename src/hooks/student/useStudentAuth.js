import { useCallback, useEffect, useMemo, useState } from 'react'
import * as studentApi from '../../api/students.js'

export default function useStudentAuth() {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    const current = studentApi.getCurrentStudent?.()
    if (current) {
      setStudent(current)
    }
    
    studentApi.verifyStudentToken()
      .then((studentData) => {
        setStudent(studentData || null)
        setLoading(false)
      })
      .catch(() => {
        setStudent(null)
        setLoading(false)
      })
  }, [])

  const register = useCallback(async (studentData) => {
    setLoading(true)
    setError('')
    try {
      const result = await studentApi.registerStudent(studentData)
      return result
    } catch (err) {
      const message = err?.message || 'Registration failed'
      const friendly = message.includes('already') 
        ? 'This email or passport number is already registered.'
        : message.includes('Network') || message.includes('fetch')
        ? 'Network error. Please check your connection.'
        : message
      setError(friendly)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyEmail = useCallback(async (email, otp) => {
    setLoading(true)
    setError('')
    try {
      const result = await studentApi.verifyEmail(email, otp)
      if (result.student) {
        setStudent(result.student)
      }
      return result
    } catch (err) {
      const message = err?.message || 'Verification failed'
      const friendly = message.includes('Invalid') || message.includes('expired')
        ? 'Invalid or expired verification code.'
        : message.includes('Network') || message.includes('fetch')
        ? 'Network error. Please check your connection.'
        : message
      setError(friendly)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const resendOTP = useCallback(async (email) => {
    setLoading(true)
    setError('')
    try {
      const result = await studentApi.resendOTP(email)
      return result
    } catch (err) {
      const message = err?.message || 'Failed to resend code'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError('')
    try {
      const result = await studentApi.loginStudent(email, password)
      if (result.token) {
        const studentData = await studentApi.verifyStudentToken()
        setStudent(studentData || result.student || null)
      } else if (result.student) {
        setStudent(result.student)
      }
      return result
    } catch (err) {
      const message = err?.message || 'Login failed'
      const friendly = message.includes('Invalid') || message.includes('password')
        ? 'Invalid email or password.'
        : message.includes('verify')
        ? 'Please verify your email before logging in.'
        : message.includes('Network') || message.includes('fetch')
        ? 'Network error. Please check your connection.'
        : message
      setError(friendly)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      studentApi.logoutStudent()
      setStudent(null)
    } catch (err) {
      setError(err?.message || 'Logout failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const isAuthenticated = useMemo(() => Boolean(student), [student])

  return { 
    student, 
    isAuthenticated, 
    loading, 
    error, 
    register,
    verifyEmail,
    resendOTP,
    login, 
    logout 
  }
}

