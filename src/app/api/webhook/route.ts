// ============================================
// GS SPORT - Stripe Webhook Handler
// ============================================

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook signature verification failed';
    console.error('Webhook error:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const supabase = createAdminSupabaseClient();
      const metadata = session.metadata!;
      const items = JSON.parse(metadata.items);
      const shippingAddress = JSON.parse(metadata.shipping_address);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: metadata.user_id !== 'guest' ? metadata.user_id : null,
          status: 'pending',
          total: parseFloat(metadata.total),
          subtotal: parseFloat(metadata.subtotal),
          shipping: parseFloat(metadata.shipping),
          tax: parseFloat(metadata.tax),
          stripe_payment_intent_id: session.payment_intent as string,
          shipping_address: shippingAddress,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item: { product_id: string; quantity: number; price: number; size: string; color: string }) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        size: item.size || '',
        color: item.color || '',
      }));

      await supabase.from('order_items').insert(orderItems);

      // Update product stock
      for (const item of items) {
        await supabase.rpc('decrease_stock', {
          p_id: item.product_id,
          amount: item.quantity,
        });
      }
    } catch (error) {
      console.error('Order creation error:', error);
    }
  }

  return NextResponse.json({ received: true });
}
