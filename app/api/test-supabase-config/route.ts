import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('=== SUPABASE CONFIG TEST ===');
    
    // Test Supabase client initialization
    const supabase = getServerSupabase();
    
    if (!supabase) {
      console.error('Supabase client is null or undefined');
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase client not initialized',
        supabase: null
      });
    }
    
    console.log('Supabase client initialized successfully');
    
    // Test basic connectivity with a simple operation
    try {
      // Try to list buckets to test basic connectivity
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error('Bucket list error:', bucketError.message);
        return NextResponse.json({ 
          success: false, 
          error: 'Bucket list failed',
          bucketError: bucketError.message
        });
      }
      
      console.log('Bucket list successful, found buckets:', buckets?.length || 0);
      
      // Try to access the gallery bucket specifically
      const { data: galleryBucket, error: galleryError } = await supabase.storage.getBucket('gallery');
      
      if (galleryError) {
        console.error('Gallery bucket access error:', galleryError.message);
        return NextResponse.json({ 
          success: false, 
          error: 'Gallery bucket access failed',
          galleryError: galleryError.message
        });
      }
      
      console.log('Gallery bucket access successful:', galleryBucket);
      
      return NextResponse.json({ 
        success: true,
        message: 'Supabase configuration test completed',
        buckets: buckets?.length || 0,
        galleryBucket: galleryBucket
      });
    } catch (operationError: any) {
      console.error('Supabase operation error:', operationError.message);
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase operation failed',
        operationError: operationError.message
      });
    }
  } catch (err: any) {
    console.error('Supabase config test error:', err);
    return new NextResponse('Test failed: ' + (err.message || String(err)), { status: 500 });
  }
}