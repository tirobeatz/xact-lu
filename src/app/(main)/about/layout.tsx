import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the team behind Xact Real Estate. A boutique Luxembourg agency with 7+ years of experience, 350+ properties sold, and a 98% client satisfaction rate.",
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
