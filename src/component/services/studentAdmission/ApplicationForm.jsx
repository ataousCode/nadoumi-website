import React, { useMemo, useState } from 'react'
import useStudentAdmission from '../../../hooks/service/useStudentAdmission.js'
import useFormValidation from '../../../hooks/service/useFormValidation.js'
import useFileUpload from '../../../hooks/service/useFileUpload.js'
import FormSubmissionStatus from './FormSubmissionStatus.jsx'
import FormField from './FormField.jsx'
import FamilyMembersSection from './FamilyMembersSection.jsx'
import DocumentInput from './DocumentInput.jsx'
import FormStepNavigation from './FormStepNavigation.jsx'
import { saveApplication } from '../../../api/applications.js'
import { uploadDocument } from '../../../api/documents.js'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

function ApplicationForm({ className = '' }) {
  const { fields, documents } = useStudentAdmission()
  const [values, setValues] = useState({})
  const [status, setStatus] = useState('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [touchedFields, setTouchedFields] = useState(new Set())
  const { t } = useI18n()
  const { errors, validate, clear, clearField } = useFormValidation(fields, t)
  const { files, errors: fileErrors, setFilesFor, clearAll: clearFiles } = useFileUpload(documents)
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
    // Only show errors for fields that have been touched
    return Object.fromEntries(
      Object.entries(errors).filter(([id]) => ids.has(id) && touchedFields.has(id))
    )
  }, [errors, currentFieldIds, touchedFields])

  const onChange = (id, val) => {
    setValues((prev) => ({ ...prev, [id]: val }))
    // Mark field as touched
    setTouchedFields((prev) => new Set([...prev, id]))
    // Clear error for this field when user starts typing
    if (errors[id]) {
      clearField(id)
    }
    // Clear status message when user makes changes
    if (status === 'error') {
      setStatus('idle')
      setStatusMsg('')
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    // Reset any previous errors
    setStatus('submitting')
    setStatusMsg(t('contact.form.status.validating'))

    // Validate form fields
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

        try {
          if (def.type === 'file-multiple') {
            const arr = Array.from(selected || [])
            const uploaded = []
            for (const file of arr) {
              const safeName = `${def.id}-${file.name}`
              setStatusMsg(`${t('contact.form.status.uploading')} ${file.name} (0%) — ${completedUploads}/${totalUploads}`)

              const res = await uploadDocument(file, appId, safeName, {
                timeoutMs: 180000, // 3 minutes per file
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
              setStatusMsg(`${t('contact.form.status.uploading')} ${file.name} (0%) — ${completedUploads}/${totalUploads}`)

              const res = await uploadDocument(file, appId, safeName, {
                timeoutMs: 180000, // 3 minutes per file
                onProgress: ({ percent }) => {
                  setStatusMsg(`${t('contact.form.status.uploading')} ${file.name} (${percent}%) — ${completedUploads}/${totalUploads}`)
                },
              })

              docEntries[def.id] = { path: res.path, name: file.name, size: file.size, type: file.type }
              completedUploads += 1
              setStatusMsg(`${t('contact.form.status.uploading')} (${completedUploads}/${totalUploads})...`)
            }
          }
        } catch (uploadError) {
          console.error('Upload error for', def.id, uploadError)
          throw new Error(`Failed to upload ${def.label}: ${uploadError.message || 'Unknown error'}`)
        }
      }

      setStatusMsg(t('contact.form.status.saving'))
      const application = {
        id: appId,
        submittedAt: Date.now(),
        status: 'PENDING',
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

      // Clear all form data
      clear()
      clearFiles()
      setValues({})

      // Reset to first step
      setStep(0)
    } catch (err) {
      console.error('Submission error:', err)
      setStatus('error')
      const errorMessage = err?.message || t('contact.form.status.submitError')
      setStatusMsg(errorMessage)

      // Scroll to error message
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
    // Mark all current step fields as touched
    setTouchedFields((prev) => {
      const newTouched = new Set(prev)
      currentFieldIds.forEach(id => newTouched.add(id))
      return newTouched
    })

    // Validate only current step fields
    const { errors: allErrors } = validate(values)
    const ids = new Set(currentFieldIds)
    const stepErrors = Object.entries(allErrors).filter(([id]) => ids.has(id))

    if (stepErrors.length > 0) {
      setStatus('error')
      setStatusMsg(t('contact.form.status.error'))
      // Scroll to first error
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
                <FormField key={f.id} def={f} value={values[f.id]} onChange={onChange} error={visibleErrors[f.id]} />
              ))}
            </div>
            {sec.section === 'familyInformation' && (
              <FamilyMembersSection members={values.familyMembers || []} onChange={onChange} />
            )}
            {sec.section === 'additionalInformation' && Boolean(values.currentlyInChina) && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  def={{ id: 'presentSchoolChina', label: t('admission.form.presentSchoolChina'), type: 'text', required: false }}
                  value={values['presentSchoolChina']}
                  onChange={onChange}
                  error={errors['presentSchoolChina']}
                />
                <FormField
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
            <p className="mt-2 text-sm text-gray-600">{t('admission.uploadInstructions') || 'Upload all required documents. Files with green background are successfully uploaded.'}</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {(documents.documents || []).map((doc) => (
                <DocumentInput
                  key={doc.id}
                  doc={doc}
                  onChange={setFilesFor}
                  errors={fileErrors[doc.id]}
                  currentFiles={files[doc.id]}
                />
              ))}
            </div>
          </div>
        )}

        {status !== 'idle' && (
          <div className="sticky top-4 z-10">
            <FormSubmissionStatus status={status} message={statusMsg} />
          </div>
        )}

        <FormStepNavigation
          currentStep={step}
          totalSteps={STEP_SECTIONS.length}
          onNext={onNext}
          onPrev={onPrev}
          onSubmit={onSubmit}
          isSubmitting={status === 'submitting'}
        />
      </div>
    </form>
  )
}

export default ApplicationForm