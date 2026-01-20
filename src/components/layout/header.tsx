"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useI18n, locales, localeNames, localeFlags, Locale } from "@/lib/i18n"

export function Header() {
  const { data: session, status } = useSession()
  const { locale, setLocale, t } = useI18n()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = () => {
      setLangMenuOpen(false)
      setUserMenuOpen(false)
    }
    if (langMenuOpen || userMenuOpen) {
      document.addEventListener("click", handleClick)
      return () => document.removeEventListener("click", handleClick)
    }
  }, [langMenuOpen, userMenuOpen])

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-lg font-bold text-white">X</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold leading-none tracking-tight text-white">Xact</span>
                <span className="text-[9px] tracking-[0.15em] uppercase font-medium text-white/70">Luxembourg</span>
              </div>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  const userInitial = session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/80 backdrop-blur-xl border-b border-[#E8E6E3] shadow-sm"
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all ${
              scrolled
                ? "bg-gradient-to-br from-[#1A1A1A] to-[#333]"
                : "bg-white/10 backdrop-blur-sm border border-white/20"
            }`}>
              <span className="text-lg font-bold text-white">X</span>
              <div className="absolute inset-0 rounded-xl bg-[#B8926A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">X</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-semibold leading-none tracking-tight transition-colors ${
                scrolled ? "text-[#1A1A1A]" : "text-white"
              }`}>
                Xact
              </span>
              <span className={`text-[9px] tracking-[0.15em] uppercase font-medium transition-colors ${
                scrolled ? "text-[#B8926A]" : "text-white/70"
              }`}>
                Luxembourg
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center gap-1 mr-4">
              <Link href="/properties" className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                scrolled
                  ? "text-[#1A1A1A] hover:bg-[#F5F3EF]"
                  : "text-white/90 hover:bg-white/10"
              }`}>
                {t.nav.properties}
              </Link>
              <Link href="/about" className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                scrolled
                  ? "text-[#1A1A1A] hover:bg-[#F5F3EF]"
                  : "text-white/90 hover:bg-white/10"
              }`}>
                {t.nav.about}
              </Link>
              <Link href="/contact" className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                scrolled
                  ? "text-[#1A1A1A] hover:bg-[#F5F3EF]"
                  : "text-white/90 hover:bg-white/10"
              }`}>
                {t.nav.contact}
              </Link>
            </div>

            {/* Divider */}
            <div className={`w-px h-5 mx-2 transition-colors ${scrolled ? "bg-[#E8E6E3]" : "bg-white/20"}`} />

            {/* Secondary Nav */}
            <div className="flex items-center gap-1 ml-2">
              <Link href="/estimate" className={`px-3.5 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${
                scrolled
                  ? "text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F3EF]"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {t.home.estimation.badge}
              </Link>
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLangMenuOpen(!langMenuOpen)
                  setUserMenuOpen(false)
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  scrolled
                    ? "text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F3EF]"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {localeFlags[locale]} {locale.toUpperCase()}
                <svg className={`w-3 h-3 transition-transform ${langMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Language Dropdown */}
              {langMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-[#E8E6E3] overflow-hidden">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocale(loc)
                        setLangMenuOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[#F5F3EF] transition-colors ${
                        locale === loc ? "bg-[#F5F3EF]" : ""
                      }`}
                    >
                      <span className="flex items-center gap-2 text-[#1A1A1A]">
                        <span>{localeFlags[loc]}</span>
                        {localeNames[loc]}
                      </span>
                      {locale === loc && (
                        <svg className="w-4 h-4 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Section */}
            {status === "loading" ? (
              <div className="w-9 h-9 rounded-full bg-[#E8E6E3] animate-pulse" />
            ) : session ? (
              /* Logged In - User Menu */
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setUserMenuOpen(!userMenuOpen)
                    setLangMenuOpen(false)
                  }}
                  className="flex items-center gap-2"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${
                    scrolled
                      ? "bg-[#B8926A] text-white"
                      : "bg-white/20 text-white"
                  }`}>
                    {userInitial.toUpperCase()}
                  </div>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E8E6E3] overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#E8E6E3]">
                      <p className="text-sm font-medium text-[#1A1A1A]">{session.user?.name || "User"}</p>
                      <p className="text-xs text-[#6B6B6B] truncate">{session.user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F5F3EF] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {t.nav.dashboard}
                      </Link>
                      <Link
                        href="/dashboard/listings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F5F3EF] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {t.nav.properties}
                      </Link>
                      <Link
                        href="/dashboard/saved"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F5F3EF] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {t.common.save}
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F5F3EF] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-[#E8E6E3] py-1">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {t.nav.signOut}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not Logged In */
              <Link href="/login" className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                scrolled
                  ? "text-[#6B6B6B] hover:text-[#1A1A1A]"
                  : "text-white/70 hover:text-white"
              }`}>
                {t.nav.signIn}
              </Link>
            )}

            <Button className={`h-9 px-5 text-sm rounded-xl shadow-md hover:shadow-lg transition-all ${
              scrolled
                ? "bg-gradient-to-r from-[#1A1A1A] to-[#333] hover:from-[#333] hover:to-[#1A1A1A] text-white"
                : "bg-white/90 hover:bg-white text-[#1A1A1A]"
            }`} asChild>
              <Link href="/dashboard/listings/new" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.nav.listProperty}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLangMenuOpen(!langMenuOpen)
              }}
              className={`p-2 rounded-lg transition-colors ${
                scrolled
                  ? "text-[#1A1A1A] hover:bg-[#F5F3EF]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <span className="text-sm font-medium">{localeFlags[locale]} {locale.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                scrolled
                  ? "text-[#1A1A1A] hover:bg-[#F5F3EF]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Language Dropdown */}
      {langMenuOpen && (
        <div className="lg:hidden absolute top-16 right-4 w-44 bg-white rounded-xl shadow-xl border border-[#E8E6E3] overflow-hidden z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc)
                setLangMenuOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[#F5F3EF] transition-colors ${
                locale === loc ? "bg-[#F5F3EF]" : ""
              }`}
            >
              <span className="flex items-center gap-2 text-[#1A1A1A]">
                <span>{localeFlags[loc]}</span>
                {localeNames[loc]}
              </span>
              {locale === loc && (
                <svg className="w-4 h-4 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E6E3] bg-white/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6">
            {/* User Info (if logged in) */}
            {session && (
              <div className="flex items-center gap-3 px-3 py-3 mb-4 bg-[#F5F3EF] rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#B8926A] flex items-center justify-center text-white font-medium">
                  {userInitial.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">{session.user?.name || "User"}</p>
                  <p className="text-xs text-[#6B6B6B] truncate">{session.user?.email}</p>
                </div>
              </div>
            )}

            <nav className="space-y-1">
              <p className="px-3 py-2 text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">{t.home.categories.label}</p>
              <Link href="/properties" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t.nav.properties}
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {t.nav.about}
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t.nav.contact}
              </Link>
            </nav>

            {/* Dashboard Links (if logged in) */}
            {session && (
              <div className="mt-6 pt-6 border-t border-[#E8E6E3]">
                <p className="px-3 py-2 text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">{t.nav.dashboard}</p>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                  <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {t.nav.dashboard}
                </Link>
                <Link href="/dashboard/listings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                  <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {t.nav.properties}
                </Link>
                <Link href="/dashboard/saved" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                  <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {t.common.save}
                </Link>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-[#E8E6E3]">
              <p className="px-3 py-2 text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">{t.home.services.label}</p>
              <Link href="/estimate" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {t.home.estimation.button}
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-[#E8E6E3] space-y-3">
              {session ? (
                <>
                  <Button className="w-full h-11 justify-center rounded-xl bg-gradient-to-r from-[#1A1A1A] to-[#333] shadow-md" asChild>
                    <Link href="/dashboard/listings/new" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {t.nav.listProperty}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-center rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut({ callbackUrl: "/" })
                    }}
                  >
                    {t.nav.signOut}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full h-11 justify-center rounded-xl border-[#E8E6E3]" asChild>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>{t.nav.signIn}</Link>
                  </Button>
                  <Button className="w-full h-11 justify-center rounded-xl bg-gradient-to-r from-[#1A1A1A] to-[#333] shadow-md" asChild>
                    <Link href="/dashboard/listings/new" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {t.nav.listProperty}
                    </Link>
                  </Button>
                </>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-[#E8E6E3]">
              <p className="px-3 text-xs text-[#6B6B6B]">
                {t.nav.contact}? <a href="mailto:info@xact.lu" className="text-[#B8926A] hover:underline">info@xact.lu</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
