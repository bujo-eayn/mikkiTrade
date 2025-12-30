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
    // Remove quotes if present
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

async function inspectDatabase() {
  console.log('🔍 Inspecting Supabase Database Schema...\n');

  try {
    // Get all tables from information_schema
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);

      // Try alternative approach: query each table directly
      console.log('\n📊 Attempting direct table queries...\n');

      const tablesToCheck = ['vehicles', 'vehicle_images', 'inquiries', 'production_inquiries', 'users'];

      for (const tableName of tablesToCheck) {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (!error) {
          console.log(`✅ Table: ${tableName}`);
          console.log(`   Rows: ${count || 0}`);

          // Get one row to see the schema
          const { data: sample } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

          if (sample && sample.length > 0) {
            console.log(`   Fields: ${Object.keys(sample[0]).join(', ')}\n`);
          } else {
            // Table is empty, we need to describe it differently
            console.log(`   (Table is empty, fetching structure...)\n`);
          }
        } else {
          console.log(`❌ Table: ${tableName} - NOT FOUND or NO ACCESS`);
          console.log(`   Error: ${error.message}\n`);
        }
      }
      return;
    }

    if (!tables || tables.length === 0) {
      console.log('⚠️  No tables found in public schema');
      return;
    }

    console.log(`📊 Found ${tables.length} tables:\n`);

    // For each table, get sample data to understand structure
    for (const table of tables) {
      const tableName = table.table_name;

      // Skip system tables
      if (tableName.startsWith('_')) continue;

      console.log(`\n📋 Table: ${tableName}`);
      console.log('─'.repeat(50));

      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        continue;
      }

      console.log(`   Total rows: ${count || 0}`);

      if (data && data.length > 0) {
        const fields = Object.keys(data[0]);
        console.log(`   Fields (${fields.length}):`);

        for (const field of fields) {
          const value = data[0][field];
          const type = Array.isArray(value) ? 'array' : typeof value;
          console.log(`     - ${field}: ${type}`);
        }
      } else {
        console.log('   (Table is empty)');
      }
    }

    console.log('\n✅ Database inspection complete!\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

inspectDatabase();
