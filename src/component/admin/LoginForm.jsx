import React, { useState } from 'react'
import useAdminAuth from '../../hooks/admin/useAdminAuth.js'
import { useToast } from '../../context/ToastContext.jsx'
import { useI18n } from '../../i18n/LocaleProvider.jsx'

export default function LoginForm({ onSuccess }) {
  const { login, loading, error: authError } = useAdminAuth()
  const { success, error: showError } = useToast()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const u = await login(email, password)
      if (onSuccess && u) {
        success(t('common.toast.loginSuccess'))
        onSuccess(u)
      }
    } catch (err) {
      showError(t('common.toast.loginError'))
    }
  }

  const usingEmulators = String(import.meta.env.VITE_USE_EMULATORS || '').toLowerCase() === 'true'

  return (
    <form onSubmit={onSubmit} className="max-w-sm space-y-4">
      {authError && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {authError}
        </div>
      )}
      {usingEmulators && (
        <div className="rounded-md border border-orange-200 bg-orange-50 text-orange-700 px-3 py-2 text-xs">
          Using Firebase Emulators (Auth/Firestore/Storage)
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input className="mt-1 w-full border rounded-md px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input className="mt-1 w-full border rounded-md px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}