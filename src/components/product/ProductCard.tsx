// ============================================
// GS SPORT - Product Card Component
// ============================================

'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { formatPrice, getDiscountPercentage } from '@/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = memo(function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const isWishlisted = isInWishlist(product.id);
  const discount = product.compare_at_price
    ? getDiscountPercentage(product.price, product.compare_at_price)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.sizes?.[0] || '', product.colors?.[0] || '');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/shop/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] mb-3 sm:mb-4 bg-neutral-50 rounded-lg overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading={index < 4 ? 'eager' : 'lazy'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-200">
              <ShoppingBag size={48} />
            </div>
          )}

          {/* Hover overlay with second image */}
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] tracking-wider uppercase px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
            {product.best_seller && (
              <span className="bg-black text-white text-[10px] tracking-wider uppercase px-2 py-1 rounded">
                Best Seller
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
                isWishlisted ? 'text-red-500' : 'text-neutral-600 hover:text-red-500'
              }`}
              aria-label="Add to wishlist"
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Quick add */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <button
              onClick={handleQuickAdd}
              className="w-full bg-white/95 backdrop-blur-sm text-black py-3 text-xs tracking-widest uppercase font-medium hover:bg-black hover:text-white transition-all duration-300 rounded"
            >
              Quick Add
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-xs sm:text-sm font-medium text-neutral-800 group-hover:text-black transition-colors truncate">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold">{formatPrice(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-xs sm:text-sm text-neutral-400 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
          {product.colors && product.colors.length > 1 && (
            <p className="text-xs text-neutral-400">{product.colors.length} colors</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
});

export default ProductCard;
