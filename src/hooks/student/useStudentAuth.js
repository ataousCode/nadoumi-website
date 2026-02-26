import { useCallback } from 'react'
import * as studentApi from '../../api/students.js'
import { createAuthHook, mapFriendlyError } from '../createAuthHook.js'

const useStudentSession = createAuthHook({
  getCurrentUser: studentApi.getCurrentStudent,
  verifyUser: studentApi.verifyStudentToken,
})

export default function useStudentAuth() {
  const { user: student, setUser: setStudent, loading, setLoading, error, setError, isAuthenticated } = useStudentSession()

  const register = useCallback(async (studentData) => {
    setLoading(true)
    setError('')
    try {
      return await studentApi.registerStudent(studentData)
    } catch (err) {
      setError(mapFriendlyError(err?.message || 'Registration failed'))
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  const verifyEmail = useCallback(async (email, otp) => {
    setLoading(true)
    setError('')
    try {
      const result = await studentApi.verifyEmail(email, otp)
      if (result.student) setStudent(result.student)
      return result
    } catch (err) {
      setError(mapFriendlyError(err?.message || 'Verification failed'))
      throw err
    } finally {
      setLoading(false)
    }
  }, [setStudent, setLoading, setError])

  const resendOTP = useCallback(async (email) => {
    setLoading(true)
    setError('')
    try {
      return await studentApi.resendOTP(email)
    } catch (err) {
      setError(err?.message || 'Failed to resend code')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

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
      setError(mapFriendlyError(err?.message || 'Login failed'))
      throw err
    } finally {
      setLoading(false)
    }
  }, [setStudent, setLoading, setError])

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
  }, [setStudent, setLoading, setError])

  return { student, isAuthenticated, loading, error, register, verifyEmail, resendOTP, login, logout }
}
