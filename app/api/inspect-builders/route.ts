import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    console.log('=== INSPECT BUILDERS API ===');
    
    const sb = getServerSupabase();
    if (!sb) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured'
      }, { status: 500 });
    }
    
    // Try to fetch from builder_profiles table
    console.log('🔍 Trying builder_profiles table...');
    const { data: profilesData, error: profilesError } = await sb
      .from('builder_profiles')
      .select('*')
      .limit(5);
    
    if (profilesError) {
      console.log('❌ builder_profiles error:', profilesError.message);
    } else {
      console.log('✅ builder_profiles data:', profilesData?.length || 0, 'records');
      if (profilesData && profilesData.length > 0) {
        console.log('First builder_profile:', {
          id: profilesData[0].id,
          company_name: profilesData[0].company_name,
          headquarters_city: profilesData[0].headquarters_city,
          headquarters_country: profilesData[0].headquarters_country,
          created_at: profilesData[0].created_at
        });
      }
    }
    
    // Try to fetch from builders table
    console.log('🔍 Trying builders table...');
    const { data: buildersData, error: buildersError } = await sb
      .from('builders')
      .select('*')
      .limit(5);
    
    if (buildersError) {
      console.log('❌ builders error:', buildersError.message);
    } else {
      console.log('✅ builders data:', buildersData?.length || 0, 'records');
      if (buildersData && buildersData.length > 0) {
        console.log('First builder:', {
          id: buildersData[0].id,
          company_name: buildersData[0].company_name,
          headquarters_city: buildersData[0].headquarters_city,
          headquarters_country: buildersData[0].headquarters_country,
          created_at: buildersData[0].created_at
        });
      }
    }
    
    // Try to fetch service locations
    console.log('🔍 Trying builder_service_locations table...');
    const { data: locationsData, error: locationsError } = await sb
      .from('builder_service_locations')
      .select('*')
      .limit(5);
    
    if (locationsError) {
      console.log('❌ builder_service_locations error:', locationsError.message);
    } else {
      console.log('✅ builder_service_locations data:', locationsData?.length || 0, 'records');
      if (locationsData && locationsData.length > 0) {
        console.log('First service location:', locationsData[0]);
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        builderProfiles: profilesData || [],
        builders: buildersData || [],
        serviceLocations: locationsData || [],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error inspecting builders:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}