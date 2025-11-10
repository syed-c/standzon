import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== SSL ISSUE TEST ===');
    
    // Test the specific Supabase URL that should contain the image
    const supabaseUrl = 'https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762771365593-looafqzp4w.jpg';
    
    console.log('Testing Supabase URL:', supabaseUrl);
    
    // Try different fetch approaches
    const approaches = [
      {
        name: 'Basic fetch',
        fn: () => fetch(supabaseUrl)
      },
      {
        name: 'Fetch with redirect follow',
        fn: () => fetch(supabaseUrl, { redirect: 'follow' })
      },
      {
        name: 'Fetch with custom headers',
        fn: () => fetch(supabaseUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Next.js Media Proxy; +https://standzon.vercel.app)'
          }
        })
      },
      {
        name: 'Fetch with all options',
        fn: () => fetch(supabaseUrl, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Next.js Media Proxy; +https://standzon.vercel.app)'
          }
        })
      }
    ];
    
    const results = [];
    
    for (const approach of approaches) {
      try {
        console.log(`Testing approach: ${approach.name}`);
        const response = await approach.fn();
        
        results.push({
          name: approach.name,
          status: response.status,
          ok: response.ok,
          error: null
        });
        
        console.log(`✓ ${approach.name} - Status: ${response.status}`);
      } catch (error: any) {
        console.error(`✗ ${approach.name} failed:`, error.message);
        results.push({
          name: approach.name,
          status: null,
          ok: false,
          error: error.message || String(error)
        });
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'SSL and fetch approach test completed',
      results
    });
  } catch (err: any) {
    console.error('SSL test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}