"use client"

import Link from "next/link"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useMemo, useRef } from "react"

const team = [
  {
    name: "Sophie Weber",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    email: "sophie@xact.lu",
  },
  {
    name: "Marc Schmit",
    role: "Senior Agent",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    email: "marc@xact.lu",
  },
  {
    name: "Julie Hoffmann",
    role: "Property Consultant",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop",
    email: "julie@xact.lu",
  },
  {
    name: "Thomas Muller",
    role: "Sales Manager",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
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
    description: "Clear communication and honest advice — always.",
  },
  {
    icon: "🎯",
    title: "Client-Focused",
    description: "We listen first, then build a plan that fits your goals.",
  },
  {
    icon: "💎",
    title: "Quality Over Quantity",
    description: "Curated listings and serious buyers — no noise, just results.",
  },
  {
    icon: "🏆",
    title: "Local Expertise",
    description: "Luxembourg knowledge you can rely on, from pricing to paperwork.",
  },
]

const timeline = [
  { year: "2014", title: "Xact is founded", text: "A boutique agency with a modern, client-first approach." },
  { year: "2017", title: "First €50M milestone", text: "A track record built on referrals and trust." },
  { year: "2020", title: "Digital-first expansion", text: "Better photography, tours, and marketing performance." },
  { year: "2024", title: "Premium service model", text: "Sharper positioning and an elevated buying/selling experience." },
]

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ")
}

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
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function AboutPage() {
  const reduce = useReducedMotion()

  // Scroll progress bar
  const { scrollYProgress } = useScroll()
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Hero parallax
  const heroRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroProgress, [0, 1], [0, reduce ? 0 : 120])
  const glowY = useTransform(heroProgress, [0, 1], [0, reduce ? 0 : 180])
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0.7])

  const heroWords = useMemo(
    () => ["trusted", "modern", "sharp", "personal", "Luxembourg"],
    []
  )

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }

  const item = {
  hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 14 },
  visible: reduce ? { opacity: 1 } : { opacity: 1, y: 0, transition: { duration: 0.55 } },

  }

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-[#B8926A]"
        style={{ scaleX: barScale }}
      />

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden bg-[#0F0F10] pt-28 md:pt-36 pb-20">
        {/* Background */}
        <motion.div style={{ y: glowY, opacity: heroOpacity }} className="absolute inset-0">
          {/* animated glow blobs */}
          <motion.div
            aria-hidden
            className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-[#B8926A]/20 blur-3xl"
            animate={reduce ? undefined : { x: [0, -20, 0], y: [0, 15, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute -bottom-36 -left-36 w-[620px] h-[620px] rounded-full bg-[#B8926A]/10 blur-3xl"
            animate={reduce ? undefined : { x: [0, 25, 0], y: [0, -18, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* subtle grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          {/* vignette */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/60" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <motion.div
              style={{ y: heroY }}
              className="lg:col-span-7"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#B8926A]" />
                ABOUT XACT
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mt-5 leading-tight">
                We make real estate feel{" "}
                <span className="text-[#B8926A]">premium</span>, not painful.
              </h1>

              <p className="text-white/65 mt-6 text-lg leading-relaxed max-w-xl">
                Xact is a boutique Luxembourg agency built for people who want clarity, speed, and confidence —
                whether you&apos;re buying, selling, or investing.
              </p>

              {/* Rotating “word chips” */}
              <motion.div
                className="flex flex-wrap gap-2 mt-7"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {heroWords.map((w) => (
                  <motion.span
                    key={w}
                    variants={item}
                    className="px-3 py-1 rounded-full bg-white/8 border border-white/10 text-white/70 text-sm"
                    whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
                    transition={{ duration: 0.25 }}
                  >
                    {w}
                  </motion.span>
                ))}
              </motion.div>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/properties">
                  <Button className="h-12 px-6 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white">
                    Explore Listings
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="h-12 px-6 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    Talk to our team
                  </Button>
                </Link>
              </div>

              {/* Scroll hint */}
              <motion.div
                className="mt-10 flex items-center gap-3 text-white/50 text-sm"
                initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center"
                  animate={reduce ? undefined : { y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l6-6m-6 6l-6-6" />
                  </svg>
                </motion.div>
                Scroll to discover our story
              </motion.div>
            </motion.div>

            {/* Hero visual card */}
            <motion.div
              className="lg:col-span-5"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />

                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <p className="text-xs text-white/60">Agency Snapshot</p>
                      <p className="text-lg font-semibold mt-1">Luxembourg • Boutique • Premium</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs">
                      Since 2014
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {stats.slice(0, 4).map((s) => (
                      <div key={s.label} className="rounded-2xl bg-white/10 border border-white/10 p-4">
                        <p className="text-white text-2xl font-bold">{s.value}</p>
                        <p className="text-white/60 text-xs mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-2">
                    <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-[#B8926A]"
                        initial={{ width: "0%" }}
                        animate={{ width: "78%" }}
                        transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
                      />
                    </div>
                    <p className="text-white/60 text-xs">Market momentum</p>
                  </div>
                </div>
              </div>

              {/* Floating mini cards */}
              <motion.div
                className="hidden md:block"
                initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="absolute mt-4 ml-6 rounded-2xl bg-white/10 border border-white/10 p-4 text-white/80 w-64"
                  animate={reduce ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-xs text-white/60">Our promise</p>
                  <p className="mt-1 text-sm">Fast feedback, sharp pricing, and zero surprises.</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-16 bg-white border-b border-[#E8E6E3]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.05} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-[#1A1A1A]">{stat.value}</p>
                <p className="text-[#6B6B6B] mt-2">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STORY + TIMELINE */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-[#B8926A] font-medium text-sm tracking-wide">OUR STORY</span>
                <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-3">
                  Built on craft, not hype
                </h2>
                <p className="text-[#6B6B6B] mt-5 leading-relaxed">
                  Buying or selling property should feel confident and clear. We combine local expertise with modern
                  marketing to deliver an experience that feels premium from first call to final signature.
                </p>
              </Reveal>

              <div className="mt-10 space-y-4">
                {["Pricing that makes sense", "Marketing that performs", "Negotiation that protects you"].map((t, i) => (
                  <Reveal key={t} delay={0.1 + i * 0.05}>
                    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-[#E8E6E3]">
                      <span className="w-10 h-10 rounded-xl bg-[#B8926A]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <p className="text-[#1A1A1A] font-medium">{t}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white border border-[#E8E6E3] overflow-hidden shadow-sm">
                <div className="p-6 md:p-8 border-b border-[#E8E6E3]">
                  <Reveal>
                    <p className="text-sm text-[#6B6B6B]">Timeline</p>
                    <h3 className="text-2xl font-semibold text-[#1A1A1A] mt-1">How we got here</h3>
                  </Reveal>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {timeline.map((t, i) => (
                    <Reveal key={t.year} delay={i * 0.06}>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-2xl bg-[#B8926A] text-white flex items-center justify-center font-semibold">
                            {t.year.slice(2)}
                          </div>
                          {i !== timeline.length - 1 && <div className="w-[2px] flex-1 bg-[#E8E6E3] mt-2" />}
                        </div>
                        <div className="pt-1">
                          <p className="text-xs text-[#B8926A] font-semibold tracking-wide">{t.year}</p>
                          <p className="text-[#1A1A1A] font-semibold mt-1">{t.title}</p>
                          <p className="text-[#6B6B6B] mt-1">{t.text}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-14">
            <span className="text-[#B8926A] font-medium text-sm tracking-wide">OUR VALUES</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-3">What sets us apart</h2>
            <p className="text-[#6B6B6B] mt-4 max-w-2xl mx-auto">
              We’re boutique on purpose — fewer clients, better attention, stronger outcomes.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
                whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.06 }}
                whileHover={reduce ? undefined : { y: -6 }}
                className="relative rounded-3xl p-6 bg-[#FAFAF8] border border-[#E8E6E3] shadow-sm overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-[#B8926A]/10 blur-2xl" />
                <div className="relative">
                  <span className="text-4xl">{v.icon}</span>
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mt-4">{v.title}</h3>
                  <p className="text-[#6B6B6B] text-sm mt-2 leading-relaxed">{v.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 bg-[#0F0F10]">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-14">
            <span className="text-[#B8926A] font-medium text-sm tracking-wide">OUR TEAM</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-3">Meet the experts</h2>
            <p className="text-white/60 mt-4 max-w-xl mx-auto">
              Real humans, real experience — with a premium approach.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <motion.div
                key={m.email}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
                whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.06 }}
                className="group"
              >
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${m.image}')` }}
                      whileHover={reduce ? undefined : { scale: 1.06 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <a
                        href={`mailto:${m.email}`}
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

                  <div className="p-5">
                    <p className="text-white font-semibold">{m.name}</p>
                    <p className="text-white/60 text-sm mt-1">{m.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <Link href="/contact">
              <Button className="h-12 px-6 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white">
                Book a consultation
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-white border border-[#E8E6E3] overflow-hidden shadow-sm">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 md:p-12">
                <Reveal>
                  <span className="text-[#B8926A] font-medium text-sm tracking-wide">READY?</span>
                  <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-3">
                    Let&apos;s make your next move feel easy.
                  </h2>
                  <p className="text-[#6B6B6B] mt-4 leading-relaxed">
                    Tell us what you’re trying to achieve — we’ll give you a clear plan and the next best step.
                  </p>
                </Reveal>

                <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
                  <Link href="/properties">
                    <Button className="h-12 px-6 rounded-xl bg-[#1A1A1A] hover:bg-[#333] text-white">
                      Browse properties
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-[#E8E6E3] bg-white">
                      Contact us
                    </Button>
                  </Link>
                </Reveal>
              </div>

              <div className="relative min-h-[320px]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
              </div>
            </div>
          </div>

          <Reveal className="mt-10 text-center">
            <Link href="/">
              <Button variant="outline" className="h-12 px-6 rounded-xl border-[#E8E6E3] bg-white">
                Back to home
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
