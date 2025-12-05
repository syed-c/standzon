import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const body = await request.json();
    
    // Insert quote request into Supabase
    const { data, error } = await supabase
      .from('quote_requests')
      .insert({
        company_name: body.companyName,
        contact_person: body.contactPerson,
        contact_email: body.contactEmail,
        contact_phone: body.contactPhone,
        trade_show: body.tradeShow,
        stand_size: body.standSize,
        budget: body.budget,
        timeline: body.timeline,
        special_requests: body.specialRequests,
        status: body.status || 'Open',
        priority: body.priority || 'Standard',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create quote request: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error creating quote request:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create quote request'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const supabase = getServerSupabase();
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // Fetch recent quote requests from Supabase
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to fetch quote requests: ${error.message}`);
    }
    
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch quote requests'
    }, { status: 500 });
  }
}