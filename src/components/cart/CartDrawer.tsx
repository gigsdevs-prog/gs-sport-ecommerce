// ============================================
// GS SPORT - Cart Drawer Component
// ============================================

'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/hooks/useLanguage';
import { formatPrice } from '@/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCartStore();
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className="fixed top-0 right-0 bottom-0 z-[90] w-full sm:w-[420px] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <span className="text-sm font-semibold tracking-widest uppercase">
                  {t('cart')} ({items.length})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-neutral-400 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-neutral-200 mb-4" />
                  <p className="text-neutral-500 text-sm mb-6">{t('cart_empty')}</p>
                  <button
                    onClick={closeCart}
                    className="text-sm tracking-widest uppercase border-b border-black pb-1 hover:text-neutral-600 transition-colors"
                  >
                    {t('continue_shopping')}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence initial={false}>
                    {items.map(item => (
                      <motion.div
                        key={`${item.product.id}-${item.size}-${item.color}`}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4"
                      >
                        <div className="w-20 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                              <ShoppingBag size={24} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                          <p className="text-xs text-neutral-500 mt-1">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' / '}
                            {item.color && `Color: ${item.color}`}
                          </p>
                          <p className="text-sm font-medium mt-2">
                            {formatPrice(item.product.price)}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-neutral-200 rounded">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                                }
                                className="p-1.5 text-neutral-400 hover:text-black transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                                }
                                className="p-1.5 text-neutral-400 hover:text-black transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id, item.size, item.color)}
                              className="text-xs text-neutral-400 hover:text-red-500 transition-colors underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-100 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">{t('subtotal')}</span>
                  <span className="text-lg font-semibold">{formatPrice(getTotal())}</span>
                </div>
                <p className="text-xs text-neutral-400">
                  {t('shipping_taxes_checkout')}
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-black text-white text-center py-4 text-sm tracking-widest uppercase font-medium hover:bg-neutral-800 transition-colors"
                >
                  {t('checkout')}
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center py-2 text-sm text-neutral-500 hover:text-black transition-colors"
                >
                  {t('continue_shopping')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
