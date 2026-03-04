// ============================================
// GS SPORT - Custom Hooks: useAuth (hardened)
// Mounted checks, try/catch on all fetches,
// safety timeout so loading never hangs
// ============================================

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/types';
import type { User } from '@supabase/supabase-js';

// Module-level singleton — always same reference
const supabase = createClient();

const AUTH_TIMEOUT_MS = 10_000;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) console.error('Profile fetch error:', error);
      if (mounted.current) setProfile(data);
    } catch (err) {
      console.error('fetchProfile failed:', err);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    // Safety timeout: ensure loading finishes even if auth hangs
    const timeout = setTimeout(() => {
      if (mounted.current) {
        console.warn('useAuth: safety timeout reached, forcing loading=false');
        setLoading(false);
      }
    }, AUTH_TIMEOUT_MS);

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted.current) return;
        setUser(user);
        if (user) {
          await fetchProfile(user.id);
        }
      } catch (err) {
        console.error('getUser failed:', err);
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted.current) return;
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        if (mounted.current) setLoading(false);
      }
    );

    return () => {
      mounted.current = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  return {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    signOut,
  };
}
