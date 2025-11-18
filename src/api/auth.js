// Firebase-backed auth API for admin section
import { auth } from './admissionFirebase.js'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

export function getCurrentUser() {
  return auth.currentUser || null
}

export async function login(email, password) {
  if (!email || !password) throw new Error('Email and password are required')
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return { user: cred.user }
}

export async function logout() {
  await signOut(auth)
}