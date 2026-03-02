// ============================================
// GS SPORT - Checkout Success Page
// ============================================

'use client';

import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import Button from '@/components/ui/Button';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCartStore();

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-light tracking-wide mb-4">Thank You!</h1>
        <p className="text-neutral-500 mb-2">Your order has been placed successfully.</p>
        <p className="text-sm text-neutral-400 mb-8">
          We&apos;ll send you a confirmation email shortly.
        </p>

        <div className="bg-neutral-50 p-6 rounded-lg mb-8">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
            <Package size={18} />
            <span>Your order is being processed</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/orders">
            <Button variant="outline">
              View Orders
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/shop">
            <Button>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
