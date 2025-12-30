import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    // Build query
    let query = supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_images (
          id,
          url,
          alt_text,
          is_primary,
          display_order,
          created_at
        )
      `)
      .eq('id', id)
      .is('deleted_at', null);

    // For public access, only show published vehicles
    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
    const { id } = await params;
    const body = await request.json();

    // Update vehicle
    const { data, error } = await supabase
      .from('vehicles')
      .update(body)
      .eq('id', id)
      .select(`
        *,
        vehicle_images (
          id,
          url,
          alt_text,
          is_primary,
          display_order,
          created_at
        )
      `)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update vehicle' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
    const { id } = await params;

    // Soft delete - set deleted_at timestamp
    const { error } = await supabase
      .from('vehicles')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete vehicle' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
