"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const team = [
  {
    name: "Sophie Weber",
    role: "Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    email: "sophie@xact.lu",
  },
  {
    name: "Marc Schmit",
    role: "Senior Agent",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    email: "marc@xact.lu",
  },
  {
    name: "Julie Hoffmann",
    role: "Property Consultant",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    email: "julie@xact.lu",
  },
  {
    name: "Thomas Muller",
    role: "Sales Manager",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    email: "thomas@xact.lu",
  },
]

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "500+", label: "Properties Sold" },
  { value: "€250M+", label: "Total Sales Volume" },
  { value: "98%", label: "Client Satisfaction" },
]

const values = [
  {
    icon: "🤝",
    title: "Trust & Transparency",
    description: "We believe in honest communication and transparent dealings with every client.",
  },
  {
    icon: "🎯",
    title: "Client-Focused",
    description: "Your needs come first. We listen, understand, and deliver results that exceed expectations.",
  },
  {
    icon: "💎",
    title: "Quality Over Quantity",
    description: "We carefully curate our listings to ensure only the best properties for our clients.",
  },
  {
    icon: "🏆",
    title: "Local Expertise",
    description: "Deep knowledge of Luxembourg's neighborhoods, market trends, and regulations.",
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#1A1A1A] pt-32 pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#B8926A]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B8926A]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.span variants={fadeUp} className="text-[#B8926A] font-medium text-sm tracking-wide">
              ABOUT XACT
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mt-4 leading-tight"
            >
              Your trusted partner in Luxembourg real estate
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/60 mt-6 text-lg leading-relaxed">
              Xact is a boutique real estate agency dedicated to helping you find your perfect property in Luxembourg.
              With personalized service and deep local expertise, we make buying, selling, and renting seamless.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-[#E8E6E3]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-[#1A1A1A]">{stat.value}</p>
                <p className="text-[#6B6B6B] mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-[#B8926A] font-medium text-sm tracking-wide">OUR STORY</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-3">Built on passion for real estate</h2>
              <div className="mt-6 space-y-4 text-[#6B6B6B] leading-relaxed">
                <p>
                  Founded in Luxembourg City, Xact was born from a simple belief: buying or selling a property should be
                  an exciting journey, not a stressful one.
                </p>
                <p>
                  Our team combines years of experience in the Luxembourg real estate market with a modern,
                  client-centric approach. We understand that every property transaction is unique, and we tailor our
                  services to meet your specific needs.
                </p>
                <p>
                  Whether you&apos;re a first-time buyer, looking to upgrade, or investing in Luxembourg&apos;s thriving
                  property market, we&apos;re here to guide you every step of the way.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop')",
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#B8926A] text-white p-6 rounded-2xl shadow-xl">
                <p className="text-3xl font-bold">Since 2014</p>
                <p className="text-white/80 text-sm mt-1">Serving Luxembourg</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} className="text-[#B8926A] font-medium text-sm tracking-wide">
              OUR VALUES
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-3">
              What sets us apart
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#FAFAF8] rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl">{value.icon}</span>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mt-4">{value.title}</h3>
                <p className="text-[#6B6B6B] text-sm mt-2">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} className="text-[#B8926A] font-medium text-sm tracking-wide">
              OUR TEAM
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-semibold text-white mt-3">
              Meet the experts
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 mt-4 max-w-xl mx-auto">
              Our dedicated team of professionals is here to help you with all your real estate needs.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${member.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* ✅ FIXED: missing <a */}
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm text-[#1A1A1A] py-2 rounded-xl text-sm font-medium hover:bg-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Contact
                    </a>
                  </div>
                </div>

                <h3 className="font-semibold text-white text-lg">{member.name}</h3>
                <p className="text-white/60 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-[#B8926A] font-medium text-sm tracking-wide">CONTACT US</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-3">
                Let&apos;s talk about your property goals
              </h2>
              <p className="text-[#6B6B6B] mt-4">
                Whether you&apos;re buying, selling, or just exploring your options, we&apos;re here to help.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B8926A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">Visit Us</h3>
                    <p className="text-[#6B6B6B] mt-1">
                      12 Boulevard Royal
                      <br />
                      L-2449 Luxembourg
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B8926A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">Call Us</h3>
                    <p className="text-[#6B6B6B] mt-1">+352 26 26 26 26</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B8926A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">Email Us</h3>
                    <p className="text-[#6B6B6B] mt-1">info@xact.lu</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B8926A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">Opening Hours</h3>
                    <p className="text-[#6B6B6B] mt-1">
                      Mon - Fri: 9:00 - 18:00
                      <br />
                      Sat: 10:00 - 14:00
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-6">Send us a message</h3>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A] transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A] transition-colors"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A] transition-colors"
                />
                <select className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A] transition-colors text-[#6B6B6B]">
                  <option value="">What are you interested in?</option>
                  <option value="buy">Buying a property</option>
                  <option value="sell">Selling a property</option>
                  <option value="rent">Renting a property</option>
                  <option value="valuation">Property valuation</option>
                  <option value="other">Other inquiry</option>
                </select>
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E6E3] outline-none focus:border-[#B8926A] transition-colors resize-none"
                />
                <Button className="w-full h-12 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-xl">
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
