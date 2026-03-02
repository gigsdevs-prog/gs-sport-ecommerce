// ============================================
// GS SPORT - Admin: Content Manager (CMS)
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Save, RotateCcw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_CONTENT } from '@/lib/constants';
import toast from 'react-hot-toast';

interface ContentEntry {
  key: string;
  value: string;
  original: string;
  modified: boolean;
  label: string;
  group: string;
}

const CONTENT_GROUPS: Record<string, { label: string; keys: { key: string; label: string }[] }> = {
  hero: {
    label: 'Hero Section',
    keys: [
      { key: 'hero_headline', label: 'Headline' },
      { key: 'hero_subheadline', label: 'Subheadline' },
      { key: 'hero_cta', label: 'Button Text' },
    ],
  },
  featured: {
    label: 'Featured Collection',
    keys: [
      { key: 'featured_title', label: 'Section Title' },
      { key: 'featured_subtitle', label: 'Section Subtitle' },
    ],
  },
  bestseller: {
    label: 'Best Sellers',
    keys: [
      { key: 'bestseller_title', label: 'Section Title' },
      { key: 'bestseller_subtitle', label: 'Section Subtitle' },
    ],
  },
  promo: {
    label: 'Promo Banner',
    keys: [
      { key: 'promo_title', label: 'Title' },
      { key: 'promo_subtitle', label: 'Subtitle' },
      { key: 'promo_cta', label: 'Button Text' },
    ],
  },
  newsletter: {
    label: 'Newsletter',
    keys: [
      { key: 'newsletter_title', label: 'Title' },
      { key: 'newsletter_subtitle', label: 'Subtitle' },
    ],
  },
  footer: {
    label: 'Footer',
    keys: [
      { key: 'footer_about', label: 'About Text' },
    ],
  },
};

export default function AdminContentPage() {
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchContent = useCallback(async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*');

    const dbContent: Record<string, string> = {};
    data?.forEach(row => { dbContent[row.key] = row.value; });

    // Build entries from all keys defined in CONTENT_GROUPS
    const allEntries: ContentEntry[] = [];
    Object.entries(CONTENT_GROUPS).forEach(([group, config]) => {
      config.keys.forEach(({ key, label }) => {
        const value = dbContent[key] || DEFAULT_CONTENT[key] || '';
        allEntries.push({
          key,
          value,
          original: value,
          modified: false,
          label,
          group,
        });
      });
    });

    setEntries(allEntries);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const updateEntry = (key: string, value: string) => {
    setEntries(prev =>
      prev.map(e =>
        e.key === key
          ? { ...e, value, modified: value !== e.original }
          : e
      )
    );
  };

  const resetEntry = (key: string) => {
    setEntries(prev =>
      prev.map(e =>
        e.key === key
          ? { ...e, value: e.original, modified: false }
          : e
      )
    );
  };

  const resetToDefault = (key: string) => {
    const defaultValue = DEFAULT_CONTENT[key] || '';
    setEntries(prev =>
      prev.map(e =>
        e.key === key
          ? { ...e, value: defaultValue, modified: defaultValue !== e.original }
          : e
      )
    );
  };

  const saveAll = async () => {
    const modified = entries.filter(e => e.modified);
    if (modified.length === 0) { toast('Nothing to save'); return; }

    setSaving(true);

    for (const entry of modified) {
      const { error } = await supabase
        .from('site_content')
        .upsert({ key: entry.key, value: entry.value }, { onConflict: 'key' });

      if (error) {
        toast.error(`Failed to save ${entry.key}`);
        setSaving(false);
        return;
      }
    }

    toast.success(`${modified.length} item(s) saved`);
    setSaving(false);
    fetchContent();
  };

  const modifiedCount = entries.filter(e => e.modified).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Content Manager</h1>
          <p className="text-sm text-neutral-500 mt-1">Edit all website text & copy</p>
        </div>
        {modifiedCount > 0 && (
          <button
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            <Save size={16} />
            {saving ? 'Saving...' : `Save ${modifiedCount} Change${modifiedCount > 1 ? 's' : ''}`}
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-neutral-500">Loading...</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(CONTENT_GROUPS).map(([groupKey, groupConfig]) => {
            const groupEntries = entries.filter(e => e.group === groupKey);
            return (
              <motion.div
                key={groupKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-neutral-100 overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-2">
                  <FileText size={16} className="text-neutral-400" />
                  <h3 className="text-sm font-medium">{groupConfig.label}</h3>
                </div>
                <div className="p-5 space-y-4">
                  {groupEntries.map(entry => (
                    <div key={entry.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-neutral-500">{entry.label}</label>
                        <div className="flex items-center gap-2">
                          {entry.modified && (
                            <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full">Modified</span>
                          )}
                          <button
                            onClick={() => resetEntry(entry.key)}
                            className="text-[10px] text-neutral-400 hover:text-neutral-600"
                            title="Undo changes"
                          >
                            <RotateCcw size={12} />
                          </button>
                          <button
                            onClick={() => resetToDefault(entry.key)}
                            className="text-[10px] text-neutral-400 hover:text-neutral-600"
                            title="Reset to default"
                          >
                            Default
                          </button>
                        </div>
                      </div>
                      {entry.value.length > 60 ? (
                        <textarea
                          value={entry.value}
                          onChange={e => updateEntry(entry.key, e.target.value)}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded text-sm outline-none transition-colors resize-y ${
                            entry.modified ? 'border-amber-300 bg-amber-50/30' : 'border-neutral-200 focus:border-black'
                          }`}
                        />
                      ) : (
                        <input
                          value={entry.value}
                          onChange={e => updateEntry(entry.key, e.target.value)}
                          className={`w-full px-3 py-2 border rounded text-sm outline-none transition-colors ${
                            entry.modified ? 'border-amber-300 bg-amber-50/30' : 'border-neutral-200 focus:border-black'
                          }`}
                        />
                      )}
                      <p className="text-[10px] text-neutral-300 mt-0.5 font-mono">{entry.key}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
