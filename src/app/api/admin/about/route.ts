// ============================================
// GS SPORT - API: Admin About Page Save
// Bypasses RLS using service role after verifying admin
// ============================================

import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // 1. Verify admin via session
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Parse request
    const body = await request.json();
    const { id, ...payload } = body as {
      id?: string;
      image_url: string | null;
      title: string;
      description: string;
      phone: string | null;
      instagram_url: string | null;
      facebook_url: string | null;
      tiktok_url: string | null;
    };

    // 3. Use admin client (service role) to bypass RLS
    const adminClient = createAdminSupabaseClient();

    let error;

    if (id) {
      // Update existing
      const result = await adminClient
        .from('about_page')
        .update(payload)
        .eq('id', id);
      error = result.error;
    } else {
      // Insert new
      const result = await adminClient
        .from('about_page')
        .insert(payload);
      error = result.error;
    }

    if (error) {
      console.error('About page save error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('About save API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
