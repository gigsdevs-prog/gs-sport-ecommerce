// ============================================
// GS SPORT - API: Admin Image Upload
// Uploads site images to Supabase storage and
// saves the public URL in site_content
// ============================================

import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';

const BUCKET = 'site-images';

async function verifyAdmin() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') return null;
  return user;
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const key = formData.get('key') as string | null;

    if (!file || !key) {
      return NextResponse.json({ error: 'Missing file or key' }, { status: 400 });
    }

    const adminClient = createAdminSupabaseClient();

    // Ensure bucket exists (will no-op if already exists)
    const { data: buckets } = await adminClient.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === BUCKET);
    if (!bucketExists) {
      await adminClient.storage.createBucket(BUCKET, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'],
      });
    }

    // Generate filename from key
    const ext = file.name.split('.').pop() || 'png';
    const fileName = `${key}.${ext}`;

    // Delete existing file with this key (any extension)
    try {
      const { data: existing } = await adminClient.storage
        .from(BUCKET)
        .list('', { search: key });
      if (existing && existing.length > 0) {
        await adminClient.storage
          .from(BUCKET)
          .remove(existing.map(f => f.name));
      }
    } catch {
      // ignore cleanup errors
    }

    // Upload new file
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await adminClient.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
        cacheControl: '31536000',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = adminClient.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Save URL in site_content
    const { error: upsertError } = await adminClient
      .from('site_content')
      .upsert(
        { key, value: publicUrl, section: 'images' },
        { onConflict: 'key' }
      );

    if (upsertError) {
      console.error('Content save error:', upsertError);
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error('Image upload API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
