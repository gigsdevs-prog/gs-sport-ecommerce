// ============================================
// GS SPORT - SiteContent Context (fetches ONCE per page load, shares everywhere)
// Eliminates N duplicate fetches of site_content
// Hardened: mounted check, timeout fallback, race-safe dedup
// ============================================

'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_CONTENT } from '@/lib/constants';
import type { SiteContent } from '@/types';

interface SiteContentContextValue {
  content: Record<string, string>;
  getText: (key: string) => string;
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue>({
  content: DEFAULT_CONTENT,
  getText: (key: string) => DEFAULT_CONTENT[key] || '',
  loading: true,
  error: false,
  refresh: async () => {},
});

const FETCH_TIMEOUT_MS = 10_000;

// Deduplicate concurrent fetches (race-safe)
let fetchPromise: Promise<Record<string, string>> | null = null;

async function fetchSiteContent(): Promise<Record<string, string>> {
  if (fetchPromise) return fetchPromise;

  const promise = (async () => {
    try {
      const supabase = createClient();

      // Race the fetch against a timeout
      const result = await Promise.race([
        supabase.from('site_content').select('*'),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Site content fetch timed out')), FETCH_TIMEOUT_MS)
        ),
      ]);

      const { data, error } = result as { data: SiteContent[] | null; error: { message: string } | null };
      const contentMap: Record<string, string> = { ...DEFAULT_CONTENT };
      if (error) {
        console.error('Failed to fetch site content:', error);
      }
      if (data) {
        data.forEach((item: SiteContent) => {
          contentMap[item.key] = item.value;
        });
      }
      return contentMap;
    } catch (err) {
      console.error('Site content fetch failed:', err);
      return { ...DEFAULT_CONTENT };
    }
  })();

  fetchPromise = promise;

  // Clear the dedup reference AFTER the promise settles
  promise.finally(() => {
    if (fetchPromise === promise) {
      fetchPromise = null;
    }
  });

  return promise;
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, string>>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mounted = useRef(true);

  const loadContent = useCallback(async () => {
    try {
      const data = await fetchSiteContent();
      if (mounted.current) {
        setContent(data);
        setError(false);
      }
    } catch {
      if (mounted.current) setError(true);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    loadContent();

    // Subscribe to Supabase Realtime so admin changes reflect instantly
    const supabase = createClient();
    const channel = supabase
      .channel('site_content_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_content' },
        () => {
          // Re-fetch all content when any row changes
          fetchPromise = null; // clear cache so we get fresh data
          if (mounted.current) loadContent();
        }
      )
      .subscribe();

    return () => {
      mounted.current = false;
      supabase.removeChannel(channel);
    };
  }, [loadContent]);

  const getText = useCallback(
    (key: string): string => content[key] || DEFAULT_CONTENT[key] || '',
    [content]
  );

  const refresh = useCallback(async () => {
    if (mounted.current) {
      setLoading(true);
      setError(false);
    }
    try {
      const data = await fetchSiteContent();
      if (mounted.current) {
        setContent(data);
        setError(false);
      }
    } catch {
      if (mounted.current) setError(true);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, getText, loading, error, refresh }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
