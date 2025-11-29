import React from 'react'

function Input({
    type = 'text',
    label,
    id,
    name,
    value,
    onChange,
    error,
    required = false,
    placeholder,
    options = [],
    rows = 4,
    accept,
    multiple = false,
    className = '',
    disabled = false,
    ...props
}) {
    const inputId = id || name
    const hasError = Boolean(error)

    // Auto-generate helpful placeholders
    const getPlaceholder = () => {
        if (placeholder) return placeholder
        if (type === 'date') return 'YYYY-MM-DD'
        if (type === 'email') return 'example@email.com'
        if (type === 'tel') return '+1234567890'
        if (type === 'password') return '••••••••'
        return undefined
    }

    const baseClasses = `block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${hasError
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`

    const renderInput = () => {
        switch (type) {
            case 'textarea':
                return (
                    <textarea
                        id={inputId}
                        name={name}
                        className={`${baseClasses} ${className}`}
                        rows={rows}
                        value={value || ''}
                        onChange={onChange}
                        placeholder={getPlaceholder()}
                        disabled={disabled}
                        {...props}
                    />
                )

            case 'select':
                return (
                    <select
                        id={inputId}
                        name={name}
                        className={`${baseClasses} ${className}`}
                        value={value || ''}
                        onChange={onChange}
                        disabled={disabled}
                        {...props}
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                )

            case 'checkbox':
                return (
                    <div className="flex items-center gap-2">
                        <input
                            id={inputId}
                            name={name}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            checked={Boolean(value)}
                            onChange={onChange}
                            disabled={disabled}
                            {...props}
                        />
                        {label && (
                            <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                                {label}{required && ' *'}
                            </label>
                        )}
                        {error && <p className="ml-2 text-sm text-red-600">{error}</p>}
                    </div>
                )

            case 'file':
                return (
                    <input
                        id={inputId}
                        name={name}
                        type="file"
                        className={`${baseClasses} ${className}`}
                        accept={accept}
                        multiple={multiple}
                        onChange={onChange}
                        disabled={disabled}
                        {...props}
                    />
                )

            case 'password':
            case 'email':
            case 'tel':
            case 'date':
            case 'number':
            case 'text':
            default:
                return (
                    <input
                        id={inputId}
                        name={name}
                        type={type}
                        className={`${baseClasses} ${className}`}
                        value={value || ''}
                        onChange={onChange}
                        placeholder={getPlaceholder()}
                        disabled={disabled}
                        {...props}
                    />
                )
        }
    }

    if (type === 'checkbox') {
        return renderInput()
    }

    return (
        <div>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
                    {label}{required && ' *'}
                </label>
            )}
            <div className="mt-1">
                {renderInput()}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}

export default Input
