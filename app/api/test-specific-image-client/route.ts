import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('=== SPECIFIC IMAGE CLIENT TEST ===');
    
    // Initialize Supabase client
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase client not configured'
      }, { status: 500 });
    }
    
    // Test the specific image that's not loading
    const bucket = 'gallery';
    const filePath = 'countries/germany/2025-11-10/1762773151025-r7d4gm0qc5.jpg';
    
    console.log('Testing Supabase client fetch:', bucket, filePath);
    
    // Try to get file metadata first
    const { data: metaData, error: metaError } = await supabase.storage.from(bucket).list('countries/germany/2025-11-10/', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
      search: '1762773151025-r7d4gm0qc5.jpg'
    });
    
    if (metaError) {
      console.error('Metadata fetch error:', metaError.message);
      return NextResponse.json({ 
        success: false, 
        error: 'Metadata fetch failed',
        metaError: metaError.message
      });
    }
    
    console.log('Metadata found:', metaData);
    
    // Now try to download the image
    console.log('Attempting to download image...');
    const { data, error } = await supabase.storage.from(bucket).download(filePath);
    
    if (error) {
      console.error('Download error:', error.message);
      return NextResponse.json({ 
        success: false, 
        error: 'Download failed',
        downloadError: error.message,
        bucket: bucket,
        filePath: filePath
      });
    }
    
    console.log('Download successful, size:', data.size);
    
    // Convert to buffer to check content
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('Buffer size:', buffer.length);
    console.log('Content type:', data.type);
    
    // Check if it's a valid image by looking at magic bytes
    if (buffer.length > 4) {
      const isJPEG = buffer[0] === 0xFF && buffer[1] === 0xD8;
      const isPNG = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
      console.log('Is JPEG:', isJPEG);
      console.log('Is PNG:', isPNG);
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Specific image client test completed',
      bucket: bucket,
      filePath: filePath,
      size: buffer.length,
      contentType: data.type,
      metadata: metaData,
      isJPEG: buffer.length > 2 && buffer[0] === 0xFF && buffer[1] === 0xD8,
      isPNG: buffer.length > 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47
    });
  } catch (err: any) {
    console.error('Specific image client test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}