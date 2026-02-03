import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('💳 Processing subscription upgrade request');
    
    const { builderId, builderEmail, planId } = await request.json();
    
    console.log('💳 Processing subscription upgrade:', {
      builderId,
      builderEmail,
      planId
    });

    if (!builderId || !builderEmail || !planId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: builderId, builderEmail, planId' 
      }, { status: 400 });
    }

    // Update the builder's subscription plan in Supabase
    const { data, error } = await supabase
      .from('builder_profiles')
      .update({ 
        premium_member: planId === 'professional' || planId === 'enterprise',
        updated_at: new Date().toISOString()
      })
      .eq('id', builderId)
      .select();

    if (error) {
      console.error('❌ Error updating subscription:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update subscription plan' 
      }, { status: 500 });
    }

    console.log('✅ Subscription updated successfully:', data);

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription upgraded successfully',
      data: {
        planId,
        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Subscription upgrade error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}