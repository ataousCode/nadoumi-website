import React, { useEffect, useMemo, useState } from 'react'
import useDocumentPreview from '../../hooks/admin/useDocumentPreview.js'
import Loading from './Loading.jsx'
import EmptyState from './EmptyState.jsx'
import DocumentViewer from '../common/DocumentViewer.jsx'

function flattenDocs(entry, out = []) {
  if (!entry) return out
  if (Array.isArray(entry)) {
    entry.forEach((e) => {
      if (typeof e === 'string') {
        out.push({ path: e })
      } else {
        flattenDocs(e, out)
      }
    })
  } else if (typeof entry === 'object') {
    if (entry.path) {
      out.push(entry)
    } else {
      // Handle documents object with keys like passport, transcripts, etc.
      Object.entries(entry).forEach(([key, value]) => {
        if (typeof value === 'string') {
          out.push({ path: value, name: key })
        } else if (Array.isArray(value)) {
          value.forEach((v) => {
            if (typeof v === 'string') {
              out.push({ path: v, name: key })
            } else {
              flattenDocs(v, out)
            }
          })
        } else {
          flattenDocs(value, out)
        }
      })
    }
  } else if (typeof entry === 'string') {
    out.push({ path: entry })
  }
  return out
}

function nameFromPath(path = '') {
  try {
    return decodeURIComponent(path.split('/').pop() || 'document')
  } catch (_) {
    return path.split('/').pop() || 'document'
  }
}

export default function DocumentList({ application, documents, className = '' }) {
  const { urls, loading, error, loadFor } = useDocumentPreview()
  const [syncedCount, setSyncedCount] = useState(0)
  const [lastScanPrefixes, setLastScanPrefixes] = useState([])
  const [lastPathsTried, setLastPathsTried] = useState([])
  const [viewingDocument, setViewingDocument] = useState(null)

  const appId = application?.id || application?.docId || null
  const docsKey = useMemo(() => JSON.stringify(documents || application?.documents || {}), [documents, application])

  // Always call hooks before any early return to comply with Rules of Hooks
  useEffect(() => {
    const app = application || (documents ? { documents } : null)
    if (app) loadFor(app)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, docsKey])

  const metaByPath = useMemo(() => {
    const all = flattenDocs(application?.documents || documents || {})
    const map = new Map()
    all.forEach((d) => d?.path && map.set(d.path, d))
    return map
  }, [application, documents])

  const items = useMemo(() => {
    return (urls || []).map(({ path, url, type, size, name }) => {
      const meta = metaByPath.get(path) || {}
      return {
        path,
        url,
        name: name || meta.name || nameFromPath(path),
        size: size || meta.size || '',
        type: type || meta.type || getFileType(path),
      }
    })
  }, [urls, metaByPath])

  function getFileType(path) {
    if (!path) return 'Unknown'
    const ext = path.split('.').pop()?.toLowerCase()
    const typeMap = {
      'pdf': 'PDF',
      'jpg': 'Image',
      'jpeg': 'Image',
      'png': 'Image',
      'gif': 'Image',
      'webp': 'Image',
      'doc': 'Document',
      'docx': 'Document',
      'mp4': 'Video',
      'mov': 'Video',
      'avi': 'Video',
      'mkv': 'Video'
    }
    return typeMap[ext] || 'File'
  }

  function formatFileSize(bytes) {
    if (!bytes) return 'N/A'
    if (typeof bytes === 'string') return bytes
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Compute diagnostics count BEFORE any early returns to follow Rules of Hooks
  const savedPathsCount = useMemo(() => (
    flattenDocs(application?.documents || documents || {}).filter((d) => d?.path).length
  ), [application, documents])

  // Admin action: force a re-scan and show diagnostics
  const onSyncNow = async () => {
    try {
      const app = application || (documents ? { documents } : null)
      if (!app) return
      // Trigger load
      await loadFor(app)
      // Derive diagnostics from current docs
      const raw = flattenDocs(app.documents || documents || {})
      const tried = raw.map((d) => d?.path || d?.url).filter(Boolean)
      setLastPathsTried(tried)
      // Derive prefixes we likely scanned
      const prefixes = Array.from(new Set(tried.map((p) => {
        try {
          const s = String(p)
          const isUrl = /^https?:\/\//.test(s)
          if (isUrl) {
            const m = s.match(/\/o\/([^?]+)(?:\?|$)/)
            const enc = m && m[1] ? m[1] : ''
            const dec = enc ? decodeURIComponent(enc) : ''
            const parts = dec.split('/')
            return parts.length > 1 ? parts.slice(0, parts.length - 1).join('/') : dec
          }
          const parts = s.split('/')
          return parts.length > 1 ? parts.slice(0, parts.length - 1).join('/') : s
        } catch (_) { return '' }
      }).filter(Boolean)))
      setLastScanPrefixes(prefixes)
      setSyncedCount((urls || []).length)
    } catch (_) { /* noop */ }
  }

  if (loading) return <Loading label="Loading documents…" />
  if (error) return <div className="text-sm text-red-600">{error}</div>
  if (!items || items.length === 0) {
    const message = savedPathsCount > 0
      ? `Saved ${savedPathsCount} document path(s), but none could be fetched. Ensure files exist under applications/${appId}/ and admin is signed in.`
      : 'This application has no documents.'
    return (
      <EmptyState title="No documents" message={message}>
        <div className="text-xs text-gray-600 space-y-2">
          <div>
            <button type="button" onClick={onSyncNow} className="px-2 py-1 bg-indigo-600 text-white rounded-md">Sync from Storage</button>
            {syncedCount > 0 && (
              <span className="ml-2">Found {syncedCount} file(s) after sync.</span>
            )}
          </div>
          <div className="text-gray-700">
            <div>Application: <code>{appId || 'unknown'}</code></div>
          </div>
          {lastScanPrefixes.length > 0 && (
            <div>
              <div className="font-medium">Scanned prefixes:</div>
              <ul className="list-disc ml-5">
                {lastScanPrefixes.map((p) => <li key={p}><code>{p}</code></li>)}
              </ul>
            </div>
          )}
          {lastPathsTried.length > 0 && (
            <div>
              <div className="font-medium">Saved paths/urls:</div>
              <ul className="list-disc ml-5">
                {lastPathsTried.map((p, i) => <li key={`${p}-${i}`}><code>{String(p)}</code></li>)}
              </ul>
            </div>
          )}
        </div>
      </EmptyState>
    )
  }

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-md border">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">File</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Type</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Size</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((d) => (
              <tr key={d.path}>
                <td className="px-3 py-2 text-gray-900 break-words">{d.name}</td>
                <td className="px-3 py-2 text-gray-700">{d.type || 'N/A'}</td>
                <td className="px-3 py-2 text-gray-700">{formatFileSize(d.size)}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setViewingDocument(d)}
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      View Document
                    </button>
                    <span className="text-gray-300">|</span>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                      onClick={(e) => {
                        e.preventDefault()
                        setViewingDocument(d)
                      }}
                    >
                      Download
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <DocumentViewer
        isOpen={!!viewingDocument}
        onClose={() => setViewingDocument(null)}
        document={viewingDocument}
      />
    </div>
  )
}