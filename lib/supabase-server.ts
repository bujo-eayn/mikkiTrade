import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Server-side only - get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase server environment variables');
}

// Server-side Supabase client with service role (for admin operations)
// This should ONLY be used in API routes and server components
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Export types for convenience
export type { Database };
export type Vehicle = Database['public']['Tables']['vehicles']['Row'];
export type VehicleInsert = Database['public']['Tables']['vehicles']['Insert'];
export type VehicleUpdate = Database['public']['Tables']['vehicles']['Update'];
export type VehicleImage = Database['public']['Tables']['vehicle_images']['Row'];
export type Inquiry = Database['public']['Tables']['inquiries']['Row'];
export type ProductionInquiry = Database['public']['Tables']['production_inquiries']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
