import { NextRequest, NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching all event planners from unified platform');
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'stats') {
      // Get event planner statistics
      const planners = unifiedPlatformAPI.getEventPlanners();
      const stats = {
        totalPlanners: planners.length,
        verifiedPlanners: planners.filter(p => p.verified).length,
        premiumPlanners: planners.filter(p => p.premiumMember).length,
        averageRating: planners.length > 0 ? planners.reduce((sum, p) => sum + (p.rating || 0), 0) / planners.length : 0,
        totalEvents: planners.reduce((sum, p) => sum + (p.eventsCompleted || 0), 0),
        totalCountries: Array.from(new Set(planners.map(p => p.headquarters.country))).length,
        totalCities: Array.from(new Set(planners.map(p => p.headquarters.city))).length
      };
      
      return NextResponse.json({
        success: true,
        data: stats
      });
    }
    
    const planners = unifiedPlatformAPI.getEventPlanners();
    
    return NextResponse.json({
      success: true,
      data: planners,
      total: planners.length,
      message: `Retrieved ${planners.length} event planners from unified platform`
    });
  } catch (error) {
    console.error('❌ Error fetching event planners:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch event planners'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 Creating new event planner:', body);
    
    // Transform event planner data to match the unified platform structure
    const eventPlannerData = {
      id: `event-planner-${Date.now()}`,
      companyName: body.companyName,
      slug: body.slug,
      establishedYear: body.establishedYear,
      type: 'event_planner',
      headquarters: body.headquarters,
      serviceLocations: body.serviceLocations || [body.headquarters],
      contactInfo: body.contactInfo,
      services: body.services || [],
      specializations: body.specializations || [],
      teamSize: body.teamSize || 5,
      eventsCompleted: body.eventsCompleted || 0,
      rating: body.rating || 4.0,
      reviewCount: body.reviewCount || 0,
      responseTime: body.responseTime || 'Within 24 hours',
      languages: body.languages || ['English'],
      verified: body.verified || false,
      premiumMember: body.premiumMember || false,
      companyDescription: body.companyDescription,
      whyChooseUs: body.whyChooseUs || ['Professional team', 'Creative solutions', 'Competitive pricing'],
      clientTestimonials: body.clientTestimonials || [],
      socialMedia: body.socialMedia || {},
      businessLicense: body.businessLicense,
      keyStrengths: body.keyStrengths || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to unified platform
    const result = unifiedPlatformAPI.addEventPlanner(eventPlannerData);
    
    if (result.success) {
      console.log('✅ Event planner added to unified platform successfully');
      
      // Broadcast the creation event for real-time sync
      const statsUpdate = {
        totalPlanners: unifiedPlatformAPI.getEventPlanners().length,
        verifiedPlanners: unifiedPlatformAPI.getEventPlanners().filter(p => p.verified).length,
        newRegistration: {
          id: eventPlannerData.id,
          companyName: eventPlannerData.companyName,
          country: eventPlannerData.headquarters.country,
          timestamp: new Date().toISOString()
        }
      };
      
      // Trigger real-time updates
      console.log('🔔 Broadcasting event planner creation event');
      
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Event planner registered successfully and added to platform',
        stats: statsUpdate
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to register event planner'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Error creating event planner:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create event planner'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    console.log('📝 Updating event planner:', id);
    
    const result = unifiedPlatformAPI.updateEventPlanner(id, updates);
    
    if (result.success) {
      console.log('✅ Event planner updated successfully');
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Event planner updated successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to update event planner'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Error updating event planner:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update event planner'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Event planner ID is required'
      }, { status: 400 });
    }
    
    console.log('🗑️ Deleting event planner:', id);
    
    const result = unifiedPlatformAPI.deleteEventPlanner(id);
    
    if (result.success) {
      console.log('✅ Event planner deleted successfully');
      return NextResponse.json({
        success: true,
        message: 'Event planner deleted successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to delete event planner'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Error deleting event planner:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete event planner'
    }, { status: 500 });
  }
}
