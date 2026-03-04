const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await c.connect();

  // Rename about → about_page
  try {
    await c.query('ALTER TABLE public.about RENAME TO about_page');
    console.log('Renamed about → about_page ✓');
  } catch (e) {
    console.log('about rename:', e.message);
  }

  // Create gif_sections table
  try {
    await c.query(`
      CREATE TABLE IF NOT EXISTS public.gif_sections (
        id TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::TEXT,
        title TEXT,
        gif_url TEXT NOT NULL,
        category_id TEXT,
        product_id TEXT,
        active BOOLEAN NOT NULL DEFAULT true,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    console.log('Created gif_sections ✓');
  } catch (e) {
    console.log('gif_sections:', e.message);
  }

  // Disable RLS on new tables
  try {
    await c.query('ALTER TABLE public.about_page DISABLE ROW LEVEL SECURITY');
    await c.query('ALTER TABLE public.gif_sections DISABLE ROW LEVEL SECURITY');
    console.log('RLS disabled ✓');
  } catch (e) {
    console.log('RLS:', e.message);
  }

  // Drop old gifs table (we created it by mistake)
  try {
    await c.query('DROP TABLE IF EXISTS public.gifs');
    console.log('Dropped old gifs table ✓');
  } catch (e) {
    console.log('drop gifs:', e.message);
  }

  await c.end();
  console.log('Done!');
})();
