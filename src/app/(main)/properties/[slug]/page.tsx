"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

// Mock data - will come from database later
const mockProperties: Record<string, any> = {
  "cozy-family-home-strassen": {
    id: "1",
    title: "Cozy Family Home",
    slug: "cozy-family-home-strassen",
    description:
      "Beautiful family home in a quiet neighborhood of Strassen. This charming property features a spacious living area, modern kitchen, and a lovely garden perfect for children and entertaining. Recently renovated with high-quality materials throughout.\n\nThe ground floor offers an open-plan living and dining area with direct access to the terrace and garden. The fully equipped kitchen includes premium appliances. Upstairs you'll find three comfortable bedrooms and a family bathroom.\n\nLocated in one of Luxembourg's most sought-after residential areas, close to schools, shops, and public transport.",
    location: "Strassen",
    address: "12 Rue des Jardins, Strassen",
    price: 685000,
    type: "HOUSE",
    listingType: "SALE",
    beds: 3,
    baths: 2,
    area: 145,
    landArea: 320,
    yearBuilt: 2005,
    energyClass: "B",
    features: [
      "Garden",
      "Terrace",
      "Garage",
      "Modern Kitchen",
      "Fireplace",
      "Double Glazing",
      "Alarm System",
    ],
    images: [
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    ],
    agent: {
      name: "Marie Schmidt",
      phone: "+352 621 123 456",
      email: "marie@xact.lu",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      agency: "Xact Real Estate",
    },
  },
  "bright-city-apartment-bonnevoie": {
    id: "2",
    title: "Bright City Apartment",
    slug: "bright-city-apartment-bonnevoie",
    description:
      "Modern and luminous apartment in the heart of Bonnevoie. Perfect for young professionals or couples looking for city living with excellent transport connections.\n\nThis beautifully renovated apartment features an open-plan living space with large windows flooding the rooms with natural light. The contemporary kitchen is fully equipped with quality appliances.\n\nBonnevoie is a vibrant neighborhood with cafes, restaurants, and shops at your doorstep. The train station is just a 5-minute walk away.",
    location: "Bonnevoie",
    address: "45 Avenue de la Gare, Bonnevoie",
    price: 425000,
    type: "APARTMENT",
    listingType: "SALE",
    beds: 2,
    baths: 1,
    area: 78,
    floor: 3,
    totalFloors: 5,
    yearBuilt: 2018,
    energyClass: "A",
    features: [
      "Balcony",
      "Elevator",
      "Modern Kitchen",
      "Built-in Wardrobes",
      "Cellar",
      "Bike Storage",
    ],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
    ],
    agent: {
      name: "Jean Muller",
      phone: "+352 621 789 012",
      email: "jean@xact.lu",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
      agency: "Xact Real Estate",
    },
  },
}

const defaultProperty = {
  id: "0",
  title: "Property",
  slug: "property",
  description: "Beautiful property in Luxembourg.",
  location: "Luxembourg",
  address: "Luxembourg",
  price: 500000,
  type: "HOUSE",
  listingType: "SALE",
  beds: 3,
  baths: 2,
  area: 120,
  yearBuilt: 2010,
  energyClass: "C",
  features: ["Garden", "Garage"],
  images: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop",
  ],
  agent: {
    name: "Agent",
    phone: "+352 621 000 000",
    email: "info@xact.lu",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    agency: "Xact Real Estate",
  },
}

const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export default function PropertyDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const property = mockProperties[slug] || defaultProperty

  const [activeImage, setActiveImage] = useState(0)
  const [showContact, setShowContact] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in this property: ${property.title}`,
  })

  return (
    <>
      {/* Image Gallery */}
      <section className="pt-16 bg-[#1A1A1A]">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => {}}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${property.images[activeImage]}')` }}
              />
            </motion.div>

            {/* Thumbnails */}
            <div className="grid grid-cols-2 gap-4">
              {property.images.slice(0, 4).map((image: string, index: number) => (
                <div
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                    activeImage === index ? "ring-2 ring-[#B8926A]" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${image}')` }}
                  />
                  {index === 3 && property.images.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">+{property.images.length - 4} more</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          property.listingType === "RENT" ? "bg-blue-500 text-white" : "bg-[#B8926A] text-white"
                        }`}
                      >
                        For {property.listingType === "RENT" ? "Rent" : "Sale"}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F5F3EF] text-[#6B6B6B]">
                        {property.type}
                      </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A]">{property.title}</h1>

                    <p className="text-[#6B6B6B] mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {property.address}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#1A1A1A]">
                      €{formatNumber(property.price)}
                      {property.listingType === "RENT" && (
                        <span className="text-lg font-normal text-[#6B6B6B]">/month</span>
                      )}
                    </p>

                    {property.area && (
                      <p className="text-[#6B6B6B] text-sm mt-1">
                        €{formatNumber(Math.round(property.price / property.area))}/m²
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E8E6E3]">
                  {property.beds > 0 && (
                    <div className="text-center p-4 bg-[#F5F3EF] rounded-xl">
                      <p className="text-2xl font-semibold text-[#1A1A1A]">{property.beds}</p>
                      <p className="text-sm text-[#6B6B6B]">Bedrooms</p>
                    </div>
                  )}
                  <div className="text-center p-4 bg-[#F5F3EF] rounded-xl">
                    <p className="text-2xl font-semibold text-[#1A1A1A]">{property.baths}</p>
                    <p className="text-sm text-[#6B6B6B]">Bathrooms</p>
                  </div>
                  <div className="text-center p-4 bg-[#F5F3EF] rounded-xl">
                    <p className="text-2xl font-semibold text-[#1A1A1A]">{property.area}</p>
                    <p className="text-sm text-[#6B6B6B]">m² Living</p>
                  </div>
                  {property.landArea && (
                    <div className="text-center p-4 bg-[#F5F3EF] rounded-xl">
                      <p className="text-2xl font-semibold text-[#1A1A1A]">{property.landArea}</p>
                      <p className="text-sm text-[#6B6B6B]">m² Land</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Description</h2>
                <div className="text-[#6B6B6B] whitespace-pre-line leading-relaxed">{property.description}</div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-[#6B6B6B]">
                      <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b border-[#E8E6E3]">
                    <span className="text-[#6B6B6B]">Property Type</span>
                    <span className="font-medium text-[#1A1A1A]">{property.type}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#E8E6E3]">
                    <span className="text-[#6B6B6B]">Year Built</span>
                    <span className="font-medium text-[#1A1A1A]">{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#E8E6E3]">
                    <span className="text-[#6B6B6B]">Energy Class</span>
                    <span
                      className={`font-medium px-2 py-0.5 rounded ${
                        property.energyClass === "A" || property.energyClass === "B"
                          ? "bg-green-100 text-green-700"
                          : property.energyClass === "C" || property.energyClass === "D"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {property.energyClass}
                    </span>
                  </div>
                  {property.floor !== undefined && property.totalFloors !== undefined && (
                    <div className="flex justify-between py-3 border-b border-[#E8E6E3]">
                      <span className="text-[#6B6B6B]">Floor</span>
                      <span className="font-medium text-[#1A1A1A]">
                        {property.floor} of {property.totalFloors}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Agent Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${property.agent.image}')` }}
                    />
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">{property.agent.name}</p>
                      <p className="text-sm text-[#6B6B6B]">{property.agent.agency}</p>
                    </div>
                  </div>

                  {/* ✅ FIXED LINKS */}
                  <div className="space-y-3 mb-6">
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="flex items-center gap-3 text-[#6B6B6B] hover:text-[#B8926A] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {property.agent.phone}
                    </a>

                    <a
                      href={`mailto:${property.agent.email}`}
                      className="flex items-center gap-3 text-[#6B6B6B] hover:text-[#B8926A] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {property.agent.email}
                    </a>
                  </div>

                  <Button
                    onClick={() => setShowContact(!showContact)}
                    className="w-full h-12 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-xl"
                  >
                    Contact Agent
                  </Button>
                </motion.div>

                {/* Contact Form */}
                {showContact && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                  >
                    <h3 className="font-semibold text-[#1A1A1A] mb-4">Send a Message</h3>
                    <form className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A]"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A]"
                      />
                      <input
                        type="tel"
                        placeholder="Your Phone"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A]"
                      />
                      <textarea
                        placeholder="Your Message"
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A] resize-none"
                      />
                      <Button className="w-full h-12 bg-[#B8926A] hover:bg-[#A6825C] text-white rounded-xl">
                        Send Message
                      </Button>
                    </form>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-11 rounded-xl border-[#E8E6E3]">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Save
                  </Button>

                  <Button variant="outline" className="flex-1 h-11 rounded-xl border-[#E8E6E3]">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-8">Similar Properties</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <p className="text-[#6B6B6B] col-span-3 text-center py-8">
              Similar properties will be shown here based on location and price.
            </p>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link href="/properties">
          <Button variant="outline" className="h-12 px-6 rounded-xl bg-white shadow-lg border-[#E8E6E3]">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Properties
          </Button>
        </Link>
      </div>
    </>
  )
}
