// ============================================
// GS SPORT - Order History Page
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatDate } from '@/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import type { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusBadge = (status: string) => {
    const s = ORDER_STATUSES.find(s => s.value === status);
    return s ? (
      <span className={`text-xs px-3 py-1 rounded-full ${s.color}`}>
        {s.label}
      </span>
    ) : null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        Back to account
      </Link>

      <h1 className="text-3xl font-light tracking-wide mb-10">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="text-neutral-200 mx-auto mb-4" />
          <p className="text-neutral-500 mb-6">No orders yet</p>
          <Link href="/shop" className="text-sm underline hover:no-underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-neutral-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-neutral-400 mb-1">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-neutral-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(order.status)}
                  <p className="text-sm font-semibold mt-2">{formatPrice(order.total)}</p>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="border-t border-neutral-100 pt-4 space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">
                        {item.product?.name || 'Product'} × {item.quantity}
                        {item.size && ` (${item.size})`}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
