// ============================================
// GS SPORT - BOG iPay Webhook / Callback Handler
// Called by BOG after payment completion
// ============================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { getPaymentStatus } from '@/lib/bog-ipay';

// Known BOG iPay IP ranges (ipay.ge production servers)
const BOG_ALLOWED_IPS = [
  '185.139.56.',  // BOG primary range
  '185.139.57.',
  '91.239.206.',
  '10.',          // Allow internal/proxy during development
  '127.0.0.1',
  '::1',
];

function isBogOrigin(ip: string): boolean {
  if (!ip) return false;
  return BOG_ALLOWED_IPS.some(prefix => ip.startsWith(prefix));
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient();
  const clientIp = getClientIp(request);

  let rawPayload: Record<string, unknown> = {};
  let bogOrderId: string | undefined;

  try {
    rawPayload = await request.json();
    const { order_id, payment_hash, status, transaction_id } = rawPayload as {
      order_id?: string;
      payment_hash?: string;
      status?: string;
      transaction_id?: string;
    };

    bogOrderId = order_id;

    // 1. Verify origin
    if (!isBogOrigin(clientIp)) {
      console.warn(`[Webhook] Rejected request from untrusted IP: ${clientIp}`);
      await logWebhookEvent(supabase, {
        event_type: 'payment_callback',
        bog_order_id: order_id,
        status: status || 'unknown',
        transaction_id,
        payment_hash,
        raw_payload: rawPayload,
        ip_address: clientIp,
        processed: false,
        error: `Rejected: untrusted IP ${clientIp}`,
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 2. Validate required fields
    if (!order_id) {
      await logWebhookEvent(supabase, {
        event_type: 'payment_callback',
        status: 'invalid',
        raw_payload: rawPayload,
        ip_address: clientIp,
        processed: false,
        error: 'Missing order_id',
      });
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // 3. Verify payment status with BOG iPay API (never trust callback alone)
    let verifiedStatus: string;
    let verifiedTransactionId: string | undefined = transaction_id;
    let verifiedPaymentHash: string | undefined = payment_hash;

    try {
      const bogResult = await getPaymentStatus(order_id);
      verifiedStatus = bogResult.status;
      if (bogResult.payment_hash) verifiedPaymentHash = bogResult.payment_hash;
      if ((bogResult as Record<string, unknown>).transaction_id) {
        verifiedTransactionId = (bogResult as Record<string, unknown>).transaction_id as string;
      }
    } catch (verifyErr) {
      // Verification failed — do NOT trust the callback status
      console.error(`[Webhook] BOG verification failed for ${order_id}:`, verifyErr);
      await logWebhookEvent(supabase, {
        event_type: 'payment_callback',
        bog_order_id: order_id,
        status: status || 'unknown',
        verified_status: 'VERIFICATION_FAILED',
        transaction_id,
        payment_hash,
        raw_payload: rawPayload,
        ip_address: clientIp,
        processed: false,
        error: `BOG API verification failed: ${verifyErr instanceof Error ? verifyErr.message : 'unknown'}`,
      });
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 502 });
    }

    // 4. Find order in database
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('id, status, bog_order_id')
      .eq('bog_order_id', order_id)
      .single();

    if (findError || !order) {
      console.error(`[Webhook] Order not found for BOG order: ${order_id}`);
      await logWebhookEvent(supabase, {
        event_type: 'payment_callback',
        bog_order_id: order_id,
        status: status || 'unknown',
        verified_status: verifiedStatus,
        transaction_id: verifiedTransactionId,
        payment_hash: verifiedPaymentHash,
        raw_payload: rawPayload,
        ip_address: clientIp,
        processed: false,
        error: 'Order not found in database',
      });
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 5. Process based on verified status
    if (verifiedStatus === 'COMPLETED' || verifiedStatus === 'CAPTURED') {
      // Skip if already processed
      if (order.status !== 'awaiting_payment') {
        await logWebhookEvent(supabase, {
          event_type: 'payment_callback',
          bog_order_id: order_id,
          order_id: order.id,
          status: status || 'unknown',
          verified_status: verifiedStatus,
          transaction_id: verifiedTransactionId,
          payment_hash: verifiedPaymentHash,
          raw_payload: rawPayload,
          ip_address: clientIp,
          processed: true,
          error: `Skipped: order already ${order.status}`,
        });
        return NextResponse.json({ received: true });
      }

      // Update order — mark as paid
      await supabase
        .from('orders')
        .update({
          status: 'pending',
          bog_payment_hash: verifiedPaymentHash || null,
          bog_transaction_id: verifiedTransactionId || null,
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
            console.error('[Webhook] Stock decrease failed (non-fatal):', stockErr);
          }
        }
      }

      console.log(`[Webhook] Payment SUCCESS for order ${order.id} (BOG: ${order_id})`);
      await logWebhookEvent(supabase, {
        event_type: 'payment_callback',
        bog_order_id: order_id,
        order_id: order.id,
        status: status || 'unknown',
        verified_status: verifiedStatus,
        transaction_id: verifiedTransactionId,
        payment_hash: verifiedPaymentHash,
        raw_payload: rawPayload,
        ip_address: clientIp,
        processed: true,
      });

    } else if (verifiedStatus === 'REJECTED' || verifiedStatus === 'ERROR' || verifiedStatus === 'TIMEOUT') {
      // Payment failed
      if (order.status === 'awaiting_payment') {
        await supabase
          .from('orders')
          .update({
            status: 'cancelled',
            bog_transaction_id: verifiedTransactionId || null,
          })
          .eq('id', order.id);
      }

      console.log(`[Webhook] Payment FAILED (${verifiedStatus}) for order ${order.id} (BOG: ${order_id})`);
      await logWebhookEvent(supabase, {
        event_type: 'payment_callback',
        bog_order_id: order_id,
        order_id: order.id,
        status: status || 'unknown',
        verified_status: verifiedStatus,
        transaction_id: verifiedTransactionId,
        payment_hash: verifiedPaymentHash,
        raw_payload: rawPayload,
        ip_address: clientIp,
        processed: true,
      });

    } else {
      // Unknown or still pending status
      console.log(`[Webhook] Unhandled status "${verifiedStatus}" for BOG order ${order_id}`);
      await logWebhookEvent(supabase, {
        event_type: 'payment_callback',
        bog_order_id: order_id,
        order_id: order.id,
        status: status || 'unknown',
        verified_status: verifiedStatus,
        transaction_id: verifiedTransactionId,
        payment_hash: verifiedPaymentHash,
        raw_payload: rawPayload,
        ip_address: clientIp,
        processed: false,
        error: `Unhandled verified status: ${verifiedStatus}`,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Fatal error:', error);
    await logWebhookEvent(supabase, {
      event_type: 'payment_callback',
      bog_order_id: bogOrderId,
      status: 'error',
      raw_payload: rawPayload,
      ip_address: clientIp,
      processed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }).catch(() => {}); // Don't let logging failure mask the real error
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Also handle GET for redirect-based callbacks (user browser redirects after payment)
export async function GET(request: Request) {
  const supabase = createAdminSupabaseClient();
  const url = new URL(request.url);
  const orderId = url.searchParams.get('order_id');
  const clientIp = getClientIp(request);

  if (!orderId) {
    return NextResponse.redirect(new URL('/checkout', request.url));
  }

  // Log redirect callback
  await logWebhookEvent(supabase, {
    event_type: 'redirect_callback',
    bog_order_id: orderId,
    status: 'redirect',
    ip_address: clientIp,
    processed: true,
  }).catch(() => {});

  // Verify with BOG API before showing success
  try {
    const bogResult = await getPaymentStatus(orderId);
    if (bogResult.status === 'COMPLETED' || bogResult.status === 'CAPTURED') {
      return NextResponse.redirect(
        new URL(`/checkout/success?order_id=${bogResult.shop_order_id}`, request.url)
      );
    }
  } catch {
    // Verification failed — redirect to checkout
  }

  return NextResponse.redirect(new URL('/checkout', request.url));
}

// ── Logging helper ──

interface WebhookEventLog {
  event_type: string;
  bog_order_id?: string;
  order_id?: string;
  status: string;
  verified_status?: string;
  transaction_id?: string;
  payment_hash?: string;
  raw_payload?: Record<string, unknown>;
  ip_address?: string;
  processed: boolean;
  error?: string;
}

async function logWebhookEvent(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  event: WebhookEventLog
) {
  try {
    await supabase.from('webhook_events').insert(event);
  } catch (logErr) {
    console.error('[Webhook] Failed to log event:', logErr);
  }
}
