import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Test connection by fetching a single builder
    const { data, error } = await supabase
      .from('builder_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      // Try the 'builders' table as fallback
      const { data: data2, error: error2 } = await supabase
        .from('builders')
        .select('*')
        .limit(1);
      
      if (error2) {
        return NextResponse.json({ 
          success: false, 
          error: error.message || error2.message 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Connected to builders table',
        data: data2
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Connected to builder_profiles table',
      data 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}