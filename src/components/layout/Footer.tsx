// ============================================
// GS SPORT - Footer Component (lightweight)
// ============================================

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME } from '@/lib/constants';
import { useSiteContent } from '@/hooks/useSiteContent';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'Men', href: '/shop?category=men' },
    { label: 'Women', href: '/shop?category=women' },
    { label: 'Accessories', href: '/shop?category=accessories' },
    { label: 'Shoes', href: '/shop?category=shoes' },
    { label: 'New Arrivals', href: '/shop' },
    { label: 'Sale', href: '/shop?sale=true' },
  ],
  help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Track Order', href: '/account/orders' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  const { getText } = useSiteContent();
  const logoUrl = getText('site_logo_url') || '/logo.png';

  return (
    <footer className="bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src={logoUrl} alt="GS SPORT" width={200} height={200} className="h-14 w-auto brightness-0 invert" />
              <span className="text-white text-2xl font-semibold tracking-wide">• Sport</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              {getText('footer_about')}
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase font-semibold mb-6">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase font-semibold mb-6">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. {getText('footer_copyright')}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
