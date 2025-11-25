import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;
    const folder: string | null = data.get('folder') as string || 'portfolio';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = getServerSupabase();
    
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `${folder}/${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

    // Upload to Supabase Storage
    const bucket = 'portfolio-images';
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload to Supabase: ' + uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    const publicUrl = urlData.publicUrl;

    // Create proxied URL using our custom domain
    // The proxy expects the full path including the bucket name
    const proxiedPath = `/api/media/${bucket}/${filename}`;
    
    // Get the base URL from the request to create an absolute URL
    // Use the host from headers, with a more generic fallback
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    const proxiedUrl = `${baseUrl}${proxiedPath}`;

    console.log('✅ Image uploaded to Supabase successfully:', publicUrl);
    console.log('Generated proxied URL:', proxiedUrl);

    return NextResponse.json({
      success: true,
      data: {
        url: proxiedUrl, // Return the absolute proxied URL
        directUrl: publicUrl, // Also include the direct URL for reference
        filename: filename,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('❌ Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}