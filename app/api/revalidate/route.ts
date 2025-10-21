import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Add GET endpoint for direct access
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    
    if (path) {
      // Revalidate specific path
      revalidatePath(path);
      return NextResponse.json({ 
        success: true, 
        message: `Cache cleared successfully for path: ${path}` 
      });
    }
    
    // Revalidate all country pages without city sections
    const countriesWithoutCities = ['tw', 'hk', 'nz', 'vn', 'id', 'ph', 'in', 'au', 'es', 'ch', 'at', 'se', 'no', 'dk', 'fi'];
    for (const country of countriesWithoutCities) {
      revalidatePath(`/exhibition-stands/${country}`);
    }
    
    // Revalidate new city pages
    const newCityPages = [
      '/exhibition-stands/jp/chiba',
      '/exhibition-stands/be/kortrijk',
      '/exhibition-stands/th/khon-kaen',
      '/exhibition-stands/fr/strasbourg',
      '/exhibition-stands/nl/maastricht',
      '/exhibition-stands/nl/rotterdam',
      '/exhibition-stands/nl/vijfhuizen'
    ];
    for (const cityPage of newCityPages) {
      revalidatePath(cityPage);
    }
    
    // Also revalidate main pages
    revalidatePath('/exhibition-stands');
    revalidatePath('/');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared successfully for all country and city pages.' 
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


