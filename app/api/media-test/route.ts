import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Media test endpoint called');
  return NextResponse.json({ 
    success: true, 
    message: 'Media API route is working',
    timestamp: new Date().toISOString()
  });
}