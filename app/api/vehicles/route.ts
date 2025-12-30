import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import type { VehicleInsert } from '@/lib/supabase-server';

// GET /api/vehicles - Fetch all vehicles with dynamic filtering, sorting, pagination, and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Search parameters
    const search = searchParams.get('search'); // Global search across make, model, description

    // Filter parameters
    const status = searchParams.get('status');
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const minMileage = searchParams.get('minMileage');
    const maxMileage = searchParams.get('maxMileage');
    const bodyType = searchParams.get('bodyType');
    const transmission = searchParams.get('transmission');
    const fuelType = searchParams.get('fuelType');
    const color = searchParams.get('color');
    const featured = searchParams.get('featured');
    const onDeal = searchParams.get('onDeal');
    const tags = searchParams.get('tags'); // Comma-separated tags

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Sorting parameters
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Include deleted?
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    // Include drafts (unpublished)? Default false for public API, true for admin
    const includeDrafts = searchParams.get('includeDrafts') === 'true';

    // Build query
    let query = supabaseAdmin
      .from('vehicles')
      .select(`
        *,
        vehicle_images (
          id,
          url,
          thumbnail_url,
          is_primary,
          display_order,
          alt_text
        )
      `, { count: 'exact' });

    // Global search (searches across make, model, and description)
    if (search) {
      const searchPattern = `%${search}%`;
      query = query.or(`make.ilike."${searchPattern}",model.ilike."${searchPattern}",description.ilike."${searchPattern}"`);
    }

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by published status
    // Public API (includeDrafts=false): Only show published vehicles
    // Admin API (includeDrafts=true): Show all vehicles including drafts
    if (!includeDrafts) {
      query = query.eq('is_published', true);
    }

    // Exclude soft-deleted vehicles unless explicitly requested
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }

    if (make) query = query.ilike('make', `%${make}%`); // Case-insensitive partial match
    if (model) query = query.ilike('model', `%${model}%`);
    if (minPrice) query = query.gte('price', parseInt(minPrice));
    if (maxPrice) query = query.lte('price', parseInt(maxPrice));
    if (minYear) query = query.gte('year', parseInt(minYear));
    if (maxYear) query = query.lte('year', parseInt(maxYear));
    if (minMileage) query = query.gte('mileage', parseInt(minMileage));
    if (maxMileage) query = query.lte('mileage', parseInt(maxMileage));
    if (bodyType) query = query.eq('body_type', bodyType);
    if (transmission) query = query.eq('transmission', transmission);
    if (fuelType) query = query.eq('fuel_type', fuelType);
    if (color) query = query.ilike('color', `%${color}%`);
    if (featured !== null) query = query.eq('featured', featured === 'true');
    if (onDeal !== null) query = query.eq('on_deal', onDeal === 'true');

    // Tag filtering (check if vehicle has any of the specified tags)
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      query = query.overlaps('tags', tagArray);
    }

    // Apply sorting (support multiple sort fields)
    const sortFields = sortBy.split(',');
    const sortOrders = sortOrder.split(',');

    sortFields.forEach((field, index) => {
      const order = sortOrders[index] || sortOrders[0] || 'desc';
      query = query.order(field.trim(), { ascending: order.trim() === 'asc' });
    });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching vehicles:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      vehicles: data,
      pagination: {
        total: count,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
        offset,
      },
      filters: {
        search,
        status,
        make,
        model,
        priceRange: minPrice || maxPrice ? { min: minPrice, max: maxPrice } : null,
        yearRange: minYear || maxYear ? { min: minYear, max: maxYear } : null,
        mileageRange: minMileage || maxMileage ? { min: minMileage, max: maxMileage } : null,
        bodyType,
        transmission,
        fuelType,
        color,
        featured,
        onDeal,
        tags: tags ? tags.split(',').map(t => t.trim()) : null,
      },
      sorting: {
        sortBy: sortFields,
        sortOrder: sortOrders,
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as VehicleInsert;

    // Validate required fields
    if (!body.make || !body.model || !body.year || !body.price || !body.slug) {
      return NextResponse.json(
        { error: 'Missing required fields: make, model, year, price, slug' },
        { status: 400 }
      );
    }

    // Insert vehicle
    const { data: vehicle, error: vehicleError } = await supabaseAdmin
      .from('vehicles')
      .insert(body)
      .select()
      .single();

    if (vehicleError) {
      console.error('Error creating vehicle:', vehicleError);
      return NextResponse.json({ error: vehicleError.message }, { status: 500 });
    }

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
