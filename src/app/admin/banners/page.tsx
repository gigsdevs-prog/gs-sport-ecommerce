// ============================================
// GS SPORT - Admin: Banners Page
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/utils';
import toast from 'react-hot-toast';

const supabase = createClient();

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchBanners = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) console.error('Failed to fetch banners:', error);
      if (data) setBanners(data);
    } catch (err) {
      console.error('Banners fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const name = `banner-${Date.now()}.${ext}`;

    // Upload without compression — preserve original quality
    const { error } = await supabase.storage
      .from('banners')
      .upload(name, file, {
        cacheControl: '31536000',
        upsert: false,
        contentType: file.type, // preserve original MIME type
      });

    if (error) { toast.error('Upload failed'); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from('banners').getPublicUrl(name);
    setImageUrl(publicUrl);
    setUploading(false);
  };

  const createBanner = async () => {
    if (!title || !imageUrl) { toast.error('Title and image are required'); return; }

    try {
      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle: subtitle || null,
          image_url: imageUrl,
          link: link || null,
          active: true,
          sort_order: banners.length,
        }),
      });

      const result = await response.json();
      if (!response.ok) { toast.error(result.error || 'Failed to create banner'); return; }

      toast.success('Banner created');
      setTitle(''); setSubtitle(''); setLink(''); setImageUrl('');
      setShowForm(false);
      fetchBanners();
    } catch (err) {
      console.error('Create banner error:', err);
      toast.error('Network error — please try again');
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const response = await fetch('/api/admin/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !active }),
      });
      if (!response.ok) { toast.error('Failed to update'); return; }
      toast.success(active ? 'Banner hidden' : 'Banner visible');
      fetchBanners();
    } catch (err) {
      console.error('Toggle banner error:', err);
      toast.error('Network error');
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      const response = await fetch('/api/admin/banners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) { toast.error('Failed to delete'); return; }
      toast.success('Banner deleted');
      fetchBanners();
    } catch (err) {
      console.error('Delete banner error:', err);
      toast.error('Network error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Banners</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage homepage hero banners (supports images & GIFs)</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-neutral-800 transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Banner'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-neutral-100 p-6 mb-6"
        >
          <h3 className="text-sm font-medium mb-4">New Banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Title *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded text-sm outline-none focus:border-black"
                placeholder="Banner title"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Subtitle</label>
              <input
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded text-sm outline-none focus:border-black"
                placeholder="Optional subtitle"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Link URL</label>
              <input
                value={link}
                onChange={e => setLink(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded text-sm outline-none focus:border-black"
                placeholder="/shop or /shop/category"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Image / GIF *</label>
              {imageUrl ? (
                <div className="relative w-full h-32 bg-neutral-50 rounded overflow-hidden">
                  <img src={imageUrl} alt="" className="w-full h-full object-contain" />
                  <button onClick={() => setImageUrl('')} className="absolute top-1 right-1 p-1 bg-white/80 rounded-full">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 w-full h-24 border-2 border-dashed border-neutral-200 rounded cursor-pointer hover:border-black transition-colors text-sm text-neutral-400">
                  {uploading ? 'Uploading...' : <><Upload size={16} /> Upload Image / GIF</>}
                  <input
                    type="file"
                    accept="image/*,.gif"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])}
                  />
                </label>
              )}
            </div>
          </div>
          <button
            onClick={createBanner}
            disabled={uploading || !title || !imageUrl}
            className="px-6 py-2 bg-black text-white text-sm rounded hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            Create Banner
          </button>
        </motion.div>
      )}

      {/* Banners List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-neutral-500">Loading...</div>
        ) : banners.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <ImageIcon size={48} className="text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-500">No banners yet</p>
            <button onClick={() => setShowForm(true)} className="mt-3 text-sm underline">Add your first banner</button>
          </div>
        ) : (
          banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`bg-white rounded-xl border border-neutral-100 overflow-hidden flex items-center gap-4 p-4 ${
                !banner.active ? 'opacity-60' : ''
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-32 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{banner.title}</p>
                {banner.subtitle && <p className="text-xs text-neutral-400 truncate">{banner.subtitle}</p>}
                <div className="flex items-center gap-3 mt-1">
                  {banner.link && <span className="text-xs text-neutral-400">{banner.link}</span>}
                  <span className="text-xs text-neutral-300">{formatDate(banner.created_at)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-neutral-400 mr-2">#{index + 1}</span>
                <button
                  onClick={() => toggleActive(banner.id, banner.active)}
                  className={`p-2 rounded transition-colors ${
                    banner.active ? 'text-green-600 hover:bg-green-50' : 'text-neutral-400 hover:bg-neutral-50'
                  }`}
                  title={banner.active ? 'Hide' : 'Show'}
                >
                  {banner.active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => deleteBanner(banner.id)}
                  className="p-2 rounded text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
