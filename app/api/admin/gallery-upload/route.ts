import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Log the incoming request for debugging
    console.log('Gallery upload request received');
    
    const supabase = getServerSupabase();
    if (!supabase) {
      console.error('Supabase not configured');
      return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
    }

    let formData;
    try {
      formData = await request.formData();
    } catch (formError) {
      console.error('Form data parsing error:', formError);
      return NextResponse.json({ success: false, error: 'Invalid form data' }, { status: 400 });
    }
    
    const file = formData.get('file') as File | null;
    const scope = (formData.get('scope') as string) || 'general';
    
    if (!file) {
      console.error('No file provided in form data');
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      console.error('Unsupported image type:', file.type);
      return NextResponse.json({ success: false, error: `Unsupported image type: ${file.type}` }, { status: 400 });
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      return NextResponse.json({ success: false, error: `File too large (${Math.round(file.size / (1024 * 1024))}MB max)` }, { status: 400 });
    }

    let bytes;
    try {
      bytes = await file.arrayBuffer();
    } catch (bufferError) {
      console.error('File buffer conversion error:', bufferError);
      return NextResponse.json({ success: false, error: 'Failed to process file' }, { status: 500 });
    }
    
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${scope}/${new Date().toISOString().slice(0,10)}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    console.log('Upload path:', path);

    // Ensure bucket exists (create if missing)
    const bucket = process.env.SUPABASE_GALLERY_BUCKET || 'gallery';
    console.log('Using bucket:', bucket);
    
    try {
      const { data: existing, error: bucketError } = await supabase.storage.getBucket(bucket);
      if (bucketError) {
        console.warn('Error checking bucket existence:', bucketError);
      }
      
      if (!existing) {
        console.log('Creating bucket:', bucket);
        const { error: createError } = await supabase.storage.createBucket(bucket, { 
          public: true, 
          fileSizeLimit: 10 * 1024 * 1024 
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
        } else {
          console.log('Bucket created successfully');
        }
      }
    } catch (bucketCheckError) {
      console.error('Error during bucket check:', bucketCheckError);
      // Continue anyway as the upload might still work
    }

    console.log('Uploading file to Supabase...');
    const { data: uploadData, error: uploadError } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });
    
    if (uploadError) {
      console.error('Gallery upload error:', uploadError);
      // Check if the error message is JSON parseable
      let errorMessage = uploadError.message;
      if (errorMessage.includes('Unexpected token')) {
        errorMessage = 'Supabase storage error: Internal server error. This typically happens when there are issues with the Supabase project configuration, bucket permissions, or network connectivity.';
      }
      return NextResponse.json({ 
        success: false, 
        error: `Upload failed: ${errorMessage}`,
        troubleshooting: {
          check: 'Verify the following:',
          suggestions: [
            'Ensure the Supabase project is properly configured',
            'Check that the gallery bucket exists and has public read permissions',
            'Verify the SUPABASE_SERVICE_ROLE_KEY has the necessary permissions',
            'Check Supabase storage documentation for proper setup'
          ]
        }
      }, { status: 500 });
    }
    
    console.log('Upload successful:', uploadData);

    console.log('Getting public URL...');
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    const publicUrl = pub?.publicUrl || '';

    if (!publicUrl) {
      console.error('Failed to get public URL');
      return NextResponse.json({ success: false, error: 'Failed to get public URL' }, { status: 500 });
    }

    console.log('Public URL:', publicUrl);

    // Test if the uploaded file is accessible
    console.log('Testing file accessibility...');
    let testResponse;
    try {
      // Create an AbortController for timeout functionality
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      testResponse = await fetch(publicUrl, { 
        method: 'HEAD', 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      console.log('Uploaded file accessibility test:', {
        url: publicUrl,
        status: testResponse.status,
        ok: testResponse.ok
      });
    } catch (testError) {
      console.error('File accessibility test failed:', testError);
      testResponse = { status: 0, ok: false };
    }

    // Create proxied URL using our custom domain
    // The proxy expects the full path including the bucket name
    const proxiedPath = `/api/media/${bucket}/${path}`;
    
    // Get the base URL from the request to create an absolute URL
    // Use the host from headers, with a more generic fallback
    const host = request.headers.get('host') || 'localhost:3000';
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
        directUrlAccessible: testResponse?.ok || false,
        directUrlStatus: testResponse?.status || 0
      }
    });
  } catch (e: any) {
    console.error('Gallery upload error:', e);
    // Return a more detailed error message
    const errorMessage = e?.message || 'Upload failed';
    const errorStack = e?.stack || '';
    
    // Check if this is a JSON parsing error (which would indicate the server returned HTML instead of JSON)
    if (errorMessage.includes('Unexpected token')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Server error: The upload service is temporarily unavailable. Please try again later.',
        details: 'This error typically occurs when the server encounters an internal issue.'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}