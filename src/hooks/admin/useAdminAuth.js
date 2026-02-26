import { useCallback } from 'react'
import * as authApi from '../../api/auth.js'
import { createAuthHook, mapFriendlyError } from '../createAuthHook.js'

const useAdminSession = createAuthHook({
  getCurrentUser: authApi.getCurrentUser,
  verifyUser: authApi.verifyToken,
})

export default function useAdminAuth() {
  const { user, setUser, loading, setLoading, error, setError, isAuthenticated } = useAdminSession()

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError('')
    try {
      const { user: u } = await authApi.login(email, password)
      setUser(u || null)
      return u
    } catch (err) {
      setError(mapFriendlyError(err?.message || 'Login failed'))
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser, setLoading, setError])

  const logout = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      await authApi.logout()
      setUser(null)
    } catch (err) {
      setError(err?.message || 'Logout failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser, setLoading, setError])

  return { user, isAuthenticated, loading, error, login, logout }
}
