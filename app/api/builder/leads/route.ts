import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // Get leads for this builder (with error handling)
    let leads = [];
    try {
      // First try the direct builder_id approach (from 003_builder_dashboard_tables.sql)
      const { data: leadsData, error } = await supabase
        .from('leads')
        .select('*')
        .eq('builder_id', builderId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads with builder_id:', error);
        
        // If that fails, try the lead_assignments approach (from 001_initial_schema.sql)
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('lead_assignments')
          .select(`
            *,
            leads (*)
          `)
          .eq('builder_id', builderId);

        if (assignmentsError) {
          console.error('Error fetching leads via assignments:', assignmentsError);
          leads = [];
        } else {
          leads = assignmentsData?.map(assignment => assignment.leads).filter(Boolean) || [];
        }
      } else {
        leads = leadsData || [];
      }
    } catch (error) {
      console.log('Leads table not found, using empty array');
      leads = [];
    }

    return NextResponse.json({
      success: true,
      data: leads || []
    });

  } catch (error) {
    console.error('Error in leads API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { leadId, status } = await request.json();

    if (!leadId || !status) {
      return NextResponse.json(
        { success: false, error: 'Lead ID and status are required' },
        { status: 400 }
      );
    }

    // Try to update lead status directly first
    let { data, error } = await supabase
      .from('leads')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead directly:', error);
      
      // If direct update fails, try updating via lead_assignments
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('lead_assignments')
        .select('lead_id')
        .eq('lead_id', leadId)
        .single();

      if (assignmentError) {
        console.error('Error finding lead assignment:', assignmentError);
        return NextResponse.json(
          { success: false, error: 'Failed to update lead' },
          { status: 500 }
        );
      }

      // Update the lead via assignment
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating lead via assignment:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update lead' },
          { status: 500 }
        );
      }

      data = updatedLead;
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in leads update API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
