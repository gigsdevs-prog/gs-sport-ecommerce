// ============================================
// GS SPORT - Admin Products Page
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/utils';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  const fetchProducts = useCallback(async () => {
    let query = supabase
      .from('products')
      .select('*, category:categories(name)')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data } = await query;
    if (data) setProducts(data);
    setLoading(false);
  }, [supabase, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus size={18} />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 text-sm outline-none focus:border-black transition-colors rounded-lg"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-neutral-500">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left text-xs text-neutral-500 p-4 font-medium">Product</th>
                  <th className="text-left text-xs text-neutral-500 p-4 font-medium">Category</th>
                  <th className="text-left text-xs text-neutral-500 p-4 font-medium">Price</th>
                  <th className="text-left text-xs text-neutral-500 p-4 font-medium">Stock</th>
                  <th className="text-left text-xs text-neutral-500 p-4 font-medium">Status</th>
                  <th className="text-right text-xs text-neutral-500 p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-neutral-100 rounded overflow-hidden relative flex-shrink-0">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                              <Package size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-neutral-400">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-neutral-600">
                      {product.category?.name || '—'}
                    </td>
                    <td className="p-4 text-sm font-medium">{formatPrice(product.price)}</td>
                    <td className="p-4">
                      <span className={`text-sm ${product.stock <= 5 ? 'text-red-500 font-medium' : 'text-neutral-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.active ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {product.active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-neutral-400 hover:text-black transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
