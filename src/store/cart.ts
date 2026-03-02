// ============================================
// GS SPORT - Cart Store (Zustand)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity: number, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity, size, color) => {
        set(state => {
          const existingIndex = state.items.findIndex(
            item => item.product.id === product.id && item.size === size && item.color === color
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems, isOpen: true };
          }

          return {
            items: [...state.items, { product, quantity, size, color }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, size, color) => {
        set(state => ({
          items: state.items.filter(
            item => !(item.product.id === productId && item.size === size && item.color === color)
          ),
        }));
      },

      updateQuantity: (productId, size, color, quantity) => {
        set(state => ({
          items: state.items.map(item =>
            item.product.id === productId && item.size === size && item.color === color
              ? { ...item, quantity: Math.max(0, quantity) }
              : item
          ).filter(item => item.quantity > 0),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'gs-sport-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
