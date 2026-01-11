"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const includedServices = [
  { title: "Professional Photography", desc: "High-end photos that showcase your property" },
  { title: "Property Valuation", desc: "Accurate market analysis and pricing strategy" },
  { title: "Premium Listings", desc: "Featured on athome.lu, immotop.lu & more" },
  { title: "Viewings Management", desc: "We handle all scheduling and showings" },
  { title: "Buyer Qualification", desc: "Pre-screened, serious buyers only" },
  { title: "Negotiation Support", desc: "Expert negotiation to maximize your price" },
  { title: "Legal Coordination", desc: "Notary liaison and document preparation" },
  { title: "Dedicated Agent", desc: "Single point of contact throughout" },
]

const faqs = [
  {
    q: "When do I pay the commission?",
    a: "Only at closing. Our commission is paid from the sale proceeds when the notary finalizes the transaction. No upfront costs.",
  },
  {
    q: "What if my property doesn't sell?",
    a: "You pay nothing. We're confident in our approach, so we only get paid when you get results.",
  },
  {
    q: "Are there any hidden fees?",
    a: "None. The 3% commission covers everything — photography, marketing, listings, viewings, and negotiation. No surprises.",
  },
  {
    q: "How does 3% compare to other agencies?",
    a: "It's competitive with the Luxembourg market (typically 2.5–3.5%). The difference is our premium service, marketing quality, and results.",
  },
  {
    q: "Can I negotiate the commission?",
    a: "For properties above €2M, we offer adjusted rates. Contact us to discuss.",
  },
  {
    q: "Do you handle rentals too?",
    a: "Yes. For rentals, our fee is one month's rent + VAT, paid by the landlord upon signed lease.",
  },
]

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
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function PricingPage() {
  const reduce = useReducedMotion()
  const [price, setPrice] = useState(750000)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const commission = price * 0.03
  const formattedPrice = new Intl.NumberFormat("de-LU").format(price)
  const formattedCommission = new Intl.NumberFormat("de-LU").format(commission)

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
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#B8926A]" />
                TRANSPARENT PRICING
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mt-6 leading-tight">
                Simple, honest pricing.
                <span className="block text-[#B8926A]">No surprises.</span>
              </h1>

              <p className="text-white/60 mt-6 text-lg max-w-xl mx-auto">
                One clear commission. Premium service included. You only pay when your property sells.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Pricing Card */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="bg-white rounded-3xl border border-[#E8E6E3] shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#1A1A1A] p-8 md:p-10 text-center">
                  <p className="text-white/60 text-sm uppercase tracking-wider">Sales Commission</p>
                  <div className="mt-4 flex items-baseline justify-center gap-2">
                    <span className="text-6xl md:text-7xl font-bold text-white">3</span>
                    <span className="text-4xl md:text-5xl font-bold text-[#B8926A]">%</span>
                  </div>
                  <p className="text-white/60 mt-3">of final sale price · VAT included</p>
                  <p className="text-[#B8926A] text-sm mt-2 font-medium">Paid only at closing</p>
                </div>

                {/* Calculator */}
                <div className="p-8 md:p-10 border-b border-[#E8E6E3]">
                  <p className="text-[#1A1A1A] font-semibold text-center mb-6">Calculate your commission</p>
                  
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-[#6B6B6B]">Property value</span>
                      <span className="text-lg font-semibold text-[#1A1A1A]">€{formattedPrice}</span>
                    </div>
                    
                    <input
                      type="range"
                      min={200000}
                      max={5000000}
                      step={50000}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full h-2 bg-[#E8E6E3] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#B8926A] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                    />
                    
                    <div className="flex justify-between text-xs text-[#6B6B6B] mt-2">
                      <span>€200K</span>
                      <span>€5M</span>
                    </div>

                    <div className="mt-6 p-5 bg-[#FAFAF8] rounded-2xl text-center">
                      <p className="text-sm text-[#6B6B6B]">Your commission would be</p>
                      <p className="text-3xl font-bold text-[#B8926A] mt-2">€{formattedCommission}</p>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="p-8 md:p-10">
                  <p className="text-[#1A1A1A] font-semibold text-center mb-8">Everything included</p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {includedServices.map((service, i) => (
                      <motion.div
                        key={service.title}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#B8926A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3.5 h-3.5 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[#1A1A1A] font-medium text-sm">{service.title}</p>
                          <p className="text-[#6B6B6B] text-xs mt-0.5">{service.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="p-8 md:p-10 bg-[#FAFAF8] border-t border-[#E8E6E3]">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/estimate">
                      <Button className="h-12 px-8 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white w-full sm:w-auto">
                        Get a Free Valuation
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="h-12 px-8 rounded-xl border-[#E8E6E3] bg-white w-full sm:w-auto">
                        Talk to an Agent
                      </Button>
                    </Link>
                  </div>
                  <p className="text-center text-[#6B6B6B] text-sm mt-4">
                    No commitment required · Response within 24 hours
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Rentals Mention */}
      <section className="py-16 bg-white border-y border-[#E8E6E3]">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-[#B8926A]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-[#B8926A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#1A1A1A]">Looking to rent out your property?</h3>
                <p className="text-[#6B6B6B] mt-2">
                  For rentals, our fee is <span className="font-semibold text-[#1A1A1A]">one month&apos;s rent + VAT</span>, 
                  paid by the landlord once the lease is signed. Same premium service, qualified tenants only.
                </p>
              </div>
              <Link href="/contact">
                <Button variant="outline" className="h-11 px-6 rounded-xl border-[#E8E6E3] whitespace-nowrap">
                  Learn More
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-14">
            <span className="text-[#B8926A] font-medium text-sm tracking-wide">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mt-3">Common questions</h2>
          </Reveal>

          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="bg-white rounded-2xl border border-[#E8E6E3] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-medium text-[#1A1A1A] pr-4">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      className="w-6 h-6 rounded-full bg-[#F5F3EF] flex items-center justify-center flex-shrink-0"
                    >
                      <svg className="w-4 h-4 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === i ? "auto" : 0,
                      opacity: openFaq === i ? 1 : 0,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-[#6B6B6B] leading-relaxed">{faq.a}</p>
                  </motion.div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0F0F10]">
        <div className="container mx-auto px-4">
          <Reveal className="text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white">
              Ready to sell your property?
            </h2>
            <p className="text-white/60 mt-4 max-w-xl mx-auto">
              Get a free, no-obligation valuation and see how much your property is worth today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/estimate">
                <Button className="h-12 px-8 rounded-xl bg-[#B8926A] hover:bg-[#A6825C] text-white">
                  Get Free Valuation
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="h-12 px-8 rounded-xl border-white/20 text-white bg-white/5 hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}