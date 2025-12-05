import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing environment variables...");
    
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      ENABLE_PERSISTENCE: process.env.ENABLE_PERSISTENCE
    };
    
    console.log("Environment variables:", envVars);
    
    // Check if required Supabase variables are present
    const supabaseConfigured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    const publicSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    return NextResponse.json({ 
      success: true, 
      envVars,
      supabaseConfigured,
      publicSupabaseConfigured
    });
  } catch (error) {
    console.error("Environment variable test failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to test environment variables",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}