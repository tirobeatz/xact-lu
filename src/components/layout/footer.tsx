import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A]">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#B8926A] flex items-center justify-center">
                <span className="text-lg font-bold text-white">X</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white leading-none">Xact</span>
                <span className="text-[9px] tracking-[0.15em] uppercase text-white/50">Luxembourg</span>
              </div>
            </Link>
            <p className="mt-6 text-white/50 text-sm leading-relaxed max-w-xs">
              Luxembourg&apos;s trusted platform for premium real estate. Find your perfect property or list with confidence.
            </p>
            
            {/* Social */}
            <div className="flex gap-3 mt-8">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#B8926A] flex items-center justify-center text-white/50 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#B8926A] flex items-center justify-center text-white/50 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#B8926A] flex items-center justify-center text-white/50 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Properties */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-medium mb-5">Properties</h4>
            <ul className="space-y-3">
              <li><Link href="/properties?type=SALE" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Buy</Link></li>
              <li><Link href="/properties?type=RENT" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Rent</Link></li>
              <li><Link href="/properties?category=RESIDENTIAL" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Residential</Link></li>
              <li><Link href="/properties?category=COMMERCIAL" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Commercial</Link></li>
              <li><Link href="/properties?category=LAND" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Land</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-medium mb-5">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/estimate" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Free Estimate</Link></li>
              <li><Link href="/dashboard/listings/new" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Submit Property</Link></li>
              <li><Link href="/pricing" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Pricing Plans</Link></li>
              <li><Link href="/agencies" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">For Agencies</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-medium mb-5">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Careers</Link></li>
              <li><Link href="/press" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-medium mb-5">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Terms of Use</Link></li>
              <li><Link href="/cookies" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">Cookie Policy</Link></li>
              <li><Link href="/gdpr" className="text-sm text-white/50 hover:text-[#B8926A] transition-colors">GDPR</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Xact Luxembourg. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-white/40">
              <a href="mailto:info@xact.lu" className="hover:text-[#B8926A] transition-colors">info@xact.lu</a>
              <span className="hidden sm:inline">•</span>
              <a href="tel:+352123456789" className="hover:text-[#B8926A] transition-colors">+352 123 456 789</a>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Luxembourg City</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}