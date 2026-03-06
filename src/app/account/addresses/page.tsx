// ============================================
// GS SPORT - Address Management Page
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronLeft, Plus, Trash2, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface SavedAddress {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  isDefault: boolean;
}

const STORAGE_KEY = 'gs_saved_addresses';

function getStoredAddresses(userId: string): SavedAddress[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAddresses(userId: string, addresses: SavedAddress[]) {
  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(addresses));
}

export default function AddressesPage() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<SavedAddress, 'id' | 'isDefault'>>({
    label: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setAddresses(getStoredAddresses(user.id));
    }
  }, [user]);

  const handleAdd = useCallback(() => {
    if (!user) return;
    if (!form.firstName || !form.address || !form.city) {
      toast.error(t('first_name') + ', ' + t('address_line') + ', ' + t('city') + ' required');
      return;
    }

    const newAddress: SavedAddress = {
      id: crypto.randomUUID(),
      ...form,
      label: form.label || `${form.city}, ${form.address}`,
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, newAddress];
    setAddresses(updated);
    saveAddresses(user.id, updated);
    setShowForm(false);
    setForm({ label: '', firstName: '', lastName: '', address: '', city: '', state: '', phone: '' });
    toast.success(t('add_address') + ' ✓');
  }, [user, form, addresses, t]);

  const handleDelete = useCallback((id: string) => {
    if (!user) return;
    const updated = addresses.filter(a => a.id !== id);
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    saveAddresses(user.id, updated);
  }, [user, addresses]);

  const handleSetDefault = useCallback((id: string) => {
    if (!user) return;
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    saveAddresses(user.id, updated);
  }, [user, addresses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-neutral-500">{t('sign_in_account')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/account" className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{t('addresses')}</h1>
              <p className="text-sm text-neutral-500">{t('manage_addresses')}</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            {t('add_address')}
          </button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                <h3 className="font-semibold text-lg">{t('add_address')}</h3>

                <div>
                  <label className="block text-sm text-neutral-600 mb-1">{t('address_name')}</label>
                  <input
                    value={form.label}
                    onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                    placeholder="Home, Office..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">{t('first_name')} *</label>
                    <input
                      value={form.firstName}
                      onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">{t('last_name')}</label>
                    <input
                      value={form.lastName}
                      onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-neutral-600 mb-1">{t('address_line')} *</label>
                  <input
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">{t('city')} *</label>
                    <input
                      value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 mb-1">{t('state')}</label>
                    <input
                      value={form.state}
                      onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-neutral-600 mb-1">{t('phone')}</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleAdd} className="flex-1">{t('save')}</Button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Address List */}
        {addresses.length === 0 && !showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <MapPin className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">{t('no_addresses')}</h3>
            <p className="text-neutral-500 mb-6">{t('add_first_address')}</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              {t('add_address')}
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {addresses.map((addr, i) => (
                <motion.div
                  key={addr.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-white rounded-xl border p-5 relative ${
                    addr.isDefault ? 'border-neutral-900' : 'border-neutral-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${addr.isDefault ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{addr.label}</h3>
                          {addr.isDefault && (
                            <span className="text-xs bg-neutral-900 text-white px-2 py-0.5 rounded-full">
                              {t('default_address')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">
                          {addr.firstName} {addr.lastName}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {addr.address}, {addr.city}
                          {addr.state && `, ${addr.state}`}
                        </p>
                        {addr.phone && (
                          <p className="text-sm text-neutral-500">{addr.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-400 hover:text-neutral-900"
                          title={t('default_address')}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-neutral-400 hover:text-red-500"
                        title={t('delete_address')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
