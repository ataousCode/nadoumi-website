// Firebase Storage-backed documents API
import { storage } from './admissionFirebase.js'
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage'
import { setApplicationSyncedDocuments } from './applications.js'

// Normalize filenames to avoid problematic characters in storage paths
function sanitizeFilename(name = '') {
  try {
    const trimmed = String(name).trim()
    // Replace spaces with underscores and drop characters that commonly cause issues in URLs
    // Keep letters, numbers, dots, dashes, and underscores
    return trimmed
      .replace(/\s+/g, '_')
      .replace(/[^A-Za-z0-9._-]/g, '')
  } catch (_) {
    return String(name || 'document')
  }
}

// Upload with a timeout to avoid indefinite hangs; uses resumable upload under the hood
export async function uploadDocument(file, applicationId, filename, { timeoutMs = 120000, onProgress } = {}) {
  if (!file) throw new Error('File is required')
  const baseName = filename || file.name
  const safeName = sanitizeFilename(baseName)
  const path = `applications/${applicationId}/${safeName}`
  const storageRef = ref(storage, path)

  // Prefer resumable uploads to handle slow networks and provide cancellation
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type })
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      try { task.cancel() } catch (_) {}
      reject(new Error(`Upload timed out for ${file.name}`))
    }, Math.max(3000, timeoutMs))

    task.on(
      'state_changed',
      (snapshot) => {
        try {
          const pct = snapshot.totalBytes > 0 ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) : 0
          if (typeof onProgress === 'function') onProgress({ bytesTransferred: snapshot.bytesTransferred, totalBytes: snapshot.totalBytes, percent: pct, path })
        } catch (_) { /* noop */ }
      },
      (err) => {
        clearTimeout(timer)
        reject(err)
      },
      () => {
        clearTimeout(timer)
        resolve()
      }
    )
  })

  return { path }
}

export async function getDocumentUrls(application) {
  if (!application) return []
  const docs = application?.documents
  const id = application?.id || application?.docId || null

  // Extract storage paths from nested documents structure. If a saved value
  // is a raw Firebase Storage REST URL (without token), convert it to a
  // storage path (fullPath) so we can resolve a signed URL reliably.
  const paths = []
  const extractPathFromUrl = (u) => {
    try {
      const s = String(u || '')
      if (!/^https?:\/\//.test(s)) return null
      // Match .../o/<encodedPath>(?...)
      const m = s.match(/\/o\/([^?]+)(?:\?|$)/)
      if (!m || !m[1]) return null
      // Decode `%2F` etc. to build the fullPath
      const decoded = decodeURIComponent(m[1])
      return decoded || null
    } catch (_) { return null }
  }
  try {
    const collectPaths = (entry) => {
      if (!entry) return
      if (Array.isArray(entry)) {
        entry.forEach((it) => collectPaths(it))
      } else if (typeof entry === 'object') {
        if (entry.path) paths.push(entry.path)
        else Object.values(entry).forEach((v) => collectPaths(v))
      } else if (typeof entry === 'string') {
        paths.push(entry)
      }
    }
    collectPaths(docs)
    // Also scan for common fields that may store direct URLs
    const maybeUrls = []
    const collectUrls = (entry) => {
      if (!entry) return
      if (Array.isArray(entry)) entry.forEach((it) => collectUrls(it))
      else if (typeof entry === 'object') {
        if (entry.url) maybeUrls.push(entry.url)
        Object.values(entry).forEach((v) => collectUrls(v))
      } else if (typeof entry === 'string') {
        maybeUrls.push(entry)
      }
    }
    collectUrls(docs)
    for (const u of maybeUrls) {
      const p = extractPathFromUrl(u)
      if (p) paths.push(p)
    }
  } catch (_) { /* noop */ }

  let validPaths = paths.filter(Boolean)
  // Fallback: if no paths were persisted in Firestore, list the Storage folder
  if (validPaths.length === 0 && id) {
    try {
      const folderRef = ref(storage, `applications/${id}`)
      // Recursively list all items under the application folder
      const allItems = await (async function listAllDeep(r) {
        const acc = []
        const res = await listAll(r)
        acc.push(...res.items)
        if (res.prefixes && res.prefixes.length) {
          for (const pr of res.prefixes) {
            const nested = await listAllDeep(pr)
            acc.push(...nested)
          }
        }
        return acc
      })(folderRef)
      validPaths = allItems.map((it) => it.fullPath)
    } catch (_) { /* noop */ }
  }

  // If we still have nothing, try listing folders inferred from saved paths
  if (validPaths.length === 0) {
    try {
      // Build a set of prefix folders from any saved strings that look like paths
      const prefixes = new Set()
      const addPrefix = (p) => {
        if (!p || typeof p !== 'string') return
        const decoded = p.startsWith('http') ? extractPathFromUrl(p) || '' : p
        if (!decoded) return
        const parts = decoded.split('/')
        if (parts.length > 1) prefixes.add(parts.slice(0, parts.length - 1).join('/'))
      }
      // Walk documents again to collect prefixes
      const collectPrefixes = (entry) => {
        if (!entry) return
        if (Array.isArray(entry)) entry.forEach((it) => collectPrefixes(it))
        else if (typeof entry === 'object') {
          if (entry.path) addPrefix(entry.path)
          if (entry.url) addPrefix(entry.url)
          Object.values(entry).forEach((v) => collectPrefixes(v))
        } else if (typeof entry === 'string') {
          addPrefix(entry)
        }
      }
      collectPrefixes(docs)
      const discovered = []
      for (const px of prefixes) {
        try {
          const r = ref(storage, px)
          const items = await (async function listAllDeep(r2) {
            const acc = []
            const res = await listAll(r2)
            acc.push(...res.items)
            if (res.prefixes && res.prefixes.length) {
              for (const pr of res.prefixes) {
                const nested = await listAllDeep(pr)
                acc.push(...nested)
              }
            }
            return acc
          })(r)
          discovered.push(...items.map((it) => it.fullPath))
        } catch (_) { /* noop */ }
      }
      if (discovered.length) validPaths = discovered
    } catch (_) { /* noop */ }
  }
  if (validPaths.length === 0) return []

  // Helper to avoid indefinite hangs: apply a timeout per request
  const withTimeout = (promise, ms, path) => {
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve({ ok: false, path, url: null }), ms)
      promise
        .then((url) => resolve({ ok: true, path, url }))
        .catch(() => resolve({ ok: false, path, url: null }))
        .finally(() => clearTimeout(timer))
    })
  }

  // Generate filename variants to compensate for legacy mismatches
  const variantsFor = (fullPath) => {
    try {
      const s = String(fullPath || '')
      const parts = s.split('/')
      const nameEnc = parts.pop() || ''
      const base = parts.join('/')
      const name = decodeURIComponent(nameEnc)
      const out = new Set()
      const push = (n) => { if (n && n !== name) out.add(`${base}/${n}`) }
      // Core variants
      push(name.replace(/\s+/g, '_'))
      push(name.replace(/\s+/g, '-'))
      push(name.replace(/\s+/g, ''))
      push(name.replace(/[()]/g, ''))
      // Remove " (n) " patterns
      push(name.replace(/\s*\(\d+\)\s*/g, ''))
      // Convert " (n)" to "_n" and "-n"
      const m = name.match(/\((\d+)\)/)
      if (m && m[1]) {
        const d = m[1]
        push(name.replace(`(${d})`, `_${d}`))
        push(name.replace(`(${d})`, `-${d}`))
      }
      return Array.from(out)
    } catch (_) { return [] }
  }

  // Request all URLs in parallel with a reasonable timeout
  const TIMEOUT_MS = 8000
  // Try original paths plus a few filename variants for legacy uploads
  const candidatePaths = [
    ...validPaths,
    ...validPaths.flatMap((p) => variantsFor(p)),
  ]
  const tasks = candidatePaths.map((p) => withTimeout(getDownloadURL(ref(storage, p)), TIMEOUT_MS, p))
  let settled = await Promise.all(tasks)
  let successes = settled.filter((r) => r.ok && r.url)

  // If none of the saved paths resolved, fall back to listing the folder
  if (successes.length === 0 && id) {
    try {
      const folderRef = ref(storage, `applications/${id}`)
      // Recursively list all items for robust discovery
      const allItems = await (async function listAllDeep(r) {
        const acc = []
        const res = await listAll(r)
        acc.push(...res.items)
        if (res.prefixes && res.prefixes.length) {
          for (const pr of res.prefixes) {
            const nested = await listAllDeep(pr)
            acc.push(...nested)
          }
        }
        return acc
      })(folderRef)
      const listTasks = allItems.map((it) => withTimeout(getDownloadURL(it), TIMEOUT_MS, it.fullPath))
      settled = await Promise.all(listTasks)
      successes = settled.filter((r) => r.ok && r.url)
      // Persist discovered files back to Firestore for reliability
      if (successes.length > 0) {
        const entries = successes.map(({ path }) => ({
          path,
          name: String(path).split('/').pop() || 'document',
          size: '',
          type: '',
        }))
        try { await setApplicationSyncedDocuments(id, entries) } catch (_) { /* noop */ }
      }
    } catch (_) { /* noop */ }
  }

  return successes.map(({ path, url }) => ({ path, url }))
}