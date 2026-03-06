// ============================================
// GS SPORT - BOG iPay Integration (Bank of Georgia)
// Redirect-based payment: create order → redirect to BOG → callback
// Docs: https://api.bog.ge/docs/payments/ipay
// ============================================

const BOG_IPAY_API = 'https://ipay.ge/opay/api/v1';

interface IPayOrderRequest {
  intent: 'CAPTURE';
  items: {
    amount: string;
    description: string;
    quantity: string;
    product_id: string;
  }[];
  locale: 'ka' | 'en';
  shop_order_id: string;
  redirect_url: string;
  show_shop_order_id_on_extract: boolean;
  capture_method: 'AUTOMATIC';
  purchase_units: {
    amount: {
      currency_code: 'GEL' | 'USD' | 'EUR';
      value: string;
    };
  };
}

interface IPayOrderResponse {
  status: string;
  order_id: string;
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
}

interface IPayAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Cache token in memory
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get BOG iPay access token (OAuth2 client_credentials)
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const clientId = process.env.BOG_IPAY_CLIENT_ID;
  const clientSecret = process.env.BOG_IPAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('BOG iPay credentials not configured');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://ipay.ge/opay/api/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`BOG iPay auth failed: ${res.status} ${text}`);
  }

  const data: IPayAuthResponse = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

/**
 * Create a payment order on BOG iPay
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

  const orderRequest: IPayOrderRequest = {
    intent: 'CAPTURE',
    items: items.map(item => ({
      amount: item.price.toFixed(2),
      description: item.name,
      quantity: item.quantity.toString(),
      product_id: item.productId,
    })),
    locale,
    shop_order_id: shopOrderId,
    redirect_url: `${siteUrl}/checkout/success?order_id=${shopOrderId}`,
    show_shop_order_id_on_extract: true,
    capture_method: 'AUTOMATIC',
    purchase_units: {
      amount: {
        currency_code: currency,
        value: amount.toFixed(2),
      },
    },
  };

  const res = await fetch(`${BOG_IPAY_API}/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderRequest),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`BOG iPay order creation failed: ${res.status} ${text}`);
  }

  const data: IPayOrderResponse = await res.json();

  // Find the redirect link
  const approveLink = data.links?.find(l => l.rel === 'approve');
  if (!approveLink) {
    throw new Error('No redirect URL returned from BOG iPay');
  }

  return {
    orderId: data.order_id,
    redirectUrl: approveLink.href,
  };
}

/**
 * Check payment status with BOG iPay
 */
export async function getPaymentStatus(orderId: string): Promise<{
  status: string;
  order_id: string;
  shop_order_id: string;
  payment_hash?: string;
}> {
  const token = await getAccessToken();

  const res = await fetch(`${BOG_IPAY_API}/checkout/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`BOG iPay status check failed: ${res.status} ${text}`);
  }

  return res.json();
}
