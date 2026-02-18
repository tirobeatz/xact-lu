import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CookieConsent } from "@/components/cookie-consent"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#1A1A1A] focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  )
}