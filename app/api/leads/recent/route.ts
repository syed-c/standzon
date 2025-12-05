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
    
    console.log('🔍 Fetching recent leads and quotes from Supabase...');
    
    // Fetch recent leads from Supabase
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    console.log('📋 Leads data:', leadsData?.length || 0, 'items');
    if (leadsError) {
      console.error('❌ Error fetching leads:', leadsError);
    }
    
    // Fetch recent quote requests from Supabase
    const { data: quotesData, error: quotesError } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    console.log('📋 Quote requests data:', quotesData?.length || 0, 'items');
    if (quotesError) {
      console.error('❌ Error fetching quote requests:', quotesError);
    }
    
    // Check if either query failed
    if (leadsError || quotesError) {
      const errorMessage = `Failed to fetch data: ${leadsError?.message || ''} ${quotesError?.message || ''}`;
      console.error('❌', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Combine and sort both datasets
    const allData = [
      ...(leadsData || []).map(lead => ({
        ...lead,
        type: 'lead'
      })),
      ...(quotesData || []).map(quote => ({
        ...quote,
        type: 'quote'
      }))
    ].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; // Descending order (newest first)
    }).slice(0, limit);
    
    console.log('📊 Combined data:', allData.length, 'items');
    
    // Transform the data to match the expected format
    const transformedData = allData.map(item => {
      if (item.type === 'lead') {
        return {
          id: item.id,
          exhibitionName: item.trade_show_name || item.exhibition_name || 'Exhibition Name Not Specified',
          standSize: item.stand_size ? `${item.stand_size} sqm` : 'Size not specified',
          budget: item.budget || 'Budget not specified',
          submittedAt: new Date(item.created_at).getTime(),
          status: item.status || 'New'
        };
      } else {
        // Quote request
        return {
          id: item.id,
          exhibitionName: item.trade_show || 'Event Not Specified',
          standSize: item.stand_size ? `${item.stand_size} sqm` : 'Size not specified',
          budget: item.budget || 'Budget not specified',
          submittedAt: new Date(item.created_at).getTime(),
          status: item.status || 'Open'
        };
      }
    });
    
    console.log('✅ Successfully fetched and transformed data:', transformedData.length, 'items');
    
    return NextResponse.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.error('💥 Error fetching recent leads and quotes:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch recent leads and quotes'
    }, { status: 500 });
  }
}