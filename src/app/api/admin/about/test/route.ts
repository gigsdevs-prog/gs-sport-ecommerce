// Temporary diagnostic endpoint — DELETE after debugging
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const diagnostics: Record<string, unknown> = {};

  try {
    // Check env vars (masked)
    diagnostics.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...'
      : 'NOT SET';
    diagnostics.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? 'SET (' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ' chars)'
      : 'NOT SET';
    diagnostics.anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? 'SET (' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ' chars)'
      : 'NOT SET';

    // Test auth
    try {
      const supabase = createServerSupabaseClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      diagnostics.auth = { userId: user?.id || null, error: authError?.message || null };
    } catch (e: unknown) {
      diagnostics.auth = { error: String(e) };
    }

    // Test admin client - list buckets
    try {
      const adminClient = createAdminSupabaseClient();
      const { data: buckets, error: bucketsError } = await adminClient.storage.listBuckets();
      diagnostics.buckets = {
        list: buckets?.map((b: { id: string; public: boolean }) => ({ id: b.id, public: b.public })) || [],
        error: bucketsError?.message || null,
      };
    } catch (e: unknown) {
      diagnostics.buckets = { error: String(e) };
    }

    // Test admin client - list about bucket files
    try {
      const adminClient = createAdminSupabaseClient();
      const { data: files, error: filesError } = await adminClient.storage
        .from('about')
        .list('', { limit: 5 });
      diagnostics.aboutFiles = {
        files: files?.map((f: { name: string }) => f.name) || [],
        error: filesError?.message || null,
      };
    } catch (e: unknown) {
      diagnostics.aboutFiles = { error: String(e) };
    }

    // Test admin client - try uploading a tiny test file
    try {
      const adminClient = createAdminSupabaseClient();
      const testContent = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
      const testName = `test-${Date.now()}.txt`;
      const { error: uploadErr } = await adminClient.storage
        .from('about')
        .upload(testName, testContent, { contentType: 'text/plain', upsert: true });
      
      if (uploadErr) {
        diagnostics.testUpload = { error: uploadErr.message };
      } else {
        await adminClient.storage.from('about').remove([testName]);
        diagnostics.testUpload = { success: true };
      }
    } catch (e: unknown) {
      diagnostics.testUpload = { error: String(e) };
    }

    return NextResponse.json(diagnostics);
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err), diagnostics }, { status: 500 });
  }
}
