// ============================================
// GS SPORT - Admin: Orders Page
// ============================================

'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatDate } from '@/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import toast from 'react-hot-toast';
import type { Order, OrderStatus } from '@/types';

const supabase = createClient();

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const statusCounts = useMemo(() => {
    return orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
  }, [orders]);

  const fetchOrders = useCallback(async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(name, images)), user:users(email, full_name)')
        .order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) console.error('Failed to fetch orders:', error);
      if (data) setOrders(data);
    } catch (err) {
      console.error('Orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });

      const result = await response.json();
      if (!response.ok) { toast.error(result.error || 'Failed to update'); return; }
      toast.success('Status updated');
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error('Network error');
    }
  };

  const getStatusBadge = (status: string) => {
    const s = ORDER_STATUSES.find(s => s.value === status);
    return s ? <span className={`text-xs px-3 py-1 rounded-full ${s.color}`}>{s.label}</span> : null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Orders</h1>
          <p className="text-sm text-neutral-500 mt-1">{orders.length} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setStatusFilter('')}
          className={`text-xs px-4 py-2 rounded-full border transition-colors ${
            !statusFilter ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-black'
          }`}
        >
          All
        </button>
        {ORDER_STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`text-xs px-4 py-2 rounded-full border transition-colors ${
              statusFilter === s.value ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-black'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2 text-xs">
        <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">All: {orders.length}</span>
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700">Awaiting Payment: {statusCounts.awaiting_payment || 0}</span>
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">Processing: {statusCounts.processing || 0}</span>
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">Delivered: {statusCounts.delivered || 0}</span>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-neutral-500">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <ShoppingCart size={48} className="text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-500">No orders found</p>
          </div>
        ) : (
          orders.map(order => {
            const firstItemImage = order.items?.[0]?.product?.images?.[0];
            const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl border border-neutral-100 overflow-hidden"
              >
              <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-6">
                  {firstItemImage ? (
                    <img
                      src={firstItemImage}
                      alt="First product"
                      className="w-12 h-12 rounded border border-neutral-100 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded border border-neutral-100 bg-neutral-50" />
                  )}
                  <div>
                    <p className="text-sm font-mono font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm">{order.user?.full_name || order.user?.email || 'Guest'}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{itemCount} item{itemCount === 1 ? '' : 's'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  {order.payment_method && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.payment_method === 'card' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {order.payment_method === 'card' ? 'Card' : 'Cash'}
                    </span>
                  )}
                  <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
                  <ChevronDown size={16} className={`text-neutral-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded details */}
              {expandedOrder === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-neutral-100 p-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="text-xs tracking-widest uppercase font-medium mb-3">Items</h4>
                      <div className="space-y-2">
                        {order.items?.map(item => (
                          <div key={item.id} className="flex items-center justify-between text-sm gap-3">
                            <div className="flex items-center gap-3">
                              {item.product?.images?.[0] && (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product?.name || 'Product'}
                                  className="w-12 h-12 object-cover rounded border border-neutral-100 flex-shrink-0"
                                />
                              )}
                              <span className="text-neutral-600">
                                {item.product?.name || 'Product'} × {item.quantity}
                                {item.size && ` (${item.size})`}
                                {item.color && ` - ${item.color}`}
                              </span>
                            </div>
                            <span className="font-medium flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-neutral-100 mt-3 pt-3 space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">Shipping</span><span>{formatPrice(order.shipping)}</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">Tax</span><span>{formatPrice(order.tax)}</span></div>
                        <div className="flex justify-between font-semibold pt-1"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                      </div>
                    </div>

                    {/* Customer & Address */}
                    <div>
                      <h4 className="text-xs tracking-widest uppercase font-medium mb-3">Shipping Address</h4>
                      {order.shipping_address && (
                        <div className="text-sm text-neutral-600 space-y-1">
                          <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                          <p>{order.shipping_address.address}</p>
                          <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                          <p>{order.shipping_address.phone}</p>
                        </div>
                      )}

                      <h4 className="text-xs tracking-widest uppercase font-medium mb-3 mt-6">Update Status</h4>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {(['processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(status => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => updateStatus(order.id, status)}
                            disabled={order.status === status}
                            className={`px-3 py-2 border rounded text-xs uppercase tracking-wide transition-colors ${
                              order.status === status
                                ? 'bg-black text-white border-black cursor-not-allowed'
                                : 'border-neutral-200 hover:border-black'
                            }`}
                          >
                            {status.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="w-full px-3 py-2 border border-neutral-200 text-sm rounded outline-none focus:border-black"
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
