// ============================================
// GS SPORT - Admin: Site Images Manager
// Upload/change logo, promo background, and other images
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, Upload, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface SiteImage {
  key: string;
  label: string;
  description: string;
  currentUrl: string;
  default: string;
  uploading: boolean;
}

const IMAGE_CONFIGS: { key: string; label: string; description: string; default: string }[] = [
  {
    key: 'site_logo_url',
    label: 'Site Logo',
    description: 'Main logo used in Header, Footer, and Welcome screen. Recommended: PNG with transparent background.',
    default: '/logo.png',
  },
  {
    key: 'promo_image_url',
    label: 'Promo Banner Background',
    description: 'Optional background image for the promotional banner section on the homepage.',
    default: '',
  },
];

export default function AdminImagesPage() {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrentImages = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/content');
      const result = await response.json();

      const contentMap: Record<string, string> = {};
      (result.data || []).forEach((row: { key: string; value: string }) => {
        contentMap[row.key] = row.value;
      });

      setImages(
        IMAGE_CONFIGS.map(config => ({
          ...config,
          currentUrl: contentMap[config.key] || config.default,
          uploading: false,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch images:', err);
      toast.error('Failed to load images');
      setImages(
        IMAGE_CONFIGS.map(config => ({
          ...config,
          currentUrl: config.default,
          uploading: false,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentImages();
  }, [fetchCurrentImages]);

  const handleUpload = async (key: string, file: File) => {
    setImages(prev =>
      prev.map(img => (img.key === key ? { ...img, uploading: true } : img))
    );

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', key);

      const response = await fetch('/api/admin/images', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Upload failed');
        return;
      }

      toast.success('Image updated!');
      setImages(prev =>
        prev.map(img =>
          img.key === key ? { ...img, currentUrl: result.url } : img
        )
      );
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Upload failed');
    } finally {
      setImages(prev =>
        prev.map(img => (img.key === key ? { ...img, uploading: false } : img))
      );
    }
  };

  const handleReset = async (key: string) => {
    const config = IMAGE_CONFIGS.find(c => c.key === key);
    if (!config) return;

    if (!confirm(`Reset to default${config.default ? ` (${config.default})` : ' (none)'}?`)) return;

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: [{ key, value: config.default }],
        }),
      });

      if (!response.ok) {
        toast.error('Failed to reset');
        return;
      }

      toast.success('Reset to default');
      setImages(prev =>
        prev.map(img =>
          img.key === key ? { ...img, currentUrl: config.default } : img
        )
      );
    } catch (err) {
      console.error('Reset error:', err);
      toast.error('Failed to reset');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Site Images</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Upload and manage images used across the website
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-neutral-500">Loading...</div>
      ) : (
        <div className="grid gap-6">
          {images.map(img => (
            <motion.div
              key={img.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-neutral-100 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-2">
                <ImagePlus size={16} className="text-neutral-400" />
                <h3 className="text-sm font-medium">{img.label}</h3>
              </div>
              <div className="p-5">
                <p className="text-xs text-neutral-500 mb-4">{img.description}</p>

                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Preview */}
                  <div className="w-full sm:w-48 h-40 bg-neutral-50 border border-dashed border-neutral-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                    {img.currentUrl ? (
                      <Image
                        src={img.currentUrl}
                        alt={img.label}
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    ) : (
                      <span className="text-xs text-neutral-300">No image</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-neutral-800 cursor-pointer transition-colors w-fit">
                      <Upload size={14} />
                      {img.uploading ? 'Uploading...' : 'Upload New'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={img.uploading}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(img.key, file);
                          e.target.value = '';
                        }}
                      />
                    </label>

                    <button
                      onClick={() => handleReset(img.key)}
                      className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 text-sm rounded-lg hover:bg-neutral-50 transition-colors w-fit"
                    >
                      <RefreshCw size={14} />
                      Reset to Default
                    </button>

                    <p className="text-[10px] text-neutral-300 font-mono mt-1">
                      Key: {img.key}
                    </p>
                    {img.currentUrl && (
                      <p className="text-[10px] text-neutral-300 font-mono break-all">
                        URL: {img.currentUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
