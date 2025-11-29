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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const categoriesCol = collection(db, 'categories')

/**
 * Upload a category icon to Firebase Storage
 * @param {File} file 
 */
export async function uploadCategoryIcon(file) {
    const storageRef = ref(storage, `categories/icons/${Date.now()}_${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    return getDownloadURL(snapshot.ref)
}

/**
 * Subscribe to all categories ordered by name
 * @param {Function} onChange - Callback with list of categories
 * @returns {Function} Unsubscribe function
 */
export function subscribeToCategories(onChange) {
    const q = query(categoriesCol, orderBy('name', 'asc'))
    return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        onChange(list)
    })
}

/**
 * Get all active categories (enabled: true)
 * Falls back to client-side filtering if composite index is missing
 */
export async function getActiveCategories() {
    try {
        // Try the optimized query with composite index
        const q = query(
            categoriesCol,
            where('enabled', '==', true),
            orderBy('name', 'asc')
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (error) {
        // If composite index is missing, fall back to fetching all and filtering client-side
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
            console.warn('Composite index missing, falling back to client-side filtering:', error)
            const q = query(categoriesCol, orderBy('name', 'asc'))
            const snapshot = await getDocs(q)
            const allCategories = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
            // Filter enabled categories client-side
            return allCategories.filter(cat => cat.enabled === true)
        }
        // Re-throw other errors
        throw error
    }
}

/**
 * Create a new category
 * @param {Object} data - { name, description, icon, enabled }
 * @param {File} iconFile - Optional icon file
 */
export async function createCategory(data, iconFile) {
    const timestamp = Timestamp.now()
    let iconUrl = data.icon || null

    if (iconFile) {
        iconUrl = await uploadCategoryIcon(iconFile)
    }

    const newCategory = {
        ...data,
        icon: iconUrl,
        createdAt: timestamp,
        updatedAt: timestamp,
        enabled: data.enabled ?? true
    }
    const docRef = await addDoc(categoriesCol, newCategory)
    return { id: docRef.id, ...newCategory }
}

/**
 * Update an existing category
 * @param {string} id 
 * @param {Object} data 
 * @param {File} iconFile - Optional new icon file
 */
export async function updateCategory(id, data, iconFile) {
    const ref = doc(categoriesCol, id)
    let updates = {
        ...data,
        updatedAt: Timestamp.now()
    }

    if (iconFile) {
        const iconUrl = await uploadCategoryIcon(iconFile)
        updates.icon = iconUrl
    }

    await updateDoc(ref, updates)
    return { id, ...updates }
}

/**
 * Delete a category
 * @param {string} id 
 */
export async function deleteCategory(id) {
    const ref = doc(categoriesCol, id)
    await deleteDoc(ref)
    return id
}

/**
 * Toggle category enabled status
 * @param {string} id 
 * @param {boolean} enabled 
 */
export async function toggleCategoryStatus(id, enabled) {
    return updateCategory(id, { enabled })
}
