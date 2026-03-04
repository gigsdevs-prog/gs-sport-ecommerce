// ============================================
// GS SPORT - API: Admin Content Save
// Bypasses RLS using service role after verifying admin
// ============================================

import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const adminClient = createAdminSupabaseClient();
    const { data, error } = await adminClient.from('site_content').select('*');
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data: data || [] });
  } catch (err) {
    console.error('Content fetch API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    const { entries } = body as { entries: { key: string; value: string }[] };

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // 3. Use admin client (service role) to bypass RLS
    const adminClient = createAdminSupabaseClient();

    const errors: string[] = [];

    for (const entry of entries) {
      const { error } = await adminClient
        .from('site_content')
        .upsert(
          {
            key: entry.key,
            value: entry.value,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

      if (error) {
        errors.push(`${entry.key}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Some entries failed to save', details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, count: entries.length });
  } catch (err) {
    console.error('Content save API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
