"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
              <Link href="/properties?type=SALE" className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                scrolled 
                  ? "text-[#1A1A1A] hover:bg-[#F5F3EF]" 
                  : "text-white/90 hover:bg-white/10"
              }`}>
                Buy
              </Link>
              <Link href="/properties?type=RENT" className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                scrolled 
                  ? "text-[#1A1A1A] hover:bg-[#F5F3EF]" 
                  : "text-white/90 hover:bg-white/10"
              }`}>
                Rent
              </Link>
              <Link href="/properties" className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                scrolled 
                  ? "text-[#1A1A1A] hover:bg-[#F5F3EF]" 
                  : "text-white/90 hover:bg-white/10"
              }`}>
                Search
              </Link>
              <Link href="/agencies" className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${
                scrolled 
                  ? "text-[#1A1A1A] hover:bg-[#F5F3EF]" 
                  : "text-white/90 hover:bg-white/10"
              }`}>
                Agencies
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
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E6E3] bg-white/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6">
            {/* Main Navigation */}
            <nav className="space-y-1">
              <p className="px-3 py-2 text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Browse</p>
              <Link href="/properties?type=SALE" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Buy Property
              </Link>
              <Link href="/properties?type=RENT" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                Rent Property
              </Link>
              <Link href="/properties" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search All
              </Link>
              <Link href="/agencies" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Find Agencies
              </Link>
            </nav>

            {/* Services */}
            <div className="mt-6 pt-6 border-t border-[#E8E6E3]">
              <p className="px-3 py-2 text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Services</p>
              <Link href="/estimate" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Free Property Estimate
              </Link>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A] hover:bg-[#F5F3EF] rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pricing Plans
              </Link>
            </div>

            {/* Actions */}
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

            {/* Contact */}
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