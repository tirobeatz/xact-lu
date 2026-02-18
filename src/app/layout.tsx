import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/providers/session-provider"
import { I18nProvider } from "@/lib/i18n"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Xact | Luxembourg Real Estate",
    template: "%s | Xact",
  },
  description: "Luxembourg's trusted platform for premium real estate listings. Buy, sell, or rent properties with confidence.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  )
}