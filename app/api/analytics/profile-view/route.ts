import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { builderId, builderSlug } = await request.json();

    if (!builderId && !builderSlug) {
      return NextResponse.json(
        { success: false, error: 'Builder ID or slug is required' },
        { status: 400 }
      );
    }

    const sb = getServerSupabase();
    if (!sb) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Get builder ID if only slug is provided
    let finalBuilderId = builderId;
    if (!finalBuilderId && builderSlug) {
      const { data: builder } = await sb
        .from('builder_profiles')
        .select('id')
        .eq('slug', builderSlug)
        .single();
      
      if (builder) {
        finalBuilderId = builder.id;
      }
    }

    if (!finalBuilderId) {
      return NextResponse.json(
        { success: false, error: 'Builder not found' },
        { status: 404 }
      );
    }

    // Record the profile view
    const { data, error } = await sb
      .from('profile_views')
      .insert({
        builder_id: finalBuilderId,
        viewed_at: new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error recording profile view:', error);
      
      // If table doesn't exist, provide helpful error message
      if (error.code === 'PGRST205') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Profile views table not found. Please create the table first.',
            instructions: 'Run this SQL in your Supabase dashboard: CREATE TABLE profile_views (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, builder_id UUID NOT NULL REFERENCES builder_profiles(id) ON DELETE CASCADE, viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), ip_address VARCHAR(45), user_agent TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());'
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to record profile view' },
        { status: 500 }
      );
    }

    console.log('✅ Profile view recorded for builder:', finalBuilderId);

    return NextResponse.json({
      success: true,
      data: {
        viewId: data.id,
        builderId: finalBuilderId,
        viewedAt: data.viewed_at
      }
    });

  } catch (error) {
    console.error('❌ Error in profile view tracking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const builderId = searchParams.get('builderId');

    if (!builderId) {
      return NextResponse.json(
        { success: false, error: 'Builder ID is required' },
        { status: 400 }
      );
    }

    const sb = getServerSupabase();
    if (!sb) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Get total profile views
    const { data: totalViews, error: totalError } = await sb
      .from('profile_views')
      .select('*', { count: 'exact' })
      .eq('builder_id', builderId);

    if (totalError) {
      console.error('❌ Error fetching total views:', totalError);
      
      // If table doesn't exist, return zero views
      if (totalError.code === 'PGRST205') {
        return NextResponse.json({
          success: true,
          data: {
            totalViews: 0,
            monthlyViews: 0
          }
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to fetch profile views' },
        { status: 500 }
      );
    }

    // Get monthly views (current month)
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    const { data: monthlyViews, error: monthlyError } = await sb
      .from('profile_views')
      .select('*', { count: 'exact' })
      .eq('builder_id', builderId)
      .gte('viewed_at', startOfMonth.toISOString());

    if (monthlyError) {
      console.error('❌ Error fetching monthly views:', monthlyError);
      
      // If table doesn't exist, return zero views
      if (monthlyError.code === 'PGRST205') {
        return NextResponse.json({
          success: true,
          data: {
            totalViews: 0,
            monthlyViews: 0
          }
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to fetch monthly views' },
        { status: 500 }
      );
    }

    console.log('📊 Total views data:', totalViews);
    console.log('📊 Monthly views data:', monthlyViews);
    console.log('📊 Total views count:', totalViews?.length || 0);
    console.log('📊 Monthly views count:', monthlyViews?.length || 0);

    return NextResponse.json({
      success: true,
      data: {
        totalViews: totalViews?.length || 0,
        monthlyViews: monthlyViews?.length || 0
      }
    });

  } catch (error) {
    console.error('❌ Error fetching profile views:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
