// Migration script: align DB column names with code expectations
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to database\n');

    // ===== ORDERS TABLE =====
    console.log('--- ORDERS TABLE ---');
    
    // 1. Rename userId -> user_id
    try {
      await client.query('ALTER TABLE public.orders RENAME COLUMN "userId" TO user_id;');
      console.log('✓ Renamed userId → user_id');
    } catch (e) {
      console.log('- userId rename:', e.message.includes('does not exist') ? 'already renamed' : e.message);
    }

    // 2. Make user_id nullable (for guest checkout)
    try {
      await client.query('ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;');
      console.log('✓ Made user_id nullable');
    } catch (e) {
      console.log('- user_id nullable:', e.message);
    }

    // 3. Rename address -> shipping_address
    try {
      await client.query('ALTER TABLE public.orders RENAME COLUMN "address" TO shipping_address;');
      console.log('✓ Renamed address → shipping_address');
    } catch (e) {
      console.log('- address rename:', e.message.includes('does not exist') ? 'already renamed' : e.message);
    }

    // 4. Make shipping_address nullable
    try {
      await client.query('ALTER TABLE public.orders ALTER COLUMN shipping_address DROP NOT NULL;');
      console.log('✓ Made shipping_address nullable');
    } catch (e) {
      console.log('- shipping_address nullable:', e.message);
    }

    // 5. Rename createdAt -> created_at
    try {
      await client.query('ALTER TABLE public.orders RENAME COLUMN "createdAt" TO created_at;');
      console.log('✓ Renamed createdAt → created_at');
    } catch (e) {
      console.log('- createdAt rename:', e.message.includes('does not exist') ? 'already renamed' : e.message);
    }

    // 6. Rename updatedAt -> updated_at
    try {
      await client.query('ALTER TABLE public.orders RENAME COLUMN "updatedAt" TO updated_at;');
      console.log('✓ Renamed updatedAt → updated_at');
    } catch (e) {
      console.log('- updatedAt rename:', e.message.includes('does not exist') ? 'already renamed' : e.message);
    }

    // 7. Add tax column if missing
    try {
      await client.query("ALTER TABLE public.orders ADD COLUMN tax DOUBLE PRECISION NOT NULL DEFAULT 0;");
      console.log('✓ Added tax column');
    } catch (e) {
      console.log('- tax column:', e.message.includes('already exists') ? 'already exists' : e.message);
    }

    // 8. Convert status from ENUM to TEXT
    try {
      const { rows } = await client.query(`
        SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'status' AND table_schema = 'public';
      `);
      if (rows[0]?.data_type === 'USER-DEFINED') {
        await client.query(`ALTER TABLE public.orders ALTER COLUMN status TYPE TEXT USING status::TEXT;`);
        await client.query(`UPDATE public.orders SET status = LOWER(status);`);
        await client.query(`ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';`);
        console.log('✓ Converted status ENUM → TEXT (lowercased values)');
      } else {
        console.log('- status already TEXT type');
      }
    } catch (e) {
      console.log('- status conversion:', e.message);
    }

    // ===== ORDER_ITEMS TABLE =====
    console.log('\n--- ORDER_ITEMS TABLE ---');

    // 9. Rename orderId -> order_id
    try {
      await client.query('ALTER TABLE public.order_items RENAME COLUMN "orderId" TO order_id;');
      console.log('✓ Renamed orderId → order_id');
    } catch (e) {
      console.log('- orderId rename:', e.message.includes('does not exist') ? 'already renamed' : e.message);
    }

    // 10. Rename productId -> product_id
    try {
      await client.query('ALTER TABLE public.order_items RENAME COLUMN "productId" TO product_id;');
      console.log('✓ Renamed productId → product_id');
    } catch (e) {
      console.log('- productId rename:', e.message.includes('does not exist') ? 'already renamed' : e.message);
    }

    // ===== DECREASE_STOCK FUNCTION =====
    console.log('\n--- FUNCTIONS ---');
    await client.query(`
      CREATE OR REPLACE FUNCTION public.decrease_stock(p_product_id TEXT, p_quantity INTEGER)
      RETURNS void AS $$
      BEGIN
        UPDATE public.products
        SET stock = GREATEST(stock - p_quantity, 0),
            "updatedAt" = now()
        WHERE id = p_product_id;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    console.log('✓ Created/updated decrease_stock function (TEXT id)');

    // ===== VERIFY =====
    console.log('\n--- VERIFICATION ---');
    
    const { rows: orderCols } = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'orders'
      ORDER BY ordinal_position;
    `);
    console.log('Orders:', orderCols.map(c => `${c.column_name}(${c.data_type}${c.is_nullable === 'YES' ? '?' : ''})`).join(', '));

    const { rows: itemCols } = await client.query(`
      SELECT column_name
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'order_items'
      ORDER BY ordinal_position;
    `);
    console.log('Order_items:', itemCols.map(c => c.column_name).join(', '));

    console.log('\n✅ Migration complete!');

  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }
}

migrate();
