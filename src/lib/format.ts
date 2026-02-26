/**
 * Format a number with comma separators (e.g., 1000000 → "1,000,000")
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
