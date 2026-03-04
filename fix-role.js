const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await c.connect();
  
  // Fix users.role ENUM → TEXT (need quoted default since 'user' is reserved)
  try {
    const { rows } = await c.query("SELECT data_type FROM information_schema.columns WHERE table_name='users' AND column_name='role' AND table_schema='public'");
    console.log('role data_type:', rows[0]?.data_type);
    if (rows[0]?.data_type === 'USER-DEFINED') {
      await c.query('ALTER TABLE public.users ALTER COLUMN role TYPE TEXT USING role::TEXT;');
      console.log('✓ Converted role ENUM → TEXT');
    }
    // Set default (with proper quoting)
    await c.query("ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'user';");
    console.log('✓ Set role default');
    // Lowercase values
    await c.query("UPDATE public.users SET role = LOWER(role);");
    console.log('✓ Lowercased role values');
  } catch (e) {
    console.log('⚠ role fix:', e.message);
  }

  // Also verify the current categories situation
  const { rows: cats } = await c.query("SELECT DISTINCT category_id FROM public.products WHERE category_id IS NOT NULL");
  console.log('\nProduct category_id values:', cats.map(r => r.category_id).join(', '));

  // Insert categories from existing product data if they were enum strings
  for (const cat of cats) {
    const name = cat.category_id;
    // Only insert if it looks like a name (not a UUID)
    if (name && !name.match(/^[0-9a-f]{8}-/i)) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
      try {
        await c.query("INSERT INTO public.categories (id, name, slug) VALUES (gen_random_uuid()::TEXT, $1, $2) ON CONFLICT (slug) DO NOTHING", [name, slug]);
        console.log('  Inserted category:', name, '→', slug);
      } catch (e) {
        console.log('  Category insert error:', e.message);
      }
    }
  }

  // Update products to reference category IDs
  await c.query(`
    UPDATE public.products p
    SET category_id = c.id
    FROM public.categories c
    WHERE p.category_id = c.name OR p.category_id = c.slug;
  `);
  console.log('Updated product category references');

  const { rows: finalCats } = await c.query("SELECT id, name, slug FROM public.categories ORDER BY name");
  console.log('\nFinal categories:', JSON.stringify(finalCats, null, 2));

  await c.end();
})();
