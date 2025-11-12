import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing GMB Supabase integration...");
    
    // Test Supabase connection directly
    const { getServerSupabase } = await import('@/lib/supabase');
    const supabase = getServerSupabase();
    
    if (!supabase) {
      console.error("Supabase client not available");
      return NextResponse.json({ 
        success: false, 
        error: "Supabase client not available"
      }, { status: 500 });
    }
    
    console.log("Supabase client available, testing connection...");
    
    // Test connection by fetching a small amount of data
    const { data, error } = await supabase
      .from('builder_profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error("Supabase connection test failed:", error);
      return NextResponse.json({ 
        success: false, 
        error: "Supabase connection test failed",
        details: error.message
      }, { status: 500 });
    }
    
    console.log("Supabase connection test successful");
    return NextResponse.json({ 
      success: true, 
      message: "Supabase connection successful",
      data: data
    });
  } catch (error) {
    console.error("Unexpected error testing Supabase connection:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Unexpected error testing Supabase connection",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}