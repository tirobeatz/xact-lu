"use client"

import { useState, useRef, useEffect } from "react"
import { useLocale, locales, localeNames, localeFlags, Locale } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
        aria-label="Select language"
      >
        <span className="text-lg">{localeFlags[locale]}</span>
        <span className="hidden sm:inline text-white/80">{locale.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors ${
                locale === loc ? "bg-gray-50" : ""
              }`}
            >
              <span className="text-lg">{localeFlags[loc]}</span>
              <span className="text-sm text-gray-700">{localeNames[loc]}</span>
              {locale === loc && (
                <svg className="w-4 h-4 text-[#B8926A] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Compact version for mobile/footer
export function LanguageSwitcherCompact() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            locale === loc
              ? "bg-white text-[#1A1A1A]"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
