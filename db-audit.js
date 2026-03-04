const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await c.connect();
  const tables = ['products','users','orders','order_items','banners','site_content','saved_products','categories','gifs'];
  for (const t of tables) {
    const { rows: cols } = await c.query(
      `SELECT column_name, data_type, column_default, is_nullable FROM information_schema.columns WHERE table_name=$1 AND table_schema='public' ORDER BY ordinal_position`, [t]
    );
    console.log('\n=== ' + t.toUpperCase() + ' ===');
    if (!cols.length) { console.log('  (not found)'); continue; }
    cols.forEach(r => console.log(`  ${r.column_name} (${r.data_type})${r.column_default ? ' DEF=' + r.column_default : ''}${r.is_nullable === 'NO' ? ' NOT NULL' : ''}`));
    const { rows: cnt } = await c.query(`SELECT count(*) as cnt FROM public.${t}`);
    console.log(`  → ${cnt[0].cnt} rows`);
    if (t === 'products') {
      const { rows: s } = await c.query('SELECT id, name, slug, category_id, active, featured, best_seller, compare_at_price FROM public.products LIMIT 3');
      console.log('  Sample:', JSON.stringify(s));
    }
    if (t === 'users') {
      const { rows: s } = await c.query('SELECT id, email, full_name, role, blocked FROM public.users LIMIT 3');
      console.log('  Sample:', JSON.stringify(s));
    }
    if (t === 'orders') {
      const { rows: s } = await c.query('SELECT id, user_id, status, total, payment_method FROM public.orders LIMIT 3');
      console.log('  Sample:', JSON.stringify(s));
    }
  }
  // Check functions
  const { rows: fns } = await c.query(`SELECT proname FROM pg_proc WHERE proname = 'decrease_stock'`);
  console.log('\n=== FUNCTIONS ===');
  console.log('  decrease_stock:', fns.length > 0 ? 'EXISTS' : 'NOT FOUND');
  
  // Check foreign keys on orders
  const { rows: fks } = await c.query(`
    SELECT tc.constraint_name, kcu.column_name, ccu.table_name AS fk_table, ccu.column_name AS fk_column
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name = 'orders' AND tc.constraint_type = 'FOREIGN KEY'
  `);
  console.log('\n=== ORDERS FK ===');
  fks.forEach(r => console.log(`  ${r.column_name} → ${r.fk_table}.${r.fk_column} (${r.constraint_name})`));
  
  // Check FK on order_items
  const { rows: fks2 } = await c.query(`
    SELECT tc.constraint_name, kcu.column_name, ccu.table_name AS fk_table, ccu.column_name AS fk_column
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name = 'order_items' AND tc.constraint_type = 'FOREIGN KEY'
  `);
  console.log('\n=== ORDER_ITEMS FK ===');
  fks2.forEach(r => console.log(`  ${r.column_name} → ${r.fk_table}.${r.fk_column} (${r.constraint_name})`));
  
  await c.end();
})();
