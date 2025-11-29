import { db, storage } from './admissionFirebase.js'
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
    where
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const productsCol = collection(db, 'products')

/**
 * Subscribe to all products ordered by name
 * @param {Function} onChange - Callback with list of products
 * @returns {Function} Unsubscribe function
 */
export function subscribeToProducts(onChange) {
    const q = query(productsCol, orderBy('name', 'asc'))
    return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        onChange(list)
    })
}

/**
 * Upload a product image to Firebase Storage
 * @param {File} file 
 * @param {string} path - Storage path (e.g., 'products/thumbnails')
 */
export async function uploadProductImage(file, path) {
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    return getDownloadURL(snapshot.ref)
}

/**
 * Create a new product
 * @param {Object} data 
 * @param {File} thumbnailFile - Optional thumbnail file
 * @param {Array<File>} carouselFiles - Optional carousel files
 */
export async function createProduct(data, thumbnailFile, carouselFiles = []) {
    const timestamp = Timestamp.now()
    let thumbnailUrl = data.thumbnail || null
    let carouselUrls = data.carousel || []

    // Upload thumbnail if provided
    if (thumbnailFile) {
        thumbnailUrl = await uploadProductImage(thumbnailFile, 'products/thumbnails')
    }

    // Upload carousel images if provided
    if (carouselFiles.length > 0) {
        const uploadPromises = carouselFiles.map(file =>
            uploadProductImage(file, 'products/carousel')
        )
        const newUrls = await Promise.all(uploadPromises)
        carouselUrls = [...carouselUrls, ...newUrls]
    }

    const newProduct = {
        ...data,
        thumbnail: thumbnailUrl,
        carousel: carouselUrls,
        createdAt: timestamp,
        updatedAt: timestamp,
        enabled: data.enabled ?? true
    }

    const docRef = await addDoc(productsCol, newProduct)
    return { id: docRef.id, ...newProduct }
}

/**
 * Update an existing product
 * @param {string} id 
 * @param {Object} data 
 * @param {File} thumbnailFile - Optional new thumbnail
 * @param {Array<File>} carouselFiles - Optional new carousel images
 */
export async function updateProduct(id, data, thumbnailFile, carouselFiles = []) {
    const timestamp = Timestamp.now()
    let updates = { ...data, updatedAt: timestamp }

    // Upload new thumbnail if provided
    if (thumbnailFile) {
        const url = await uploadProductImage(thumbnailFile, 'products/thumbnails')
        updates.thumbnail = url
    }

    // Upload new carousel images if provided
    if (carouselFiles.length > 0) {
        const uploadPromises = carouselFiles.map(file =>
            uploadProductImage(file, 'products/carousel')
        )
        const newUrls = await Promise.all(uploadPromises)
        // Append new URLs to existing ones (handled by caller passing existing urls in data.carousel if needed, 
        // but here we assume data.carousel contains the *final* list of URLs minus the new files, so we merge)
        // Actually, simpler strategy: caller handles list merging logic. 
        // We just return the new URLs? No, we should update the doc.
        // Let's assume data.carousel contains the list of *kept* existing URLs.
        const currentCarousel = data.carousel || []
        updates.carousel = [...currentCarousel, ...newUrls]
    }

    const ref = doc(productsCol, id)
    await updateDoc(ref, updates)
    return { id, ...updates }
}

/**
 * Delete a product
 * @param {string} id 
 */
export async function deleteProduct(id) {
    const ref = doc(productsCol, id)
    await deleteDoc(ref)
    // Note: We are not automatically deleting images from storage here to avoid complexity 
    // (would need to track all URLs). In a production app, we should clean up storage.
    return id
}

/**
 * Toggle product enabled status
 * @param {string} id 
 * @param {boolean} enabled 
 */
export async function toggleProductStatus(id, enabled) {
    const ref = doc(productsCol, id)
    await updateDoc(ref, { enabled, updatedAt: Timestamp.now() })
}

/**
 * Get all enabled products (for public display)
 * @returns {Promise<Array>} List of enabled products
 */
export async function getEnabledProducts() {
    const q = query(
        productsCol,
        where('enabled', '==', true),
        orderBy('name', 'asc')
    )
    try {
        const snapshot = await getDocs(q)
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (error) {
        // If composite index is missing, fall back to client-side filtering
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
            console.warn('Composite index missing, falling back to client-side filtering')
            const allQ = query(productsCol, orderBy('name', 'asc'))
            const allSnapshot = await getDocs(allQ)
            const allProducts = allSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
            return allProducts.filter(p => p.enabled === true)
        }
        throw error
    }
}

/**
 * Subscribe to enabled products (for public display)
 * @param {Function} onChange - Callback with list of enabled products
 * @returns {Function} Unsubscribe function
 */
export function subscribeToEnabledProducts(onChange) {
    const q = query(
        productsCol,
        where('enabled', '==', true),
        orderBy('name', 'asc')
    )
    return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        onChange(list)
    }, (error) => {
        // If composite index is missing, fall back to subscribing to all and filtering
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
            console.warn('Composite index missing, falling back to client-side filtering')
            const allQ = query(productsCol, orderBy('name', 'asc'))
            return onSnapshot(allQ, (snapshot) => {
                const allProducts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
                const enabled = allProducts.filter(p => p.enabled === true)
                onChange(enabled)
            })
        }
        console.error('Error subscribing to products:', error)
    })
}

/**
 * Get a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object|null>} Product data or null if not found
 */
export async function getProduct(id) {
    const ref = doc(productsCol, id)
    const snapshot = await getDoc(ref)
    if (!snapshot.exists()) {
        return null
    }
    return { id: snapshot.id, ...snapshot.data() }
}
