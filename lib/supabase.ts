'use client';

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Get environment variables
// In Next.js, NEXT_PUBLIC_ variables are automatically replaced at build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file and restart the dev server.');
}

// Client-side Supabase client (for authentication and public queries)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Note: Server-side client moved to lib/supabase-server.ts
// Import from there for API routes and server components

// Export types for convenience
export type { Database };
export type Vehicle = Database['public']['Tables']['vehicles']['Row'];
export type VehicleInsert = Database['public']['Tables']['vehicles']['Insert'];
export type VehicleUpdate = Database['public']['Tables']['vehicles']['Update'];
export type VehicleImage = Database['public']['Tables']['vehicle_images']['Row'];
export type Inquiry = Database['public']['Tables']['inquiries']['Row'];
export type ProductionInquiry = Database['public']['Tables']['production_inquiries']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
