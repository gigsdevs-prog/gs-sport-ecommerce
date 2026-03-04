// ============================================
// GS SPORT - Checkout Page
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ShoppingBag, Lock, Banknote, CreditCard, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { shippingSchema, type ShippingFormData } from '@/lib/validations';
import { formatPrice } from '@/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

type PaymentMethod = 'cash' | 'card';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  const subtotal = getTotal();
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  const onSubmit = async (shippingData: ShippingFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method: paymentMethod,
          items: items.map(item => ({
            product_id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.product.images?.[0] || '',
          })),
          shipping_address: shippingData,
          subtotal,
          shipping,
          tax,
          total,
        }),
      });

      const data = await res.json();

      if (data.url) {
        // Card payment — redirect to BOG iPay
        window.location.href = data.url;
      } else if (data.success) {
        // Cash on delivery — order placed directly
        clearCart();
        router.push(`/checkout/success?order_id=${data.order_id}`);
      } else {
        throw new Error(data.error || 'Failed to place order');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="text-neutral-200 mx-auto mb-4" />
        <h1 className="text-2xl font-light mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push('/shop')} variant="outline">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl font-light tracking-wide mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Shipping Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7"
        >
          <h2 className="text-xs tracking-[0.2em] uppercase font-semibold mb-6">
            Shipping Information
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} id="checkout-form" className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>
            <Input
              label="Address"
              placeholder="123 Main St"
              error={errors.address?.message}
              {...register('address')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="New York"
                error={errors.city?.message}
                {...register('city')}
              />
              <Input
                label="State"
                placeholder="NY"
                error={errors.state?.message}
                {...register('state')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ZIP Code"
                placeholder="10001"
                error={errors.zip?.message}
                {...register('zip')}
              />
              <Input
                label="Country"
                placeholder="United States"
                error={errors.country?.message}
                {...register('country')}
              />
            </div>
            <Input
              label="Phone"
              type="tel"
              placeholder="+995 5XX XXX XXX"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </form>

          {/* Payment Method */}
          <div className="mt-8">
            <h2 className="text-xs tracking-[0.2em] uppercase font-semibold mb-4">
              Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`relative flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 ${
                  paymentMethod === 'cash'
                    ? 'border-black bg-neutral-50'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {paymentMethod === 'cash' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <Banknote size={28} className={paymentMethod === 'cash' ? 'text-black' : 'text-neutral-400'} />
                <span className={`text-sm font-medium ${paymentMethod === 'cash' ? 'text-black' : 'text-neutral-500'}`}>
                  Cash on Delivery
                </span>
                <span className="text-xs text-neutral-400">Pay when you receive</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`relative flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 ${
                  paymentMethod === 'card'
                    ? 'border-black bg-neutral-50'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {paymentMethod === 'card' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <CreditCard size={28} className={paymentMethod === 'card' ? 'text-black' : 'text-neutral-400'} />
                <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-black' : 'text-neutral-500'}`}>
                  Pay by Card
                </span>
                <span className="text-xs text-neutral-400">Visa / Mastercard</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5"
        >
          <div className="bg-neutral-50 p-6 lg:p-8 sticky top-32">
            <h2 className="text-xs tracking-[0.2em] uppercase font-semibold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="w-16 h-20 bg-white rounded overflow-hidden relative flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {item.size && `${item.size}`}
                      {item.size && item.color && ' / '}
                      {item.color && `${item.color}`}
                      {' × '}{item.quantity}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-3 border-t border-neutral-200">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-6"
            >
              {paymentMethod === 'card' ? (
                <>
                  <CreditCard size={16} />
                  Pay {formatPrice(total)}
                </>
              ) : (
                <>
                  <Banknote size={16} />
                  Place Order — {formatPrice(total)}
                </>
              )}
            </Button>

            <p className="mt-4 text-xs text-neutral-400 text-center flex items-center justify-center gap-1">
              {paymentMethod === 'card' ? (
                <>
                  <Lock size={12} />
                  Secure payment via Bank of Georgia
                </>
              ) : (
                <>
                  <Banknote size={12} />
                  Pay with cash when your order arrives
                </>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
