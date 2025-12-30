import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function addIsPublishedField() {
  try {
    console.log('🚀 Adding is_published field to vehicles table...\n');

    // Read the SQL migration file
    const sqlPath = path.join(__dirname, 'migrations', 'add-is-published.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Execute the SQL using Supabase RPC
    // Note: Since Supabase doesn't support direct SQL execution via client,
    // we'll use the SQL editor in Supabase Dashboard or add the column directly

    // For now, let's add the column using a simpler approach
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();

    if (error) {
      console.log('⚠️  Note: Direct SQL execution not available via client.');
      console.log('📝 Please run the following SQL in your Supabase SQL Editor:\n');
      console.log('Path: scripts/migrations/add-is-published.sql\n');
      console.log('Or copy this SQL:\n');
      console.log(sql);
      console.log('\n✅ After running the SQL, run: npm run publish-vehicles');
      return;
    }

    console.log('✅ Successfully added is_published field!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addIsPublishedField();
