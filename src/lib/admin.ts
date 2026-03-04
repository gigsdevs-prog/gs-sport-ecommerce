// ============================================
// GS SPORT - Admin Verification Helper
// Verifies admin status, handles CUID→UUID migration
// ============================================

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';

export async function verifyAdmin() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const adminClient = createAdminSupabaseClient();

  // 1. Try by Supabase Auth UUID
  const { data: profile } = await adminClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile) {
    return profile.role === 'admin' ? user : null;
  }

  // 2. Try by email (handles CUID → UUID migration)
  if (user.email) {
    const { data: byEmail } = await adminClient
      .from('users')
      .select('id, role')
      .eq('email', user.email)
      .single();

    if (byEmail) {
      // Update the user's ID to match Supabase Auth UUID
      await adminClient
        .from('users')
        .update({ id: user.id })
        .eq('email', user.email);
      // Update orders referencing the old ID
      await adminClient
        .from('orders')
        .update({ user_id: user.id })
        .eq('user_id', byEmail.id);
      return byEmail.role === 'admin' ? user : null;
    }
  }

  return null;
}
