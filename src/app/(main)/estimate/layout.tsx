import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Property Estimation",
  description: "Get a free property valuation in Luxembourg. Submit your property details and our experts will provide a market estimation.",
}

export default function EstimateLayout({ children }: { children: React.ReactNode }) {
  return children
}
