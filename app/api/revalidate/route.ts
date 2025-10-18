import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Add GET endpoint for direct access
export async function GET() {
  try {
    // Force revalidate all Italy-related paths
    revalidatePath('/locations/italy');
    revalidatePath('/admin');
    revalidatePath('/');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared successfully. Italy cities data has been refreshed.' 
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { success: false, message: `Failed to clear cache: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const paths: string[] = Array.isArray(body?.paths)
      ? body.paths
      : typeof body?.path === 'string'
        ? [body.path]
        : [];

    if (!paths.length) {
      // If no paths specified, revalidate Italy cities data by default
      revalidatePath('/locations/italy');
      revalidatePath('/admin');
      revalidatePath('/');
      return NextResponse.json({ 
        success: true, 
        message: 'Italy cities data cache cleared successfully.' 
      });
    }

    for (const p of paths) {
      try {
        revalidatePath(p);
      } catch {}
    }

    return NextResponse.json({ success: true, revalidated: paths });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Revalidation failed' }, { status: 500 });
  }
}


