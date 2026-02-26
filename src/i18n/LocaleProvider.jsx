import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LocaleContext = createContext({ locale: 'en', setLocale: () => {}, t: (k) => k })

const STORAGE_KEY = 'app_locale'
const SUPPORTED = ['en', 'fr', 'zh']

function detectLocale() {
  const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
  if (saved && SUPPORTED.includes(saved)) return saved
  const bro = typeof navigator !== 'undefined' ? String(navigator.language || '').slice(0, 2).toLowerCase() : 'en'
  return SUPPORTED.includes(bro) ? bro : 'en'
}

async function loadMessages(locale) {
  const mod = await import(`./locales/${locale}/common.json`)
  return mod.default || {}
}

export function LocaleProvider({ children }) {
  // Detect locale synchronously on first render — eliminates the double-render flash
  const [locale, setLocale] = useState(detectLocale)
  const [messages, setMessages] = useState({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    loadMessages(locale).then(data => {
      if (active) {
        setMessages(data)
        setReady(true)
      }
    })
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, locale)
    return () => { active = false }
  }, [locale])

  // Show nothing until the first locale chunk is loaded to avoid flashing raw keys
  // NOTE: useMemo must be declared BEFORE any conditional return (Rules of Hooks)
  const t = useMemo(() => {
    return (key) => {
      if (!key) return ''
      // Support both nested paths and dotted top-level keys (e.g., "services.faq")
      const direct = messages[key]
      if (typeof direct === 'string') return direct
      const segs = key.split('.')
      // Standard nested traversal
      let acc = messages
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i]
        if (acc && acc[s] != null) {
          acc = acc[s]
          continue
        }
        // Fallback: treat the remainder as a single property name containing dots
        const remainder = segs.slice(i).join('.')
        if (acc && acc[remainder] != null) {
          acc = acc[remainder]
          break
        }
        acc = undefined
        break
      }
      if (typeof acc === 'string') return acc
      // Fallback for objects stored under dotted top-level keys like "about.values" with nested children
      const [head, ...rest] = segs
      const dottedRoot = messages[`${head}.${rest[0] || ''}`]
      if (dottedRoot) {
        const leaf = rest.slice(1).reduce((a, k) => (a && a[k] != null ? a[k] : undefined), dottedRoot)
        if (typeof leaf === 'string') return leaf
      }
      return key
    }
  }, [messages])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  if (!ready) return null

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useI18n() {
  return useContext(LocaleContext)
}

export default LocaleProvider