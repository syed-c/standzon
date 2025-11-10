import { NextResponse } from 'next/server';
import https from 'https';

export async function GET() {
  try {
    console.log('=== HTTPS DIRECT TEST ===');
    
    // Test the exact Supabase URL that should work
    const supabaseUrl = 'https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg';
    console.log('Testing Supabase URL:', supabaseUrl);
    
    // Parse the URL
    const url = new URL(supabaseUrl);
    console.log('URL parsed:', url.hostname, url.pathname);
    
    // Try with direct HTTPS request
    return new Promise((resolve) => {
      const req = https.get(supabaseUrl, (res) => {
        console.log('HTTPS response status:', res.statusCode);
        console.log('HTTPS response headers:', res.headers);
        
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          // Success
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            console.log('HTTPS request successful, data length:', data.length);
            resolve(NextResponse.json({ 
              success: true,
              message: 'HTTPS direct request successful',
              status: res.statusCode,
              dataLength: data.length
            }));
          });
        } else {
          // Error
          let errorData = '';
          res.on('data', (chunk) => {
            errorData += chunk;
          });
          res.on('end', () => {
            console.error('HTTPS request failed:', res.statusCode, errorData);
            resolve(NextResponse.json({ 
              success: false,
              message: 'HTTPS direct request failed',
              status: res.statusCode,
              error: errorData
            }));
          });
        }
      });
      
      req.on('error', (err) => {
        console.error('HTTPS request error:', err);
        resolve(new NextResponse('HTTPS request failed: ' + err.message, { status: 500 }));
      });
      
      req.end();
    });
  } catch (err: any) {
    console.error('HTTPS direct test error:', err);
    console.error('Error stack:', err.stack);
    return new NextResponse('Test failed: ' + (err.message || err), { status: 500 });
  }
}