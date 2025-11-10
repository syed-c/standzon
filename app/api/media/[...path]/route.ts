import { NextResponse } from 'next/server';

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
    console.log('Params:', params);
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
    } else {
      console.log('Using default gallery bucket');
    }
    
    console.log('File path:', filePath);
    
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
    
    // Construct the Supabase Storage URL - Fixed the typo in the domain
    const supabaseUrl = `https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;
    
    console.log('Proxying image from Supabase URL:', supabaseUrl);
    
    // Fetch the image from Supabase with specific options to handle SSL issues
    let response;
    try {
      console.log('Attempting to fetch from Supabase with options...');
      response = await fetch(supabaseUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Next.js Media Proxy; +https://standzon.vercel.app)'
        }
      });
      console.log('Fetch completed with status:', response.status);
    } catch (fetchError: any) {
      console.error('Fetch error when connecting to Supabase:', fetchError);
      console.error('Error type:', typeof fetchError);
      console.error('Error keys:', Object.keys(fetchError || {}));
      
      // Return a proper placeholder image when fetch fails
      console.log('Returning placeholder image due to fetch error');
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
    
    console.log('Supabase response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // If the response is not ok, return a placeholder image
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read response body');
      console.error('Supabase image not found:', supabaseUrl);
      console.error('Response status:', response.status);
      console.error('Response text:', errorText);
      
      // Return a proper placeholder image when the image is not found
      console.log('Returning placeholder image due to 404');
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
    
    // Convert ArrayBuffer to Buffer
    let buffer;
    try {
      console.log('Converting response to buffer...');
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      console.log('Buffer conversion completed, size:', buffer.length);
    } catch (bufferError: any) {
      console.error('Error converting response to buffer:', bufferError);
      
      // Return a proper placeholder image when buffer conversion fails
      console.log('Returning placeholder image due to buffer conversion error');
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
    
    // Get content type from response headers
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    console.log('Content type:', contentType);
    console.log('Content length:', buffer.length);
    
    // Validate that we have actual image data
    if (!buffer || buffer.length === 0) {
      console.error('Received empty buffer from Supabase');
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
    
    console.log('Successfully proxied image');
    return nextResponse;
  } catch (err: any) {
    console.error('Proxy error:', err);
    console.error('Error stack:', err.stack);
    
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