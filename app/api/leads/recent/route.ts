import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const supabase = getServerSupabase();
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // Fetch recent leads from Supabase
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    // Transform the data to match the expected format
    const transformedData = data.map(lead => ({
      id: lead.id,
      exhibitionName: lead.exhibition_name || 'Exhibition Name Not Specified',
      standSize: lead.stand_size ? `${lead.stand_size} sqm` : 'Size not specified',
      budget: lead.budget || 'Budget not specified',
      submittedAt: new Date(lead.created_at).getTime(),
      status: lead.status || 'Open'
    }));
    
    return NextResponse.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.error('Error fetching recent leads:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch recent leads'
    }, { status: 500 });
  }
}