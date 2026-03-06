// ============================================
// GS SPORT - BOG Payment Integration (Bank of Georgia)
// New BOG Payments API: https://api.bog.ge
// ============================================

const BOG_API_BASE = (process.env.BOG_IPAY_API_URL || 'https://api.bog.ge/payments/v1').trim();
const BOG_AUTH_URL = (process.env.BOG_AUTH_URL || 'https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token').trim();

interface BOGAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Cache token in memory
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get BOG access token (OAuth2 client_credentials)
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const clientId = (process.env.BOG_IPAY_CLIENT_ID || '').trim();
  const clientSecret = (process.env.BOG_IPAY_CLIENT_SECRET || '').trim();

  if (!clientId || !clientSecret) {
    console.error('BOG credentials missing. CLIENT_ID length:', clientId.length, 'CLIENT_SECRET length:', clientSecret.length);
    throw new Error('BOG credentials not configured');
  }

  const res = await fetch(BOG_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`BOG auth failed: ${res.status} ${text}`);
  }

  const data: BOGAuthResponse = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

/**
 * Create a payment order on BOG Payments API
 */
export async function createPaymentOrder(params: {
  shopOrderId: string;
  amount: number;
  currency?: 'GEL' | 'USD' | 'EUR';
  items: { name: string; price: number; quantity: number; productId: string }[];
  locale?: 'ka' | 'en';
}): Promise<{ orderId: string; redirectUrl: string }> {
  const token = await getAccessToken();
  const { shopOrderId, amount, currency = 'GEL', items, locale = 'ka' } = params;

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gssport.ge').trim();

  const orderRequest = {
    callback_url: `${siteUrl}/api/webhook`,
    external_order_id: shopOrderId,
    purchase_units: {
      currency: currency,
      total_amount: Number(amount.toFixed(2)),
      basket: items.map(item => ({
        quantity: item.quantity,
        unit_price: Number(item.price.toFixed(2)),
        product_id: item.productId,
      })),
    },
    redirect_urls: {
      success: `${siteUrl}/api/webhook?shop_order_id=${shopOrderId}`,
      fail: `${siteUrl}/checkout?payment=failed`,
    },
    language: locale,
  };

  console.log('[BOG] Creating order, request:', JSON.stringify(orderRequest));

  const res = await fetch(`${BOG_API_BASE}/ecommerce/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderRequest),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[BOG] Order creation failed:', res.status, text);
    throw new Error(`BOG order creation failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  console.log('[BOG] Order creation response:', JSON.stringify(data));

  // Extract redirect URL - support multiple response formats
  const redirectUrl = data._links?.redirect?.href 
    || data.links?.find((l: { rel: string; href: string }) => l.rel === 'redirect' || l.rel === 'approve')?.href
    || data.redirect_url
    || data.redirectUrl;

  if (!redirectUrl) {
    console.error('[BOG] No redirect URL in response:', JSON.stringify(data));
    throw new Error('No redirect URL returned from BOG');
  }

  const orderId = data.id || data.order_id;

  return {
    orderId,
    redirectUrl,
  };
}

/**
 * Check payment status with BOG Payments API
 */
export async function getPaymentStatus(orderId: string): Promise<{
  status: string;
  order_id: string;
  shop_order_id: string;
  payment_hash?: string;
}> {
  const token = await getAccessToken();

  const res = await fetch(`${BOG_API_BASE}/receipt/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`BOG status check failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  
  // Map BOG response to our expected format
  return {
    status: data.order_status?.key || data.status || 'UNKNOWN',
    order_id: data.id || orderId,
    shop_order_id: data.external_order_id || '',
    payment_hash: data.payment_hash,
  };
}
