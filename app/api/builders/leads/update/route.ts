import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/supabase/database";

const dbService = new DatabaseService();

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, status, builderId } = body;
    
    if (!leadId || !status) {
      return NextResponse.json(
        { success: false, error: 'Lead ID and status are required' },
        { status: 400 }
      );
    }
    
    console.log('🔄 Updating lead status:', { leadId, status, builderId });
    
    // Map frontend status to database status
    // Database enum values: NEW, ASSIGNED, CONTACTED, QUOTED, CONVERTED, LOST, REJECTED
    const dbStatus = status === 'approved' ? 'ASSIGNED' : 
                     status === 'completed' ? 'CONVERTED' :  // Changed from COMPLETED to CONVERTED
                     status === 'rejected' ? 'REJECTED' : 'NEW';
    
    // Prepare update data
    const updateData: any = {
      status: dbStatus,
      updated_at: new Date().toISOString()
    };
    
    // If approving and builderId provided, mark this builder as the one who accepted
    if (status === 'approved' && builderId) {
      // Get builder name for reference
      const { data: builderData } = await dbService['client']
        .from('builder_profiles')
        .select('company_name')
        .eq('id', builderId)
        .single();
      
      updateData.accepted_by_builder_id = builderId;
      updateData.accepted_by_builder_name = builderData?.company_name || 'Unknown';
      updateData.accepted_at = new Date().toISOString();
      
      console.log('👤 Lead accepted by:', builderData?.company_name);
    }
    
    // Update lead status in Supabase
    const { data, error } = await dbService['client']
      .from('leads')
      .update(updateData)
      .eq('id', leadId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Failed to update lead:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    console.log('✅ Lead updated successfully:', data);
    
    return NextResponse.json({
      success: true,
      data: {
        ...data,
        status: status // Return the frontend status format
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error updating lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update lead'
      },
      { status: 500 }
    );
  }
}
