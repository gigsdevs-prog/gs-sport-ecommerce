// Temporary diagnostic endpoint — DELETE after debugging
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const diagnostics: Record<string, unknown> = {};

  try {
    diagnostics.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? 'SET (' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ' chars)'
      : 'NOT SET';

    const adminClient = createAdminSupabaseClient();

    // List buckets
    const { data: buckets, error: listErr } = await adminClient.storage.listBuckets();
    diagnostics.bucketsBefore = {
      list: buckets?.map((b: { id: string }) => b.id) || [],
      error: listErr?.message || null,
    };

    // Create about bucket if missing
    const hasAbout = buckets?.some((b: { id: string }) => b.id === 'about');
    if (!hasAbout) {
      const { data: createData, error: createErr } = await adminClient.storage.createBucket('about', {
        public: true,
        fileSizeLimit: 10485760,
      });
      diagnostics.createBucket = {
        data: createData,
        error: createErr?.message || null,
      };
    } else {
      diagnostics.createBucket = { skipped: 'already exists' };
    }

    // List buckets again
    const { data: buckets2 } = await adminClient.storage.listBuckets();
    diagnostics.bucketsAfter = buckets2?.map((b: { id: string }) => b.id) || [];

    // Test upload
    const testContent = new Uint8Array([0x74, 0x65, 0x73, 0x74]);
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

    return NextResponse.json(diagnostics);
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err), diagnostics }, { status: 500 });
  }
}
