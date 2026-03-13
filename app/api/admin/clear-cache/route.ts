import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    
    let clearedItems: string[] = [];
    let message = '';

    // Clear Next.js data cache (revalidate paths)
    const pathsToRevalidate = [
      '/',
      '/admin',
      '/admin/dashboard',
      '/admin/builders',
      '/admin/leads',
      '/admin/users',
      '/locations',
      '/locations/[country]',
      '/locations/[country]/[city]',
      '/builders',
      '/builders/[slug]',
      '/exhibitions',
      '/exhibitions/[slug]',
      '/trade-shows',
      '/trade-shows/[slug]',
    ];

    // Clear specific paths
    pathsToRevalidate.forEach(path => {
      try {
        revalidatePath(path);
        clearedItems.push(`Revalidated: ${path}`);
      } catch (e) {
        // Some paths might not exist, that's fine
      }
    });

    message = `Successfully cleared cache. ${clearedItems.length} paths revalidated.`;

    return NextResponse.json({ 
      success: true, 
      message,
      clearedItems: clearedItems.slice(0, 10),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: `Failed to clear cache: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  }
}

// GET handler for checking cache status
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Cache clear API is running. Use POST to clear cache.',
    timestamp: new Date().toISOString()
  });
}
