import React from 'react'
import Input from '../../common/Input.jsx'

function FormField({ def, value, onChange, error }) {
    const handleChange = (e) => {
        if (def.type === 'checkbox') {
            onChange(def.id, e.target.checked)
        } else if (def.type === 'file') {
            onChange(def.id, e.target.files?.[0] || null)
        } else {
            onChange(def.id, e.target.value)
        }
    }

    // Support all standard input types
    const validTypes = ['email', 'tel', 'date', 'text', 'textarea', 'select', 'checkbox', 'file', 'password', 'number']
    const inputType = validTypes.includes(def.type) ? def.type : 'text'

    return (
        <Input
            type={inputType}
            id={def.id}
            name={def.id}
            label={def.label}
            value={value}
            onChange={handleChange}
            error={error}
            required={def.required}
            options={def.options}
            accept={def.accept}
            placeholder={def.placeholder}
        />
    )
}

export default FormField
