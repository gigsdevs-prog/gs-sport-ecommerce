const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres.nsupmxkzcwgdzyloyzog:Lashaalad17@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  const queries = [
    // Drop ALL existing storage policies
    `DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects`,
    `DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects`,
    `DROP POLICY IF EXISTS "Anyone can view banner images" ON storage.objects`,
    `DROP POLICY IF EXISTS "Admins can upload banner images" ON storage.objects`,
    `DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects`,
    `DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects`,
    `DROP POLICY IF EXISTS "public_read_products" ON storage.objects`,
    `DROP POLICY IF EXISTS "public_read_banners" ON storage.objects`,
    `DROP POLICY IF EXISTS "public_read_avatars" ON storage.objects`,
    `DROP POLICY IF EXISTS "admin_insert_products" ON storage.objects`,
    `DROP POLICY IF EXISTS "admin_insert_banners" ON storage.objects`,
    `DROP POLICY IF EXISTS "admin_update_products" ON storage.objects`,
    `DROP POLICY IF EXISTS "admin_update_banners" ON storage.objects`,
    `DROP POLICY IF EXISTS "admin_delete_products" ON storage.objects`,
    `DROP POLICY IF EXISTS "admin_delete_banners" ON storage.objects`,
    `DROP POLICY IF EXISTS "users_insert_avatars" ON storage.objects`,
    `DROP POLICY IF EXISTS "users_update_avatars" ON storage.objects`,
    `DROP POLICY IF EXISTS "users_delete_avatars" ON storage.objects`,

    // Public read for all buckets
    `CREATE POLICY "public_read_products" ON storage.objects FOR SELECT USING (bucket_id = 'products')`,
    `CREATE POLICY "public_read_banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners')`,
    `CREATE POLICY "public_read_avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars')`,

    // Authenticated users can INSERT into products & banners (admin check in app)
    `CREATE POLICY "auth_insert_products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated')`,
    `CREATE POLICY "auth_insert_banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated')`,

    // Authenticated users can UPDATE in products & banners
    `CREATE POLICY "auth_update_products" ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND auth.role() = 'authenticated')`,
    `CREATE POLICY "auth_update_banners" ON storage.objects FOR UPDATE USING (bucket_id = 'banners' AND auth.role() = 'authenticated')`,

    // Authenticated users can DELETE from products & banners
    `CREATE POLICY "auth_delete_products" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND auth.role() = 'authenticated')`,
    `CREATE POLICY "auth_delete_banners" ON storage.objects FOR DELETE USING (bucket_id = 'banners' AND auth.role() = 'authenticated')`,

    // Users can manage their own avatars
    `CREATE POLICY "auth_insert_avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated')`,
    `CREATE POLICY "auth_update_avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated')`,
    `CREATE POLICY "auth_delete_avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated')`,

    // Add videos column to products
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS videos TEXT[] NOT NULL DEFAULT '{}'`,
  ];

  let ok = 0, fail = 0;
  for (const q of queries) {
    try {
      await client.query(q);
      ok++;
    } catch (e) {
      console.log('FAIL:', q.substring(0, 60), '-', e.message);
      fail++;
    }
  }
  console.log(`Done: ${ok} OK, ${fail} failed`);
  await client.end();
}

run().catch(console.error);
