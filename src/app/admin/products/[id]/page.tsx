// ============================================
// GS SPORT - Admin: Edit Product Page
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { productSchema, type ProductFormData } from '@/lib/validations';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { Category } from '@/types';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sizesInput, setSizesInput] = useState('');
  const [colorsInput, setColorsInput] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      compare_at_price: null,
      category_id: '',
      stock: 0,
      sizes: [],
      colors: [],
      featured: false,
      best_seller: false,
      active: true,
    },
  });

  const fetchProduct = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').eq('id', productId).single();
    if (data) {
      setValue('name', data.name);
      setValue('slug', data.slug);
      setValue('description', data.description);
      setValue('price', data.price);
      setValue('compare_at_price', data.compare_at_price);
      setValue('category_id', data.category_id);
      setValue('stock', data.stock);
      setValue('featured', data.featured);
      setValue('best_seller', data.best_seller);
      setValue('active', data.active);
      setImages(data.images || []);
      setSizesInput((data.sizes || []).join(', '));
      setColorsInput((data.colors || []).join(', '));
    }
    setLoading(false);
  }, [supabase, productId, setValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').eq('active', true).order('name');
      if (data) setCategories(data);
    };
    fetchCategories();
    fetchProduct();
  }, [supabase, fetchProduct]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const newImages = [...images];
    for (const file of Array.from(e.target.files)) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const { error } = await supabase.storage.from('products').upload(fileName, file);
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
        newImages.push(publicUrl);
      }
    }
    setImages(newImages);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    setSaving(true);
    const sizes = sizesInput.split(',').map(s => s.trim()).filter(Boolean);
    const colors = colorsInput.split(',').map(s => s.trim()).filter(Boolean);

    const { error } = await supabase.from('products')
      .update({ ...data, images, sizes, colors, updated_at: new Date().toISOString() })
      .eq('id', productId);

    if (error) {
      toast.error('Failed to update product');
      setSaving(false);
      return;
    }
    toast.success('Product updated!');
    router.push('/admin/products');
  };

  if (loading) {
    return <div className="animate-pulse"><div className="h-8 bg-neutral-100 rounded w-1/3 mb-8" /></div>;
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors mb-6"
      >
        <ChevronLeft size={16} />
        Back to products
      </Link>

      <h1 className="text-2xl font-light tracking-wide mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Images */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-3 font-medium">
            Product Images
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-28 bg-neutral-100 rounded overflow-hidden group">
                <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="w-24 h-28 border-2 border-dashed border-neutral-200 rounded flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors">
              <Upload size={20} className="text-neutral-400 mb-1" />
              <span className="text-xs text-neutral-400">Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          {uploading && <p className="text-xs text-neutral-500 mt-2">Uploading...</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Product Name" error={errors.name?.message} {...register('name')} />
          <Input label="Slug" error={errors.slug?.message} {...register('slug')} />
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2 font-medium">Description</label>
          <textarea {...register('description')} rows={4}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-black transition-colors resize-none" />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Price" type="number" step="0.01" error={errors.price?.message} {...register('price', { valueAsNumber: true })} />
          <Input label="Compare at Price" type="number" step="0.01" {...register('compare_at_price', { valueAsNumber: true })} />
          <Input label="Stock" type="number" error={errors.stock?.message} {...register('stock', { valueAsNumber: true })} />
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2 font-medium">Category</label>
          <select {...register('category_id')} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-black transition-colors">
            <option value="">Select category</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2 font-medium">Sizes (comma separated)</label>
            <input value={sizesInput} onChange={e => setSizesInput(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-black transition-colors" />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2 font-medium">Colors (comma separated)</label>
            <input value={colorsInput} onChange={e => setColorsInput(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-black transition-colors" />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('featured')} className="accent-black" />
            <span className="text-sm">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('best_seller')} className="accent-black" />
            <span className="text-sm">Best Seller</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('active')} className="accent-black" />
            <span className="text-sm">Active</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" loading={saving}>Save Changes</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
