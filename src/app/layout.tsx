import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/providers/session-provider"
import { I18nProvider } from "@/lib/i18n"
import { ToastProvider } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xact.lu"

export const metadata: Metadata = {
  title: {
    default: "Xact | Luxembourg Real Estate",
    template: "%s | Xact",
  },
  description: "Luxembourg's trusted platform for premium real estate listings. Buy, sell, or rent properties with confidence.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Xact Luxembourg",
    title: "Xact | Luxembourg Real Estate",
    description: "Luxembourg's trusted platform for premium real estate listings. Buy, sell, or rent properties with confidence.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xact | Luxembourg Real Estate",
    description: "Luxembourg's trusted platform for premium real estate listings.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <SessionProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </SessionProvider>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  )
}