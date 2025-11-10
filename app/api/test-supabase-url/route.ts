import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the specific Supabase URL that should contain the image
    const supabaseUrl = 'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg';
    
    console.log('Testing Supabase URL:', supabaseUrl);
    
    // First test if we can access the Supabase domain at all
    const domainTestUrl = 'https://elipizumpfnzmzifrcnl.supabase.co';
    try {
      const domainResponse = await fetch(domainTestUrl, { method: 'HEAD' });
      console.log('Supabase domain test - Status:', domainResponse.status);
    } catch (domainError: any) {
      console.error('Supabase domain test failed:', domainError.message);
      return NextResponse.json({ 
        success: false,
        message: 'Cannot access Supabase domain',
        error: domainError.message || String(domainError)
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }
    
    // Try to fetch the image directly from Supabase
    const response = await fetch(supabaseUrl);
    
    console.log('Supabase response status:', response.status);
    console.log('Supabase response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read response body');
      console.error('Supabase error:', errorText);
      
      return NextResponse.json({ 
        success: false,
        message: 'Failed to fetch from Supabase directly',
        url: supabaseUrl,
        status: response.status,
        error: errorText
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }
    
    // Try to get the content type and size
    const contentType = response.headers.get('content-type') || 'unknown';
    const contentLength = response.headers.get('content-length') || 'unknown';
    
    return NextResponse.json({ 
      success: true,
      message: 'Successfully fetched from Supabase directly',
      url: supabaseUrl,
      status: response.status,
      contentType,
      contentLength
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err: any) {
    console.error('Test error:', err);
    return new NextResponse('Test failed: ' + (err.message || err), { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}