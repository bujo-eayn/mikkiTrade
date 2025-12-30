/**
 * Database Seed Script - Mikki Trade Motors
 *
 * This script seeds the Supabase database with dummy vehicle data.
 * Run with: npm run seed
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';
import { mockVehicles } from '../lib/mockVehicles';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  console.error('');
  console.error('Found:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? '✓' : '✗');
  process.exit(1);
}

// Create admin client
const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to create a slug from vehicle details
function createSlug(make: string, model: string, year: number, id: string): string {
  const slugBase = `${make}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slugBase}-${id.substring(0, 8)}`;
}

// Helper function to parse mileage string to number
function parseMileage(mileageStr: string): number {
  const match = mileageStr.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, '')) : 0;
}

// Map mock vehicle data to database schema
function mapVehicleToDBFormat(mockVehicle: typeof mockVehicles[0]) {
  const slug = createSlug(mockVehicle.make, mockVehicle.model, mockVehicle.year, mockVehicle.id);

  return {
    // Don't include id - let Supabase generate UUID automatically
    // id: mockVehicle.id,  // Removed - will be auto-generated

    // Basic Information
    make: mockVehicle.make,
    model: mockVehicle.model,
    year: mockVehicle.year,
    price: mockVehicle.price,

    // Details
    mileage: parseMileage(mockVehicle.mileage),
    // Map CVT to Automatic (database only accepts Manual or Automatic)
    transmission: (mockVehicle.transmission === 'CVT' ? 'Automatic' : mockVehicle.transmission) as 'Manual' | 'Automatic',
    // Map fuel types (database only accepts: Petrol, Diesel, Hybrid, Electric)
    fuel_type: (mockVehicle.fuelType === 'Plug-in Hybrid' ? 'Hybrid' : mockVehicle.fuelType) as 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric',
    body_type: mockVehicle.bodyType,
    color: mockVehicle.color,
    vin: null, // No VIN in mock data

    // Description
    description: mockVehicle.description,
    features: mockVehicle.features,

    // Status - must be one of: 'available', 'sold', 'reserved', 'coming_soon'
    status: 'available' as const,
    featured: mockVehicle.featured || false,
    on_deal: mockVehicle.oldPrice ? true : false,
    deal_description: mockVehicle.oldPrice
      ? `Special price! Was KES ${mockVehicle.oldPrice.toLocaleString()}`
      : null,

    // SEO & Tags
    slug,
    tags: mockVehicle.badges || [],

    // Metadata - set to 0 initially, will increment with actual usage
    views: 0,
    inquiries: 0,

    // Timestamps
    created_at: mockVehicle.createdAt,
    published_at: mockVehicle.createdAt,
  };
}

// Map vehicle images to database format
function mapVehicleImages(vehicleId: string, images: string[]) {
  return images.map((imageUrl, index) => ({
    vehicle_id: vehicleId,
    url: imageUrl,
    thumbnail_url: imageUrl, // In production, you'd generate actual thumbnails
    alt_text: `Vehicle image ${index + 1}`,
    display_order: index,
    is_primary: index === 0, // First image is primary
    file_size: null,
    width: null,
    height: null,
    format: 'jpg',
  }));
}

// Main seeding function
async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Step 1: Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    const { error: deleteImagesError } = await supabase
      .from('vehicle_images')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteImagesError) {
      console.error('Error deleting images:', deleteImagesError);
    }

    const { error: deleteVehiclesError } = await supabase
      .from('vehicles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteVehiclesError) {
      console.error('Error deleting vehicles:', deleteVehiclesError);
    }

    console.log('✅ Existing data cleared\n');

    // Step 2: Seed vehicles
    console.log(`📦 Seeding ${mockVehicles.length} vehicles...`);

    const vehiclesToInsert = mockVehicles.map(mapVehicleToDBFormat);

    const { data: insertedVehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .insert(vehiclesToInsert)
      .select();

    if (vehiclesError) {
      console.error('❌ Error inserting vehicles:', vehiclesError);
      throw vehiclesError;
    }

    console.log(`✅ Inserted ${insertedVehicles?.length || 0} vehicles\n`);

    // Step 3: Seed vehicle images
    console.log('🖼️  Seeding vehicle images...');

    let totalImages = 0;
    for (let i = 0; i < mockVehicles.length; i++) {
      const mockVehicle = mockVehicles[i];
      const insertedVehicle = insertedVehicles[i];

      // Use the actual vehicle ID from the database
      const images = mapVehicleImages(insertedVehicle.id, mockVehicle.images);

      const { error: imagesError } = await supabase
        .from('vehicle_images')
        .insert(images);

      if (imagesError) {
        console.error(`Error inserting images for vehicle ${insertedVehicle.id}:`, imagesError);
        continue;
      }

      totalImages += images.length;
    }

    console.log(`✅ Inserted ${totalImages} vehicle images\n`);

    // Step 4: Verify data
    console.log('🔍 Verifying seeded data...');

    const { count: vehicleCount } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true });

    const { count: imageCount } = await supabase
      .from('vehicle_images')
      .select('*', { count: 'exact', head: true });

    console.log(`✅ Verification complete:`);
    console.log(`   - Total vehicles: ${vehicleCount}`);
    console.log(`   - Total images: ${imageCount}`);
    console.log(`   - Avg images per vehicle: ${((imageCount || 0) / (vehicleCount || 1)).toFixed(1)}\n`);

    // Step 5: Show some sample data
    console.log('📊 Sample vehicles:');
    const { data: sampleVehicles } = await supabase
      .from('vehicles')
      .select(`
        id,
        make,
        model,
        year,
        price,
        status,
        featured,
        on_deal
      `)
      .limit(5);

    if (sampleVehicles) {
      sampleVehicles.forEach(v => {
        const tags = [];
        if (v.featured) tags.push('FEATURED');
        if (v.on_deal) tags.push('ON DEAL');

        console.log(
          `   ${v.year} ${v.make} ${v.model} - KES ${v.price.toLocaleString()} ${tags.length > 0 ? `[${tags.join(', ')}]` : ''}`
        );
      });
    }

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Check your Supabase dashboard to verify the data');
    console.log('   2. Run the application and test the Motors page');
    console.log('   3. Verify that vehicles are loading from the database\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('🎉 Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
