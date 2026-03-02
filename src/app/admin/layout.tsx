// ============================================
// GS SPORT - Admin Layout
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  FileText,
  Menu,
  X,
  ChevronLeft,
  Tags,
} from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/content', label: 'Content', icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-[104px] left-4 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/20"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-white shadow-xl"
            >
              <div className="p-4 flex items-center justify-between border-b">
                <span className="text-sm font-bold tracking-widest">ADMIN</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {sidebarLinks.map(link => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                        isActive
                          ? 'bg-black text-white'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <link.icon size={18} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-[120px] left-0 bottom-0 w-64 bg-white border-r border-neutral-100 overflow-y-auto z-30">
        <div className="p-6 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-widest uppercase text-neutral-400 mb-1">{SITE_NAME}</p>
              <p className="text-sm font-semibold">Admin Panel</p>
            </div>
            <Link href="/" className="text-neutral-400 hover:text-black">
              <ChevronLeft size={18} />
            </Link>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8 min-h-[calc(100vh-120px)]">
        {children}
      </main>
    </div>
  );
}
