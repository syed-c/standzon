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

    // Check if the specific image file exists using Supabase client
    const bucket = 'gallery';
    const path = 'countries/germany/2025-11-10/1762771365593-looafqzp4w.jpg';
    
    console.log('Checking if file exists in Supabase:', bucket, path);
    
    // Try to get file information
    const { data: fileInfo, error: infoError } = await supabase.storage.from(bucket).list('countries/germany/2025-11-10/', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });
    
    if (infoError) {
      console.error('Supabase list error:', infoError);
      return NextResponse.json({ 
        success: false, 
        error: infoError.message,
        operation: 'list'
      }, {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }
    
    // Check if our specific file is in the list
    const fileExists = fileInfo?.some(file => file.name === '1762771365593-looafqzp4w.jpg');
    
    // Also try to get metadata for the specific file
    const { data: metaData, error: metaError } = await supabase.storage.from(bucket).list('countries/germany/2025-11-10/', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
      search: '1762771365593-looafqzp4w.jpg'
    });
    
    // Try to download a small portion to verify accessibility
    let downloadTest = null;
    let downloadError = null;
    try {
      const { data: downloadData, error: downloadErr } = await supabase.storage.from(bucket).download(path);
      if (downloadErr) {
        downloadError = downloadErr.message;
      } else {
        downloadTest = {
          size: downloadData?.size || 0,
          type: downloadData?.type || 'unknown'
        };
      }
    } catch (downloadException: any) {
      downloadError = downloadException.message || String(downloadException);
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Image check completed',
      fileExists,
      filesInDirectory: fileInfo?.map(f => f.name) || [],
      specificFileMetadata: metaData,
      downloadTest,
      downloadError,
      bucket,
      path
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