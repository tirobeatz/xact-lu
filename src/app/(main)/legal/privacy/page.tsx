"use client"

import { useI18n } from "@/lib/i18n"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#1A1A1A] pt-28 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            {t.legal?.privacy?.title || "Privacy Policy"}
          </h1>
          <p className="text-white/60 mt-2">
            {t.legal?.privacy?.lastUpdated || "Last updated"}: January 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#E8E6E3]">
          <div className="prose prose-gray max-w-none">

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">1. Introduction</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Xact Real Estate S.à r.l. ("Xact", "we", "us", or "our") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                you visit our website xact.lu and use our services.
              </p>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                We comply with the General Data Protection Regulation (GDPR) (EU) 2016/679 and Luxembourg's
                data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">2. Data Controller</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                The data controller responsible for your personal data is:
              </p>
              <div className="bg-[#F5F3EF] p-4 rounded-lg mt-4 text-[#6B6B6B]">
                <p><strong>Xact Real Estate S.à r.l.</strong></p>
                <p>[Your Address]</p>
                <p>L-[Postal Code] Luxembourg</p>
                <p>Email: privacy@xact.lu</p>
                <p>RCS Luxembourg: B[Number]</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">3. Information We Collect</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2">
                <li><strong>Account Information:</strong> Name, email address, phone number, password when you create an account</li>
                <li><strong>Property Listings:</strong> Property details, images, and descriptions you submit</li>
                <li><strong>Contact Forms:</strong> Information you provide when contacting us or agents</li>
                <li><strong>Communications:</strong> Messages sent through our platform</li>
                <li><strong>Payment Information:</strong> When applicable, processed securely by our payment providers</li>
              </ul>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                <strong>Automatically Collected Information:</strong>
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2 mt-2">
                <li>IP address and device information</li>
                <li>Browser type and settings</li>
                <li>Pages visited and interactions on our website</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar technologies (see our <Link href="/legal/cookies" className="text-[#B8926A] hover:underline">Cookie Policy</Link>)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">4. How We Use Your Information</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2">
                <li>To provide and maintain our services</li>
                <li>To process and manage property listings</li>
                <li>To facilitate communication between users and property agents</li>
                <li>To send you service-related communications</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To improve and personalize your experience</li>
                <li>To comply with legal obligations</li>
                <li>To send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">5. Legal Basis for Processing</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">
                We process your personal data based on the following legal grounds:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2">
                <li><strong>Contract Performance:</strong> To provide our services and fulfill our contractual obligations</li>
                <li><strong>Legitimate Interests:</strong> To improve our services and ensure security</li>
                <li><strong>Consent:</strong> For marketing communications and optional features</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">6. Data Sharing and Disclosure</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2">
                <li><strong>Property Agents:</strong> When you contact an agent about a property</li>
                <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                We do not sell your personal data to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">7. Data Retention</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                We retain your personal data for as long as necessary to provide our services and fulfill the
                purposes described in this policy. Account data is retained until you request deletion.
                Property listings are retained for the duration they are active plus a reasonable period for
                legal and business purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">8. Your Rights</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">
                Under GDPR, you have the following rights:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2">
                <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                To exercise these rights, contact us at privacy@xact.lu.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">9. Data Security</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data
                against unauthorized access, alteration, disclosure, or destruction. This includes encryption,
                secure servers, and regular security assessments.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">10. International Data Transfers</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Your data is primarily processed within the European Union. If we transfer data outside the EU,
                we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved
                by the European Commission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">11. Changes to This Policy</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes
                by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">12. Contact Us & Complaints</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-[#F5F3EF] p-4 rounded-lg mt-4 text-[#6B6B6B]">
                <p>Email: privacy@xact.lu</p>
                <p>Phone: +352 621 000 000</p>
              </div>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                You also have the right to lodge a complaint with the Luxembourg data protection authority
                (Commission Nationale pour la Protection des Données - CNPD) at <a href="https://cnpd.public.lu" target="_blank" rel="noopener noreferrer" className="text-[#B8926A] hover:underline">cnpd.public.lu</a>.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
