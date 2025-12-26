import { NextRequest, NextResponse } from "next/server";

// Add CORS headers
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  // Add CORS headers to response
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    console.log("🧪 GMB Demo API called - returning mock success response");
    
    const response = NextResponse.json({
      success: true,
      message: "Demo mode activated! API key test successful",
      data: {
        status: "OK",
        resultsCount: 5,
        testQuery: "demo query",
        demoMode: true
      }
    });

    // Add CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("❌ GMB Demo API error:", error);
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );

    // Add CORS headers to error response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });

    return errorResponse;
  }
}

export async function GET(request: NextRequest) {
  // Add CORS headers to GET response
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    console.log("🧪 GMB Demo API GET - returning mock success response");
    
    const response = NextResponse.json({
      success: true,
      message: "GMB Demo API is working!",
      data: {
        demoMode: true,
        timestamp: new Date().toISOString()
      }
    });

    // Add CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("❌ GMB Demo API GET error:", error);
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );

    // Add CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });

    return errorResponse;
  }
}