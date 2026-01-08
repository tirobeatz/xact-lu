import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-LU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatArea(area: number): string {
  return `${area.toLocaleString("fr-LU")} m²`
}