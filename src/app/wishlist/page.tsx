// ============================================
// GS SPORT - Wishlist Page
// ============================================

'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useWishlistStore } from '@/store/wishlist';
import ProductCard from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import type { Product } from '@/types';

const supabase = createClient();

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { items } = useWishlistStore();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const fetchProducts = async () => {
      try {
        if (items.length === 0) {
          if (mounted.current) {
            setProducts([]);
            setLoading(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', items)
          .eq('active', true);

        if (error) console.error('Failed to fetch wishlist products:', error);
        if (mounted.current && data) setProducts(data);
      } catch (err) {
        console.error('Wishlist fetch error:', err);
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    fetchProducts();
    return () => { mounted.current = false; };
  }, [items]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-light tracking-wide mb-2">Wishlist</h1>
        <p className="text-sm text-neutral-500 mb-10">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={48} className="text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-500 mb-6">Your wishlist is empty</p>
            <Link href="/shop">
              <Button variant="outline">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
