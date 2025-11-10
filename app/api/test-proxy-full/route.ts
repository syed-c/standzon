import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== FULL PROXY TEST ===');
    
    // Simulate the exact same logic as the media proxy
    const bucket = 'gallery';
    const filePath = 'countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg';
    const supabaseUrl = `https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;
    
    console.log('Supabase URL:', supabaseUrl);
    
    // Test different fetch approaches
    console.log('Testing fetch approach 1: Basic fetch');
    try {
      const response1 = await fetch(supabaseUrl);
      console.log('Approach 1 success, status:', response1.status);
      if (response1.ok) {
        const arrayBuffer = await response1.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log('Approach 1 data retrieved, size:', buffer.length);
        return NextResponse.json({ 
          success: true,
          message: 'Approach 1 successful',
          status: response1.status,
          size: buffer.length
        });
      }
    } catch (err1: any) {
      console.error('Approach 1 failed:', err1.message);
    }
    
    console.log('Testing fetch approach 2: With headers');
    try {
      const response2 = await fetch(supabaseUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      console.log('Approach 2 success, status:', response2.status);
      if (response2.ok) {
        const arrayBuffer = await response2.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log('Approach 2 data retrieved, size:', buffer.length);
        return NextResponse.json({ 
          success: true,
          message: 'Approach 2 successful',
          status: response2.status,
          size: buffer.length
        });
      }
    } catch (err2: any) {
      console.error('Approach 2 failed:', err2.message);
    }
    
    console.log('Testing fetch approach 3: With redirect option');
    try {
      const response3 = await fetch(supabaseUrl, {
        method: 'GET',
        redirect: 'follow'
      });
      console.log('Approach 3 success, status:', response3.status);
      if (response3.ok) {
        const arrayBuffer = await response3.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log('Approach 3 data retrieved, size:', buffer.length);
        return NextResponse.json({ 
          success: true,
          message: 'Approach 3 successful',
          status: response3.status,
          size: buffer.length
        });
      }
    } catch (err3: any) {
      console.error('Approach 3 failed:', err3.message);
    }
    
    // If all approaches fail
    console.error('All fetch approaches failed');
    return NextResponse.json({ 
      success: false,
      message: 'All fetch approaches failed'
    });
  } catch (err: any) {
    console.error('Full proxy test error:', err);
    console.error('Error stack:', err.stack);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}