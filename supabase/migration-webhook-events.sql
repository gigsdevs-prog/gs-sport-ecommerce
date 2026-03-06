-- ============================================
-- Webhook Events Table + Transaction ID on Orders
-- ============================================

-- 1. Log every BOG webhook event for auditing
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,              -- 'payment_callback', 'redirect_callback'
  bog_order_id TEXT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  status TEXT NOT NULL,                  -- raw status from BOG or verified status
  verified_status TEXT,                  -- status after API verification
  transaction_id TEXT,
  payment_hash TEXT,
  raw_payload JSONB,                     -- full raw POST body for debugging
  ip_address TEXT,
  processed BOOLEAN NOT NULL DEFAULT false,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhook_events_bog_order ON public.webhook_events(bog_order_id);
CREATE INDEX idx_webhook_events_order_id ON public.webhook_events(order_id);

-- 2. Add transaction_id column to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS bog_transaction_id TEXT;
