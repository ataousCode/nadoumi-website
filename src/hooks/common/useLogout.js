import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../i18n/LocaleProvider.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function useLogout(logoutFn, redirectPath = '/', loading = false) {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { success, error: showError } = useToast()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleLogout = useCallback(async () => {
    try {
      await logoutFn()
      setShowConfirm(false)
      success(t('common.toast.logoutSuccess'))
      navigate(redirectPath)
    } catch (err) {
      showError(t('common.toast.logoutError'))
    }
  }, [logoutFn, redirectPath, navigate, success, showError, t])

  return {
    showConfirm,
    setShowConfirm,
    handleLogout,
    isLoading: loading,
  }
}

