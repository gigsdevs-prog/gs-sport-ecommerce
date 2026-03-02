// ============================================
// GS SPORT - Header Component
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/hooks/useAuth';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { openCart, getItemCount } = useCartStore();
  const { user, isAdmin } = useAuth();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm'
            : 'bg-white'
        }`}
      >
        {/* Top bar */}
        <div className="border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10 text-xs tracking-widest text-neutral-500 uppercase">
              <span>Free shipping on orders over $100</span>
              <span className="hidden sm:block">Premium Athletic Wear</span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-neutral-700 hover:text-black transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-xl lg:text-2xl font-bold tracking-[0.3em] text-black">
                {SITE_NAME}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-widest uppercase text-neutral-600 hover:text-black transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-neutral-700 hover:text-black transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                href="/wishlist"
                className="p-2 text-neutral-700 hover:text-black transition-colors hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              <Link
                href={user ? '/account' : '/auth/login'}
                className="p-2 text-neutral-700 hover:text-black transition-colors hidden sm:block"
                aria-label="Account"
              >
                <User size={20} />
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-xs tracking-widest uppercase text-neutral-500 hover:text-black transition-colors hidden lg:block"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={openCart}
                className="p-2 text-neutral-700 hover:text-black transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
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
                <span className="text-sm tracking-widest uppercase text-neutral-500">Search</span>
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
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  autoFocus
                  className="w-full text-3xl lg:text-4xl font-light border-b-2 border-neutral-200 focus:border-black pb-4 outline-none transition-colors bg-transparent placeholder:text-neutral-300"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-80 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                <span className="text-lg font-bold tracking-[0.2em]">{SITE_NAME}</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-black"
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="p-6 space-y-6">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm tracking-widest uppercase text-neutral-600 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-neutral-100" />
                <Link
                  href={user ? '/account' : '/auth/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm tracking-widest uppercase text-neutral-600 hover:text-black"
                >
                  {user ? 'Account' : 'Sign In'}
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm tracking-widest uppercase text-neutral-600 hover:text-black"
                >
                  Wishlist
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm tracking-widest uppercase text-neutral-600 hover:text-black"
                  >
                    Admin Panel
                  </Link>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-[104px] lg:h-[120px]" />
    </>
  );
}
