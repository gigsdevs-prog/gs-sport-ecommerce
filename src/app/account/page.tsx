// ============================================
// GS SPORT - Account Page
// ============================================

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Heart, User, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const accountLinks = [
  { href: '/account/orders', label: 'My Orders', icon: Package, desc: 'View your order history' },
  { href: '/wishlist', label: 'Wishlist', icon: Heart, desc: 'Products you love' },
  { href: '/account/profile', label: 'Profile', icon: User, desc: 'Manage your account' },
];

export default function AccountPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 bg-neutral-100 rounded w-1/3 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-neutral-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10">
          <h1 className="text-3xl font-light tracking-wide">My Account</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Welcome back, {profile?.full_name || user?.email}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {accountLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between p-5 bg-neutral-50 hover:bg-neutral-100 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <link.icon size={20} className="text-neutral-400" />
                <div>
                  <span className="text-sm font-medium">{link.label}</span>
                  <p className="text-xs text-neutral-400 mt-0.5">{link.desc}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-neutral-300 group-hover:text-neutral-600 transition-colors" />
            </Link>
          ))}
        </div>

        <Button variant="ghost" onClick={handleSignOut} className="text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut size={18} />
          Sign Out
        </Button>
      </motion.div>
    </div>
  );
}
