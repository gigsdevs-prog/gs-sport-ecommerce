// ============================================
// GS SPORT - Admin: Categories Page
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Tags } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { slugify } from '@/utils';
import toast from 'react-hot-toast';
import type { Category } from '@/types';

const supabase = createClient();

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) console.error('Failed to fetch categories:', error);
      if (data) setCategories(data);
    } catch (err) {
      console.error('Categories fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, slug: newSlug || slugify(newName), active: true }),
      });
      const result = await response.json();
      if (!response.ok) { toast.error(result.error || 'Failed to create'); return; }
      toast.success('Category created');
      setNewName(''); setNewSlug(''); setShowNew(false);
      fetchCategories();
    } catch (err) { console.error(err); toast.error('Network error'); }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editName, slug: editSlug }),
      });
      const result = await response.json();
      if (!response.ok) { toast.error(result.error || 'Failed to update'); return; }
      toast.success('Category updated');
      setEditingId(null);
      fetchCategories();
    } catch (err) { console.error(err); toast.error('Network error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (!response.ok) { toast.error(result.error || 'Failed to delete'); return; }
      toast.success('Category deleted');
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) { console.error(err); toast.error('Network error'); }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !active }),
      });
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Categories</h1>
          <p className="text-sm text-neutral-500 mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus size={18} />
          Add Category
        </Button>
      </div>

      {/* New Category Form */}
      {showNew && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-neutral-100 p-6 mb-6">
          <h3 className="text-sm font-semibold mb-4">New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="Name" value={newName}
              onChange={e => { setNewName(e.target.value); setNewSlug(slugify(e.target.value)); }} />
            <Input label="Slug" value={newSlug} onChange={e => setNewSlug(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate}><Save size={16} /> Create</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowNew(false)}><X size={16} /> Cancel</Button>
          </div>
        </motion.div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-neutral-500">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <Tags size={48} className="text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-500">No categories yet</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {categories.map(cat => (
              <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                {editingId === cat.id ? (
                  <div className="flex-1 flex items-center gap-3">
                    <input value={editName} onChange={e => setEditName(e.target.value)}
                      className="px-3 py-2 border border-neutral-200 text-sm rounded outline-none focus:border-black" />
                    <input value={editSlug} onChange={e => setEditSlug(e.target.value)}
                      className="px-3 py-2 border border-neutral-200 text-sm rounded outline-none focus:border-black" />
                    <button onClick={() => handleUpdate(cat.id)} className="p-2 text-green-600 hover:text-green-700"><Save size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="p-2 text-neutral-400 hover:text-black"><X size={16} /></button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      {cat.image && (
                        <div className="w-10 h-10 rounded overflow-hidden relative">
                          <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="40px" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{cat.name}</p>
                        <p className="text-xs text-neutral-400">{cat.slug}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        cat.active ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {cat.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggleActive(cat.id, cat.active)}
                        className="text-xs text-neutral-500 hover:text-black px-2 py-1">
                        {cat.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => startEdit(cat)} className="p-2 text-neutral-400 hover:text-black"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 text-neutral-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
