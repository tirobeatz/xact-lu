"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Locale, defaultLocale, locales } from "./config"
import { getDictionary, Dictionary } from "./get-dictionary"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dictionary
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const LOCALE_STORAGE_KEY = "xact-locale"

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [dictionary, setDictionary] = useState<Dictionary>(getDictionary(defaultLocale))

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale)
      setDictionary(getDictionary(savedLocale))
      document.documentElement.lang = savedLocale
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0] as Locale
      if (locales.includes(browserLang)) {
        setLocaleState(browserLang)
        setDictionary(getDictionary(browserLang))
        document.documentElement.lang = browserLang
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    setDictionary(getDictionary(newLocale))
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
    document.documentElement.lang = newLocale
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: dictionary }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

export function useTranslations() {
  const { t } = useI18n()
  return t
}

export function useLocale() {
  const { locale, setLocale } = useI18n()
  return { locale, setLocale }
}
