// ============================================
// GS SPORT - Product Detail Page
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Minus, Plus, ChevronLeft, ShoppingBag, Star, ZoomIn, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { formatPrice, getDiscountPercentage } from '@/utils';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Product, Review } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const supabase = createClient();

  const fetchProduct = useCallback(async () => {
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('active', true)
      .single();
    
    if (data) {
      setProduct(data);
      if (data.sizes?.length) setSelectedSize(data.sizes[0]);
      if (data.colors?.length) setSelectedColor(data.colors[0]);

      // Fetch related products
      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', data.category_id)
        .eq('active', true)
        .neq('id', data.id)
        .limit(4);
      if (related) setRelatedProducts(related);

      // Fetch reviews
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*, user:users(full_name, avatar_url)')
        .eq('product_id', data.id)
        .order('created_at', { ascending: false });
      if (reviewData) setReviews(reviewData);
    }
    setLoading(false);
  }, [supabase, slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, selectedSize, selectedColor);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[3/4] bg-neutral-100 rounded-lg" />
          <div className="space-y-4 py-8">
            <div className="h-6 bg-neutral-100 rounded w-1/4" />
            <div className="h-10 bg-neutral-100 rounded w-3/4" />
            <div className="h-6 bg-neutral-100 rounded w-1/3" />
            <div className="h-32 bg-neutral-100 rounded mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-light mb-4">Product not found</h1>
        <Link href="/shop" className="text-sm underline text-neutral-500 hover:text-black">
          Back to shop
        </Link>
      </div>
    );
  }

  const discount = product.compare_at_price
    ? getDiscountPercentage(product.price, product.compare_at_price)
    : 0;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          Back to shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              className="relative aspect-[3/4] bg-neutral-50 rounded-lg overflow-hidden cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
              layoutId="product-image"
            >
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-200">
                  <ShoppingBag size={64} />
                </div>
              )}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
                <ZoomIn size={18} className="text-neutral-600" />
              </div>
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs tracking-wider uppercase px-3 py-1 rounded">
                  -{discount}%
                </span>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-24 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {product.category && (
                <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-3">
                  {product.category.name}
                </p>
              )}
              <h1 className="text-2xl lg:text-3xl font-light tracking-wide">
                {product.name}
              </h1>

              {/* Rating */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-500">
                    ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mt-4">
                <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-lg text-neutral-400 line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              {/* Description (short) */}
              <p className="mt-6 text-sm text-neutral-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              <div className="mt-8 space-y-6">
                {/* Size selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs tracking-widest uppercase font-medium">Size</span>
                      <button className="text-xs text-neutral-500 underline">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[48px] h-12 px-4 border text-sm transition-all duration-200 ${
                            selectedSize === size
                              ? 'border-black bg-black text-white'
                              : 'border-neutral-200 hover:border-black'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color selector */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span className="text-xs tracking-widest uppercase font-medium mb-3 block">
                      Color: {selectedColor}
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 border text-sm transition-all duration-200 ${
                            selectedColor === color
                              ? 'border-black bg-black text-white'
                              : 'border-neutral-200 hover:border-black'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <span className="text-xs tracking-widest uppercase font-medium mb-3 block">
                    Quantity
                  </span>
                  <div className="inline-flex items-center border border-neutral-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-black transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 h-12 flex items-center justify-center text-sm font-medium border-x border-neutral-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-black transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleAddToCart} size="lg" fullWidth disabled={product.stock <= 0}>
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <button
                    onClick={() => toggleItem(product.id)}
                    className={`w-14 h-14 flex-shrink-0 border flex items-center justify-center transition-colors ${
                      isInWishlist(product.id)
                        ? 'border-red-200 text-red-500 bg-red-50'
                        : 'border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200'
                    }`}
                  >
                    <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Stock info */}
                {product.stock > 0 && product.stock <= 5 && (
                  <p className="text-xs text-orange-600">Only {product.stock} left in stock</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tabs: Description & Reviews */}
        <div className="mt-16 lg:mt-24">
          <div className="border-b border-neutral-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 text-sm tracking-widest uppercase transition-colors relative ${
                  activeTab === 'description' ? 'text-black font-medium' : 'text-neutral-400'
                }`}
              >
                Description
                {activeTab === 'description' && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 text-sm tracking-widest uppercase transition-colors relative ${
                  activeTab === 'reviews' ? 'text-black font-medium' : 'text-neutral-400'
                }`}
              >
                Reviews ({reviews.length})
                {activeTab === 'reviews' && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'description' ? (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-8 max-w-3xl"
              >
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-8"
              >
                {reviews.length === 0 ? (
                  <p className="text-sm text-neutral-500">No reviews yet.</p>
                ) : (
                  <div className="space-y-6 max-w-2xl">
                    {reviews.map(review => (
                      <div key={review.id} className="border-b border-neutral-100 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200'}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">
                            {review.user?.full_name || 'Anonymous'}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ScrollReveal className="mt-16 lg:mt-24">
            <h2 className="text-2xl font-light tracking-wide mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomOpen && product.images?.[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomOpen(false)}
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center cursor-zoom-out"
          >
            <button
              onClick={() => setZoomOpen(false)}
              className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-black"
            >
              <X size={24} />
            </button>
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              width={1200}
              height={1600}
              className="max-h-[90vh] w-auto object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
