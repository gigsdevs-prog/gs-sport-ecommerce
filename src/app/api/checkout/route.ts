// ============================================
// GS SPORT - Checkout API Route (Cash + Card)
// ============================================

import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';
import { createPaymentOrder } from '@/lib/bog-ipay';

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { payment_method, items, shipping_address, subtotal, shipping, tax, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const adminClient = createAdminSupabaseClient();
    const isCash = payment_method === 'cash';

    // Verify user exists in public.users if logged in
    let userId: string | null = null;
    if (user?.id) {
      const { data: dbUser } = await adminClient
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
      userId = dbUser ? user.id : null;
    }

    // Create order in DB
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        payment_method: isCash ? 'cash' : 'card',
        total,
        subtotal,
        shipping,
        tax,
        shipping_address,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json({ error: orderError.message || 'Failed to create order' }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item: { product_id: string; quantity: number; price: number; size: string; color: string }) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      size: item.size || '',
      color: item.color || '',
    }));
    await adminClient.from('order_items').insert(orderItems);

    // Cash on delivery — decrease stock and confirm immediately
    if (isCash) {
      for (const item of items) {
        try {
          await adminClient.rpc('decrease_stock', {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
          });
        } catch (stockErr) {
          console.error('Stock decrease failed (non-fatal):', stockErr);
        }
      }
      return NextResponse.json({ success: true, order_id: order.id });
    }

    // Card payment — redirect to BOG iPay
    const payment = await createPaymentOrder({
      shopOrderId: order.id,
      amount: total,
      currency: 'GEL',
      items: items.map((item: { name: string; price: number; quantity: number; product_id: string }) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        productId: item.product_id,
      })),
    });

    await adminClient
      .from('orders')
      .update({ bog_order_id: payment.orderId })
      .eq('id', order.id);

    return NextResponse.json({ url: payment.redirectUrl });
  } catch (error: unknown) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
