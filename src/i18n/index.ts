import { useCallback } from 'react'
import type { Locale } from './translations'
import { translations, LOCALE_NAMES } from './translations'

const LOCALE_KEY = 'ai-tab-locale'

function detectLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_KEY)
  if (stored && stored in translations) return stored as Locale

  const nav = navigator.language || 'en'
  if (nav.startsWith('zh-TW') || nav.startsWith('zh-HK')) return 'zh-TW'
  if (nav.startsWith('zh')) return 'zh-CN'
  return 'en'
}

let currentLocale: Locale = detectLocale()
let listeners: Set<() => void> = new Set()

export function getLocale(): Locale {
  return currentLocale
}

export function setLocale(locale: Locale): void {
  currentLocale = locale
  localStorage.setItem(LOCALE_KEY, locale)
  listeners.forEach((fn) => fn())
  // Also update HTML lang attribute
  document.documentElement.lang = locale
}

export function t(key: keyof typeof translations.en, params?: Record<string, string | number>): string {
  const t = translations[currentLocale] ?? translations.en
  let str = t[key] ?? translations.en[key] ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v))
    }
  }
  return str
}

export function useLocale(): Locale {
  const [locale, setLocaleState] = React.useState<Locale>(currentLocale)

  React.useEffect(() => {
    const listener = () => setLocaleState(getLocale())
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  return locale
}

export function useI18n() {
  const locale = useLocale()

  const changeLocale = useCallback((locale: Locale) => {
    setLocale(locale)
  }, [])

  const tFn = useCallback(
    (key: keyof typeof translations.en, params?: Record<string, string | number>) => {
      return t(key, params)
    },
    [locale]
  )

  return { locale, t: tFn, changeLocale, LOCALE_NAMES }
}

// React import - lazy to avoid circular deps
import * as React from 'react'
