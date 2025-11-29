import React, { useState, useEffect } from 'react'
import Input from '../../common/Input.jsx'
import Button from '../../common/Button.jsx'
import { getActiveCategories } from '../../../api/categories.js'

function ProductForm({ initialData, onSubmit, onCancel, isSubmitting }) {
    const [formData, setFormData] = useState({
        name: '',
        keywords: '',
        categoryId: '',
        price: '',
        discount: '',
        originalPrice: '',
        inStock: true,
        reservationTime: '',
        weight: '',
        details: '',
        thumbnail: null, // URL or File
        carousel: [] // Array of URLs or Files
    })

    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [categoriesError, setCategoriesError] = useState(null)
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [carouselFiles, setCarouselFiles] = useState([])
    const [thumbnailPreview, setThumbnailPreview] = useState(null)
    const [carouselPreviews, setCarouselPreviews] = useState([])

    // Fetch categories
    useEffect(() => {
        setCategoriesLoading(true)
        setCategoriesError(null)
        getActiveCategories()
            .then((cats) => {
                setCategories(cats || [])
                setCategoriesError(null)
            })
            .catch((error) => {
                console.error('Failed to fetch categories:', error)
                setCategoriesError('Failed to load categories. Please refresh the page.')
                setCategories([])
            })
            .finally(() => {
                setCategoriesLoading(false)
            })
    }, [])

    // Initialize form data
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                keywords: initialData.keywords || '',
                categoryId: initialData.categoryId || '',
                price: initialData.price || '',
                discount: initialData.discount || '',
                originalPrice: initialData.originalPrice || '',
                inStock: initialData.inStock ?? true,
                reservationTime: initialData.reservationTime || '',
                weight: initialData.weight || '',
                details: initialData.details || '',
                thumbnail: initialData.thumbnail || null,
                carousel: initialData.carousel || []
            })
            if (initialData.thumbnail) setThumbnailPreview(initialData.thumbnail)
            if (initialData.carousel) setCarouselPreviews(initialData.carousel)
        }
    }, [initialData])

    // Auto-calculate Original Price
    useEffect(() => {
        const price = parseFloat(formData.price)
        const discount = parseFloat(formData.discount)

        if (!isNaN(price) && !isNaN(discount) && discount > 0 && discount < 100) {
            const original = price / (1 - discount / 100)
            setFormData(prev => ({ ...prev, originalPrice: original.toFixed(2) }))
        } else if (!isNaN(price) && (!formData.discount || formData.discount === '0')) {
            setFormData(prev => ({ ...prev, originalPrice: price.toFixed(2) }))
        }
    }, [formData.price, formData.discount])

    const handleChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setThumbnailFile(file)
            setThumbnailPreview(URL.createObjectURL(file))
        }
    }

    const handleCarouselChange = (e) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            // Append new files
            setCarouselFiles(prev => [...prev, ...files])
            // Append new previews
            const newPreviews = files.map(f => URL.createObjectURL(f))
            setCarouselPreviews(prev => [...prev, ...newPreviews])
        }
    }

    const handleRemoveThumbnail = () => {
        setThumbnailFile(null)
        setThumbnailPreview(null)
        setFormData(prev => ({ ...prev, thumbnail: null }))
    }

    const handleRemoveCarouselImage = (index) => {
        // Remove from previews
        const newPreviews = [...carouselPreviews]
        newPreviews.splice(index, 1)
        setCarouselPreviews(newPreviews)

        // Remove from files if it was a new file
        // This is imperfect as we don't track which preview maps to which file index exactly
        // But for MVP, we can just remove the corresponding index if we assume append order
        // A better way is to rebuild the files list.
        // Let's just update the formData.carousel if it was a URL
        // If it was a file, we need to remove it from carouselFiles.

        // Simplified logic:
        // We have `carouselPreviews` which mixes URLs and Blob URLs.
        // We have `carouselFiles` which are just the new files.
        // We have `formData.carousel` which are the existing URLs.

        // Let's reconstruct.
        // If we remove an item at index `i`:
        // Is it an existing URL or a new file?

        // Let's assume `formData.carousel` items come first in `carouselPreviews`.
        const existingCount = formData.carousel?.length || 0

        if (index < existingCount) {
            // It's an existing URL
            const newExisting = [...formData.carousel]
            newExisting.splice(index, 1)
            setFormData(prev => ({ ...prev, carousel: newExisting }))
        } else {
            // It's a new file
            const fileIndex = index - existingCount
            const newFiles = [...carouselFiles]
            newFiles.splice(fileIndex, 1)
            setCarouselFiles(newFiles)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData, thumbnailFile, carouselFiles)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    id="name"
                    label="Product Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                />
                <div>
                    <Input
                        id="categoryId"
                        type="select"
                        label="Category"
                        value={formData.categoryId}
                        onChange={(e) => handleChange('categoryId', e.target.value)}
                        required
                        disabled={categoriesLoading}
                        options={[
                            { value: '', label: categoriesLoading ? 'Loading categories...' : categories.length === 0 ? 'No categories available' : 'Select Category' },
                            ...categories.map(c => ({ value: c.id, label: c.name }))
                        ]}
                    />
                    {categoriesError && (
                        <p className="mt-1 text-sm text-red-600">{categoriesError}</p>
                    )}
                    {!categoriesLoading && categories.length === 0 && !categoriesError && (
                        <p className="mt-1 text-sm text-amber-600">
                            No active categories found. Please create a category first.
                        </p>
                    )}
                </div>
            </div>

            <Input
                id="keywords"
                label="Search Keywords"
                value={formData.keywords}
                onChange={(e) => handleChange('keywords', e.target.value)}
                placeholder="Comma separated keywords"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                    id="price"
                    type="number"
                    label="Price (Selling)"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    required
                    min="0"
                    step="0.01"
                />
                <Input
                    id="discount"
                    type="number"
                    label="Discount (%)"
                    value={formData.discount}
                    onChange={(e) => handleChange('discount', e.target.value)}
                    min="0"
                    max="100"
                />
                <Input
                    id="originalPrice"
                    type="number"
                    label="Original Price (Auto)"
                    value={formData.originalPrice}
                    disabled
                    className="bg-gray-50"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                    id="inStock"
                    type="select"
                    label="In Stock"
                    value={formData.inStock ? 'true' : 'false'}
                    onChange={(e) => handleChange('inStock', e.target.value === 'true')}
                    options={[
                        { value: 'true', label: 'Yes' },
                        { value: 'false', label: 'No' }
                    ]}
                />
                <Input
                    id="reservationTime"
                    label="Reservation Arrival Time"
                    value={formData.reservationTime}
                    onChange={(e) => handleChange('reservationTime', e.target.value)}
                    placeholder="e.g., 2 weeks"
                />
                <Input
                    id="weight"
                    label="Weight"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    placeholder="e.g., 1.5 kg"
                />
            </div>

            {/* Thumbnail Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail (First Image)</label>
                <div className="flex items-center gap-4">
                    {thumbnailPreview ? (
                        <div className="relative h-20 w-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 group">
                            <img src={thumbnailPreview} alt="Thumbnail" className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={handleRemoveThumbnail}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        />
                    )}
                    {thumbnailPreview && (
                        <button
                            type="button"
                            onClick={handleRemoveThumbnail}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>

            {/* Carousel Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carousel Images (Max 5)</label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                    {carouselPreviews.map((url, idx) => (
                        <div key={idx} className="h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 relative group">
                            <img src={url} alt={`Carousel ${idx}`} className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemoveCarouselImage(idx)}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    {carouselPreviews.length < 5 && (
                        <label className="h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleCarouselChange}
                                className="hidden"
                            />
                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </label>
                    )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Select multiple images to add to carousel.</p>
            </div>

            <Input
                id="details"
                type="textarea"
                label="Product Details"
                value={formData.details}
                onChange={(e) => handleChange('details', e.target.value)}
                rows={6}
                placeholder="Detailed description of the product..."
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
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
                </Button>
            </div>
        </form>
    )
}

export default ProductForm
