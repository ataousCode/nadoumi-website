import { useI18n } from '../../../i18n/LocaleProvider.jsx'

function FormSubmissionStatus({ status = 'idle', message = '', className = '' }) {
  if (status === 'idle') return null
  const { t } = useI18n()
  const tone = status === 'success' ? 'text-green-700 bg-green-50 border-green-200' : status === 'error' ? 'text-red-700 bg-red-50 border-red-200' : 'text-gray-700 bg-gray-50 border-gray-200'
  const label = status === 'success' ? t('common.status.success') : status === 'error' ? t('common.status.error') : t('common.status.submitting')
  return (
    <div className={`rounded-xl border p-4 ${tone} ${className}`} role="status" aria-live="polite">
      <div className="font-semibold">{label}</div>
      {message && <p className="mt-1 text-sm">{message}</p>}
    </div>
  )
}

export default FormSubmissionStatus