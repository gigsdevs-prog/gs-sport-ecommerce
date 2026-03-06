// ============================================
// GS SPORT - Shop Page
// ============================================

'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ProductCard from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { withTimeout } from '@/utils';
import type { Product, Category } from '@/types';

const supabase = createClient();

function ShopContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const mounted = useRef(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState('newest');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('active', true);

      if (selectedCategory) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', selectedCategory)
          .single();
        if (cat) {
          query = query.eq('category_id', cat.id);
        }
      }

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      query = query
        .gte('price', priceRange[0])
        .lte('price', priceRange[1]);

      switch (sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'name-asc':
          query = query.order('name', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await withTimeout(query, 8000);
      if (error) console.error('Failed to fetch products:', error);
      if (mounted.current) setProducts(data || []);
    } catch (err) {
      console.error('Products fetch error:', err);
      if (mounted.current) setProducts([]);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  useEffect(() => {
    mounted.current = true;
    const fetchCategories = async () => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('categories')
            .select('*')
            .order('name'),
          8000
        );
        if (error) console.error('Failed to fetch categories:', error);
        if (mounted.current && data) setCategories(data);
      } catch (err) {
        console.error('Categories fetch error:', err);
      }
    };
    fetchCategories();
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
  }, [categorySlug]);

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 500]);
    setSortBy('newest');
  };

  const hasActiveFilters = selectedCategory || priceRange[0] > 0 || priceRange[1] < 500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Page header */}
      <div className="mb-8 lg:mb-12">
        <h1 className="text-3xl lg:text-4xl font-light tracking-wide">
          {searchQuery ? `Search: "${searchQuery}"` : selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'All Products'}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {loading ? 'Loading...' : `${products.length} products`}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors"
        >
          <SlidersHorizontal size={16} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 hidden sm:block">Sort by:</span>
          <div className="relative">
            <select
              id="sort-by"
              name="sort-by"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none bg-transparent text-sm pr-6 cursor-pointer outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
            <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters sidebar */}
        {showFilters && (
          <>
            {/* Mobile overlay */}
            <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setShowFilters(false)} />
            <motion.aside
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-xl p-6 pt-20 overflow-y-auto lg:relative lg:top-auto lg:left-auto lg:bottom-auto lg:z-auto lg:w-60 lg:shadow-none lg:p-0 lg:pt-0 lg:overflow-visible flex-shrink-0"
            >
            <div className="sticky top-32 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="text-xs tracking-widest uppercase font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`block text-sm ${!selectedCategory ? 'text-black font-medium' : 'text-neutral-500 hover:text-black'} transition-colors`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`block text-sm ${selectedCategory === cat.slug ? 'text-black font-medium' : 'text-neutral-500 hover:text-black'} transition-colors`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs tracking-widest uppercase font-semibold mb-4">Price Range</h3>
                <div className="space-y-3">
                  <input
                    id="price-range"
                    name="price-range"
                    type="range"
                    min={0}
                    max={500}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-black"
                  />
                  <div className="flex items-center justify-between text-sm text-neutral-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-neutral-500 hover:text-black transition-colors"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}

              {/* Close button mobile */}
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-full py-3 bg-black text-white text-sm rounded-lg mt-4"
              >
                Apply Filters
              </button>
            </div>
          </motion.aside>
          </>
        )}

        {/* Products grid */}
        <div className="flex-1">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-500 text-lg mb-2">No products found</p>
              <p className="text-neutral-400 text-sm">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12"><ProductGridSkeleton /></div>}>
      <ShopContent />
    </Suspense>
  );
}
