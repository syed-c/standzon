import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('=== PATH PARSING TEST ===');
    console.log('Request URL:', request.url);
    
    // Parse the URL to simulate what the proxy does
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').slice(3); // Remove /api/test-path-parsing/
    console.log('Raw path parts:', pathParts);
    
    // Test with a real image path
    const testPath = 'gallery/countries/germany/2025-11-10/1762773151025-r7d4gm0qc5.jpg';
    const testParts = testPath.split('/');
    console.log('Test path parts:', testParts);
    
    // Simulate proxy logic
    let bucket = 'gallery';
    let filePath = testPath;
    
    const knownBuckets = ['gallery', 'portfolio-images'];
    if (knownBuckets.includes(testParts[0])) {
      bucket = testParts[0];
      filePath = testParts.slice(1).join('/');
      console.log('Parsed bucket:', bucket);
      console.log('Parsed file path:', filePath);
    } else {
      console.log('Using default gallery bucket');
    }
    
    // Construct Supabase URL
    const supabaseUrl = `https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;
    console.log('Constructed Supabase URL:', supabaseUrl);
    
    // Test if this matches the expected URL
    const expectedUrl = 'https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762773151025-r7d4gm0qc5.jpg';
    const matches = supabaseUrl === expectedUrl;
    console.log('URL matches expected:', matches);
    
    return NextResponse.json({ 
      success: true,
      message: 'Path parsing test completed',
      rawPathParts: pathParts,
      testPathParts: testParts,
      bucket: bucket,
      filePath: filePath,
      constructedUrl: supabaseUrl,
      expectedUrl: expectedUrl,
      urlsMatch: matches
    });
  } catch (err: any) {
    console.error('Path parsing test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}