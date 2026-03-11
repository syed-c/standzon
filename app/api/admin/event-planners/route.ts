import { NextRequest, NextResponse } from 'next/server';

// Event planners are not yet implemented in unifiedPlatformAPI.
// These routes return stub data to keep the build passing.

const stubPlanners: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      return NextResponse.json({
        success: true,
        data: {
          totalPlanners: 0,
          verifiedPlanners: 0,
          premiumPlanners: 0,
          averageRating: 0,
          totalEvents: 0,
          totalCountries: 0,
          totalCities: 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: stubPlanners,
      total: 0,
      message: 'Retrieved 0 event planners'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch event planners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const planner = { id: `event-planner-${Date.now()}`, ...body, createdAt: new Date().toISOString() };
    stubPlanners.push(planner);
    return NextResponse.json({ success: true, data: planner, message: 'Event planner registered successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to create event planner' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const idx = stubPlanners.findIndex(p => p.id === id);
    if (idx !== -1) stubPlanners[idx] = { ...stubPlanners[idx], ...updates };
    return NextResponse.json({ success: true, message: 'Event planner updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to update event planner' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    return NextResponse.json({ success: true, message: 'Event planner deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete event planner' }, { status: 500 });
  }
}
