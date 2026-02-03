import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    console.log('=== CHECK BUILDERS API ===');
    
    const sb = getServerSupabase();
    if (!sb) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured'
      }, { status: 500 });
    }
    
    console.log('✅ Supabase configured');
    
    // Check builders table
    console.log('🔍 Checking builders table...');
    const { data: buildersData, error: buildersError } = await sb
      .from('builders')
      .select('*')
      .limit(3);
    
    console.log('Builders table result:', {
      success: !buildersError,
      count: buildersData?.length || 0,
      error: buildersError?.message
    });
    
    if (buildersData && buildersData.length > 0) {
      console.log('First builder:', {
        id: buildersData[0].id,
        company_name: buildersData[0].company_name,
        headquarters_city: buildersData[0].headquarters_city,
        headquarters_country: buildersData[0].headquarters_country
      });
    }
    
    // Check builder_profiles table
    console.log('🔍 Checking builder_profiles table...');
    const { data: profilesData, error: profilesError } = await sb
      .from('builder_profiles')
      .select('*')
      .limit(3);
    
    console.log('Builder profiles table result:', {
      success: !profilesError,
      count: profilesData?.length || 0,
      error: profilesError?.message
    });
    
    if (profilesData && profilesData.length > 0) {
      console.log('First profile:', {
        id: profilesData[0].id,
        company_name: profilesData[0].company_name,
        headquarters_city: profilesData[0].headquarters_city,
        headquarters_country: profilesData[0].headquarters_country
      });
    }
    
    // Get counts for both tables
    const { count: buildersCount, error: buildersCountError } = await sb
      .from('builders')
      .select('*', { count: 'exact', head: true });
    
    const { count: profilesCount, error: profilesCountError } = await sb
      .from('builder_profiles')
      .select('*', { count: 'exact', head: true });
    
    console.log('Table counts:', {
      builders: buildersCount,
      profiles: profilesCount,
      buildersCountError: buildersCountError?.message,
      profilesCountError: profilesCountError?.message
    });
    
    return NextResponse.json({
      success: true,
      data: {
        builders: {
          count: buildersCount,
          sample: buildersData?.slice(0, 2) || []
        },
        builderProfiles: {
          count: profilesCount,
          sample: profilesData?.slice(0, 2) || []
        }
      }
    });
  } catch (error) {
    console.error('Error checking builders:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}