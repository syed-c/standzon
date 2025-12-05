import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing GMB Integration API connectivity...");
    
    // Test the GMB integration API
    const response = await fetch('http://localhost:3000/api/admin/gmb-integration?action=test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("GMB Integration API test result:", result);
    
    return NextResponse.json({
      success: true,
      message: "GMB Integration API is accessible",
      data: result
    });
  } catch (error) {
    console.error("Error testing GMB Integration API:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to test GMB Integration API",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Testing GMB Integration API POST request...");
    
    // Test the GMB integration API with a simple action
    const response = await fetch('http://localhost:3000/api/admin/gmb-integration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'test-api',
        data: {
          apiKey: 'demo-key'
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("GMB Integration API POST test result:", result);
    
    return NextResponse.json({
      success: true,
      message: "GMB Integration API POST request successful",
      data: result
    });
  } catch (error) {
    console.error("Error testing GMB Integration API POST request:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to test GMB Integration API POST request",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}