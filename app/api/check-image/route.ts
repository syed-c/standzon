import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

// Test if a specific image exists in Supabase storage
export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase not configured' }, { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Check if the specific image file exists
    const bucket = 'gallery';
    const path = 'countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg';
    
    // Try to get file information directly
    const { data: fileData, error: fileError } = await supabase.storage.from(bucket).download(path);
    
    if (fileError) {
      console.error('Supabase file download error:', fileError);
      
      // Try to list files in the directory to see what's there
      const { data: listData, error: listError } = await supabase.storage.from(bucket).list('countries/germany/2025-11-10/', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
      
      return NextResponse.json({ 
        success: false,
        error: fileError.message,
        fileList: listData || [],
        listError: listError?.message || null,
        bucket,
        path
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }
    
    // If we get here, the file exists
    return NextResponse.json({ 
      success: true,
      message: 'Image found in Supabase storage',
      bucket,
      path,
      fileSize: fileData?.size || 0
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (e: any) {
    console.error('Check image error:', e);
    return NextResponse.json({ success: false, error: e?.message || 'Check failed' }, { 
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