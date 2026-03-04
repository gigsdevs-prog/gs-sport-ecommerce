const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const env = fs.readFileSync('.env.local', 'utf8');
const vars = {};
env.split('\n').forEach(l => {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m) {
    let val = m[2].trim();
    // Strip surrounding quotes
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    vars[m[1]] = val;
  }
});

const url = vars.NEXT_PUBLIC_SUPABASE_URL;
const key = vars.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL:', url ? url.substring(0, 30) + '...' : 'NOT SET');
console.log('Key:', key ? `SET (${key.length} chars)` : 'NOT SET');

const supabase = createClient(url, key);

async function main() {
  // List existing buckets
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  console.log('\nExisting buckets:', buckets?.map(b => b.id) || [], listErr?.message || '');

  // Create 'about' bucket
  console.log('\nCreating "about" bucket...');
  const { data, error } = await supabase.storage.createBucket('about', {
    public: true,
    fileSizeLimit: 10485760,
  });
  if (error) {
    console.log('Create result:', error.message);
  } else {
    console.log('Created successfully:', data);
  }

  // List again
  const { data: buckets2 } = await supabase.storage.listBuckets();
  console.log('\nBuckets after:', buckets2?.map(b => b.id) || []);

  // Test upload
  console.log('\nTesting upload...');
  const testData = Buffer.from('test');
  const { error: uploadErr } = await supabase.storage
    .from('about')
    .upload('test.txt', testData, { contentType: 'text/plain', upsert: true });
  
  if (uploadErr) {
    console.log('Upload test FAILED:', uploadErr.message);
  } else {
    console.log('Upload test SUCCESS');
    await supabase.storage.from('about').remove(['test.txt']);
    console.log('Cleanup done');
  }
}

main().catch(console.error);
