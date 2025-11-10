import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== DETAILED NETWORK TEST ===');
    
    // Test different endpoints to see what works
    const testUrls = [
      {
        name: 'HTTPBin (known good)',
        url: 'https://httpbin.org/get'
      },
      {
        name: 'Google (known good)',
        url: 'https://google.com'
      },
      {
        name: 'Supabase Domain',
        url: 'https://elipzumpfnzmzifrcnl.supabase.co'
      },
      {
        name: 'Specific Image',
        url: 'https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762771365593-looafqzp4w.jpg'
      }
    ];
    
    const results = [];
    
    for (const test of testUrls) {
      try {
        console.log(`Testing ${test.name}: ${test.url}`);
        const response = await fetch(test.url, { 
          method: 'HEAD'
        });
        
        results.push({
          name: test.name,
          url: test.url,
          status: response.status,
          ok: response.ok,
          error: null
        });
        
        console.log(`✓ ${test.name} - Status: ${response.status}`);
      } catch (error: any) {
        console.error(`✗ ${test.name} failed:`, error.message);
        results.push({
          name: test.name,
          url: test.url,
          status: null,
          ok: false,
          error: error.message || String(error)
        });
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Network connectivity test completed',
      results
    });
  } catch (err: any) {
    console.error('Network test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}