// ============================================
// GS SPORT - Admin Dashboard
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/utils';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    total: number;
    status: string;
    created_at: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const [products, orders, users] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id, total, status, created_at').order('created_at', { ascending: false }),
        supabase.from('users').select('id', { count: 'exact', head: true }),
      ]);

      const totalRevenue = orders.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

      setStats({
        totalProducts: products.count || 0,
        totalOrders: orders.data?.length || 0,
        totalUsers: users.count || 0,
        totalRevenue,
        recentOrders: orders.data?.slice(0, 5) || [],
      });
      setLoading(false);
    };
    fetchStats();
  }, [supabase]);

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-purple-50 text-purple-600' },
    { label: 'Users', value: stats.totalUsers, icon: Users, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wide">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Welcome to GS SPORT Admin</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {statCards.map((card, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white p-6 rounded-xl border border-neutral-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                    <card.icon size={20} />
                  </div>
                  <TrendingUp size={16} className="text-green-500" />
                </div>
                <p className="text-2xl font-semibold">{card.value}</p>
                <p className="text-xs text-neutral-500 mt-1">{card.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-neutral-100 p-6">
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">Recent Orders</h2>
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-neutral-500">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="text-left text-xs text-neutral-500 pb-3 font-medium">Order ID</th>
                      <th className="text-left text-xs text-neutral-500 pb-3 font-medium">Amount</th>
                      <th className="text-left text-xs text-neutral-500 pb-3 font-medium">Status</th>
                      <th className="text-left text-xs text-neutral-500 pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map(order => (
                      <tr key={order.id} className="border-b border-neutral-50">
                        <td className="py-3 text-sm font-mono">
                          {order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3 text-sm font-medium">{formatPrice(order.total)}</td>
                        <td className="py-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-neutral-100">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-neutral-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
