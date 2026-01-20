"use client"

import { useI18n } from "@/lib/i18n"
import Link from "next/link"

export default function CookiePolicyPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#1A1A1A] pt-28 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            {t.legal?.cookies?.title || "Cookie Policy"}
          </h1>
          <p className="text-white/60 mt-2">
            {t.legal?.cookies?.lastUpdated || "Last updated"}: January 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#E8E6E3]">
          <div className="prose prose-gray max-w-none">

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">1. What Are Cookies?</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile)
                when you visit a website. They help websites function properly, provide a better user
                experience, and enable us to understand how you interact with our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">2. How We Use Cookies</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">
                Xact Real Estate uses cookies to:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2">
                <li>Keep you signed in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Improve our services based on usage patterns</li>
                <li>Ensure the security of your account</li>
                <li>Remember your language preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">3. Types of Cookies We Use</h2>

              <div className="space-y-6">
                <div className="border border-[#E8E6E3] rounded-lg p-4">
                  <h3 className="font-semibold text-[#1A1A1A] mb-2">Essential Cookies (Strictly Necessary)</h3>
                  <p className="text-[#6B6B6B] text-sm mb-3">
                    These cookies are required for the website to function and cannot be disabled.
                  </p>
                  <div className="bg-[#F5F3EF] rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-[#E8E6E3]">
                        <tr>
                          <th className="text-left p-2 text-[#1A1A1A]">Cookie</th>
                          <th className="text-left p-2 text-[#1A1A1A]">Purpose</th>
                          <th className="text-left p-2 text-[#1A1A1A]">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-[#6B6B6B]">
                        <tr className="border-t border-[#E8E6E3]">
                          <td className="p-2">next-auth.session-token</td>
                          <td className="p-2">User authentication</td>
                          <td className="p-2">Session / 30 days</td>
                        </tr>
                        <tr className="border-t border-[#E8E6E3]">
                          <td className="p-2">next-auth.csrf-token</td>
                          <td className="p-2">Security protection</td>
                          <td className="p-2">Session</td>
                        </tr>
                        <tr className="border-t border-[#E8E6E3]">
                          <td className="p-2">xact-cookie-consent</td>
                          <td className="p-2">Cookie preferences</td>
                          <td className="p-2">1 year</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border border-[#E8E6E3] rounded-lg p-4">
                  <h3 className="font-semibold text-[#1A1A1A] mb-2">Functional Cookies</h3>
                  <p className="text-[#6B6B6B] text-sm mb-3">
                    These cookies enable personalized features and remember your preferences.
                  </p>
                  <div className="bg-[#F5F3EF] rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-[#E8E6E3]">
                        <tr>
                          <th className="text-left p-2 text-[#1A1A1A]">Cookie</th>
                          <th className="text-left p-2 text-[#1A1A1A]">Purpose</th>
                          <th className="text-left p-2 text-[#1A1A1A]">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-[#6B6B6B]">
                        <tr className="border-t border-[#E8E6E3]">
                          <td className="p-2">xact-language</td>
                          <td className="p-2">Language preference</td>
                          <td className="p-2">1 year</td>
                        </tr>
                        <tr className="border-t border-[#E8E6E3]">
                          <td className="p-2">xact-search-preferences</td>
                          <td className="p-2">Search filters</td>
                          <td className="p-2">30 days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border border-[#E8E6E3] rounded-lg p-4">
                  <h3 className="font-semibold text-[#1A1A1A] mb-2">Analytics Cookies</h3>
                  <p className="text-[#6B6B6B] text-sm mb-3">
                    These cookies help us understand how visitors interact with our website.
                  </p>
                  <div className="bg-[#F5F3EF] rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-[#E8E6E3]">
                        <tr>
                          <th className="text-left p-2 text-[#1A1A1A]">Cookie</th>
                          <th className="text-left p-2 text-[#1A1A1A]">Purpose</th>
                          <th className="text-left p-2 text-[#1A1A1A]">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-[#6B6B6B]">
                        <tr className="border-t border-[#E8E6E3]">
                          <td className="p-2">_ga</td>
                          <td className="p-2">Google Analytics - User identification</td>
                          <td className="p-2">2 years</td>
                        </tr>
                        <tr className="border-t border-[#E8E6E3]">
                          <td className="p-2">_gid</td>
                          <td className="p-2">Google Analytics - Session identification</td>
                          <td className="p-2">24 hours</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">4. Third-Party Cookies</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">
                Some cookies are placed by third-party services that appear on our pages:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2">
                <li><strong>Google Analytics:</strong> Website usage analytics</li>
                <li><strong>Google Maps:</strong> Property location maps</li>
              </ul>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                These third parties have their own privacy policies governing the use of cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">5. Managing Your Cookie Preferences</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">
                You can control and manage cookies in several ways:
              </p>

              <h3 className="font-semibold text-[#1A1A1A] mt-4 mb-2">Cookie Consent Banner</h3>
              <p className="text-[#6B6B6B] leading-relaxed">
                When you first visit our website, you can choose which types of cookies to accept through
                our cookie consent banner.
              </p>

              <h3 className="font-semibold text-[#1A1A1A] mt-4 mb-2">Browser Settings</h3>
              <p className="text-[#6B6B6B] leading-relaxed">
                Most browsers allow you to manage cookies through their settings. You can:
              </p>
              <ul className="list-disc list-inside text-[#6B6B6B] space-y-2 mt-2">
                <li>Block all cookies</li>
                <li>Accept only first-party cookies</li>
                <li>Delete cookies when you close the browser</li>
                <li>Browse in "incognito" or "private" mode</li>
              </ul>

              <div className="bg-[#F5F3EF] p-4 rounded-lg mt-4">
                <p className="text-[#6B6B6B] text-sm">
                  <strong>Note:</strong> Blocking essential cookies may affect the functionality of our website,
                  including the ability to sign in or save your preferences.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">6. Browser-Specific Instructions</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">
                To manage cookies in your browser, follow these links:
              </p>
              <ul className="space-y-2 text-[#6B6B6B]">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#B8926A] hover:underline">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-[#B8926A] hover:underline">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#B8926A] hover:underline">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#B8926A] hover:underline">
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">7. Changes to This Policy</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page
                with an updated "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">8. Contact Us</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="bg-[#F5F3EF] p-4 rounded-lg mt-4 text-[#6B6B6B]">
                <p>Email: privacy@xact.lu</p>
                <p>Phone: +352 621 000 000</p>
              </div>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                For more information about how we handle your personal data, please see our{" "}
                <Link href="/legal/privacy" className="text-[#B8926A] hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
