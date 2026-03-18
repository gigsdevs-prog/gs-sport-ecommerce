-- Add 'awaiting_payment' to orders status CHECK constraint
-- Run this in Supabase SQL Editor

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('awaiting_payment', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'));
