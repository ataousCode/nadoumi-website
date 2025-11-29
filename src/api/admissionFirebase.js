// Firebase initialization and shared instances for auth, Firestore, and Storage
// Reads config from Vite env vars: VITE_FIREBASE_*

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

function assertConfig(cfg) {
  const missing = Object.entries(cfg)
    .filter(([, v]) => !v)
    .map(([k]) => k)
  if (missing.length > 0) {
    // Provide a helpful error for missing env configuration
    throw new Error(`Missing Firebase env configuration: ${missing.join(', ')}`)
  }
}

let app
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig)
} catch (err) {
  // If initialization fails due to missing config, surface a clearer error
  assertConfig(firebaseConfig)
  throw err
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Optional: connect SDKs to local emulators when VITE_USE_EMULATORS=true
try {
  const useEmulators = String(import.meta.env.VITE_USE_EMULATORS || '').toLowerCase() === 'true'
  if (useEmulators) {
    connectAuthEmulator(auth, 'http://localhost:9099')
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectStorageEmulator(storage, 'localhost', 9199)
  }
} catch (_) { /* noop */ }

export default app