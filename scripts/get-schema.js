const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    envVars[key] = value;
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function getTableSchema() {
  console.log('🔍 Fetching Table Schemas...\n');

  const tables = ['vehicles', 'vehicle_images', 'inquiries', 'production_inquiries', 'users'];

  for (const tableName of tables) {
    console.log(`\n📋 Table: ${tableName}`);
    console.log('─'.repeat(60));

    // Use RPC to get column information
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: tableName });

    if (error) {
      // Fallback: query pg_catalog directly using raw SQL
      const query = `
        SELECT
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = '${tableName}'
        ORDER BY ordinal_position;
      `;

      // Try using Supabase's postgres connection
      const { data: pgData, error: pgError } = await supabase
        .from(tableName)
        .select('*')
        .limit(0);

      if (pgError && pgError.code !== 'PGRST116') {
        console.log(`   ❌ Error: ${pgError.message}`);
        continue;
      }

      // Since direct schema query doesn't work, let's use TypeScript generation approach
      console.log(`   ℹ️  Table exists. Run: npx supabase gen types typescript --project-id qbcvxetpiaocgfxykvsv > lib/database.types.ts`);
      console.log(`   ℹ️  Or view schema in Supabase Dashboard: Table Editor`);
    }
  }

  console.log('\n\n💡 To get complete type definitions, run:');
  console.log('   npx supabase gen types typescript --project-id qbcvxetpiaocgfxykvsv > lib/database.types.ts\n');
}

getTableSchema();
