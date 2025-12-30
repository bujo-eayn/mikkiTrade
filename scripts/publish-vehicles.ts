import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

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

async function publishRandomVehicles(count: number = 40) {
  try {
    console.log(`🚀 Publishing ${count} random vehicles...\n`);

    // Step 1: Fetch all vehicles
    const { data: allVehicles, error: fetchError } = await supabase
      .from('vehicles')
      .select('id, make, model, year, is_published')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (fetchError) {
      throw new Error(`Failed to fetch vehicles: ${fetchError.message}`);
    }

    if (!allVehicles || allVehicles.length === 0) {
      console.log('⚠️  No vehicles found in database');
      return;
    }

    console.log(`📊 Found ${allVehicles.length} vehicles in database`);

    // Step 2: Randomly select vehicles to publish
    const shuffled = [...allVehicles].sort(() => 0.5 - Math.random());
    const toPublish = shuffled.slice(0, Math.min(count, allVehicles.length));

    console.log(`📝 Publishing ${toPublish.length} vehicles...\n`);

    // Step 3: Update vehicles to published
    const updates = toPublish.map(async (vehicle) => {
      const { error } = await supabase
        .from('vehicles')
        .update({
          is_published: true,
          status: 'available', // Set to available when publishing
        })
        .eq('id', vehicle.id);

      if (error) {
        console.error(`❌ Failed to publish ${vehicle.make} ${vehicle.model} ${vehicle.year}:`, error.message);
        return null;
      }

      console.log(`✅ Published: ${vehicle.make} ${vehicle.model} ${vehicle.year}`);
      return vehicle.id;
    });

    const results = await Promise.all(updates);
    const successCount = results.filter(id => id !== null).length;

    console.log(`\n✨ Successfully published ${successCount} out of ${toPublish.length} vehicles!`);

    // Step 4: Show summary
    const { data: publishedVehicles, error: summaryError } = await supabase
      .from('vehicles')
      .select('id, is_published')
      .is('deleted_at', null);

    if (!summaryError && publishedVehicles) {
      const totalPublished = publishedVehicles.filter(v => v.is_published).length;
      const totalDrafts = publishedVehicles.filter(v => !v.is_published).length;

      console.log('\n📊 Current Status:');
      console.log(`   Published: ${totalPublished}`);
      console.log(`   Drafts: ${totalDrafts}`);
      console.log(`   Total: ${publishedVehicles.length}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get count from command line argument or default to 40
const count = process.argv[2] ? parseInt(process.argv[2]) : 40;

if (isNaN(count) || count < 1) {
  console.error('❌ Invalid count. Usage: npm run publish-vehicles [count]');
  process.exit(1);
}

publishRandomVehicles(count);
