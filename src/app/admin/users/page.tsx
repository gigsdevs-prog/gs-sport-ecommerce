// ============================================
// GS SPORT - Admin: Users Page
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Shield, ShieldOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/utils';
import toast from 'react-hot-toast';

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin';
  avatar_url: string | null;
  blocked: boolean;
  created_at: string;
  orders_count?: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setUsers(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleBlock = async (userId: string, blocked: boolean) => {
    const { error } = await supabase
      .from('users')
      .update({ blocked: !blocked })
      .eq('id', userId);

    if (error) { toast.error('Failed to update user'); return; }
    toast.success(blocked ? 'User unblocked' : 'User blocked');
    fetchUsers();
  };

  const toggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) { toast.error('Failed to update role'); return; }
    toast.success(`Role updated to ${newRole}`);
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Users</h1>
          <p className="text-sm text-neutral-500 mt-1">{users.length} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-neutral-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className="text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-xs uppercase tracking-widest text-neutral-400">
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center text-xs font-medium uppercase">
                          {user.full_name?.charAt(0) || user.email.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name || '—'}</p>
                          <p className="text-xs text-neutral-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user.role === 'admin'
                          ? 'bg-violet-50 text-violet-700'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-500">{formatDate(user.created_at)}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user.blocked
                          ? 'bg-red-50 text-red-600'
                          : 'bg-green-50 text-green-600'
                      }`}>
                        {user.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleAdmin(user.id, user.role)}
                          title={user.role === 'admin' ? 'Remove admin' : 'Make admin'}
                          className="p-1.5 rounded text-neutral-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                        >
                          {user.role === 'admin' ? <ShieldOff size={16} /> : <Shield size={16} />}
                        </button>
                        <button
                          onClick={() => toggleBlock(user.id, user.blocked)}
                          className={`text-xs px-3 py-1.5 rounded transition-colors ${
                            user.blocked
                              ? 'bg-green-50 text-green-600 hover:bg-green-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {user.blocked ? 'Unblock' : 'Block'}
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
