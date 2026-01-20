"use client"

import Link from "next/link"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useMemo, useRef, useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n"

interface Agent {
  id: string
  name: string
  email: string
  phone: string | null
  image: string | null
  bio: string | null
  role: string | null
}

const statsData = [
  { value: "7+", labelKey: "yearsExperience" as const },
  { value: "350+", labelKey: "propertiesSold" as const },
  { value: "100%", labelKey: "totalSalesVolume" as const },
  { value: "98%", labelKey: "clientSatisfaction" as const },
]

const valuesData = [
  { icon: "🤝", key: "trustTransparency" as const },
  { icon: "🎯", key: "clientFocused" as const },
  { icon: "💎", key: "qualityOverQuantity" as const },
  { icon: "🏆", key: "localExpertise" as const },
]

const timelineYears = ["2014", "2017", "2020", "2024"] as const

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
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loadingAgents, setLoadingAgents] = useState(true)

  // Fetch agents for the team section
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/agents/about")
        if (res.ok) {
          const data = await res.json()
          setAgents(data)
        }
      } catch (error) {
        console.error("Failed to fetch agents:", error)
      } finally {
        setLoadingAgents(false)
      }
    }
    fetchAgents()
  }, [])

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
    () => t.about.heroWords,
    [t.about.heroWords]
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
                {t.about.badge}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mt-5 leading-tight">
                {t.about.heroTitle}{" "}
                <span className="text-[#B8926A]">{t.about.heroPremium}</span>{t.about.heroNotPainful}
              </h1>

              <p className="text-white/65 mt-6 text-lg leading-relaxed max-w-xl">
                {t.about.heroSubtitle}
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
                    {t.about.exploreListings}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="h-12 px-6 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    {t.about.talkToTeam}
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
                {t.about.scrollToDiscover}
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
                      <p className="text-xs text-white/60">{t.about.agencySnapshot}</p>
                      <p className="text-lg font-semibold mt-1">{t.about.boutiqueTag}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs">
                      {t.about.since}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {statsData.slice(0, 4).map((s) => (
                      <div key={s.labelKey} className="rounded-2xl bg-white/10 border border-white/10 p-4">
                        <p className="text-white text-2xl font-bold">{s.value}</p>
                        <p className="text-white/60 text-xs mt-1">{t.about.stats[s.labelKey]}</p>
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
                    <p className="text-white/60 text-xs">{t.about.marketMomentum}</p>
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
                  <p className="text-xs text-white/60">{t.about.ourPromise}</p>
                  <p className="mt-1 text-sm">{t.about.promiseText}</p>
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
            {statsData.map((stat, i) => (
              <Reveal key={stat.labelKey} delay={i * 0.05} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-[#1A1A1A]">{stat.value}</p>
                <p className="text-[#6B6B6B] mt-2">{t.about.stats[stat.labelKey]}</p>
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
                <span className="text-[#B8926A] font-medium text-sm tracking-wide">{t.about.story.label}</span>
                <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-3">
                  {t.about.story.title}
                </h2>
                <p className="text-[#6B6B6B] mt-5 leading-relaxed">
                  {t.about.story.description}
                </p>
              </Reveal>

              <div className="mt-10 space-y-4">
                {t.about.story.points.map((point, i) => (
                  <Reveal key={point} delay={0.1 + i * 0.05}>
                    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-[#E8E6E3]">
                      <span className="w-10 h-10 rounded-xl bg-[#B8926A]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <p className="text-[#1A1A1A] font-medium">{point}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white border border-[#E8E6E3] overflow-hidden shadow-sm">
                <div className="p-6 md:p-8 border-b border-[#E8E6E3]">
                  <Reveal>
                    <p className="text-sm text-[#6B6B6B]">{t.about.timeline.title}</p>
                    <h3 className="text-2xl font-semibold text-[#1A1A1A] mt-1">{t.about.timeline.subtitle}</h3>
                  </Reveal>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {timelineYears.map((year, i) => (
                    <Reveal key={year} delay={i * 0.06}>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-2xl bg-[#B8926A] text-white flex items-center justify-center font-semibold">
                            {year.slice(2)}
                          </div>
                          {i !== timelineYears.length - 1 && <div className="w-[2px] flex-1 bg-[#E8E6E3] mt-2" />}
                        </div>
                        <div className="pt-1">
                          <p className="text-xs text-[#B8926A] font-semibold tracking-wide">{year}</p>
                          <p className="text-[#1A1A1A] font-semibold mt-1">{t.about.timeline[year].title}</p>
                          <p className="text-[#6B6B6B] mt-1">{t.about.timeline[year].text}</p>
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
            <span className="text-[#B8926A] font-medium text-sm tracking-wide">{t.about.values.label}</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-3">{t.about.values.title}</h2>
            <p className="text-[#6B6B6B] mt-4 max-w-2xl mx-auto">
              {t.about.values.subtitle}
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuesData.map((v, i) => (
              <motion.div
                key={v.key}
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
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mt-4">{t.about.values[v.key].title}</h3>
                  <p className="text-[#6B6B6B] text-sm mt-2 leading-relaxed">{t.about.values[v.key].desc}</p>
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
            <span className="text-[#B8926A] font-medium text-sm tracking-wide">{t.about.team.label}</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-3">{t.about.team.title}</h2>
            <p className="text-white/60 mt-4 max-w-xl mx-auto">
              {t.about.team.subtitle}
            </p>
          </Reveal>

          {loadingAgents ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8926A]" />
            </div>
          ) : agents.length > 0 ? (
            <div className={cx(
              "grid gap-6",
              agents.length === 1 && "max-w-sm mx-auto",
              agents.length === 2 && "md:grid-cols-2 max-w-2xl mx-auto",
              agents.length === 3 && "md:grid-cols-3 max-w-4xl mx-auto",
              agents.length >= 4 && "md:grid-cols-2 lg:grid-cols-4"
            )}>
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
                  whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.06 }}
                  className="group"
                >
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {agent.image ? (
                        <motion.div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url('${agent.image}')` }}
                          whileHover={reduce ? undefined : { scale: 1.06 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#B8926A] flex items-center justify-center">
                          <span className="text-6xl text-white font-semibold">{agent.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <a
                          href={`mailto:${agent.email}`}
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
                          {t.about.team.contact}
                        </a>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-white font-semibold">{agent.name}</p>
                      <p className="text-white/60 text-sm mt-1">{agent.role || "Agent"}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60">Our team information is being updated. Please check back soon.</p>
            </div>
          )}

          <Reveal className="mt-12 text-center">
            <Link href="/contact">
              <Button className="h-12 px-6 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white">
                {t.about.team.bookConsultation}
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
                  <span className="text-[#B8926A] font-medium text-sm tracking-wide">{t.about.cta.label}</span>
                  <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-3">
                    {t.about.cta.title}
                  </h2>
                  <p className="text-[#6B6B6B] mt-4 leading-relaxed">
                    {t.about.cta.description}
                  </p>
                </Reveal>

                <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
                  <Link href="/properties">
                    <Button className="h-12 px-6 rounded-xl bg-[#1A1A1A] hover:bg-[#333] text-white">
                      {t.about.cta.browseProperties}
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-[#E8E6E3] bg-white">
                      {t.about.cta.contactUs}
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
                {t.about.cta.backToHome}
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
