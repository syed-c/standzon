import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Use the server-side Supabase client
    const supabase = getServerSupabase();
    
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase client not configured' 
      }, { status: 500 });
    }
    
    // Try to fetch builders from builder_profiles table
    console.log('Attempting to fetch from builder_profiles...');
    const { data: builderProfiles, error: profilesError } = await supabase
      .from('builder_profiles')
      .select('*')
      .limit(5);
    
    console.log('Builder profiles result:', { data: builderProfiles, error: profilesError });
    
    // Try to fetch builders from builders table
    console.log('Attempting to fetch from builders...');
    const { data: builders, error: buildersError } = await supabase
      .from('builders')
      .select('*')
      .limit(5);
    
    console.log('Builders result:', { data: builders, error: buildersError });
    
    // Try to get all tables using a simpler approach
    console.log('Attempting to list tables...');
    const { data: tablesData, error: tablesError } = await supabase
      .from('builder_profiles')
      .select('id')
      .limit(1);
    
    console.log('Tables test result:', { data: tablesData, error: tablesError });
    
    return NextResponse.json({ 
      success: true,
      builder_profiles: {
        data: builderProfiles,
        error: profilesError?.message
      },
      builders: {
        data: builders,
        error: buildersError?.message
      },
      tables_test: {
        data: tablesData,
        error: tablesError?.message
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}