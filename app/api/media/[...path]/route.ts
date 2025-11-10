import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

// Create a proper 1x1 transparent PNG placeholder
const createPlaceholderImage = () => {
  // This is a valid 1x1 transparent PNG
  const placeholder = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  return Buffer.from(placeholder, 'base64');
};

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  try {
    console.log('=== MEDIA PROXY ROUTE CALLED ===');
    console.log('Request URL:', request.url);
    console.log('Full params:', params);
    console.log('Environment:', process.env.NODE_ENV);
    
    const { path } = params;
    
    console.log('Proxy route called with path:', path);
    
    if (!path || !path.length) {
      console.error('Proxy error: Path is required');
      // Return a proper placeholder image
      const placeholder = createPlaceholderImage();
      return new NextResponse(placeholder, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // Convert path array to string
    const pathString = path.join('/');
    console.log('Path string:', pathString);
    
    // The new URLs include the bucket name as the first part of the path
    // For example: "gallery/countries/germany/2025-11-10/1762765141975-7zbl5ivme0o.jpg"
    // Or for backward compatibility: "countries/germany/2025-11-10/1762765141975-7zbl5ivme0o.jpg" (default to gallery)
    
    let bucket = 'gallery';
    let filePath = pathString;
    
    // Check if the first part is a bucket name
    const knownBuckets = ['gallery', 'portfolio-images'];
    if (knownBuckets.includes(path[0])) {
      bucket = path[0];
      filePath = path.slice(1).join('/');
      console.log('Using bucket from path:', bucket);
      console.log('Remaining file path:', filePath);
    } else {
      console.log('Using default gallery bucket');
    }
    
    console.log('Final bucket:', bucket);
    console.log('Final file path:', filePath);
    
    // If filePath is empty, it means the path was just the bucket name
    if (!filePath) {
      console.error('Proxy error: File path is required');
      // Return a proper placeholder image
      const placeholder = createPlaceholderImage();
      return new NextResponse(placeholder, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
    
    // Initialize Supabase client
    const supabase = getServerSupabase();
    if (!supabase) {
      console.error('Supabase client not configured');
      const placeholder = createPlaceholderImage();
      return new NextResponse(placeholder, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
    
    console.log('Fetching image from Supabase using client:', bucket, filePath);
    
    // Fetch the image from Supabase using the client (bypasses network restrictions)
    const { data, error } = await supabase.storage.from(bucket).download(filePath);
    
    if (error) {
      console.error('Supabase client error:', error);
      console.error('Error message:', error.message);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Return a proper placeholder image when fetch fails
      console.log('Returning placeholder image due to Supabase client error');
      const placeholder = createPlaceholderImage();
      return new NextResponse(placeholder, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
    
    console.log('Successfully fetched image from Supabase, size:', data.size);
    
    // Convert Blob to Buffer
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Get content type from the blob
    const contentType = data.type || 'application/octet-stream';
    
    console.log('Content type:', contentType);
    console.log('Content length:', buffer.length);
    
    // Validate that we have actual image data
    if (!buffer || buffer.length === 0) {
      console.error('Received empty buffer from Supabase client');
      const placeholder = createPlaceholderImage();
      return new NextResponse(placeholder, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
    
    // Create response with proper headers
    const nextResponse = new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
        'Accept-Ranges': 'bytes',
      },
    });
    
    console.log('Successfully proxied image using Supabase client');
    return nextResponse;
  } catch (err: any) {
    console.error('Proxy error:', err);
    console.error('Error stack:', err.stack);
    console.error('Error details:', JSON.stringify(err, null, 2));
    
    // Return a proper placeholder image when there's a general error
    console.log('Returning placeholder image due to general error');
    const placeholder = createPlaceholderImage();
    return new NextResponse(placeholder, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }
}