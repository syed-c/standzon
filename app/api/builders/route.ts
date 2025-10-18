import { NextRequest, NextResponse } from 'next/server';
import * as builderService from '@/lib/supabase/builders';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    
    if (slug) {
      const builder = await builderService.getBuilderBySlug(slug);
      return NextResponse.json({ success: true, data: builder });
    } else if (id) {
      const builder = await builderService.getBuilderById(id);
      return NextResponse.json({ success: true, data: builder });
    } else {
      const builders = await builderService.getAllBuilders();
      return NextResponse.json({ success: true, data: builders });
    }
  } catch (error: any) {
    console.error('Error fetching builders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch builders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const builder = await builderService.createBuilder(body);
    
    return NextResponse.json({ success: true, data: builder }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating builder:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create builder' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Builder ID is required' },
        { status: 400 }
      );
    }
    
    const builder = await builderService.updateBuilder(id, updates);
    return NextResponse.json({ success: true, data: builder });
  } catch (error: any) {
    console.error('Error updating builder:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update builder' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Builder ID is required' },
        { status: 400 }
      );
    }
    
    await builderService.deleteBuilder(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting builder:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete builder' },
      { status: 500 }
    );
  }
}