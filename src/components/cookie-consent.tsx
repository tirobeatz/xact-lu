"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

const COOKIE_CONSENT_KEY = "xact-cookie-consent"

interface CookiePreferences {
  essential: boolean
  functional: boolean
  analytics: boolean
}

export function CookieConsent() {
  const { t } = useI18n()
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    functional: true,
    analytics: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Small delay to prevent flash on page load
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs))
    setShowBanner(false)
    setShowSettings(false)

    // Here you would typically initialize or disable analytics based on preferences
    if (prefs.analytics) {
      // Initialize Google Analytics or other analytics
      console.log("Analytics enabled")
    }
  }

  const acceptAll = () => {
    const allAccepted = { essential: true, functional: true, analytics: true }
    setPreferences(allAccepted)
    saveConsent(allAccepted)
  }

  const acceptEssential = () => {
    const essentialOnly = { essential: true, functional: false, analytics: false }
    setPreferences(essentialOnly)
    saveConsent(essentialOnly)
  }

  const savePreferences = () => {
    saveConsent(preferences)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl shadow-2xl border border-[#E8E6E3] overflow-hidden">
              {!showSettings ? (
                // Main Banner
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F5F3EF] flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                        {t.cookies?.title || "We use cookies"}
                      </h3>
                      <p className="text-[#6B6B6B] text-sm leading-relaxed">
                        {t.cookies?.description || "We use cookies to improve your experience, analyze site traffic, and personalize content. By clicking \"Accept All\", you consent to our use of cookies."}{" "}
                        <Link href="/legal/cookies" className="text-[#B8926A] hover:underline">
                          {t.cookies?.learnMore || "Learn more"}
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
                    <Button
                      onClick={acceptAll}
                      className="h-11 px-6 rounded-xl bg-[#1A1A1A] hover:bg-[#333] text-white"
                    >
                      {t.cookies?.acceptAll || "Accept All"}
                    </Button>
                    <Button
                      onClick={acceptEssential}
                      variant="outline"
                      className="h-11 px-6 rounded-xl border-[#E8E6E3]"
                    >
                      {t.cookies?.essentialOnly || "Essential Only"}
                    </Button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors underline"
                    >
                      {t.cookies?.customize || "Customize"}
                    </button>
                  </div>
                </div>
              ) : (
                // Settings Panel
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">
                      {t.cookies?.settings || "Cookie Settings"}
                    </h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Essential Cookies */}
                    <div className="flex items-start justify-between p-4 bg-[#F5F3EF] rounded-xl">
                      <div className="flex-1 pr-4">
                        <p className="font-medium text-[#1A1A1A]">
                          {t.cookies?.essential?.title || "Essential Cookies"}
                        </p>
                        <p className="text-sm text-[#6B6B6B] mt-1">
                          {t.cookies?.essential?.description || "Required for the website to function. Cannot be disabled."}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-6 bg-[#B8926A] rounded-full flex items-center justify-end px-1 opacity-50 cursor-not-allowed">
                          <div className="w-4 h-4 bg-white rounded-full shadow" />
                        </div>
                      </div>
                    </div>

                    {/* Functional Cookies */}
                    <div className="flex items-start justify-between p-4 border border-[#E8E6E3] rounded-xl">
                      <div className="flex-1 pr-4">
                        <p className="font-medium text-[#1A1A1A]">
                          {t.cookies?.functional?.title || "Functional Cookies"}
                        </p>
                        <p className="text-sm text-[#6B6B6B] mt-1">
                          {t.cookies?.functional?.description || "Enable personalized features and remember your preferences."}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => setPreferences(prev => ({ ...prev, functional: !prev.functional }))}
                          className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                            preferences.functional ? "bg-[#B8926A] justify-end" : "bg-[#E8E6E3] justify-start"
                          }`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full shadow" />
                        </button>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-start justify-between p-4 border border-[#E8E6E3] rounded-xl">
                      <div className="flex-1 pr-4">
                        <p className="font-medium text-[#1A1A1A]">
                          {t.cookies?.analytics?.title || "Analytics Cookies"}
                        </p>
                        <p className="text-sm text-[#6B6B6B] mt-1">
                          {t.cookies?.analytics?.description || "Help us understand how visitors interact with our website."}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                          className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                            preferences.analytics ? "bg-[#B8926A] justify-end" : "bg-[#E8E6E3] justify-start"
                          }`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full shadow" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button
                      onClick={savePreferences}
                      className="h-11 px-6 rounded-xl bg-[#1A1A1A] hover:bg-[#333] text-white"
                    >
                      {t.cookies?.savePreferences || "Save Preferences"}
                    </Button>
                    <Button
                      onClick={acceptAll}
                      variant="outline"
                      className="h-11 px-6 rounded-xl border-[#E8E6E3]"
                    >
                      {t.cookies?.acceptAll || "Accept All"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
