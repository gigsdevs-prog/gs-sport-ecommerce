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

const SESSION_TIMEOUT_MS = 3_000;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const fetchProfile = useCallback(async (authUser: User) => {
    try {
      // 1. Try by Supabase Auth UUID
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) {
        if (mounted.current) setProfile(data);
        return;
      }

      // 2. Try by email (handles CUID → UUID migration)
      const email = authUser.email;
      if (email) {
        const { data: byEmail } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (byEmail) {
          // Update the row's ID to the Supabase Auth UUID
          await supabase
            .from('users')
            .update({ id: authUser.id })
            .eq('email', email);
          // Also update orders referencing the old ID
          await supabase
            .from('orders')
            .update({ user_id: authUser.id })
            .eq('user_id', byEmail.id);
          if (mounted.current) setProfile({ ...byEmail, id: authUser.id });
          return;
        }
      }

      // 3. User doesn't exist — create profile
      const newProfile = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
        role: 'user',
        avatar_url: authUser.user_metadata?.avatar_url || null,
        blocked: false,
      };
      const { data: created } = await supabase
        .from('users')
        .insert(newProfile)
        .select()
        .single();
      if (mounted.current) setProfile(created);
    } catch (err) {
      console.error('fetchProfile failed:', err);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    const getUser = async () => {
      try {
        // Use getSession() first — it reads from local cache and is instant.
        // getUser() makes a network call and is slower.
        // Wrap in a timeout so a hanging refresh doesn't block the UI.
        const sessionResult = await Promise.race([
          supabase.auth.getSession(),
          new Promise<null>((resolve) =>
            setTimeout(() => resolve(null), SESSION_TIMEOUT_MS)
          ),
        ]);
        if (!mounted.current) return;
        const currentUser = sessionResult?.data?.session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser);
        }
      } catch (err) {
        console.warn('getUser failed:', err);
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
          await fetchProfile(session.user);
        } else {
          setProfile(null);
        }
        if (mounted.current) setLoading(false);
      }
    );

    return () => {
      mounted.current = false;
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
