"use client"

import { useI18n } from "@/lib/i18n"

export default function ImprintPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#1A1A1A] pt-28 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            {t.legal?.imprint?.title || "Legal Notice (Mentions Légales)"}
          </h1>
          <p className="text-white/60 mt-2">
            {t.legal?.imprint?.subtitle || "Company Information"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#E8E6E3]">
          <div className="prose prose-gray max-w-none">

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Company Information</h2>
              <div className="bg-[#F5F3EF] p-6 rounded-lg text-[#6B6B6B]">
                <p className="font-semibold text-[#1A1A1A] text-lg">Xact Real Estate S.à r.l.</p>
                <p className="mt-4"><strong>Legal Form:</strong> Société à responsabilité limitée (S.à r.l.)</p>
                <p className="mt-2"><strong>Registered Office:</strong></p>
                <p>[Street Address]</p>
                <p>L-[Postal Code] Luxembourg</p>
                <p>Grand Duchy of Luxembourg</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Registration Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#F5F3EF] p-4 rounded-lg">
                  <p className="text-sm text-[#6B6B6B]">RCS Luxembourg</p>
                  <p className="font-semibold text-[#1A1A1A]">B[Registration Number]</p>
                </div>
                <div className="bg-[#F5F3EF] p-4 rounded-lg">
                  <p className="text-sm text-[#6B6B6B]">VAT Number</p>
                  <p className="font-semibold text-[#1A1A1A]">LU[VAT Number]</p>
                </div>
                <div className="bg-[#F5F3EF] p-4 rounded-lg">
                  <p className="text-sm text-[#6B6B6B]">Share Capital</p>
                  <p className="font-semibold text-[#1A1A1A]">€[Amount]</p>
                </div>
                <div className="bg-[#F5F3EF] p-4 rounded-lg">
                  <p className="text-sm text-[#6B6B6B]">Authorization Number</p>
                  <p className="font-semibold text-[#1A1A1A]">[Ministry Authorization]</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Management</h2>
              <div className="bg-[#F5F3EF] p-4 rounded-lg text-[#6B6B6B]">
                <p><strong>Managing Director (Gérant):</strong></p>
                <p>[Name of Managing Director]</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[#F5F3EF] rounded-lg">
                  <svg className="w-6 h-6 text-[#B8926A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Email</p>
                    <p className="font-medium text-[#1A1A1A]">info@xact.lu</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[#F5F3EF] rounded-lg">
                  <svg className="w-6 h-6 text-[#B8926A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Phone</p>
                    <p className="font-medium text-[#1A1A1A]">+352 621 000 000</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Professional Regulation</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Xact Real Estate S.à r.l. is authorized to operate as a real estate agent in Luxembourg
                in accordance with the Law of 2 September 2011 regulating access to the professions of
                craftsman, merchant, and industrialist.
              </p>
              <div className="bg-[#F5F3EF] p-4 rounded-lg mt-4 text-[#6B6B6B]">
                <p><strong>Supervising Authority:</strong></p>
                <p>Ministère de l'Économie</p>
                <p>Direction générale PME, Entrepreneuriat et Marché intérieur</p>
                <p>19-21, boulevard Royal</p>
                <p>L-2449 Luxembourg</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Professional Insurance</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Xact Real Estate holds professional liability insurance in accordance with Luxembourg
                real estate regulations.
              </p>
              <div className="bg-[#F5F3EF] p-4 rounded-lg mt-4 text-[#6B6B6B]">
                <p><strong>Insurer:</strong> [Insurance Company Name]</p>
                <p><strong>Policy Number:</strong> [Policy Number]</p>
                <p><strong>Coverage:</strong> Professional Liability</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Website Hosting</h2>
              <div className="bg-[#F5F3EF] p-4 rounded-lg text-[#6B6B6B]">
                <p><strong>Hosting Provider:</strong> Vercel Inc.</p>
                <p>440 N Barranca Avenue #4133</p>
                <p>Covina, CA 91723</p>
                <p>United States</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Dispute Resolution</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                In accordance with EU Regulation No 524/2013, consumers may submit complaints through the
                European Commission's Online Dispute Resolution (ODR) platform:
              </p>
              <p className="mt-4">
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B8926A] hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                For direct complaints, please contact us at: legal@xact.lu
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Intellectual Property</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                All content on this website, including texts, images, graphics, logos, and software, is the
                property of Xact Real Estate S.à r.l. or its licensors and is protected by Luxembourg and
                international intellectual property laws.
              </p>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                © {new Date().getFullYear()} Xact Real Estate S.à r.l. All rights reserved.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
