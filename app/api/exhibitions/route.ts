import { NextRequest, NextResponse } from 'next/server';
import * as exhibitionService from '@/lib/supabase/exhibitions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const country = searchParams.get('country');
    const upcoming = searchParams.get('upcoming');
    const featured = searchParams.get('featured');
    
    if (slug) {
      const exhibition = await exhibitionService.getExhibitionBySlug(slug);
      return NextResponse.json({ success: true, data: exhibition });
    } else if (id) {
      const exhibition = await exhibitionService.getExhibitionById(id);
      return NextResponse.json({ success: true, data: exhibition });
    } else if (country) {
      const exhibitions = await exhibitionService.getExhibitionsByCountry(country);
      return NextResponse.json({ success: true, data: exhibitions });
    } else if (upcoming === 'true') {
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
      const exhibitions = await exhibitionService.getUpcomingExhibitions(limit);
      return NextResponse.json({ success: true, data: exhibitions });
    } else if (featured === 'true') {
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 6;
      const exhibitions = await exhibitionService.getFeaturedExhibitions(limit);
      return NextResponse.json({ success: true, data: exhibitions });
    } else {
      const exhibitions = await exhibitionService.getAllExhibitions();
      return NextResponse.json({ success: true, data: exhibitions });
    }
  } catch (error: any) {
    console.error('Error fetching exhibitions:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch exhibitions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const exhibition = await exhibitionService.createExhibition(body);
    
    return NextResponse.json({ success: true, data: exhibition }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating exhibition:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create exhibition' },
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
        { success: false, error: 'Exhibition ID is required' },
        { status: 400 }
      );
    }
    
    const exhibition = await exhibitionService.updateExhibition(id, updates);
    return NextResponse.json({ success: true, data: exhibition });
  } catch (error: any) {
    console.error('Error updating exhibition:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update exhibition' },
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
        { success: false, error: 'Exhibition ID is required' },
        { status: 400 }
      );
    }
    
    await exhibitionService.deleteExhibition(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting exhibition:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete exhibition' },
      { status: 500 }
    );
  }
}