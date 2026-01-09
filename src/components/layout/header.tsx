"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "lu", label: "LU", name: "Lëtzebuergesch" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [currentLang, setCurrentLang] = useState(languages[0])
  const [langMenuOpen, setLangMenuOpen] = useState(false)
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
    const handleClick = () => setLangMenuOpen(false)
    if (langMenuOpen) {
      document.addEventListener("click", handleClick)
      return () => document.removeEventListener("click", handleClick)
    }
  }, [langMenuOpen])

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
                Properties
              </Link>
              <Link href="/about" className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                scrolled 
                  ? "text-[#1A1A1A] hover:bg-[#F5F3EF]" 
                  : "text-white/90 hover:bg-white/10"
              }`}>
                About
              </Link>
              <Link href="/pricing" className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                scrolled 
                  ? "text-[#1A1A1A] hover:bg-[#F5F3EF]" 
                  : "text-white/90 hover:bg-white/10"
              }`}>
                Pricing
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
                Free Estimate
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
                {currentLang.label}
                <svg className={`w-3 h-3 transition-transform ${langMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Language Dropdown */}
              {langMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-[#E8E6E3] overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang)
                        setLangMenuOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[#F5F3EF] transition-colors ${
                        currentLang.code === lang.code ? "bg-[#F5F3EF]" : ""
                      }`}
                    >
                      <span className="text-[#1A1A1A]">{lang.name}</span>
                      <span className="text-[#6B6B6B] text-xs">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/login" className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              scrolled 
                ? "text-[#6B6B6B] hover:text-[#1A1A1A]" 
                : "text-white/70 hover:text-white"
            }`}>
              Sign In
            </Link>
            <Button className={`h-9 px-5 text-sm rounded-xl shadow-md hover:shadow-lg transition-all ${
              scrolled 
                ? "bg-gradient-to-r from-[#1A1A1A] to-[#333] hover:from-[#333] hover:to-[#1A1A1A] text-white" 
                : "bg-white/90 hover:bg-white text-[#1A1A1A]"
            }`} asChild>
              <Link href="/dashboard/listings/new" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Property
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
              <span className="text-sm font-medium">{currentLang.label}</span>
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
        <div className="lg:hidden absolute top-16 right-4 w-40 bg-white rounded-xl shadow-xl border border-[#E8E6E3] overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setCurrentLang(lang)
                setLangMenuOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[#F5F3EF] transition-colors ${
                currentLang.code === lang.code ? "bg-[#F5F3EF]" : ""
              }`}
            >
              <span className="text-[#1A1A1A]">{lang.name}</span>
              <span className="text-[#6B6B6B] text-xs">{lang.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E6E3] bg-white/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6">
            <nav className="space-y-1">
              <p className="px-3 py-2 text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Browse</p>
              <Link href="/properties" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                All Properties
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                About Us
              </Link>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pricing
              </Link>
            </nav>

            <div className="mt-6 pt-6 border-t border-[#E8E6E3]">
              <p className="px-3 py-2 text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Services</p>
              <Link href="/estimate" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Free Property Estimate
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-[#E8E6E3] space-y-3">
              <Button variant="outline" className="w-full h-11 justify-center rounded-xl border-[#E8E6E3]" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="w-full h-11 justify-center rounded-xl bg-gradient-to-r from-[#1A1A1A] to-[#333] shadow-md" asChild>
                <Link href="/dashboard/listings/new" className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Submit Your Property
                </Link>
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-[#E8E6E3]">
              <p className="px-3 text-xs text-[#6B6B6B]">
                Need help? <a href="mailto:info@xact.lu" className="text-[#B8926A] hover:underline">info@xact.lu</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}