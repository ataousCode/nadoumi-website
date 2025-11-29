import React from 'react'
import Card from '../../common/Card.jsx'
import { summarizeFileError } from '../../../utils/fileValidation.js'
import { useI18n } from '../../../i18n/LocaleProvider.jsx'

function DocumentInput({ doc, onChange, errors = [], currentFiles = null }) {
    const { t } = useI18n()
    const multiple = doc.type === 'file-multiple'
    const accept = doc.accept || undefined
    const helper = summarizeFileError({ maxDisplay: doc.maxFileSizeDisplay, note: doc.note })

    const hasFiles = currentFiles && (
        Array.isArray(currentFiles) ? currentFiles.length > 0 : currentFiles instanceof FileList ? currentFiles.length > 0 : !!currentFiles
    )

    const fileCount = hasFiles ? (
        Array.isArray(currentFiles) ? currentFiles.length : currentFiles instanceof FileList ? currentFiles.length : 1
    ) : 0

    return (
        <Card variant={hasFiles ? 'success' : 'default'}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-900">
                        {doc.label}{doc.required && ' *'}
                    </label>
                    {hasFiles && (
                        <div className="mt-1 flex items-center gap-2">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm font-medium text-green-700">
                                {fileCount} {fileCount === 1 ? t('admission.form.fileUploaded') || 'file uploaded' : t('admission.form.filesUploaded') || 'files uploaded'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <input
                className="mt-3 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={(e) => onChange(doc.id, e.target.files)}
            />

            {helper && <p className="mt-2 text-xs text-gray-600">{helper}</p>}

            {errors?.length > 0 && (
                <ul className="mt-3 text-sm text-red-600 space-y-1">
                    {errors.map((er, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <svg className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{er}</span>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    )
}

export default DocumentInput
