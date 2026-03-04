// Comprehensive migration: align ALL DB columns with code expectations
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function renameCol(c, table, from, to) {
  try {
    await c.query(`ALTER TABLE public."${table}" RENAME COLUMN "${from}" TO "${to}";`);
    console.log(`  ✓ ${table}.${from} → ${to}`);
  } catch (e) {
    if (e.message.includes('does not exist')) console.log(`  - ${table}.${from}: already renamed`);
    else if (e.message.includes('already exists')) console.log(`  - ${table}.${from} → ${to}: target already exists`);
    else console.log(`  ⚠ ${table}.${from}: ${e.message}`);
  }
}

async function addCol(c, table, name, type, def) {
  try {
    const defClause = def !== undefined ? ` DEFAULT ${def}` : '';
    await c.query(`ALTER TABLE public."${table}" ADD COLUMN "${name}" ${type}${defClause};`);
    console.log(`  ✓ Added ${table}.${name}`);
  } catch (e) {
    if (e.message.includes('already exists')) console.log(`  - ${table}.${name}: already exists`);
    else console.log(`  ⚠ ${table}.${name}: ${e.message}`);
  }
}

async function enumToText(c, table, col, defaultVal) {
  try {
    const { rows } = await c.query(`SELECT data_type FROM information_schema.columns WHERE table_name='${table}' AND column_name='${col}' AND table_schema='public'`);
    if (rows[0] && rows[0].data_type === 'USER-DEFINED') {
      await c.query(`ALTER TABLE public."${table}" ALTER COLUMN "${col}" TYPE TEXT USING "${col}"::TEXT;`);
      if (defaultVal) await c.query(`ALTER TABLE public."${table}" ALTER COLUMN "${col}" SET DEFAULT '${defaultVal}';`);
      console.log(`  ✓ ${table}.${col}: ENUM → TEXT`);
    } else {
      console.log(`  - ${table}.${col}: already TEXT`);
    }
  } catch (e) {
    console.log(`  ⚠ ${table}.${col} enum→text: ${e.message}`);
  }
}

async function makeNullable(c, table, col) {
  try {
    await c.query(`ALTER TABLE public."${table}" ALTER COLUMN "${col}" DROP NOT NULL;`);
    console.log(`  ✓ ${table}.${col}: made nullable`);
  } catch (e) {
    console.log(`  - ${table}.${col} nullable: ${e.message}`);
  }
}

async function setDefault(c, table, col, val) {
  try {
    await c.query(`ALTER TABLE public."${table}" ALTER COLUMN "${col}" SET DEFAULT ${val};`);
    console.log(`  ✓ ${table}.${col}: default set`);
  } catch (e) {
    console.log(`  ⚠ ${table}.${col} default: ${e.message}`);
  }
}

async function migrate() {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await c.connect();
  console.log('Connected to database\n');

  // ========== PRODUCTS ==========
  console.log('=== PRODUCTS ===');
  await renameCol(c, 'products', 'originalPrice', 'compare_at_price');
  await renameCol(c, 'products', 'isActive', 'active');
  await renameCol(c, 'products', 'isFeatured', 'featured');
  await renameCol(c, 'products', 'createdAt', 'created_at');
  await renameCol(c, 'products', 'updatedAt', 'updated_at');
  await enumToText(c, 'products', 'gender', null);
  await enumToText(c, 'products', 'category', null);
  // Rename 'category' to 'category_id' so code works
  await renameCol(c, 'products', 'category', 'category_id');
  // Add missing columns
  await addCol(c, 'products', 'slug', 'TEXT', null);
  await addCol(c, 'products', 'videos', 'TEXT[]', "'{}'");
  await addCol(c, 'products', 'best_seller', 'BOOLEAN', 'false');
  // Make some columns nullable
  await makeNullable(c, 'products', 'slug');
  await makeNullable(c, 'products', 'compare_at_price');
  await makeNullable(c, 'products', 'updated_at');
  await makeNullable(c, 'products', 'category_id');
  // Generate slugs from name for existing products
  await c.query(`UPDATE public.products SET slug = LOWER(REGEXP_REPLACE(REPLACE(name, ' ', '-'), '[^a-z0-9-]', '', 'g')) WHERE slug IS NULL;`);
  console.log('  ✓ Generated slugs from names');
  // Make slug unique
  try {
    await c.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);`);
    console.log('  ✓ Created unique index on slug');
  } catch (e) {
    console.log('  ⚠ slug index: ' + e.message);
  }
  // Set default for id using gen_random_uuid
  await setDefault(c, 'products', 'id', "gen_random_uuid()::TEXT");

  // ========== USERS ==========
  console.log('\n=== USERS ===');
  await renameCol(c, 'users', 'name', 'full_name');
  await renameCol(c, 'users', 'avatar', 'avatar_url');
  await renameCol(c, 'users', 'createdAt', 'created_at');
  await renameCol(c, 'users', 'updatedAt', 'updated_at');
  await enumToText(c, 'users', 'role', "'user'");
  // Lowercase role values
  await c.query(`UPDATE public.users SET role = LOWER(role);`);
  console.log('  ✓ Lowercased role values');
  // Add missing columns
  await addCol(c, 'users', 'blocked', 'BOOLEAN', 'false');
  // Make some columns nullable
  await makeNullable(c, 'users', 'full_name');
  await makeNullable(c, 'users', 'avatar_url');
  await makeNullable(c, 'users', 'updated_at');
  // Set defaults
  await setDefault(c, 'users', 'id', "gen_random_uuid()::TEXT");

  // ========== ORDERS ==========
  console.log('\n=== ORDERS ===');
  // Already migrated in previous run, but ensure defaults
  await setDefault(c, 'orders', 'id', "gen_random_uuid()::TEXT");
  await setDefault(c, 'orders', 'updated_at', 'CURRENT_TIMESTAMP');
  await makeNullable(c, 'orders', 'updated_at');

  // ========== ORDER_ITEMS ==========
  console.log('\n=== ORDER_ITEMS ===');
  await setDefault(c, 'order_items', 'id', "gen_random_uuid()::TEXT");

  // ========== BANNERS ==========
  console.log('\n=== BANNERS ===');
  await renameCol(c, 'banners', 'imageUrl', 'image_url');
  await renameCol(c, 'banners', 'linkUrl', 'link');
  await renameCol(c, 'banners', 'isActive', 'active');
  await renameCol(c, 'banners', 'position', 'sort_order');
  await renameCol(c, 'banners', 'createdAt', 'created_at');
  await renameCol(c, 'banners', 'updatedAt', 'updated_at');
  await makeNullable(c, 'banners', 'link');
  await makeNullable(c, 'banners', 'updated_at');
  await setDefault(c, 'banners', 'id', "gen_random_uuid()::TEXT");
  await setDefault(c, 'banners', 'sort_order', '0');
  await setDefault(c, 'banners', 'active', 'true');

  // ========== SITE_CONTENT ==========
  console.log('\n=== SITE_CONTENT ===');
  await renameCol(c, 'site_content', 'updatedAt', 'updated_at');
  await addCol(c, 'site_content', 'created_at', 'TIMESTAMPTZ', 'now()');
  await makeNullable(c, 'site_content', 'updated_at');
  await setDefault(c, 'site_content', 'id', "gen_random_uuid()::TEXT");

  // ========== SAVED_PRODUCTS → WISHLIST ==========
  console.log('\n=== SAVED_PRODUCTS → WISHLIST ===');
  // Rename columns first
  await renameCol(c, 'saved_products', 'userId', 'user_id');
  await renameCol(c, 'saved_products', 'productId', 'product_id');
  await renameCol(c, 'saved_products', 'createdAt', 'created_at');
  // Create a view named 'wishlist' pointing to saved_products
  try {
    await c.query(`CREATE OR REPLACE VIEW public.wishlist AS SELECT * FROM public.saved_products;`);
    console.log('  ✓ Created wishlist view → saved_products');
  } catch (e) {
    console.log('  ⚠ wishlist view: ' + e.message);
  }

  // ========== CATEGORIES TABLE ==========
  console.log('\n=== CATEGORIES ===');
  // Get distinct categories from products
  const { rows: cats } = await c.query(`SELECT DISTINCT category_id FROM public.products WHERE category_id IS NOT NULL`);
  try {
    await c.query(`
      CREATE TABLE IF NOT EXISTS public.categories (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        image TEXT,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    console.log('  ✓ Created categories table');
    // Insert categories from product enum values
    for (const cat of cats) {
      const name = cat.category_id;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      try {
        await c.query(`INSERT INTO public.categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING`, [name, slug]);
      } catch (e) { /* ignore */ }
    }
    console.log(`  ✓ Inserted ${cats.length} categories from product data`);
    // Update products.category_id to reference category IDs
    await c.query(`
      UPDATE public.products p
      SET category_id = c.id
      FROM public.categories c
      WHERE LOWER(p.category_id) = LOWER(c.name) OR LOWER(p.category_id) = LOWER(c.slug);
    `);
    console.log('  ✓ Updated products.category_id to reference category IDs');
  } catch (e) {
    console.log('  ⚠ categories: ' + e.message);
  }

  // ========== DECREASE_STOCK ==========
  console.log('\n=== FUNCTIONS ===');
  await c.query(`
    CREATE OR REPLACE FUNCTION public.decrease_stock(p_product_id TEXT, p_quantity INTEGER)
    RETURNS void AS $$
    BEGIN
      UPDATE public.products SET stock = GREATEST(stock - p_quantity, 0), updated_at = now() WHERE id = p_product_id;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);
  console.log('  ✓ decrease_stock function updated');

  // ========== VERIFY ==========
  console.log('\n=== VERIFICATION ===');
  const tables = ['products', 'users', 'orders', 'order_items', 'banners', 'site_content', 'saved_products'];
  for (const t of tables) {
    const { rows } = await c.query(`SELECT column_name FROM information_schema.columns WHERE table_name='${t}' AND table_schema='public' ORDER BY ordinal_position`);
    console.log(`${t}: ${rows.map(r => r.column_name).join(', ')}`);
  }
  
  // Check categories
  const { rows: catRows } = await c.query(`SELECT * FROM public.categories ORDER BY name`);
  console.log(`categories: ${catRows.length} rows (${catRows.map(r => r.name).join(', ')})`);

  // Check wishlist view
  try {
    await c.query(`SELECT * FROM public.wishlist LIMIT 1`);
    console.log('wishlist view: works');
  } catch (e) {
    console.log('wishlist view: ' + e.message);
  }

  console.log('\n✅ Migration complete!');
  await c.end();
}

migrate().catch(console.error);
