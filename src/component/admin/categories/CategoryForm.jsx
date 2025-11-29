import React, { useState, useEffect } from 'react'
import Input from '../../common/Input.jsx'
import Button from '../../common/Button.jsx'

function CategoryForm({ initialData, onSubmit, onCancel, isSubmitting }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        enabled: true,
        icon: null // URL or File object
    })
    const [iconFile, setIconFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                enabled: initialData.enabled ?? true,
                icon: initialData.icon || null
            })
            if (initialData.icon) {
                setPreviewUrl(initialData.icon)
            }
        }
    }, [initialData])

    const handleChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setIconFile(file)
            // Create preview URL
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleRemoveIcon = () => {
        setIconFile(null)
        setPreviewUrl(null)
        setFormData(prev => ({ ...prev, icon: null }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData, iconFile)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                id="name"
                label="Category Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="e.g., Import & Export"
            />

            <Input
                id="description"
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of the category..."
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className="flex items-center gap-4">
                    {previewUrl ? (
                        <div className="relative h-16 w-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center group">
                            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={handleRemoveIcon}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                            />
                            <p className="mt-1 text-xs text-gray-500">Recommended size: 64x64px. PNG or JPG.</p>
                        </div>
                    )}
                    {previewUrl && (
                        <button
                            type="button"
                            onClick={handleRemoveIcon}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Remove Icon
                        </button>
                    )}
                </div>
            </div>

            <Input
                id="enabled"
                type="checkbox"
                label="Enable Category"
                value={formData.enabled}
                onChange={(e) => handleChange('enabled', e.target.checked)}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Category' : 'Create Category')}
                </Button>
            </div>
        </form>
    )
}

export default CategoryForm
