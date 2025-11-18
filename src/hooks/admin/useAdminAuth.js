import { useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from '../../api/auth.js'
import { auth } from '../../api/admissionFirebase.js'
import { onAuthStateChanged } from 'firebase/auth'

/**
 * Admin auth hook: tracks auth state and exposes login/logout.
 * Can be backed by Firebase, Supabase, or custom API via src/api/auth.js.
 */
export default function useAdminAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const current = authApi.getCurrentUser?.()
    if (current) setUser(current)
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null)
    })
    return () => { try { unsub && unsub() } catch (_) { /* noop */ } }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError('')
    try {
      const { user: u } = await authApi.login(email, password)
      setUser(u || null)
      return u
    } catch (err) {
      const code = err?.code || ''
      const friendly =
        code === 'auth/invalid-credential' ? 'Invalid email or password.' :
        code === 'auth/user-not-found' ? 'No admin account found for this email.' :
        code === 'auth/wrong-password' ? 'Incorrect password.' :
        code === 'auth/network-request-failed' ? 'Network error. Check connection or emulator status.' :
        err?.message || 'Login failed'
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
      await authApi.logout()
      setUser(null)
    } catch (err) {
      setError(err?.message || 'Logout failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const isAuthenticated = useMemo(() => Boolean(user), [user])

  return { user, isAuthenticated, loading, error, login, logout }
}