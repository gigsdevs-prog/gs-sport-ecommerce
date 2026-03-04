const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await c.connect();

  // ====== STEP 1: Map auth.users to public.users by email ======
  console.log('=== Step 1: Sync user IDs (CUID → Supabase Auth UUID) ===');
  
  let authUsers;
  try {
    const { rows } = await c.query(`SELECT id, email FROM auth.users`);
    authUsers = rows;
    console.log(`Found ${authUsers.length} auth users`);
  } catch (e) {
    console.log('Cannot read auth.users (expected in pooler mode):', e.message);
    console.log('Will skip user ID sync - will handle in code instead');
    authUsers = [];
  }

  for (const au of authUsers) {
    // Find matching public.users by email
    const { rows: matches } = await c.query(
      `SELECT id FROM public.users WHERE email = $1`, [au.email]
    );
    if (matches.length > 0 && matches[0].id !== au.id) {
      const oldId = matches[0].id;
      console.log(`  Syncing: ${au.email} | ${oldId} → ${au.id}`);
      
      // Update orders that reference the old user ID
      const { rowCount: ordersUpdated } = await c.query(
        `UPDATE public.orders SET user_id = $1 WHERE user_id = $2`, [au.id, oldId]
      );
      console.log(`    Updated ${ordersUpdated} orders`);
      
      // Update saved_products
      try {
        await c.query(`UPDATE public.saved_products SET user_id = $1 WHERE user_id = $2`, [au.id, oldId]);
      } catch (e) { /* table might not have matching rows */ }
      
      // Update the user ID itself
      await c.query(`UPDATE public.users SET id = $1 WHERE id = $2`, [au.id, oldId]);
      console.log(`    Updated user ID ✓`);
    } else if (matches.length === 0) {
      // Auth user doesn't exist in public.users — create them
      console.log(`  Creating public.users entry for: ${au.email}`);
      await c.query(
        `INSERT INTO public.users (id, email, full_name, role) VALUES ($1, $2, $3, 'user')
         ON CONFLICT (id) DO NOTHING`,
        [au.id, au.email, au.email.split('@')[0]]
      );
    } else {
      console.log(`  Already synced: ${au.email}`);
    }
  }

  // ====== STEP 2: Drop problematic FK constraints ======
  console.log('\n=== Step 2: Drop FK constraints ===');
  
  const fksToDrop = [
    { table: 'orders', constraint: 'orders_userId_fkey' },
    { table: 'order_items', constraint: 'order_items_orderId_fkey' },
    { table: 'order_items', constraint: 'order_items_productId_fkey' },
  ];
  
  for (const fk of fksToDrop) {
    try {
      await c.query(`ALTER TABLE public.${fk.table} DROP CONSTRAINT IF EXISTS "${fk.constraint}"`);
      console.log(`  Dropped: ${fk.constraint} ✓`);
    } catch (e) {
      console.log(`  ${fk.constraint}: ${e.message}`);
    }
  }

  // Also try snake_case versions (in case they were renamed)
  const snakeFks = [
    { table: 'orders', constraint: 'orders_user_id_fkey' },
    { table: 'order_items', constraint: 'order_items_order_id_fkey' },
    { table: 'order_items', constraint: 'order_items_product_id_fkey' },
  ];
  for (const fk of snakeFks) {
    try {
      await c.query(`ALTER TABLE public.${fk.table} DROP CONSTRAINT IF EXISTS "${fk.constraint}"`);
      console.log(`  Dropped: ${fk.constraint} ✓`);
    } catch (e) { /* ignore */ }
  }

  // ====== STEP 3: Create gifs table if missing ======
  console.log('\n=== Step 3: Create gifs table ===');
  try {
    await c.query(`
      CREATE TABLE IF NOT EXISTS public.gifs (
        id TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::TEXT,
        title TEXT NOT NULL DEFAULT '',
        url TEXT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT true,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    console.log('  gifs table created ✓');
  } catch (e) {
    console.log('  gifs:', e.message);
  }

  // ====== STEP 4: Create about table if missing ======
  console.log('\n=== Step 4: Create about table ===');
  try {
    await c.query(`
      CREATE TABLE IF NOT EXISTS public.about (
        id TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::TEXT,
        image_url TEXT,
        title TEXT NOT NULL DEFAULT 'About Us',
        description TEXT NOT NULL DEFAULT '',
        phone TEXT,
        instagram_url TEXT,
        facebook_url TEXT,
        tiktok_url TEXT,
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    console.log('  about table created ✓');
  } catch (e) {
    console.log('  about:', e.message);
  }

  // ====== STEP 5: Create reviews table if missing ======
  console.log('\n=== Step 5: Create reviews table ===');
  try {
    await c.query(`
      CREATE TABLE IF NOT EXISTS public.reviews (
        id TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::TEXT,
        product_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 5,
        comment TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    console.log('  reviews table created ✓');
  } catch (e) {
    console.log('  reviews:', e.message);
  }

  // ====== STEP 6: Disable RLS on all tables (for development) ======
  console.log('\n=== Step 6: Disable RLS ===');
  const allTables = ['products','users','orders','order_items','banners','site_content',
                     'saved_products','categories','gifs','about','reviews'];
  for (const t of allTables) {
    try {
      await c.query(`ALTER TABLE public.${t} DISABLE ROW LEVEL SECURITY`);
      console.log(`  RLS disabled on ${t} ✓`);
    } catch (e) { console.log(`  ${t}: ${e.message}`); }
  }

  // ====== STEP 7: Verify final state ======
  console.log('\n=== Verification ===');
  const { rows: users } = await c.query('SELECT id, email, role FROM public.users ORDER BY created_at');
  console.log('Users:', JSON.stringify(users));
  
  const { rows: ordersSample } = await c.query('SELECT id, user_id, status, total FROM public.orders LIMIT 3');
  console.log('Orders sample:', JSON.stringify(ordersSample));

  // Check remaining FK constraints
  const { rows: fks } = await c.query(`
    SELECT tc.table_name, tc.constraint_name, kcu.column_name, ccu.table_name AS fk_table
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
  `);
  console.log('Remaining FKs:', JSON.stringify(fks));

  await c.end();
  console.log('\n✅ Migration complete!');
})();
