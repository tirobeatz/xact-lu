"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useMemo, useCallback } from "react"
import { LazyMotion, domAnimation, m } from "framer-motion"
import { Button } from "@/components/ui/button"
import { locations } from "@/lib/locations"
import { useI18n } from "@/lib/i18n"

// Simplified animations for better performance
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
}

// Format number consistently to avoid hydration mismatch
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Luxembourg banks for mortgage
const banks = [
  { name: "Select a bank", rate: 3.5 },
  { name: "BGL BNP Paribas", rate: 3.2 },
  { name: "Banque de Luxembourg", rate: 3.4 },
  { name: "Spuerkeess (BCEE)", rate: 3.1 },
  { name: "ING Luxembourg", rate: 3.5 },
  { name: "Raiffeisen", rate: 3.3 },
  { name: "BIL", rate: 3.4 },
]

interface Translations {
  en?: string
  fr?: string
  de?: string
  [key: string]: string | undefined
}

interface FeaturedProperty {
  id: string
  title: string
  slug: string
  titleTranslations?: Translations | null
  location: string
  price: number
  beds: number
  baths: number
  area: number
  image: string
  tag: string
}

interface Stats {
  activeListings: string
  propertyValue: string
  satisfiedClients: string
}

interface Categories {
  Apartments: number
  Houses: number
  Villas: number
  Land: number
  Commercial: number
  Studios: number
}

export default function HomePage() {
  const { t, locale } = useI18n()

  // Helper to get translated text
  const getTranslated = (defaultValue: string, translations?: Translations | null): string => {
    if (!translations || typeof translations !== 'object') return defaultValue
    const localeValue = translations[locale]
    if (localeValue && localeValue.trim()) return localeValue
    const enValue = translations.en
    if (enValue && enValue.trim()) return enValue
    return defaultValue
  }

  // Mortgage calculator state
  const [propertyPrice, setPropertyPrice] = useState(750000)
  const [downPayment, setDownPayment] = useState(20)
  const [loanTerm, setLoanTerm] = useState(25)
  const [selectedBank, setSelectedBank] = useState(banks[0])

  // Data states
  const [featuredProperties, setFeaturedProperties] = useState<FeaturedProperty[]>([])
  const [stats, setStats] = useState<Stats>({ activeListings: "0+", propertyValue: "€0", satisfiedClients: "98%" })
  const [categories, setCategories] = useState<Categories>({
    Apartments: 0, Houses: 0, Villas: 0, Land: 0, Commercial: 0, Studios: 0
  })
  const [loading, setLoading] = useState(true)

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch featured properties and stats in parallel
        const [propertiesRes, statsRes] = await Promise.all([
          fetch("/api/properties?featured=true&limit=3"),
          fetch("/api/stats"),
        ])

        if (propertiesRes.ok) {
          const propertiesData = await propertiesRes.json()
          setFeaturedProperties(propertiesData.properties)
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData.stats)
          setCategories(statsData.categories)
        }
      } catch (error) {
        console.error("Failed to fetch homepage data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate mortgage - memoized for performance
  const mortgageCalculation = useMemo(() => {
    const loanAmount = propertyPrice * (1 - downPayment / 100)
    const monthlyRate = selectedBank.rate / 100 / 12
    const numPayments = loanTerm * 12
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    const totalPayment = monthlyPayment * numPayments
    const totalInterest = totalPayment - loanAmount

    return {
      loanAmount,
      monthlyPayment,
      numPayments,
      totalPayment,
      totalInterest
    }
  }, [propertyPrice, downPayment, loanTerm, selectedBank.rate])

  const { loanAmount, monthlyPayment, numPayments } = mortgageCalculation

  // Memoized callbacks for mortgage calculator
  const handlePropertyPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyPrice(Number(e.target.value))
  }, [])

  const handleDownPaymentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDownPayment(Number(e.target.value))
  }, [])

  const handleLoanTermChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanTerm(Number(e.target.value))
  }, [])

  const handleBankChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const bank = banks.find(b => b.name === e.target.value)
    if (bank) setSelectedBank(bank)
  }, [])

  // Use only real properties from database
  const displayProperties = featuredProperties

  // Category data with real counts
  const categoryItems = [
    { title: t.home.categories.apartments, key: "Apartments", count: categories.Apartments || 0, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop" },
    { title: t.home.categories.houses, key: "Houses", count: categories.Houses || 0, image: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2070&auto=format&fit=crop" },
    { title: t.home.categories.land, key: "Land", count: categories.Land || 0, image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2065&auto=format&fit=crop" },
    { title: t.home.categories.commercial, key: "Commercial", count: categories.Commercial || 0, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" },
  ]

  return (
    <LazyMotion features={domAnimation}>
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1592595896616-c37162298647?q=80&w=2070&auto=format&fit=crop')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/80 via-[#1A1A1A]/60 to-[#1A1A1A]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/70 to-transparent" />

          {/* Gradient orbs - static for performance */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-[#B8926A]/20 rounded-full blur-3xl hidden md:block" />
          <div className="absolute bottom-40 left-20 w-64 h-64 bg-[#B8926A]/10 rounded-full blur-3xl hidden md:block" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <m.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl"
          >
            <m.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/90 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8926A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B8926A]"></span>
              </span>
              {t.home.badge}
            </m.div>

            <m.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold text-white leading-[1.1] tracking-tight">
              {t.home.title}
              <span className="block bg-gradient-to-r from-[#B8926A] via-[#D4AF7A] to-[#B8926A] bg-clip-text text-transparent">{t.home.titleHighlight}</span>
            </m.h1>

            <m.p variants={fadeUp} className="mt-4 md:mt-6 text-base md:text-xl text-white/60 max-w-xl leading-relaxed">
              {t.home.subtitle}
            </m.p>

            {/* Search Bar */}
            <m.div variants={fadeUp} className="mt-6 md:mt-10 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl max-w-3xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const params = new URLSearchParams()

                  const location = formData.get("location") as string
                  const type = formData.get("type") as string
                  const minBeds = formData.get("minBeds") as string
                  const maxPrice = formData.get("maxPrice") as string
                  const propertyType = formData.get("propertyType") as string
                  const minArea = formData.get("minArea") as string

                  if (location && location !== "All") params.set("location", location)
                  if (type) params.set("type", type)
                  if (minBeds) params.set("minBeds", minBeds)
                  if (maxPrice) params.set("maxPrice", maxPrice)
                  if (propertyType) params.set("propertyType", propertyType)
                  if (minArea) params.set("minArea", minArea)

                  window.location.href = `/properties${params.toString() ? `?${params.toString()}` : ""}`
                }}
                className="space-y-3"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <select name="location" className="flex-1 px-4 py-3.5 rounded-xl bg-[#F5F3EF] text-[#1A1A1A] text-sm outline-none cursor-pointer">
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc === "All" ? t.search.allLocations : loc}
                      </option>
                    ))}
                  </select>
                  <select name="type" className="px-4 py-3.5 rounded-xl bg-[#F5F3EF] text-[#1A1A1A] text-sm outline-none cursor-pointer">
                    <option value="">{t.search.buyRent}</option>
                    <option value="SALE">{t.search.buy}</option>
                    <option value="RENT">{t.search.rent}</option>
                  </select>
                  <Button type="submit" className="h-12 px-8 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-xl text-base">
                    {t.common.search}
                  </Button>
                </div>
                <div className="hidden sm:flex flex-wrap gap-3">
                  <select name="minBeds" className="px-4 py-2.5 rounded-xl bg-[#F5F3EF] text-[#1A1A1A] text-sm outline-none cursor-pointer">
                    <option value="">{t.search.bedrooms}</option>
                    <option value="1">1+ {t.common.bed}</option>
                    <option value="2">2+ {t.common.beds}</option>
                    <option value="3">3+ {t.common.beds}</option>
                    <option value="4">4+ {t.common.beds}</option>
                    <option value="5">5+ {t.common.beds}</option>
                  </select>
                  <select name="maxPrice" className="px-4 py-2.5 rounded-xl bg-[#F5F3EF] text-[#1A1A1A] text-sm outline-none cursor-pointer">
                    <option value="">{t.search.maxPrice}</option>
                    <option value="300000">€300,000</option>
                    <option value="500000">€500,000</option>
                    <option value="750000">€750,000</option>
                    <option value="1000000">€1,000,000</option>
                    <option value="1500000">€1,500,000</option>
                    <option value="2000000">€2,000,000</option>
                    <option value="3000000">€3,000,000</option>
                  </select>
                  <select name="propertyType" className="px-4 py-2.5 rounded-xl bg-[#F5F3EF] text-[#1A1A1A] text-sm outline-none cursor-pointer">
                    <option value="">{t.search.propertyType}</option>
                    <option value="Apartment">{t.home.categories.apartments}</option>
                    <option value="House">{t.home.categories.houses}</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Studio">Studio</option>
                    <option value="Duplex">Duplex</option>
                  </select>
                  <select name="minArea" className="px-4 py-2.5 rounded-xl bg-[#F5F3EF] text-[#1A1A1A] text-sm outline-none cursor-pointer">
                    <option value="">{t.search.minArea}</option>
                    <option value="50">50+ m²</option>
                    <option value="75">75+ m²</option>
                    <option value="100">100+ m²</option>
                    <option value="150">150+ m²</option>
                    <option value="200">200+ m²</option>
                    <option value="300">300+ m²</option>
                  </select>
                </div>
              </form>
            </m.div>

            {/* Stats */}
            <m.div variants={fadeUp} className="mt-10 md:mt-16 grid grid-cols-3 gap-4 md:flex md:flex-wrap md:gap-16">
              {[
                { value: stats.activeListings, label: t.home.stats.activeListings },
                { value: stats.propertyValue, label: t.home.stats.propertyValue },
                { value: stats.satisfiedClients, label: t.home.stats.satisfiedClients },
              ].map((stat) => (
                <div key={stat.label} className="relative text-center md:text-left">
                  <div className="absolute -inset-2 bg-white/5 rounded-lg blur-sm" />
                  <div className="relative">
                    <p className="text-xl sm:text-2xl md:text-4xl font-semibold text-white">{stat.value}</p>
                    <p className="text-xs md:text-sm text-white/50 mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </m.div>
          </m.div>
        </div>

        {/* Scroll Indicator - CSS animation for performance */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2 animate-bounce">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Properties - only show if there are properties */}
      {(loading || displayProperties.length > 0) && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <m.div variants={fadeUp} className="flex justify-between items-end mb-12">
                <div>
                  <span className="text-[#B8926A] font-medium text-sm tracking-wide">{t.home.featured.label}</span>
                  <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-2">
                    {t.home.featured.title}
                  </h2>
                </div>
                <Link href="/properties" className="hidden md:flex items-center gap-2 text-sm text-[#1A1A1A] hover:text-[#B8926A] transition-colors">
                  {t.common.viewAll}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </m.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  // Loading skeleton
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[4/3] rounded-2xl bg-gray-200 mb-5" />
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                      <div className="flex gap-4">
                        <div className="h-4 bg-gray-200 rounded w-16" />
                        <div className="h-4 bg-gray-200 rounded w-16" />
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </div>
                    </div>
                  ))
                ) : (
                  displayProperties.map((property) => (
                    <m.div key={property.id} variants={fadeUp}>
                      <Link href={`/properties/${property.slug}`} className="group block">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url('${property.image}')` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent" />
                          <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium text-[#1A1A1A]">
                            {property.tag}
                          </span>
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white/80 text-sm">{property.location}</p>
                            <p className="text-white text-2xl font-semibold mt-1">€{formatNumber(property.price)}</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-[#1A1A1A] group-hover:text-[#B8926A] transition-colors">
                          {getTranslated(property.title, property.titleTranslations)}
                        </h3>
                        <div className="flex gap-4 mt-3 text-sm text-[#6B6B6B]">
                          <span>{property.beds} {t.common.beds}</span>
                          <span>{property.baths} {t.common.baths}</span>
                          <span>{property.area} {t.common.area}</span>
                        </div>
                      </Link>
                    </m.div>
                  ))
                )}
              </div>
            </m.div>
          </div>
        </section>
      )}

      {/* Property Categories */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <m.div variants={fadeUp} className="text-center mb-16">
              <span className="text-[#B8926A] font-medium text-sm tracking-wide">{t.home.categories.label}</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-[#1A1A1A] mt-3">
                {t.home.categories.title}
              </h2>
            </m.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryItems.map((item) => (
                <m.div key={item.key} variants={fadeUp}>
                  <Link
                    href={`/properties?propertyType=${item.key}`}
                    className="group block relative aspect-[3/4] rounded-2xl overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-xl md:text-2xl font-semibold text-white">{item.title}</h3>
                      <p className="text-white/60 text-sm mt-1">{item.count} {t.home.categories.properties}</p>
                    </div>
                  </Link>
                </m.div>
              ))}
            </div>
          </m.div>
        </div>
      </section>


      {/* Services */}
      <section className="py-24 bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B8926A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B8926A]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <m.div variants={fadeUp} className="max-w-xl mb-16">
              <span className="text-[#B8926A] font-medium text-sm tracking-wide">{t.home.services.label}</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mt-3">
                {t.home.services.title}
              </h2>
            </m.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "🔍", title: t.home.services.advancedSearch.title, desc: t.home.services.advancedSearch.desc },
                { icon: "✓", title: t.home.services.verifiedListings.title, desc: t.home.services.verifiedListings.desc },
                { icon: "💰", title: t.home.services.freeValuation.title, desc: t.home.services.freeValuation.desc },
                { icon: "📤", title: t.home.services.easyListing.title, desc: t.home.services.easyListing.desc },
                { icon: "💬", title: t.home.services.directContact.title, desc: t.home.services.directContact.desc },
                { icon: "🏢", title: t.home.services.agencyProfiles.title, desc: t.home.services.agencyProfiles.desc },
              ].map((service, i) => (
                <m.div
                  key={i}
                  variants={fadeUp}
                  className="group p-6 rounded-2xl border border-white/10 hover:border-[#B8926A]/50 hover:bg-white/5 transition-all duration-300"
                >
                  <span className="text-3xl mb-4 block">{service.icon}</span>
                  <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-white/50 text-sm">{service.desc}</p>
                </m.div>
              ))}
            </div>
          </m.div>
        </div>
      </section>

      {/* Free Estimation CTA */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="bg-gradient-to-br from-[#B8926A] to-[#8B6E4E] rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

            <div className="relative z-10">
              <m.span variants={fadeUp} className="inline-block px-4 py-1 bg-white/20 rounded-full text-white/90 text-sm mb-6">
                {t.home.estimation.badge}
              </m.span>
              <m.h2 variants={fadeUp} className="text-3xl md:text-5xl font-semibold text-white">
                {t.home.estimation.title}
              </m.h2>
              <m.p variants={fadeUp} className="text-white/80 mt-4 text-lg max-w-xl mx-auto">
                {t.home.estimation.subtitle}
              </m.p>
              <m.div variants={fadeUp}>
                <Button className="mt-10 h-14 px-10 bg-white hover:bg-white/90 text-[#1A1A1A] rounded-xl text-lg font-medium shadow-lg" asChild>
                  <Link href="/estimate">{t.home.estimation.button}</Link>
                </Button>
              </m.div>
            </div>
          </m.div>
        </div>
      </section>

      {/* Mortgage Calculator */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23B8926A%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

        <div className="container mx-auto px-4 relative z-10">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <m.div variants={fadeUp} className="text-center mb-16">
              <span className="text-[#B8926A] font-medium text-sm tracking-wide">{t.home.mortgage.label}</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-[#1A1A1A] mt-3">
                {t.home.mortgage.title}
              </h2>
              <p className="text-[#6B6B6B] mt-4 max-w-xl mx-auto">
                {t.home.mortgage.subtitle}
              </p>
            </m.div>

            <m.div variants={fadeUp} className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2a2a2a] rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Sliders */}
                  <div className="space-y-8">
                    {/* Property Price */}
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-white/70 text-sm">{t.home.mortgage.propertyPrice}</label>
                        <span className="text-white font-semibold">€{formatNumber(propertyPrice)}</span>
                      </div>
                      <input
                        type="range"
                        min="100000"
                        max="3000000"
                        step="10000"
                        value={propertyPrice}
                        onChange={handlePropertyPriceChange}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#B8926A] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between mt-1 text-xs text-white/40">
                        <span>€100K</span>
                        <span>€3M</span>
                      </div>
                    </div>

                    {/* Down Payment */}
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-white/70 text-sm">{t.home.mortgage.downPayment}</label>
                        <span className="text-white font-semibold">{downPayment}% (€{formatNumber(Math.round(propertyPrice * downPayment / 100))})</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={downPayment}
                        onChange={handleDownPaymentChange}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#B8926A] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between mt-1 text-xs text-white/40">
                        <span>10%</span>
                        <span>50%</span>
                      </div>
                    </div>

                    {/* Loan Term */}
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-white/70 text-sm">{t.home.mortgage.loanTerm}</label>
                        <span className="text-white font-semibold">{loanTerm} {t.home.mortgage.years}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="30"
                        step="5"
                        value={loanTerm}
                        onChange={handleLoanTermChange}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#B8926A] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between mt-1 text-xs text-white/40">
                        <span>10 {t.home.mortgage.years}</span>
                        <span>30 {t.home.mortgage.years}</span>
                      </div>
                    </div>

                    {/* Bank Selection Dropdown */}
                    <div>
                      <label className="text-white/70 text-sm block mb-3">{t.home.mortgage.selectBank}</label>
                      <div className="relative">
                        <select
                          value={selectedBank.name}
                          onChange={handleBankChange}
                          className="w-full h-14 px-4 bg-white/10 border border-white/20 rounded-xl text-white outline-none cursor-pointer appearance-none hover:bg-white/15 transition-colors"
                        >
                          {banks.map((bank) => (
                            <option key={bank.name} value={bank.name} className="bg-[#1A1A1A] text-white">
                              {bank.name} {bank.name !== "Select a bank" && `— ${bank.rate}% interest`}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-white/40">
                        {t.home.mortgage.interestRate}: <span className="text-[#B8926A]">{selectedBank.rate}%</span>
                      </p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="flex flex-col justify-center">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                      <p className="text-white/50 text-sm mb-2">{t.home.mortgage.monthlyPayment}</p>
                      <p className="text-5xl md:text-6xl font-bold text-white mb-2">
                        €{formatNumber(Math.round(monthlyPayment))}
                      </p>
                      <p className="text-white/40 text-sm">{t.home.mortgage.perMonth}</p>

                      <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">{t.home.mortgage.loanAmount}</span>
                          <span className="text-white">€{formatNumber(Math.round(loanAmount))}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">{t.home.mortgage.interestRate}</span>
                          <span className="text-[#B8926A]">{selectedBank.rate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">{t.home.mortgage.totalInterest}</span>
                          <span className="text-white">€{formatNumber(Math.round(monthlyPayment * numPayments - loanAmount))}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                          <span className="text-white/50">{t.home.mortgage.totalPayment}</span>
                          <span className="text-white font-semibold">€{formatNumber(Math.round(monthlyPayment * numPayments))}</span>
                        </div>
                      </div>

                      <Button className="w-full mt-8 h-12 bg-[#B8926A] hover:bg-[#A6825C] text-white rounded-xl" asChild>
                        <Link href={`/properties?maxPrice=${propertyPrice}`}>
                          {t.home.mortgage.findProperties} €{(propertyPrice / 1000000).toFixed(1)}M
                        </Link>
                      </Button>
                    </div>

                    {/* Disclaimer */}
                    <p className="mt-4 text-xs text-white/30 text-center">
                      {t.home.mortgage.disclaimer}
                    </p>
                  </div>
                </div>
              </div>
            </m.div>
          </m.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center max-w-3xl mx-auto"
          >
            <m.h2 variants={fadeUp} className="text-3xl md:text-5xl font-semibold text-white">
              {t.home.cta.title}
            </m.h2>
            <m.p variants={fadeUp} className="text-white/60 mt-4 text-lg">
              {t.home.cta.subtitle}
            </m.p>
            <m.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="h-14 px-8 bg-[#B8926A] hover:bg-[#A6825C] text-white rounded-xl text-lg font-medium" asChild>
                <Link href="/properties">{t.home.cta.browse}</Link>
              </Button>
              <Button className="h-14 px-8 bg-transparent border border-white/20 hover:bg-white/10 text-white rounded-xl text-lg font-medium" asChild>
                <Link href="/dashboard/listings/new">{t.home.cta.submit}</Link>
              </Button>
            </m.div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  )
}
