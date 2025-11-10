import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const scope = (formData.get('scope') as string) || 'general';
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Unsupported image type' }, { status: 400 });
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'File too large (10MB max)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${scope}/${new Date().toISOString().slice(0,10)}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Ensure bucket exists (create if missing)
    const bucket = process.env.SUPABASE_GALLERY_BUCKET || 'gallery';
    try {
      const { data: existing } = await supabase.storage.getBucket(bucket);
      if (!existing) {
        await supabase.storage.createBucket(bucket, { public: true, fileSizeLimit: 10 * 1024 * 1024 });
      }
    } catch {
      // Try create if getBucket fails
      try { await supabase.storage.createBucket(bucket, { public: true, fileSizeLimit: 10 * 1024 * 1024 }); } catch {}
    }

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) {
      console.error('Gallery upload error:', uploadError);
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    const publicUrl = pub?.publicUrl || '';

    // Test if the uploaded file is accessible
    const testResponse = await fetch(publicUrl, { method: 'HEAD' });
    console.log('Uploaded file accessibility test:', {
      url: publicUrl,
      status: testResponse.status,
      ok: testResponse.ok
    });

    // Create proxied URL using our custom domain
    // The proxy expects the full path including the bucket name
    const proxiedPath = `/api/media/${bucket}/${path}`;
    
    // Get the base URL from the request to create an absolute URL
    // Use the host from headers to ensure we get the correct port
    const host = request.headers.get('host') || 'localhost:3002';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    const proxiedUrl = `${baseUrl}${proxiedPath}`;

    console.log('Generated proxied URL:', proxiedUrl);

    return NextResponse.json({ 
      success: true, 
      url: proxiedUrl, // Return the absolute proxied URL
      directUrl: publicUrl, // Also include the direct URL for reference
      path,
      test: {
        directUrlAccessible: testResponse.ok,
        directUrlStatus: testResponse.status
      }
    });
  } catch (e: any) {
    console.error('Gallery upload error:', e);
    return NextResponse.json({ success: false, error: e?.message || 'Upload failed' }, { status: 500 });
  }
}