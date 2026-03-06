// ============================================
// GS SPORT - BOG iPay Webhook / Callback Handler
// Called by BOG after payment completion
// ============================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { getPaymentStatus } from '@/lib/bog-ipay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, payment_hash, status } = body;

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // Verify payment status with BOG iPay
    let paymentStatus: string;
    try {
      const bogStatus = await getPaymentStatus(order_id);
      paymentStatus = bogStatus.status;
    } catch {
      // If we can't verify with BOG, use the status from callback
      paymentStatus = status || 'unknown';
    }

    const supabase = createAdminSupabaseClient();

    if (paymentStatus === 'COMPLETED' || paymentStatus === 'CAPTURED') {
      // Find order by BOG order ID
      const { data: order, error: findError } = await supabase
        .from('orders')
        .select('*')
        .eq('bog_order_id', order_id)
        .single();

      if (findError || !order) {
        console.error('Order not found for BOG order:', order_id);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Skip if already processed (only process orders still awaiting payment)
      if (order.status !== 'awaiting_payment') {
        return NextResponse.json({ received: true });
      }

      // Update order status to pending (paid, ready for processing)
      await supabase
        .from('orders')
        .update({
          status: 'pending',
          bog_payment_hash: payment_hash || null,
        })
        .eq('id', order.id);

      // Decrease stock now that payment is confirmed
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', order.id);

      if (orderItems) {
        for (const item of orderItems) {
          try {
            await supabase.rpc('decrease_stock', {
              p_product_id: item.product_id,
              p_quantity: item.quantity,
            });
          } catch (stockErr) {
            console.error('Stock decrease failed (non-fatal):', stockErr);
          }
        }
      }
    } else if (paymentStatus === 'REJECTED' || paymentStatus === 'ERROR') {
      // Payment failed — update order status
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('bog_order_id', order_id)
        .single();

      if (order) {
        await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', order.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Also handle GET for redirect-based callbacks
export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get('order_id');

  if (!orderId) {
    return NextResponse.redirect(new URL('/checkout', request.url));
  }

  // Verify with BOG
  try {
    const status = await getPaymentStatus(orderId);
    if (status.status === 'COMPLETED' || status.status === 'CAPTURED') {
      return NextResponse.redirect(
        new URL(`/checkout/success?order_id=${status.shop_order_id}`, request.url)
      );
    }
  } catch {
    // Fall through to checkout page
  }

  return NextResponse.redirect(new URL('/checkout', request.url));
}
