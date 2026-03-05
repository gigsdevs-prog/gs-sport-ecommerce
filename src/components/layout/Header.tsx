// ============================================
// GS SPORT - Header Component
// Nav+Search left, Logo+SPORT center, icons right
// Animated top bar with rotating announcements
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, Heart, Menu, X, Settings } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/hooks/useAuth';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useLanguage, LanguageSelector } from '@/hooks/useLanguage';
import { NAV_LINKS } from '@/lib/constants';

const TOP_BAR_MESSAGES = [
  'topbar_free_shipping',
  'topbar_new_arrivals',
  'topbar_premium_athletic',
  'topbar_easy_returns',
  'topbar_signup_discount',
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [topBarIndex, setTopBarIndex] = useState(0);
  const { openCart, getItemCount } = useCartStore();
  const { user, isAdmin } = useAuth();
  const { getText } = useSiteContent();
  const { t } = useLanguage();
  const logoUrl = getText('site_logo_url') || '/logo.png';
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotate top bar messages
  useEffect(() => {
    const interval = setInterval(() => {
      setTopBarIndex(prev => (prev + 1) % TOP_BAR_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm'
            : 'bg-white'
        }`}
      >
        {/* Top bar — animated rotating messages */}
        <div className="border-b border-neutral-100 bg-neutral-950 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-9 relative">
              <div className="w-16" />
              <div className="flex-1 flex justify-center relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={topBarIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-light absolute"
                  >
                    {t(TOP_BAR_MESSAGES[topBarIndex])}
                  </motion.span>
                </AnimatePresence>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 lg:h-20">
            {/* LEFT: Hamburger (mobile) + Nav Links (desktop) + Search */}
            <div className="flex items-center gap-1 z-10">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-neutral-700 hover:text-black transition-colors"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              {/* Desktop nav links */}
              <nav className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-2.5 py-1.5 text-[11px] tracking-[0.15em] uppercase text-neutral-600 hover:text-black transition-colors font-medium"
                  >
                    {t(link.label.toLowerCase()) || link.label}
                  </Link>
                ))}
              </nav>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-neutral-700 hover:text-black transition-colors"
                aria-label="Search"
              >
                <Search size={19} />
              </button>
            </div>

            {/* CENTER: Logo (absolutely centered) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link href="/">
                <Image
                  src={logoUrl}
                  alt="GS SPORT"
                  width={200}
                  height={200}
                  className="h-12 sm:h-14 lg:h-16 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* RIGHT: Wishlist + User + Admin + Cart */}
            <div className="flex items-center gap-0.5 sm:gap-1 z-10">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden lg:flex items-center gap-1.5 bg-neutral-900 text-white px-3 py-1.5 text-[10px] tracking-widest uppercase font-medium hover:bg-neutral-700 transition-colors rounded"
                >
                  <Settings size={12} />
                  Admin
                </Link>
              )}

              <Link
                href="/wishlist"
                className="hidden sm:block p-2 text-neutral-700 hover:text-black transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={19} />
              </Link>

              <Link
                href={user ? '/account' : '/auth/login'}
                className="p-2 text-neutral-700 hover:text-black transition-colors"
                aria-label="Account"
              >
                <User size={19} />
              </Link>

              <button
                onClick={openCart}
                className="p-2 text-neutral-700 hover:text-black transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag size={19} />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0 -right-0 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white flex items-start justify-center pt-32"
          >
            <div className="w-full max-w-2xl px-4">
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm tracking-widest uppercase text-neutral-500">{t('search')}</span>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-neutral-500 hover:text-black"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  id="search-input"
                  name="search"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  autoFocus
                  className="w-full text-3xl lg:text-4xl font-light border-b-2 border-neutral-200 focus:border-black pb-4 outline-none transition-colors bg-transparent placeholder:text-neutral-300"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-out Menu from LEFT */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-80 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Image src={logoUrl} alt="GS SPORT" width={100} height={100} className="h-10 w-auto" />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-black transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="p-6 space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 text-sm tracking-widest uppercase text-neutral-600 hover:text-black hover:pl-2 transition-all duration-300 border-b border-neutral-50"
                    >
                      {t(link.label.toLowerCase()) || link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4 space-y-1"
                >
                  <Link
                    href={user ? '/account' : '/auth/login'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-sm tracking-widest uppercase text-neutral-600 hover:text-black hover:pl-2 transition-all duration-300 border-b border-neutral-50"
                  >
                    {user ? t('my_account') : t('sign_in')}
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-sm tracking-widest uppercase text-neutral-600 hover:text-black hover:pl-2 transition-all duration-300 border-b border-neutral-50"
                  >
                    {t('wishlist')}
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 text-sm tracking-widest uppercase text-neutral-600 hover:text-black hover:pl-2 transition-all duration-300 border-b border-neutral-50"
                    >
                      {t('admin_panel')}
                    </Link>
                  )}
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-[100px] lg:h-[116px]" />
    </>
  );
}
