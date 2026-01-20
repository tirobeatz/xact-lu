"use client"

import { useI18n } from "@/lib/i18n"
import Link from "next/link"

export default function TermsOfServicePage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#1A1A1A] pt-28 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            {t.legal?.terms?.title || "Terms of Service"}
          </h1>
          <p className="text-white/60 mt-2">
            {t.legal?.terms?.lastUpdated || "Last updated"}: January 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#E8E6E3]">
          <div className="prose prose-gray max-w-none">

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">1. Agreement to Terms</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                By accessing or using the Xact Real Estate website (xact.lu) and services, you agree to be
                bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not
                use our services.
              </p>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                These Terms constitute a legally binding agreement between you and Xact Real Estate S.à r.l.,
                a company registered in Luxembourg.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">2. Description of Services</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Xact provides an online platform for:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2 mt-4">
                <li>Listing residential and commercial properties for sale or rent in Luxembourg</li>
                <li>Searching and browsing property listings</li>
                <li>Connecting property seekers with property owners and agents</li>
                <li>Property valuation services</li>
                <li>Real estate brokerage services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">3. User Accounts</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
                <li>Not share your account with others</li>
              </ul>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">4. Property Listings</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">
                Users who list properties agree to:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2">
                <li>Provide accurate, complete, and truthful property information</li>
                <li>Have legal authority to list the property</li>
                <li>Only upload images they have the right to use</li>
                <li>Update listings promptly when property status changes</li>
                <li>Comply with all applicable Luxembourg real estate laws and regulations</li>
                <li>Not engage in fraudulent or misleading practices</li>
              </ul>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                Xact reserves the right to review, modify, or remove any listing that violates these Terms
                or our content guidelines.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">5. Prohibited Activities</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2">
                <li>Use the platform for any illegal purpose</li>
                <li>Post false, misleading, or fraudulent listings</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Spam or send unsolicited communications</li>
                <li>Scrape or collect data without authorization</li>
                <li>Interfere with the platform's operation or security</li>
                <li>Circumvent any access restrictions or security measures</li>
                <li>Use the platform to discriminate against any person</li>
                <li>Violate any intellectual property rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">6. Fees and Commissions</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Xact's brokerage services are subject to commission fees as communicated during the listing
                process. Current fee structures are available upon request. Commission is only payable upon
                successful completion of a transaction. All fees are subject to Luxembourg VAT where applicable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">7. Intellectual Property</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                All content on the Xact platform, including but not limited to text, graphics, logos, images,
                and software, is the property of Xact or its content suppliers and is protected by Luxembourg
                and international intellectual property laws.
              </p>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                By uploading content to our platform, you grant Xact a non-exclusive, worldwide, royalty-free
                license to use, display, and distribute that content in connection with our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                The platform is provided "as is" without warranties of any kind. Xact does not guarantee:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2 mt-4">
                <li>The accuracy or completeness of property listings</li>
                <li>The availability or legality of any listed property</li>
                <li>The conduct of any users on the platform</li>
                <li>Uninterrupted or error-free service</li>
              </ul>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                Users are advised to independently verify all property information before making any decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">9. Limitation of Liability</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                To the maximum extent permitted by Luxembourg law, Xact shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages arising from your use of the platform,
                including but not limited to loss of profits, data, or business opportunities.
              </p>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                Our total liability for any claim shall not exceed the amount paid by you to Xact in the
                twelve (12) months preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">10. Indemnification</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                You agree to indemnify and hold harmless Xact, its officers, directors, employees, and agents
                from any claims, damages, losses, or expenses arising from your violation of these Terms or
                your use of the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">11. Termination</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Either party may terminate this agreement at any time. You may delete your account through
                your profile settings or by contacting us. We may suspend or terminate your access if you
                violate these Terms, without prior notice.
              </p>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                Upon termination, your right to use the platform ceases, but provisions that by their nature
                should survive will remain in effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">12. Changes to Terms</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                We may modify these Terms at any time. We will notify users of material changes by posting
                the updated Terms on our website and updating the "Last Updated" date. Continued use of
                the platform after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">13. Governing Law and Jurisdiction</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                These Terms are governed by the laws of the Grand Duchy of Luxembourg. Any disputes shall
                be subject to the exclusive jurisdiction of the courts of Luxembourg City, without prejudice
                to your rights under EU consumer protection regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">14. Contact Information</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                For questions about these Terms, please contact us:
              </p>
              <div className="bg-[#F5F3EF] p-4 rounded-lg mt-4 text-[#6B6B6B]">
                <p><strong>Xact Real Estate S.à r.l.</strong></p>
                <p>Email: legal@xact.lu</p>
                <p>Phone: +352 621 000 000</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
