// ============================================
// GS SPORT - Custom Hooks: useAuth (context-based)
// Single fetch, shared state across all consumers
// ============================================

'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/types';
import type { User } from '@supabase/supabase-js';
import React from 'react';

// Module-level singleton — always same reference
const supabase = createClient();

const SESSION_TIMEOUT_MS = 3_000;

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      console.error('signOut failed:', error);
    }
    setUser(null);
    setProfile(null);
  }, []);

  const value = React.useMemo(() => ({
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    signOut,
  }), [user, profile, loading, signOut]);

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
