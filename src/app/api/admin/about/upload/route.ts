// ============================================
// GS SPORT - API: Admin About Image Upload
// Server-side upload to bypass storage RLS
// ============================================

import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // 1. Verify admin
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      console.error('About upload auth error:', authError?.message);
      return NextResponse.json({ 
        error: 'Unauthorized: ' + (authError?.message || 'No user session found. Please log in again.') 
      }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      console.error('About upload forbidden:', profileError?.message, 'role:', profile?.role);
      return NextResponse.json({ 
        error: 'Forbidden: ' + (profileError?.message || `role is "${profile?.role}", need "admin"`) 
      }, { status: 403 });
    }

    // 2. Parse upload
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const oldUrl = formData.get('oldUrl') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const adminClient = createAdminSupabaseClient();

    // 2.5 Ensure 'about' bucket exists
    const { data: buckets } = await adminClient.storage.listBuckets();
    const aboutBucket = buckets?.find((b: { id: string }) => b.id === 'about');
    if (!aboutBucket) {
      const { error: bucketError } = await adminClient.storage.createBucket('about', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      if (bucketError && !bucketError.message?.includes('already exists')) {
        console.error('Failed to create about bucket:', bucketError);
        return NextResponse.json({ error: 'Storage setup failed: ' + bucketError.message }, { status: 500 });
      }
    }

    // 3. Delete previous image if provided
    if (oldUrl) {
      const parts = oldUrl.split('/about/');
      const oldPath = parts[parts.length - 1];
      if (oldPath) {
        await adminClient.storage.from('about').remove([oldPath]);
      }
    }

    // 4. Upload new image
    const ext = file.name.split('.').pop() || 'jpg';
    const name = `about-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await adminClient.storage
      .from('about')
      .upload(name, buffer, {
        cacheControl: '31536000',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('About image upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // 5. Get public URL
    const { data: { publicUrl } } = adminClient.storage
      .from('about')
      .getPublicUrl(name);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error('About upload API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
