import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== PLATFORM RESTRICTIONS TEST ===');
    
    // Check Vercel-specific environment variables
    const vercelEnv = process.env.VERCEL_ENV;
    const vercelRegion = process.env.VERCEL_REGION;
    const nodeVersion = process.version;
    
    console.log('Platform info:', { vercelEnv, vercelRegion, nodeVersion });
    
    // Test different types of external requests
    const testCases = [
      {
        name: 'HTTPS to HTTPBin',
        url: 'https://httpbin.org/get',
        description: 'Standard HTTPS request'
      },
      {
        name: 'HTTPS to Google',
        url: 'https://google.com',
        description: 'Major website'
      },
      {
        name: 'HTTPS to Supabase',
        url: 'https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762771365593-looafqzp4w.jpg',
        description: 'Specific Supabase image'
      }
    ];
    
    const results = [];
    
    for (const testCase of testCases) {
      try {
        console.log(`Testing: ${testCase.name}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(testCase.url, {
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        results.push({
          name: testCase.name,
          description: testCase.description,
          url: testCase.url,
          status: response.status,
          ok: response.ok,
          timedOut: false,
          error: null
        });
        
        console.log(`✓ ${testCase.name} - Status: ${response.status}`);
      } catch (error: any) {
        console.error(`✗ ${testCase.name} failed:`, error.message);
        results.push({
          name: testCase.name,
          description: testCase.description,
          url: testCase.url,
          status: null,
          ok: false,
          timedOut: error.name === 'AbortError',
          error: error.message || String(error)
        });
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Platform restrictions test completed',
      platform: { vercelEnv, vercelRegion, nodeVersion },
      results
    });
  } catch (err: any) {
    console.error('Platform restrictions test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}