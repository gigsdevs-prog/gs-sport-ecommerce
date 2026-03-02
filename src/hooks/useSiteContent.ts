// ============================================
// GS SPORT - Custom Hook: useSiteContent
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_CONTENT } from '@/lib/constants';
import type { SiteContent } from '@/types';

export function useSiteContent() {
  const [content, setContent] = useState<Record<string, string>>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from('site_content')
        .select('*');

      if (data) {
        const contentMap: Record<string, string> = { ...DEFAULT_CONTENT };
        data.forEach((item: SiteContent) => {
          contentMap[item.key] = item.value;
        });
        setContent(contentMap);
      }
      setLoading(false);
    };

    fetchContent();
  }, [supabase]);

  const getText = (key: string): string => {
    return content[key] || DEFAULT_CONTENT[key] || '';
  };

  return { content, getText, loading };
}
