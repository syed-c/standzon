import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('=== PROXY PATH TEST ===');
    
    // Simulate the exact path that would come to the proxy
    // Based on your URL: https://standzon.vercel.app/api/media/gallery/countries/germany/2025-11-10/1762773151025-r7d4gm0qc5.jpg
    const simulatedPath = [
      'gallery',
      'countries',
      'germany',
      '2025-11-10',
      '1762773151025-r7d4gm0qc5.jpg'
    ];
    
    console.log('Simulated path:', simulatedPath);
    
    // Apply the same logic as the proxy
    let bucket = 'gallery';
    let filePath = simulatedPath.join('/');
    
    const knownBuckets = ['gallery', 'portfolio-images'];
    if (knownBuckets.includes(simulatedPath[0])) {
      bucket = simulatedPath[0];
      filePath = simulatedPath.slice(1).join('/');
      console.log('Parsed bucket:', bucket);
      console.log('Parsed file path:', filePath);
    }
    
    // Construct the Supabase URL that would be used
    const supabaseUrl = `https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;
    const expectedUrl = 'https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762773151025-r7d4gm0qc5.jpg';
    
    console.log('Constructed URL:', supabaseUrl);
    console.log('Expected URL:', expectedUrl);
    console.log('URLs match:', supabaseUrl === expectedUrl);
    
    // Also test what the proxy would receive as params
    const paramsObject = { path: simulatedPath };
    console.log('Params object:', paramsObject);
    
    return NextResponse.json({ 
      success: true,
      message: 'Proxy path test completed',
      simulatedPath: simulatedPath,
      bucket: bucket,
      filePath: filePath,
      constructedUrl: supabaseUrl,
      expectedUrl: expectedUrl,
      urlsMatch: supabaseUrl === expectedUrl,
      params: paramsObject
    });
  } catch (err: any) {
    console.error('Proxy path test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}