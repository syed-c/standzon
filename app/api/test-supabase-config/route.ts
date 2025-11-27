import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("=== Testing Supabase Configuration ===");
    
    // Check all possible environment variable names
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    };
    
    console.log("Environment variables:", envVars);
    
    // Check if required Supabase variables are present
    const hasPublicConfig = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const hasServerConfig = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Test Supabase connection if configured
    let connectionTestResult = null;
    if (hasServerConfig) {
      try {
        console.log("Testing Supabase connection...");
        const { createClient } = await import('@supabase/supabase-js');
        
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        
        // Test connection by fetching a small amount of data
        const { data, error } = await supabase
          .from('builder_profiles')
          .select('id')
          .limit(1);
        
        connectionTestResult = {
          success: !error,
          error: error?.message,
          recordCount: data?.length || 0
        };
        
        console.log("Connection test result:", connectionTestResult);
      } catch (connError) {
        connectionTestResult = {
          success: false,
          error: connError instanceof Error ? connError.message : 'Unknown connection error'
        };
        console.error("Connection test error:", connError);
      }
    }
    
    return NextResponse.json({ 
      success: true,
      envVars,
      hasPublicConfig,
      hasServerConfig,
      connectionTestResult
    });
  } catch (error) {
    console.error("Supabase config test failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to test Supabase configuration",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}