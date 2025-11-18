import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LocaleContext = createContext({ locale: 'en', setLocale: () => {}, t: (k) => k })

const STORAGE_KEY = 'app_locale'
const SUPPORTED = ['en', 'fr', 'zh']

async function loadMessages(locale) {
  const mod = await import(`./locales/${locale}/common.json`)
  return mod.default || {}
}

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('en')
  const [messages, setMessages] = useState({})

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
    const bro = typeof navigator !== 'undefined' ? String(navigator.language || '').slice(0, 2).toLowerCase() : 'en'
    const initial = saved && SUPPORTED.includes(saved) ? saved : SUPPORTED.includes(bro) ? bro : 'en'
    setLocale(initial)
  }, [])

  useEffect(() => {
    let active = true
    ;(async () => {
      const data = await loadMessages(locale)
      if (active) setMessages(data)
    })()
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, locale)
    return () => { active = false }
  }, [locale])

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

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useI18n() {
  return useContext(LocaleContext)
}

export default LocaleProvider