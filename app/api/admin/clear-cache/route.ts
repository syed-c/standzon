import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    // Revalidate all paths that might contain Italy cities data
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
      { 
        success: false, 
        message: `Failed to clear cache: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  }
}