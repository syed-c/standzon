import { NextRequest, NextResponse } from 'next/server';
import { leadAPI } from '@/lib/database/persistenceAPI';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';
import { IntelligentQuoteMatchingEngine } from '@/lib/services/intelligentQuoteMatching';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const builderId = searchParams.get('builderId');
    const builderEmail = searchParams.get('builderEmail');
    
    console.log('🔍 Fetching leads for builder:', { builderId, builderEmail });
    
    if (!builderId || !builderEmail) {
      return NextResponse.json({
        success: false,
        error: 'Builder ID and email are required'
      }, { status: 400 });
    }
    
    // Get builder profile to understand their service areas
    const builders = unifiedPlatformAPI.getBuilders();
    const builder = builders.find(b => 
      b.id === builderId || b.contactEmail === builderEmail
    );

    if (!builder) {
      return NextResponse.json({
        success: false,
        error: 'Builder not found'
      }, { status: 404 });
    }

    // Get all leads from unified platform
    const allLeads = unifiedPlatformAPI.getLeads();
    
    // Enhanced lead matching based on builder's profile
    const relevantLeads = allLeads.filter(lead => {
      // Check if lead location matches builder's service areas
      const locationMatch = builder.serviceLocations?.some(location => 
        location.city.toLowerCase() === lead.city?.toLowerCase() ||
        location.country.toLowerCase() === lead.country?.toLowerCase()
      );

      // Check if lead has already been assigned to this builder
      const alreadyAssigned = lead.assignedBuilders?.includes(builderId) || 
                             lead.assignedBuilders?.includes(builderEmail);

      return locationMatch && !alreadyAssigned;
    });

    // Transform leads to match expected format
    const transformedLeads = relevantLeads.map(lead => ({
      id: lead.id,
      projectName: lead.tradeShowName || lead.exhibitionName || 'Exhibition Project',
      clientName: lead.contactName || lead.fullName || 'Client',
      clientEmail: lead.contactEmail || lead.email,
      clientPhone: lead.contactPhone || lead.phone || 'Not provided',
      eventName: lead.tradeShowName || lead.exhibitionName || 'Trade Show',
      eventDate: lead.eventDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      city: lead.city || 'Not specified',
      country: lead.country || 'Not specified',
      venueName: lead.venue || 'Exhibition Center',
      standSize: lead.standSize || lead.boothSize || '6x6m',
      budget: lead.budget || lead.projectBudget || '15000-25000',
      budgetCurrency: 'USD',
      description: lead.specialRequests || lead.message || 'Looking for professional exhibition stand',
      requirements: ['Professional design', 'Quality construction', 'On-time delivery'],
      urgency: lead.priority === 'HIGH' ? 'high' : lead.priority === 'LOW' ? 'low' : 'medium',
      submittedAt: lead.createdAt || new Date().toISOString(),
      status: lead.status || 'new',
      isUnlocked: lead.accessGranted || false,
      unlockedAt: lead.unlockedAt,
      priority: lead.leadScore || 85,
      matchScore: calculateMatchScore(builder, lead)
    }));

    console.log(`✅ Found ${transformedLeads.length} relevant leads for builder ${builderEmail}`);
    
    return NextResponse.json({
      success: true,
      data: {
        leads: transformedLeads,
        total: transformedLeads.length,
        builder: {
          id: builder.id,
          companyName: builder.companyName,
          leadCredits: builder.subscription?.leadCredits || 3,
          plan: builder.plan || 'free'
        }
      },
      message: `Retrieved ${transformedLeads.length} leads`
    });
    
  } catch (error) {
    console.error('❌ Error fetching builder leads:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch leads'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, action, builderId, builderEmail, quoteData } = body;
    
    console.log('📝 Processing lead action:', { leadId, action, builderId, builderEmail });
    
    if (!leadId || !action) {
      return NextResponse.json({
        success: false,
        error: 'Lead ID and action are required'
      }, { status: 400 });
    }

    // Get builder profile
    const builders = unifiedPlatformAPI.getBuilders();
    const builder = builders.find(b => 
      b.id === builderId || b.contactEmail === builderEmail
    );

    if (!builder) {
      return NextResponse.json({
        success: false,
        error: 'Builder not found'
      }, { status: 404 });
    }
    
    // Get the lead
    const leads = unifiedPlatformAPI.getLeads();
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) {
      return NextResponse.json({
        success: false,
        error: 'Lead not found'
      }, { status: 404 });
    }
    
    // Process different actions
    let updates: any = {};
    let responseMessage = '';
    
    switch (action) {
      case 'unlock':
        // Check if builder has credits
        const leadCredits = builder.subscription?.leadCredits || 3;
        if (leadCredits <= 0 && builder.plan === 'free') {
          return NextResponse.json({
            success: false,
            error: 'Insufficient lead credits. Please upgrade your plan.'
          }, { status: 403 });
        }

        updates = {
          accessGranted: true,
          unlockedAt: new Date().toISOString(),
          unlockedBy: builderId || builderEmail,
          status: 'viewed'
        };

        // Deduct credit (for non-enterprise plans)
        if (builder.plan !== 'enterprise') {
          const newCredits = Math.max(0, leadCredits - 1);
          const builderUpdate = {
            ...builder,
            subscription: {
              ...builder.subscription,
              leadCredits: newCredits
            }
          };
          unifiedPlatformAPI.updateBuilder(builder.id, builderUpdate);
        }

        responseMessage = 'Lead unlocked successfully';
        break;

      case 'quote':
        if (!quoteData || !quoteData.amount || !quoteData.message) {
          return NextResponse.json({
            success: false,
            error: 'Quote amount and message are required'
          }, { status: 400 });
        }

        updates = {
          status: 'quoted',
          quotedAt: new Date().toISOString(),
          quotedBy: builderId || builderEmail,
          quote: {
            builderId: builder.id,
            builderName: builder.companyName,
            builderEmail: builder.contactEmail,
            amount: quoteData.amount,
            message: quoteData.message,
            submittedAt: quoteData.submittedAt || new Date().toISOString()
          }
        };

        responseMessage = 'Quote submitted successfully';
        
        // TODO: Send notification to client about new quote
        console.log(`📧 Should send quote notification to ${lead.contactEmail}`);
        break;

      case 'accept':
        updates = {
          status: 'accepted',
          acceptedAt: new Date().toISOString(),
          acceptedBy: builderId || builderEmail
        };
        responseMessage = 'Lead accepted successfully';
        break;

      case 'reject':
        updates = {
          status: 'rejected',
          rejectedAt: new Date().toISOString(),
          rejectedBy: builderId || builderEmail
        };
        responseMessage = 'Lead rejected';
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
    
    // Update lead in unified platform
    const updatedLead = { ...lead, ...updates };
    const result = unifiedPlatformAPI.updateLead(leadId, updatedLead);
    
    if (result.success) {
      console.log(`✅ Lead ${leadId} updated with action ${action}`);
      
      return NextResponse.json({
        success: true,
        data: updatedLead,
        message: responseMessage,
        builder: {
          leadCredits: builder.subscription?.leadCredits || 3
        }
      });
    } else {
      console.error('❌ Failed to update lead:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Error updating lead:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update lead'
    }, { status: 500 });
  }
}

// Helper function to calculate match score between builder and lead
function calculateMatchScore(builder: any, lead: any): number {
  let score = 60; // Base score

  // Location match
  const locationMatch = builder.serviceLocations?.some((location: any) => 
    location.city.toLowerCase() === lead.city?.toLowerCase() ||
    location.country.toLowerCase() === lead.country?.toLowerCase()
  );
  if (locationMatch) score += 20;

  // Budget alignment (simplified)
  if (lead.estimatedValue) {
    const builderAverage = builder.priceRange?.averageProject || 50000;
    const ratio = lead.estimatedValue / builderAverage;
    if (ratio >= 0.8 && ratio <= 1.2) score += 15;
    else if (ratio >= 0.6 && ratio <= 1.5) score += 10;
  }

  // Premium member bonus
  if (builder.premiumMember) score += 5;

  return Math.min(100, score);
}