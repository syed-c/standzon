import { NextRequest, NextResponse } from "next/server";

// Test endpoint to log the data being sent from the frontend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received data from frontend:", JSON.stringify(body, null, 2));
    
    return NextResponse.json({
      success: true,
      message: "Data received and logged",
      receivedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to process request"
    }, { status: 500 });
  }
}