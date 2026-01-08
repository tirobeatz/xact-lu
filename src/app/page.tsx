"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
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

export default function HomePage() {
  // Mortgage calculator state
  const [propertyPrice, setPropertyPrice] = useState(750000)
  const [downPayment, setDownPayment] = useState(20)
  const [loanTerm, setLoanTerm] = useState(25)
  const [selectedBank, setSelectedBank] = useState(banks[0])

  // Calculate mortgage
  const loanAmount = propertyPrice * (1 - downPayment / 100)
  const monthlyRate = selectedBank.rate / 100 / 12
  const numPayments = loanTerm * 12
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/80 via-[#1A1A1A]/60 to-[#1A1A1A]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/70 to-transparent" />
          
          {/* Animated gradient orbs */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-[#B8926A]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 left-20 w-96 h-96 bg-[#B8926A]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/90 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8926A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B8926A]"></span>
              </span>
              Luxembourg&apos;s Premium Real Estate Platform
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] tracking-tight">
              Discover your
              <span className="block bg-gradient-to-r from-[#B8926A] via-[#D4AF7A] to-[#B8926A] bg-clip-text text-transparent">dream home.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="mt-6 text-xl text-white/60 max-w-xl leading-relaxed">
              Exceptional properties across Luxembourg. Buy, rent, or list with the platform trusted by thousands.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={fadeUp} className="mt-10 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 px-4 bg-[#F5F3EF] rounded-xl">
                  <svg className="w-5 h-5 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Where do you want to live?"
                    className="flex-1 py-3.5 bg-transparent outline-none text-[#1A1A1A] placeholder:text-[#6B6B6B]/60"
                  />
                </div>
                <select className="px-4 py-3.5 rounded-xl bg-[#F5F3EF] text-[#1A1A1A] text-sm outline-none cursor-pointer">
                  <option value="">Buy / Rent</option>
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                </select>
                <Button className="h-12 px-8 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-xl text-base">
                  Search
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="mt-16 flex flex-wrap gap-8 md:gap-16">
              {[
                { value: "2,500+", label: "Active Listings" },
                { value: "€2.1B", label: "Property Value" },
                { value: "98%", label: "Satisfied Clients" },
              ].map((stat) => (
                <div key={stat.label} className="relative">
                  <div className="absolute -inset-2 bg-white/5 rounded-lg blur-sm" />
                  <div className="relative">
                    <p className="text-3xl md:text-4xl font-semibold text-white">{stat.value}</p>
                    <p className="text-sm text-white/50 mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Live Market Ticker */}
      <div className="bg-[#1A1A1A] border-y border-white/10 py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          {[
            "🏠 New: 3BR Apartment in Kirchberg • €850,000",
            "🔥 Just Listed: Villa in Limpertsberg • €2,100,000",
            "⭐ Featured: Penthouse in Belair • €1,950,000",
            "🏢 New: Office Space in Gasperich • €450,000",
            "🏠 Price Drop: House in Strassen • €980,000",
            "🔥 Hot: Studio in Bonnevoie • €320,000",
          ].map((item, i) => (
            <span key={i} className="text-sm text-white/60 flex items-center gap-2">
              {item}
              <span className="text-[#B8926A]">•</span>
            </span>
          ))}
          {[
            "🏠 New: 3BR Apartment in Kirchberg • €850,000",
            "🔥 Just Listed: Villa in Limpertsberg • €2,100,000",
            "⭐ Featured: Penthouse in Belair • €1,950,000",
            "🏢 New: Office Space in Gasperich • €450,000",
            "🏠 Price Drop: House in Strassen • €980,000",
            "🔥 Hot: Studio in Bonnevoie • €320,000",
          ].map((item, i) => (
            <span key={`dup-${i}`} className="text-sm text-white/60 flex items-center gap-2">
              {item}
              <span className="text-[#B8926A]">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Property Categories */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-[#B8926A] font-medium text-sm tracking-wide">BROWSE</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-[#1A1A1A] mt-3">
                Find your perfect match
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { title: "Apartments", count: "1,240", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop" },
                { title: "Houses", count: "856", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop" },
                { title: "Land", count: "198", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2032&auto=format&fit=crop" },
                { title: "Commercial", count: "324", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp}>
                  <Link
                    href={`/properties?type=${item.title.toUpperCase()}`}
                    className="group block relative aspect-[3/4] rounded-2xl overflow-hidden"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-xl md:text-2xl font-semibold text-white">{item.title}</h3>
                      <p className="text-white/60 text-sm mt-1">{item.count} properties</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex justify-between items-end mb-12">
              <div>
                <span className="text-[#B8926A] font-medium text-sm tracking-wide">FEATURED</span>
                <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-2">
                  Exceptional properties
                </h2>
              </div>
              <Link href="/properties" className="hidden md:flex items-center gap-2 text-sm text-[#1A1A1A] hover:text-[#B8926A] transition-colors">
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  title: "Modern Villa with Pool", 
                  location: "Kirchberg",
                  price: "€2,850,000", 
                  beds: 5, 
                  baths: 4, 
                  area: "420",
                  image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
                  tag: "Featured"
                },
                { 
                  title: "Penthouse with Skyline View", 
                  location: "Belair",
                  price: "€1,950,000", 
                  beds: 3, 
                  baths: 2, 
                  area: "185",
                  image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
                  tag: "New"
                },
                { 
                  title: "Charming Family Home", 
                  location: "Limpertsberg",
                  price: "€1,450,000", 
                  beds: 4, 
                  baths: 3, 
                  area: "280",
                  image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
                  tag: "Exclusive"
                },
              ].map((property, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <Link href={`/properties/${i}`} className="group block">
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
                        <p className="text-white text-2xl font-semibold mt-1">{property.price}</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-[#1A1A1A] group-hover:text-[#B8926A] transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex gap-4 mt-3 text-sm text-[#6B6B6B]">
                      <span>{property.beds} beds</span>
                      <span>{property.baths} baths</span>
                      <span>{property.area} m²</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B8926A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B8926A]/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="max-w-xl mb-16">
              <span className="text-[#B8926A] font-medium text-sm tracking-wide">WHY XACT</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mt-3">
                The smarter way to find property
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "🔍", title: "Advanced Search", desc: "Filter by 20+ criteria to find your perfect property." },
                { icon: "✓", title: "Verified Listings", desc: "Every property is reviewed before publication." },
                { icon: "💰", title: "Free Valuation", desc: "Get a professional estimate — completely free." },
                { icon: "📤", title: "Easy Listing", desc: "Upload your property in minutes." },
                { icon: "💬", title: "Direct Contact", desc: "Message sellers and agents directly." },
                { icon: "🏢", title: "Agency Profiles", desc: "Dedicated pages for verified partners." },
              ].map((service, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeUp}
                  className="group p-6 rounded-2xl border border-white/10 hover:border-[#B8926A]/50 hover:bg-white/5 transition-all duration-300"
                >
                  <span className="text-3xl mb-4 block">{service.icon}</span>
                  <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-white/50 text-sm">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Free Estimation CTA */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="bg-gradient-to-br from-[#B8926A] to-[#8B6E4E] rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
            
            <div className="relative z-10">
              <motion.span variants={fadeUp} className="inline-block px-4 py-1 bg-white/20 rounded-full text-white/90 text-sm mb-6">
                Free Service
              </motion.span>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-semibold text-white">
                What&apos;s your property worth?
              </motion.h2>
              <motion.p variants={fadeUp} className="text-white/80 mt-4 text-lg max-w-xl mx-auto">
                Get a professional valuation from our expert team — completely free, no obligations.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Button className="mt-10 h-14 px-10 bg-white hover:bg-white/90 text-[#1A1A1A] rounded-xl text-lg font-medium shadow-lg" asChild>
                  <Link href="/estimate">Request Free Estimation</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mortgage Calculator */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23B8926A%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-[#B8926A] font-medium text-sm tracking-wide">FINANCIAL TOOLS</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-[#1A1A1A] mt-3">
                Mortgage Calculator
              </h2>
              <p className="text-[#6B6B6B] mt-4 max-w-xl mx-auto">
                Plan your purchase with our interactive calculator. Compare rates from Luxembourg banks.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2a2a2a] rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Sliders */}
                  <div className="space-y-8">
                    {/* Property Price */}
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-white/70 text-sm">Property Price</label>
                        <span className="text-white font-semibold">€{propertyPrice.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="100000"
                        max="3000000"
                        step="10000"
                        value={propertyPrice}
                        onChange={(e) => setPropertyPrice(Number(e.target.value))}
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
                        <label className="text-white/70 text-sm">Down Payment</label>
                        <span className="text-white font-semibold">{downPayment}% (€{(propertyPrice * downPayment / 100).toLocaleString()})</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
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
                        <label className="text-white/70 text-sm">Loan Term</label>
                        <span className="text-white font-semibold">{loanTerm} years</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="30"
                        step="5"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#B8926A] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between mt-1 text-xs text-white/40">
                        <span>10 yrs</span>
                        <span>30 yrs</span>
                      </div>
                    </div>

                    {/* Bank Selection Dropdown */}
                    <div>
                      <label className="text-white/70 text-sm block mb-3">Select Your Bank</label>
                      <div className="relative">
                        <select
                          value={selectedBank.name}
                          onChange={(e) => {
                            const bank = banks.find(b => b.name === e.target.value)
                            if (bank) setSelectedBank(bank)
                          }}
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
                        Current rate: <span className="text-[#B8926A]">{selectedBank.rate}%</span> annual
                      </p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="flex flex-col justify-center">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                      <p className="text-white/50 text-sm mb-2">Your Monthly Payment</p>
                      <p className="text-5xl md:text-6xl font-bold text-white mb-2">
                        €{Math.round(monthlyPayment).toLocaleString()}
                      </p>
                      <p className="text-white/40 text-sm">per month</p>

                      <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Loan Amount</span>
                          <span className="text-white">€{Math.round(loanAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Interest Rate</span>
                          <span className="text-[#B8926A]">{selectedBank.rate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Total Interest</span>
                          <span className="text-white">€{Math.round(monthlyPayment * numPayments - loanAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                          <span className="text-white/50">Total Payment</span>
                          <span className="text-white font-semibold">€{Math.round(monthlyPayment * numPayments).toLocaleString()}</span>
                        </div>
                      </div>

                      <Button className="w-full mt-8 h-12 bg-[#B8926A] hover:bg-[#A6825C] text-white rounded-xl" asChild>
                        <Link href={`/properties?maxPrice=${propertyPrice}`}>
                          Find Properties Under €{(propertyPrice / 1000000).toFixed(1)}M
                        </Link>
                      </Button>
                    </div>
                    
                    {/* Disclaimer */}
                    <p className="mt-4 text-xs text-white/30 text-center">
                      * Rates are indicative. Contact banks directly for accurate quotes.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-semibold text-white">
              Ready to find your dream home?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 mt-4 text-lg">
              Join thousands of happy clients who found their perfect property through Xact.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="h-14 px-8 bg-[#B8926A] hover:bg-[#A6825C] text-white rounded-xl text-lg font-medium" asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
              <Button className="h-14 px-8 bg-transparent border border-white/20 hover:bg-white/10 text-white rounded-xl text-lg font-medium" asChild>
                <Link href="/dashboard/listings/new">Submit Your Property</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}