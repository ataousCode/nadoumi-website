// Firebase Firestore-backed applications API
import { db } from './admissionFirebase.js'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'

const applicationsCol = collection(db, 'applications')

export async function listApplications() {
  const q = query(applicationsCol, orderBy('submittedAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getApplication(id) {
  if (!id) return null
  const ref = doc(applicationsCol, id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function saveApplication(app) {
  const id = app?.id || String(Date.now())
  const ref = doc(applicationsCol, id)
  await setDoc(ref, { ...app, id })
  return { id }
}

export async function updateApplicationStatus(id, status) {
  if (!id) throw new Error('Application ID is required')
  const ref = doc(applicationsCol, id)
  await updateDoc(ref, { status })
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// Persist a normalized array of document entries under documents.synced.
// Each entry should be { path, name, size, type }.
export async function setApplicationSyncedDocuments(id, entries) {
  if (!id) throw new Error('Application ID is required')
  const ref = doc(applicationsCol, id)
  // Read current to merge safely
  const snap = await getDoc(ref)
  const current = snap.exists() ? snap.data() : {}
  const nextDocs = { ...(current.documents || {}), synced: Array.isArray(entries) ? entries : [] }
  await updateDoc(ref, { documents: nextDocs })
  const updated = await getDoc(ref)
  return updated.exists() ? { id: updated.id, ...updated.data() } : null
}

export function subscribeApplications(onChange) {
  const q = query(applicationsCol, orderBy('submittedAt', 'desc'))
  const unsub = onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    try { onChange(list) } catch (_) { /* noop */ }
  })
  return unsub
}