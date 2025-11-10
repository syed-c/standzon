import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    console.log('=== BLOB HANDLING TEST ===');
    console.log('Request URL:', request.url);
    
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase not configured' });
    }

    // Fetch the specific image
    const bucket = 'gallery';
    const filePath = 'countries/germany/2025-11-10/1762773151025-r7d4gm0qc5.jpg';
    
    console.log('Fetching image:', bucket, filePath);
    
    const { data, error } = await supabase.storage.from(bucket).download(filePath);
    
    if (error) {
      console.error('Download error:', error.message);
      return NextResponse.json({ success: false, error: error.message });
    }
    
    console.log('Download successful');
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data));
    console.log('Data size:', data.size);
    console.log('Data type:', data.type);
    
    // Test different ways of converting the Blob
    console.log('Testing arrayBuffer conversion...');
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('Buffer length:', buffer.length);
    console.log('First 10 bytes:', buffer.slice(0, 10));
    
    // Test if it's a valid image
    const isJPEG = buffer.length > 2 && buffer[0] === 0xFF && buffer[1] === 0xD8;
    console.log('Is valid JPEG:', isJPEG);
    
    // Add a timestamp to the filename to avoid caching
    const timestamp = Date.now();
    
    // Return the actual image data
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': data.type || 'image/jpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Timestamp': timestamp.toString(),
      },
    });
  } catch (err: any) {
    console.error('Blob handling test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}