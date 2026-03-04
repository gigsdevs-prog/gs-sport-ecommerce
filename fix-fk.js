const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await c.connect();
  const drops = [
    ['saved_products', 'saved_products_userId_fkey'],
    ['saved_products', 'saved_products_productId_fkey'],
    ['cart_items', 'cart_items_userId_fkey'],
    ['cart_items', 'cart_items_productId_fkey'],
    ['accounts', 'accounts_userId_fkey'],
    ['sessions', 'sessions_userId_fkey'],
  ];
  for (const [table, fk] of drops) {
    try {
      await c.query(`ALTER TABLE public."${table}" DROP CONSTRAINT IF EXISTS "${fk}"`);
      console.log(`Dropped ${fk}`);
    } catch (e) {
      console.log(`${fk}: ${e.message}`);
    }
  }
  await c.end();
})();
