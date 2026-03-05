// ============================================
// GS SPORT - My Room (User Dashboard)
// ============================================

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Package, Heart, User, LogOut, ChevronRight, Settings,
  ShoppingBag, Camera, Edit2, MapPin, Mail, Shield, Star
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatDate } from '@/utils';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { Order } from '@/types';

const supabase = createClient();

export default function MyRoomPage() {
  const { user, profile, loading, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const mounted = useRef(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      const { data: orders, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      if (ordersErr) console.error('Failed to fetch orders:', ordersErr);
      if (mounted.current && orders) setRecentOrders(orders);

      const { count, error: countErr } = await supabase
        .from('wishlist')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (countErr) console.error('Failed to fetch wishlist count:', countErr);
      if (mounted.current) setWishlistCount(count || 0);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    }
  }, [user]);

  useEffect(() => {
    mounted.current = true;
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }
    if (user) {
      fetchDashboardData();
      setFullName(profile?.full_name || '');
    }
    return () => { mounted.current = false; };
  }, [user, loading, profile, router, fetchDashboardData]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    router.push('/');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    setAvatarUploading(true);
    const file = e.target.files[0];
    const ext = file.name.split('.').pop();
    const fileName = `${user.id}.${ext}`;

    const { error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
    if (error) {
      toast.error('Upload failed');
      setAvatarUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
    // Add cache buster to force image refresh
    const avatarWithCacheBust = `${publicUrl}?t=${Date.now()}`;
    await supabase.from('users').update({ avatar_url: avatarWithCacheBust }).eq('id', user.id);
    toast.success('Avatar updated');
    setAvatarUploading(false);
    // Update profile state locally instead of reloading (which logs user out)
    if (profile) {
      // Force re-render by updating profile reference
      Object.assign(profile, { avatar_url: avatarWithCacheBust });
    }
    router.refresh();
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from('users').update({ full_name: fullName }).eq('id', user.id);
    if (error) { toast.error('Failed to save'); return; }
    toast.success('Profile updated');
    setEditing(false);
  };

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-neutral-100 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-neutral-100 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-6 md:p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-neutral-700 overflow-hidden flex-shrink-0 border-2 border-white/20">
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Avatar" width={96} height={96} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-light text-white/60">
                    {(profile?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                  </div>
                )}
              </div>
              <label className="absolute inset-0 rounded-full cursor-pointer flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={avatarUploading} />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input value={fullName} onChange={e => setFullName(e.target.value)} className="bg-white/10 border border-white/20 rounded px-3 py-1.5 text-white text-lg outline-none focus:border-white/40" placeholder="Your name" />
                    <button onClick={handleSaveProfile} className="text-xs bg-white text-black px-3 py-1.5 rounded font-medium">Save</button>
                    <button onClick={() => setEditing(false)} className="text-xs text-white/60 hover:text-white">Cancel</button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl md:text-2xl font-light tracking-wide">{profile?.full_name || 'Welcome'}</h1>
                    <button onClick={() => setEditing(true)} className="text-white/40 hover:text-white"><Edit2 size={14} /></button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/60 flex-wrap">
                <span className="flex items-center gap-1.5"><Mail size={14} />{user?.email}</span>
                {isAdmin && <span className="flex items-center gap-1.5 text-yellow-400"><Shield size={14} />Admin</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 sm:flex-col flex-shrink-0">
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-4 py-2.5 text-xs tracking-widest uppercase transition-all">
                  <Settings size={14} />Admin Panel
                </Link>
              )}
              <button onClick={handleSignOut} className="flex items-center gap-2 bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-lg px-4 py-2.5 text-xs tracking-widest uppercase text-white/70 hover:text-red-300 transition-all">
                <LogOut size={14} />Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { label: 'Orders', value: recentOrders.length, icon: Package, href: '/account/orders', color: 'text-blue-500' },
            { label: 'Wishlist', value: wishlistCount, icon: Heart, href: '/wishlist', color: 'text-red-500' },
            { label: 'Addresses', value: '—', icon: MapPin, href: '/checkout', color: 'text-green-500' },
            { label: 'Reviews', value: '—', icon: Star, href: '#', color: 'text-purple-500' },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href} className="bg-white border border-neutral-100 rounded-xl p-4 md:p-5 hover:shadow-md transition-all group">
              <stat.icon size={20} className={`${stat.color} mb-2`} />
              <p className="text-xl md:text-2xl font-light">{stat.value}</p>
              <p className="text-xs text-neutral-400 tracking-wide uppercase mt-1">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white border border-neutral-100 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <h2 className="text-sm font-medium tracking-wide">Recent Orders</h2>
              <Link href="/account/orders" className="text-xs text-neutral-400 hover:text-black transition-colors flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingBag size={40} className="text-neutral-200 mx-auto mb-3" />
                <p className="text-sm text-neutral-400 mb-4">No orders yet</p>
                <Link href="/shop"><Button size="sm">Start Shopping</Button></Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-50">
                {recentOrders.map(order => (
                  <div key={order.id} className="p-4 md:p-5 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-neutral-400 font-mono">#{order.id.slice(0, 8)}</span>
                      <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full font-medium ${statusColor[order.status] || 'bg-neutral-100 text-neutral-600'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                      <span className="text-xs text-neutral-400">{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            {[
              { href: '/account/orders', label: 'My Orders', icon: Package, desc: 'Track and manage orders' },
              { href: '/wishlist', label: 'Wishlist', icon: Heart, desc: 'Saved products' },
              { href: '/account', label: 'Edit Profile', icon: User, desc: 'Update your info' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-xl hover:shadow-md transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center">
                    <link.icon size={18} className="text-neutral-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">{link.label}</span>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{link.desc}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-300 group-hover:text-neutral-600 transition-colors" />
              </Link>
            ))}

            {isAdmin && (
              <Link href="/admin" className="flex items-center justify-between p-4 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Settings size={18} className="text-white/70" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Admin Panel</span>
                    <p className="text-[11px] text-white/50 mt-0.5">Manage your store</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
