import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// POST /api/vehicles/[id]/images - Upload images to Supabase Storage and add to vehicle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate vehicle exists
    const { data: vehicle, error: vehicleError } = await supabaseAdmin
      .from('vehicles')
      .select('id, make, model, year')
      .eq('id', id)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // Parse multipart/form-data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Create Supabase client with service role key for storage access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const uploadedImages = [];

    // Upload each file to Supabase Storage
    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${vehicle.id}/${Date.now()}-${index}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return NextResponse.json(
          { error: `Failed to upload ${file.name}: ${uploadError.message}` },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(fileName);

      // Get metadata from form
      const altText = formData.get(`alt_text_${index}`) as string || `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
      const isPrimary = formData.get(`is_primary_${index}`) === 'true';
      const displayOrder = parseInt(formData.get(`display_order_${index}`) as string || '0');

      uploadedImages.push({
        vehicle_id: id,
        url: publicUrl,
        alt_text: altText,
        is_primary: isPrimary,
        display_order: displayOrder,
        file_size: file.size,
        format: fileExt,
      });
    }

    // Insert image records into database
    const { data: images, error: imagesError } = await supabaseAdmin
      .from('vehicle_images')
      .insert(uploadedImages)
      .select();

    if (imagesError) {
      console.error('Error saving image records:', imagesError);
      return NextResponse.json({ error: imagesError.message }, { status: 500 });
    }

    return NextResponse.json({ images, count: images.length }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/vehicles/[id]/images - Delete images from storage and database
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const imageIds = searchParams.get('imageIds')?.split(',') || [];

    if (imageIds.length === 0) {
      return NextResponse.json({ error: 'No image IDs provided' }, { status: 400 });
    }

    // Get image URLs before deleting from database
    const { data: imagesToDelete, error: fetchError } = await supabaseAdmin
      .from('vehicle_images')
      .select('id, url')
      .in('id', imageIds)
      .eq('vehicle_id', id);

    if (fetchError) {
      console.error('Error fetching images:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Delete from storage
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    for (const image of imagesToDelete || []) {
      // Extract file path from public URL
      const urlParts = image.url.split('/vehicle-images/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];

        const { error: deleteError } = await supabase.storage
          .from('vehicle-images')
          .remove([filePath]);

        if (deleteError) {
          console.error('Error deleting file from storage:', deleteError);
        }
      }
    }

    // Delete from database
    const { error } = await supabaseAdmin
      .from('vehicle_images')
      .delete()
      .in('id', imageIds)
      .eq('vehicle_id', id);

    if (error) {
      console.error('Error deleting images from database:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Images deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
