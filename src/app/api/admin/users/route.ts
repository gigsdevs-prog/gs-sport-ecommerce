// ============================================
// GS SPORT - Admin API: Users
// Bypasses RLS using service role
// ============================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/admin';

export async function PATCH(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const adminClient = createAdminSupabaseClient();
    const { error } = await adminClient.from('users').update(updateData).eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('User update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
