import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  // Serve a 404 response for .well-known requests
  return new NextResponse('Not found', { status: 404 });
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return new NextResponse('Method not allowed', { status: 405 });
}