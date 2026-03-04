// ============================================
// GS SPORT - Admin: About Page Manager
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Info, Save, Upload, X, Phone, CheckCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { AboutPage } from '@/types';

const supabase = createClient();

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');

  const fetchAbout = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('about_page')
        .select('*')
        .limit(1)
        .single();

    if (data) {
      setAbout(data);
      setImageUrl(data.image_url || '');
      setTitle(data.title || '');
      setDescription(data.description || '');
      setPhone(data.phone || '');
      setInstagramUrl(data.instagram_url || '');
      setFacebookUrl(data.facebook_url || '');
      setTiktokUrl(data.tiktok_url || '');
    }
    if (error && error.code !== 'PGRST116') console.error('Failed to fetch about:', error);
    } catch (err) {
      console.error('About fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAbout(); }, [fetchAbout]);

  // Compress image on client side to stay within Vercel's body size limit
  const compressImage = (file: File, maxWidth = 1920, quality = 0.85): Promise<File> => {
    return new Promise((resolve) => {
      // If already small enough (<4MB), skip compression
      if (file.size <= 4 * 1024 * 1024) {
        resolve(file);
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Scale down if wider than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressed = new File([blob], file.name, { type: 'image/jpeg' });
              resolve(compressed);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file); // Fallback to original
      };
      img.src = url;
    });
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      // Compress large images
      const processedFile = await compressImage(file);

      // Use server-side API to bypass RLS issues
      const formData = new FormData();
      formData.append('file', processedFile);
      if (imageUrl) {
        formData.append('oldUrl', imageUrl);
      }

      const response = await fetch('/api/admin/about/upload', {
        method: 'POST',
        body: formData,
      });

      let result;
      const text = await response.text();
      try {
        result = JSON.parse(text);
      } catch {
        console.error('Non-JSON response:', text);
        toast.error('Server error: ' + (text.substring(0, 100) || 'Unknown'));
        setUploading(false);
        return;
      }

      if (!response.ok) {
        toast.error(result.error || 'Upload failed: ' + response.status);
        setUploading(false);
        return;
      }

      setImageUrl(result.url);
      toast.success('Image uploaded!');
    } catch (err) {
      console.error('Upload exception:', err);
      toast.error('Upload failed: ' + (err instanceof Error ? err.message : 'Network error'));
    } finally {
      setUploading(false);
    }
  };

  const saveAbout = async () => {
    setSaving(true);
    setSaveSuccess(false);

    const payload = {
      id: about?.id || undefined,
      image_url: imageUrl || null,
      title: title || 'About Us',
      description: description || '',
      phone: phone || null,
      instagram_url: instagramUrl || null,
      facebook_url: facebookUrl || null,
      tiktok_url: tiktokUrl || null,
    };

    try {
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to save');
        console.error('Save error:', result);
      } else {
        toast.success('About page saved successfully!');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchAbout();
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Network error — please try again');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-neutral-500">Loading...</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wide">About Page</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage the About Us page content</p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 text-green-600 text-sm"
            >
              <CheckCircle size={16} />
              <span>Saved!</span>
            </motion.div>
          )}
          <button
            onClick={saveAbout}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-neutral-100 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info size={16} className="text-neutral-400" />
            <h3 className="text-sm font-medium">About Image</h3>
          </div>

          {imageUrl ? (
            <div className="relative w-full max-w-sm aspect-[4/5] bg-neutral-50 rounded-xl overflow-hidden">
              <img src={imageUrl} alt="About" className="w-full h-full object-cover" />
              <button
                onClick={() => setImageUrl('')}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 w-full max-w-sm aspect-[4/5] border-2 border-dashed border-neutral-200 rounded-xl cursor-pointer hover:border-black transition-colors text-sm text-neutral-400">
              {uploading ? (
                <span className="animate-pulse">Uploading...</span>
              ) : (
                <>
                  <Upload size={20} />
                  <span>Upload Image</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])}
              />
            </label>
          )}
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-neutral-100 p-6"
        >
          <h3 className="text-sm font-medium mb-4">Text Content</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded text-sm outline-none focus:border-black transition-colors"
                placeholder="About Us"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-neutral-200 rounded text-sm outline-none focus:border-black transition-colors resize-y"
                placeholder="Tell your story..."
              />
            </div>
          </div>
        </motion.div>

        {/* Contact & Social */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-neutral-100 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Phone size={16} className="text-neutral-400" />
            <h3 className="text-sm font-medium">Contact & Social Media</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Phone Number</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded text-sm outline-none focus:border-black transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="hidden md:block" /> {/* spacer */}
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Instagram URL</label>
              <input
                value={instagramUrl}
                onChange={e => setInstagramUrl(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded text-sm outline-none focus:border-black transition-colors"
                placeholder="https://instagram.com/yourpage"
              />
              <p className="text-[10px] text-neutral-300 mt-0.5">Leave empty to hide icon</p>
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Facebook URL</label>
              <input
                value={facebookUrl}
                onChange={e => setFacebookUrl(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded text-sm outline-none focus:border-black transition-colors"
                placeholder="https://facebook.com/yourpage"
              />
              <p className="text-[10px] text-neutral-300 mt-0.5">Leave empty to hide icon</p>
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">TikTok URL</label>
              <input
                value={tiktokUrl}
                onChange={e => setTiktokUrl(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded text-sm outline-none focus:border-black transition-colors"
                placeholder="https://tiktok.com/@yourpage"
              />
              <p className="text-[10px] text-neutral-300 mt-0.5">Leave empty to hide icon</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
