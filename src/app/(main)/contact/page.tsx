"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function ContactPage() {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  })

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: t.contact.phone,
      value: "+352 26 26 26 26",
      href: "tel:+35226262626",
      subtext: t.contact.phoneHours,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: t.contact.email,
      value: "info@xact.lu",
      href: "mailto:info@xact.lu",
      subtext: t.contact.emailReply,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: t.contact.office,
      value: "2 Rue de la Liberte",
      href: "https://maps.google.com/?q=2+Rue+de+la+Liberte+Luxembourg",
      subtext: t.contact.officeAddress,
    },
  ]

  const inquiryTypes = [
    { key: "buying", label: t.contact.inquiryTypes.buying },
    { key: "selling", label: t.contact.inquiryTypes.selling },
    { key: "valuation", label: t.contact.inquiryTypes.valuation },
    { key: "renting", label: t.contact.inquiryTypes.renting },
    { key: "investment", label: t.contact.inquiryTypes.investment },
    { key: "general", label: t.contact.inquiryTypes.general },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-[#B8926A]/10 flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-[#1A1A1A] mt-6">
            {t.contact.success.title}
          </h1>
          <p className="text-[#6B6B6B] mt-4">
            {t.contact.success.description}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => {
                setSubmitted(false)
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  inquiryType: "",
                  message: "",
                })
              }}
              variant="outline"
              className="h-11 px-6 rounded-xl border-[#E8E6E3]"
            >
              {t.contact.success.sendAnother}
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white" asChild>
              <Link href="/properties">{t.contact.success.browseProperties}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0F0F10] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-[#B8926A]/15 blur-3xl"
            animate={reduce ? undefined : { scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#B8926A]/10 blur-3xl"
            animate={reduce ? undefined : { scale: [1.1, 1, 1.1] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#B8926A]" />
                {t.contact.badge}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mt-6 leading-tight">
                {t.contact.heroTitle}
                <span className="block text-[#B8926A]">{t.contact.heroHighlight}</span>
              </h1>

              <p className="text-white/60 mt-6 text-lg">
                {t.contact.heroSubtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white border-b border-[#E8E6E3]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((info, i) => (
              <motion.a
                key={info.label}
                href={info.href}
                target={info.label === t.contact.office ? "_blank" : undefined}
                rel={info.label === t.contact.office ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="flex items-start gap-4 p-6 rounded-2xl border border-[#E8E6E3] hover:border-[#B8926A]/30 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#B8926A]/10 flex items-center justify-center text-[#B8926A] group-hover:bg-[#B8926A] group-hover:text-white transition-colors">
                  {info.icon}
                </div>
                <div>
                  <p className="text-sm text-[#6B6B6B]">{info.label}</p>
                  <p className="text-[#1A1A1A] font-semibold mt-1">{info.value}</p>
                  <p className="text-sm text-[#6B6B6B] mt-1">{info.subtext}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Map Section */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <Reveal>
              <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-[#1A1A1A]">{t.contact.sendMessage}</h2>
                <p className="text-[#6B6B6B] mt-2">
                  {t.contact.formSubtitle}
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        {t.contact.fullName} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        {t.contact.emailLabel} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        {t.contact.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+352 621 123 456"
                        className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors placeholder:text-[#999]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        {t.contact.helpWith} *
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        required
                        className="w-full h-12 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors"
                      >
                        <option value="">{t.contact.selectOption}</option>
                        {inquiryTypes.map((type) => (
                          <option key={type.key} value={type.key}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {t.contact.message} *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder={t.contact.messagePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] outline-none focus:border-[#B8926A] transition-colors resize-none placeholder:text-[#999]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white text-base"
                  >
                    {t.contact.sendButton}
                  </Button>

                  <p className="text-center text-sm text-[#6B6B6B]">
                    {t.contact.privacyNote}{" "}
                    <Link href="/legal/privacy" className="text-[#B8926A] hover:underline">
                      {t.footer.privacyPolicy}
                    </Link>
                  </p>
                </form>
              </div>
            </Reveal>

            {/* Map & Info */}
            <div className="space-y-6">
              <Reveal delay={0.1}>
                <div className="rounded-2xl overflow-hidden border border-[#E8E6E3] h-[300px] lg:h-[400px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2585.8892734779476!2d6.127551776891767!3d49.611556271432884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479548cd4d52a5e7%3A0x40a5fb99a3f51d0!2sLuxembourg%20City!5e0!3m2!1sen!2slu!4v1704067200000!5m2!1sen!2slu"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="bg-white rounded-2xl border border-[#E8E6E3] p-6">
                  <h3 className="font-semibold text-[#1A1A1A]">{t.contact.officeHours}</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B6B6B]">{t.contact.mondayFriday}</span>
                      <span className="text-[#1A1A1A] font-medium">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B6B6B]">{t.contact.saturday}</span>
                      <span className="text-[#1A1A1A] font-medium">10:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B6B6B]">{t.contact.sunday}</span>
                      <span className="text-[#1A1A1A] font-medium">{t.contact.closed}</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-[#E8E6E3]">
                    <p className="text-sm text-[#6B6B6B]">
                      {t.contact.cantVisit}{" "}
                      <span className="text-[#1A1A1A]">{t.contact.scheduleAppointment}</span> {t.contact.arrangeTime}
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="bg-[#0F0F10] rounded-2xl p-6">
                  <h3 className="font-semibold text-white">{t.contact.quickLinks}</h3>
                  <div className="mt-4 space-y-2">
                    <Link href="/estimate" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-[#B8926A] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm">{t.contact.freeValuation}</span>
                    </Link>
                    <Link href="/properties" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-[#B8926A] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <span className="text-sm">{t.contact.browseProperties}</span>
                    </Link>
                    <Link href="/about" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-[#B8926A] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm">{t.nav.about}</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 bg-white border-t border-[#E8E6E3]">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-[#1A1A1A]">
                {t.contact.faq.title}
              </h2>
              <p className="text-[#6B6B6B] mt-2">
                {t.contact.faq.subtitle}
              </p>
              <div className="mt-6">
                <Button variant="outline" className="h-11 px-6 rounded-xl border-[#E8E6E3]" asChild>
                  <Link href="/contact">{t.common.contact}</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
