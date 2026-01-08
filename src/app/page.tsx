"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}


const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/70 via-[#1A1A1A]/50 to-[#1A1A1A]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl"
          >
            <motion.p 
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/90 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#B8926A]" />
              Luxembourg&apos;s Premium Real Estate Platform
            </motion.p>
            
            <motion.h1 
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] tracking-tight"
            >
              Discover your
              <span className="block text-[#B8926A]">dream home.</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeUp}
              className="mt-6 text-xl text-white/70 max-w-xl leading-relaxed"
            >
              Exceptional properties across Luxembourg. Buy, rent, or list with the platform trusted by thousands.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              variants={fadeUp}
              className="mt-10 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl max-w-2xl"
            >
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

            {/* Quick Stats */}
            <motion.div 
              variants={fadeUp}
              className="mt-16 flex flex-wrap gap-8 md:gap-16"
            >
              {[
                { value: "2,500+", label: "Active Listings" },
                { value: "€2.1B", label: "Property Value" },
                { value: "98%", label: "Satisfied Clients" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-semibold text-white">{stat.value}</p>
                  <p className="text-sm text-white/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-8 bg-white border-b border-[#E8E6E3]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40">
            {["ENGEL & VÖLKERS", "CENTURY 21", "REMAX", "SOTHEBY'S", "COLDWELL BANKER"].map((brand) => (
              <span key={brand} className="text-sm font-semibold tracking-wider text-[#1A1A1A]">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex justify-between items-end mb-12">
              <div>
                <p className="text-[#B8926A] font-medium mb-2 text-sm tracking-wide">FEATURED</p>
                <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">
                  Exceptional properties
                </h2>
              </div>
              <Link href="/properties" className="hidden md:flex items-center gap-2 text-sm text-[#1A1A1A] hover:text-[#B8926A] transition-colors">
                View all properties
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  title: "Modern Villa with Pool", 
                  location: "Kirchberg, Luxembourg City",
                  price: "€2,850,000", 
                  beds: 5, 
                  baths: 4, 
                  area: "420",
                  image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
                  tag: "Featured"
                },
                { 
                  title: "Penthouse with Skyline View", 
                  location: "Belair, Luxembourg City",
                  price: "€1,950,000", 
                  beds: 3, 
                  baths: 2, 
                  area: "185",
                  image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
                  tag: "New"
                },
                { 
                  title: "Charming Family Home", 
                  location: "Limpertsberg, Luxembourg City",
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
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.beds} beds
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {property.baths} baths
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {property.area} m²
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center md:hidden">
              <Link href="/properties" className="inline-flex items-center gap-2 text-sm text-[#B8926A]">
                View all properties
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="max-w-xl mb-12">
              <p className="text-[#B8926A] font-medium mb-2 text-sm tracking-wide">CATEGORIES</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">
                Find your perfect match
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { title: "Apartments", count: "1,240", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop" },
                { title: "Houses", count: "856", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop" },
                { title: "Land", count: "198", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2032&auto=format&fit=crop" },
                { title: "Commercial", count: "324", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" },
              ].map((item, i) => (
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

      {/* Services */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="max-w-xl mb-16">
              <p className="text-[#B8926A] font-medium mb-2 text-sm tracking-wide">WHY XACT</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-white">
                The smarter way to find property
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                  title: "Advanced Search", 
                  desc: "Filter by location, price, size, rooms, and 20+ criteria to find your perfect property." 
                },
                { 
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Verified Listings", 
                  desc: "Every property is reviewed by our team before publication. Quality guaranteed." 
                },
                { 
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Free Valuation", 
                  desc: "Get a professional property estimate from our experts — completely free, no obligations." 
                },
                { 
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  ),
                  title: "Easy Listing", 
                  desc: "Upload your property in minutes. Simple process for owners and agencies." 
                },
                { 
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  ),
                  title: "Direct Contact", 
                  desc: "Message sellers and agents directly. Schedule viewings with one click." 
                },
                { 
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  ),
                  title: "Agency Profiles", 
                  desc: "Dedicated pages for verified partners. Build trust and showcase your portfolio." 
                },
              ].map((service, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeUp}
                  className="group p-8 rounded-2xl border border-white/10 hover:border-[#B8926A]/50 hover:bg-white/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#B8926A]/10 text-[#B8926A] flex items-center justify-center mb-6 group-hover:bg-[#B8926A] group-hover:text-white transition-all duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-white/60 leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center max-w-xl mx-auto mb-16">
              <p className="text-[#B8926A] font-medium mb-2 text-sm tracking-wide">TESTIMONIALS</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">
                Trusted by thousands
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  quote: "Xact made finding our dream home in Luxembourg incredibly easy. The search filters are exactly what we needed.", 
                  name: "Marie Dupont", 
                  role: "Homeowner",
                  rating: 5
                },
                { 
                  quote: "As an agency, Xact has become our primary platform. The listing process is smooth and we get quality leads.", 
                  name: "Thomas Weber", 
                  role: "Agency Director",
                  rating: 5
                },
                { 
                  quote: "The free valuation service helped us price our property correctly. Sold within 3 weeks of listing!", 
                  name: "Sophie Martin", 
                  role: "Property Seller",
                  rating: 5
                },
              ].map((testimonial, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeUp}
                  className="bg-white p-8 rounded-2xl border border-[#E8E6E3]"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-[#B8926A]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[#1A1A1A] leading-relaxed mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">{testimonial.name}</p>
                    <p className="text-sm text-[#6B6B6B]">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[#B8926A] font-medium mb-2 text-sm tracking-wide">FOR SELLERS</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">
                List your property with confidence
              </h2>
              <p className="text-[#6B6B6B] mt-4 text-lg leading-relaxed">
                Join hundreds of agencies and private sellers who trust Xact to showcase their properties to qualified buyers.
              </p>
              
              <ul className="mt-8 space-y-4">
                {[
                  "Professional listing presentation",
                  "Reach thousands of active buyers",
                  "Direct inquiries to your inbox",
                  "Performance analytics dashboard",
                  "Verified seller badge",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#1A1A1A]">
                    <div className="w-5 h-5 rounded-full bg-[#B8926A]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button className="h-12 px-8 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-xl" asChild>
                  <Link href="/pricing">View Plans</Link>
                </Button>
                <Button variant="outline" className="h-12 px-8 rounded-xl border-[#E8E6E3] hover:border-[#B8926A] hover:text-[#B8926A]" asChild>
                  <Link href="/dashboard/listings/new">Start Listing</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="bg-[#FAFAF8] rounded-3xl p-8 md:p-10 border border-[#E8E6E3]">
                <div className="flex items-center gap-2 mb-8">
                  <span className="px-3 py-1 bg-[#B8926A]/10 text-[#B8926A] text-xs font-medium rounded-full">
                    MOST POPULAR
                  </span>
                </div>
                <p className="text-sm text-[#6B6B6B]">Professional Plan</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-5xl font-semibold text-[#1A1A1A]">€99</span>
                  <span className="text-[#6B6B6B]">/month</span>
                </div>
                <p className="text-sm text-[#6B6B6B] mt-2">Up to 20 active listings</p>
                
                <div className="mt-8 pt-8 border-t border-[#E8E6E3] space-y-4">
                  {[
                    "All starter features",
                    "Priority support",
                    "Featured listing boost",
                    "Advanced analytics",
                    "Agency profile page",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-[#1A1A1A]">
                      <svg className="w-4 h-4 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <Button className="w-full h-12 mt-8 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-xl" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Free Estimation CTA */}
      <section className="py-24 bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#B8926A] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B8926A] rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.p variants={fadeUp} className="text-[#B8926A] font-medium mb-4 text-sm tracking-wide">
              FREE SERVICE
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-semibold text-white">
              What&apos;s your property worth?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 mt-4 text-lg">
              Get a professional valuation from our expert team — completely free, no obligations.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button className="mt-10 h-14 px-10 bg-[#B8926A] hover:bg-[#A6825C] text-white rounded-xl text-lg" asChild>
                <Link href="/estimate">Request Free Estimation</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">
              Ready to find your next home?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#6B6B6B] mt-4 max-w-lg mx-auto">
              Join thousands of satisfied clients who found their perfect property through Xact.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="h-12 px-8 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-xl" asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
              <Button variant="outline" className="h-12 px-8 rounded-xl border-[#E8E6E3] hover:border-[#B8926A] hover:text-[#B8926A]" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}