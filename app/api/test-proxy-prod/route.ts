import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== PRODUCTION PROXY TEST ===');
    
    // Test the exact same logic as the production proxy
    const bucket = 'gallery';
    const filePath = 'countries/germany/2025-11-10/1762771365593-looafqzp4w.jpg'; // Your production image
    const supabaseUrl = `https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;
    
    console.log('Testing Supabase URL:', supabaseUrl);
    
    // Try to fetch with production-like settings
    let response;
    try {
      console.log('Attempting fetch...');
      response = await fetch(supabaseUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Next.js Middleware; +https://nextjs.org/docs/messages/middleware-package-used-in-pages)'
        }
      });
      console.log('Fetch completed, status:', response.status);
    } catch (fetchError: any) {
      console.error('Fetch failed:', fetchError.message);
      console.error('Error type:', typeof fetchError);
      
      return NextResponse.json({ 
        success: false,
        message: 'Fetch failed in production test',
        error: fetchError.message || String(fetchError),
        url: supabaseUrl
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read response');
      console.error('Response not OK:', response.status, errorText);
      
      return NextResponse.json({ 
        success: false,
        message: 'Response not OK in production test',
        status: response.status,
        error: errorText,
        url: supabaseUrl
      });
    }
    
    // If we get here, the fetch worked
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    console.log('Fetch successful, content type:', contentType);
    
    return NextResponse.json({ 
      success: true,
      message: 'Production proxy test successful',
      status: response.status,
      contentType: contentType,
      url: supabaseUrl
    });
  } catch (err: any) {
    console.error('Production proxy test error:', err);
    return NextResponse.json({ 
      success: false,
      message: 'Production proxy test failed',
      error: err.message || String(err)
    });
  }
}