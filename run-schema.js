const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres.nsupmxkzcwgdzyloyzog:Lashaalad17@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected!\n');

    const schema = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf8');
    
    // Remove single-line comments but preserve $$ blocks
    const lines = schema.split('\n');
    let cleanedLines = [];
    let inDollarBlock = false;
    
    for (const line of lines) {
      if (line.includes('$$')) {
        const count = (line.match(/\$\$/g) || []).length;
        if (count % 2 === 1) inDollarBlock = !inDollarBlock;
        cleanedLines.push(line);
      } else if (inDollarBlock) {
        cleanedLines.push(line);
      } else {
        const trimmed = line.trim();
        if (trimmed.startsWith('--')) continue;
        if (trimmed === '') continue;
        cleanedLines.push(line);
      }
    }
    
    const cleaned = cleanedLines.join('\n');
    
    // Split by semicolons, respecting $$ blocks
    const statements = [];
    let current = '';
    let inDollar = false;
    
    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === '$' && cleaned[i + 1] === '$') {
        inDollar = !inDollar;
        current += '$$';
        i++;
        continue;
      }
      if (cleaned[i] === ';' && !inDollar) {
        const stmt = current.trim();
        if (stmt.length > 0) statements.push(stmt);
        current = '';
        continue;
      }
      current += cleaned[i];
    }
    if (current.trim()) statements.push(current.trim());

    console.log(`Found ${statements.length} SQL statements\n`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const preview = stmt.split('\n').filter(l => l.trim())[0]?.substring(0, 90) || '';
      try {
        await client.query(stmt);
        console.log(`OK  [${i + 1}/${statements.length}] ${preview}`);
        success++;
      } catch (err) {
        console.log(`ERR [${i + 1}/${statements.length}] ${preview}`);
        console.log(`    -> ${err.message}\n`);
        failed++;
      }
    }

    console.log(`\n=============================`);
    console.log(`Done! ${success} succeeded, ${failed} failed`);

  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await client.end();
  }
}

run();
