import React, { useMemo, useState } from 'react'
import useStudentAdmission from '../../../hooks/service/useStudentAdmission.js'
import useFormValidation from '../../../hooks/service/useFormValidation.js'
import useFileUpload from '../../../hooks/service/useFileUpload.js'
import Button from '../../common/Button.jsx'
import FormSubmissionStatus from './FormSubmissionStatus.jsx'
import { summarizeFileError } from '../../../utils/fileValidation.js'
import { saveApplication } from '../../../api/applications.js'
import { uploadDocument } from '../../../api/documents.js'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

function Field({ def, value, onChange, error }) {
  const { t } = useI18n()
  const base = 'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
  if (def.type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{def.label}{def.required && ' *'}</label>
        <textarea className={`${base} mt-1`} rows={4} value={value || ''} onChange={(e) => onChange(def.id, e.target.value)} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
  if (def.type === 'select') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{def.label}{def.required && ' *'}</label>
        <select className={`${base} mt-1`} value={value || ''} onChange={(e) => onChange(def.id, e.target.value)}>
          <option value="">{t('contact.form.status.select')}</option>
          {(def.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
  if (def.type === 'checkbox') {
    return (
      <div className="flex items-center gap-2">
        <input
          id={def.id}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          checked={Boolean(value)}
          onChange={(e) => onChange(def.id, e.target.checked)}
        />
        <label htmlFor={def.id} className="text-sm font-medium text-gray-700">
          {def.label}{def.required && ' *'}
        </label>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
  if (def.type === 'file') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{def.label}{def.required && ' *'}</label>
        <input
          className={`${base} mt-1`}
          type="file"
          accept={def.accept || undefined}
          onChange={(e) => onChange(def.id, e.target.files?.[0] || null)}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
  const type = ['email','tel','date','text'].includes(def.type) ? def.type : 'text'
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{def.label}{def.required && ' *'}</label>
      <input type={type} className={`${base} mt-1`} value={value || ''} onChange={(e) => onChange(def.id, e.target.value)} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

// Removed PassportPreview per request

function FamilyMembersSection({ members = [], onChange }) {
  const max = 3
  const addMember = () => {
    const next = [...members, { name: '', nationality: '', relationship: '', email: '', phone: '', jobTitle: '' }]
    onChange('familyMembers', next)
  }
  const removeMember = (index) => {
    const next = members.filter((_, i) => i !== index)
    onChange('familyMembers', next)
  }
  const updateMember = (index, field, val) => {
    const next = members.map((m, i) => (i === index ? { ...m, [field]: val } : m))
    onChange('familyMembers', next)
  }

  const base = 'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'

  return (
    <div className="mt-6 space-y-4">
      {(members || []).map((m, idx) => (
        <div key={idx} className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            className="absolute right-4 top-4 text-sm text-red-600 hover:underline"
            onClick={() => removeMember(idx)}
            aria-label={`Remove family member ${idx + 1}`}
          >
            {t('contact.form.status.remove')}
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('contact.form.status.family.name')}</label>
              <input
                type="text"
                className={`${base} mt-1`}
                value={m.name || ''}
                onChange={(e) => updateMember(idx, 'name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('contact.form.status.family.nationality')}</label>
              <input
                type="text"
                className={`${base} mt-1`}
                value={m.nationality || ''}
                onChange={(e) => updateMember(idx, 'nationality', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('contact.form.status.family.relationship')}</label>
              <input
                type="text"
                className={`${base} mt-1`}
                value={m.relationship || ''}
                onChange={(e) => updateMember(idx, 'relationship', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('contact.form.status.family.email')}</label>
              <input
                type="email"
                className={`${base} mt-1`}
                value={m.email || ''}
                onChange={(e) => updateMember(idx, 'email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('contact.form.status.family.phone')}</label>
              <input
                type="tel"
                className={`${base} mt-1`}
                value={m.phone || ''}
                onChange={(e) => updateMember(idx, 'phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('contact.form.status.family.job')}</label>
              <input
                type="text"
                className={`${base} mt-1`}
                value={m.jobTitle || ''}
                onChange={(e) => updateMember(idx, 'jobTitle', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex">
        <button
          type="button"
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
          onClick={addMember}
          disabled={(members || []).length >= max}
        >
          {t('contact.form.status.family.add')}
        </button>
      </div>
    </div>
  )
}

function DocumentInput({ doc, onChange, errors = [] }) {
  const multiple = doc.type === 'file-multiple'
  const accept = doc.accept || undefined
  const helper = summarizeFileError({ maxDisplay: doc.maxFileSizeDisplay, note: doc.note })
  return (
    <div className="rounded-xl border border-orange-100 p-6 bg-white shadow-sm">
      <label className="block text-sm font-semibold text-gray-900">{doc.label}{doc.required && ' *'}</label>
      <input
        className="mt-2"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => onChange(doc.id, e.target.files)}
      />
      {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
      {errors?.length > 0 && (
        <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
          {errors.map((er, i) => (<li key={i}>{er}</li>))}
        </ul>
      )}
    </div>
  )
}

function ApplicationForm({ className = '' }) {
  const { fields, documents } = useStudentAdmission()
  const [values, setValues] = useState({})
  const [status, setStatus] = useState('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const { t } = useI18n()
  const { errors, validate, clear } = useFormValidation(fields)
  const { files, errors: fileErrors, setFilesFor } = useFileUpload(documents)
  const [step, setStep] = useState(0)

  const STEP_SECTIONS = useMemo(() => ([
    ['personalInformation', 'addressInformation'],
    ['academicInformation', 'additionalInformation', 'familyInformation', 'educationBackground', 'workExperienceDetails'],
    ['__documents__'],
  ]), [])

  const currentFieldSections = useMemo(() => {
    const keys = new Set(STEP_SECTIONS[step])
    return (fields || []).filter((sec) => keys.has(sec.section))
  }, [fields, STEP_SECTIONS, step])

  const currentFieldIds = useMemo(() => (
    currentFieldSections.flatMap((sec) => (sec.fields || []).map((f) => f.id))
  ), [currentFieldSections])

  const visibleErrors = useMemo(() => {
    const ids = new Set(currentFieldIds)
    return Object.fromEntries(Object.entries(errors).filter(([id]) => ids.has(id)))
  }, [errors, currentFieldIds])

  const onChange = (id, val) => {
    setValues((prev) => ({ ...prev, [id]: val }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setStatusMsg(t('contact.form.status.validating'))
    const { isValid } = validate(values)
    const requiredDocs = (documents.documents || []).filter((d) => d.required)
    const missingDocs = requiredDocs.filter((d) => !files[d.id] || (Array.isArray(files[d.id]) && files[d.id].length === 0))
    if (!isValid || missingDocs.length > 0) {
      setStatus('error')
      setStatusMsg(missingDocs.length > 0 ? t('contact.form.status.missingDocs') : t('contact.form.status.error'))
      return
    }
    try {
      // Compute total uploads for progress feedback
      const docDefs = documents.documents || []
      const totalUploads = docDefs.reduce((acc, def) => {
        const selected = files[def.id]
        if (!selected) return acc
        if (def.type === 'file-multiple') return acc + (Array.isArray(selected) ? selected.length : Array.from(selected || []).length)
        return acc + (Array.isArray(selected) ? (selected[0] ? 1 : 0) : (selected ? 1 : 0))
      }, 0)
      let completedUploads = 0
      setStatusMsg(totalUploads > 0 ? `${t('contact.form.status.uploading')} (0/${totalUploads})...` : t('contact.form.status.uploading'))
      const appId = generateId(12)
      const docEntries = {}

      for (const def of docDefs) {
        const selected = files[def.id]
        if (!selected) continue
        if (def.type === 'file-multiple') {
          const arr = Array.from(selected || [])
          const uploaded = []
          for (const file of arr) {
            const safeName = `${def.id}-${file.name}`
            const res = await uploadDocument(file, appId, safeName, {
              timeoutMs: 120000,
              onProgress: ({ percent }) => {
                setStatusMsg(`${t('contact.form.status.uploading')} ${file.name} (${percent}%) — ${completedUploads}/${totalUploads}`)
              },
            })
            uploaded.push({ path: res.path, name: file.name, size: file.size, type: file.type })
            completedUploads += 1
            setStatusMsg(`${t('contact.form.status.uploading')} (${completedUploads}/${totalUploads})...`)
          }
          docEntries[def.id] = uploaded
        } else {
          const file = Array.isArray(selected) ? selected[0] : selected
          if (file) {
            const safeName = `${def.id}-${file.name}`
            const res = await uploadDocument(file, appId, safeName, {
              timeoutMs: 120000,
              onProgress: ({ percent }) => {
                setStatusMsg(`${t('contact.form.status.uploading')} ${file.name} (${percent}%) — ${completedUploads}/${totalUploads}`)
              },
            })
            docEntries[def.id] = { path: res.path, name: file.name, size: file.size, type: file.type }
            completedUploads += 1
            setStatusMsg(`${t('contact.form.status.uploading')} (${completedUploads}/${totalUploads})...`)
          }
        }
      }

      setStatusMsg(t('contact.form.status.saving'))
      const application = {
        id: appId,
        submittedAt: Date.now(),
        status: 'received',
        applicant: {
          firstName: values.firstName || '',
          lastName: values.lastName || '',
          email: values.email || '',
          phone: values.phone || '',
        },
        desiredProgram: values.desiredProgram || '',
        fields: values,
        documents: docEntries,
      }
      await saveApplication(application)

      setStatus('success')
      setStatusMsg(t('contact.form.status.submitSuccess'))
      clear()
      // Optional: reset to first step
      setStep(0)
    } catch (err) {
      setStatus('error')
      setStatusMsg(err?.message || t('contact.form.status.submitError'))
    }
  }

  function generateId(len = 12) {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
    let out = ''
    const cryptoObj = (typeof crypto !== 'undefined' && crypto.getRandomValues) ? crypto : null
    if (cryptoObj) {
      const buf = new Uint32Array(len)
      cryptoObj.getRandomValues(buf)
      for (let i = 0; i < len; i++) out += alphabet[buf[i] % alphabet.length]
      return out
    }
    for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)]
    return out
  }

  const onNext = () => {
    const { errors: nextErrors } = validate(values)
    const ids = new Set(currentFieldIds)
    const stepErrors = Object.entries(nextErrors).filter(([id]) => ids.has(id))
    if (stepErrors.length > 0) {
      setStatus('error')
      setStatusMsg(t('contact.form.status.error'))
      return
    }
    setStatus('idle')
    setStatusMsg('')
    setStep((s) => Math.min(s + 1, STEP_SECTIONS.length - 1))
  }

  const onPrev = () => {
    setStep((s) => Math.max(s - 1, 0))
  }

  return (
    <form onSubmit={onSubmit} className={`bg-white ${className}`}>
      <div className="space-y-10">
        {(currentFieldSections || []).map((sec) => (
          <div key={sec.section}>
            <h3 className="text-lg font-bold text-gray-900">{sec.title}</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {(sec.fields || []).map((f) => (
                <Field key={f.id} def={f} value={values[f.id]} onChange={onChange} error={visibleErrors[f.id]} />
              ))}
            </div>
            {/* Passport Preview removed */}
            {sec.section === 'familyInformation' && (
              <FamilyMembersSection members={values.familyMembers || []} onChange={onChange} />
            )}
            {sec.section === 'additionalInformation' && Boolean(values.currentlyInChina) && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  def={{ id: 'presentSchoolChina', label: t('admission.form.presentSchoolChina'), type: 'text', required: false }}
                  value={values['presentSchoolChina']}
                  onChange={onChange}
                  error={errors['presentSchoolChina']}
                />
                <Field
                  def={{ id: 'visaExpiryDate', label: t('admission.form.visaExpiryDate'), type: 'date', required: false }}
                  value={values['visaExpiryDate']}
                  onChange={onChange}
                  error={errors['visaExpiryDate']}
                />
              </div>
            )}
          </div>
        ))}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900">{t('admission.requiredTitle')}</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {(documents.documents || []).map((doc) => (
                <DocumentInput key={doc.id} doc={doc} onChange={setFilesFor} errors={fileErrors[doc.id]} />
              ))}
            </div>
          </div>
        )}

        <FormSubmissionStatus status={status} message={statusMsg} />

        <div className="flex justify-between">
          <Button variant="secondary" size="md" ariaLabel={t('contact.form.status.previous')} type="button" onClick={onPrev} disabled={step === 0}>
            {t('contact.form.status.previous')}
          </Button>
          {step < 2 ? (
            <Button variant="primary" size="md" ariaLabel={t('contact.form.status.next')} type="button" onClick={onNext}>
              {t('contact.form.status.next')}
            </Button>
          ) : (
            <Button variant="primary" size="md" ariaLabel={t('contact.form.status.submit')} type="submit">
              {t('contact.form.status.submit')}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}

export default ApplicationForm