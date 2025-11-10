import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== FETCH DEBUG TEST ===');
    
    // Test if fetch is available
    console.log('Fetch function available:', typeof fetch);
    
    // Test a simple external URL first
    const testUrl = 'https://httpbin.org/get';
    console.log('Testing basic fetch to:', testUrl);
    
    let response;
    try {
      response = await fetch(testUrl);
      console.log('Fetch completed successfully');
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response));
      console.log('Response status:', response.status);
    } catch (fetchError: any) {
      console.error('Fetch failed with error:', fetchError);
      console.error('Error type:', typeof fetchError);
      console.error('Error message:', fetchError.message);
      console.error('Error stack:', fetchError.stack);
      return NextResponse.json({ 
        success: false,
        message: 'Fetch failed',
        error: fetchError.message || String(fetchError)
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read response body');
      console.error('Response not OK:', errorText);
      return NextResponse.json({ 
        success: false,
        message: 'Response not OK',
        status: response.status,
        error: errorText
      });
    }
    
    console.log('Basic fetch successful');
    
    return NextResponse.json({ 
      success: true,
      message: 'Fetch test successful',
      status: response.status
    });
  } catch (err: any) {
    console.error('Fetch debug test error:', err);
    console.error('Error stack:', err.stack);
    return new NextResponse('Test failed: ' + (err.message || err), { status: 500 });
  }
}