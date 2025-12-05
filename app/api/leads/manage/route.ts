import { NextRequest, NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';
import { claimNotificationService } from '@/lib/email/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔔 Lead management API received:', body);
    
    const { leadId, leadData } = body;

    if (!leadId || !leadData) {
      return NextResponse.json({
        success: false,
        error: 'Lead ID and lead data are required'
      }, { status: 400 });
    }

    // Get all builders from the platform
    const allBuilders = unifiedPlatformAPI.getBuilders();
    console.log('📊 Total builders in platform:', allBuilders.length);

    // Find builders in the lead's location with active credits/subscriptions
    const eligibleBuilders = allBuilders.filter(builder => {
      // Check if builder serves the lead's location
      const servesLocation = 
        builder.serviceLocations?.some(loc => 
          loc.country?.toLowerCase().includes(leadData.country?.toLowerCase()) ||
          loc.city?.toLowerCase().includes(leadData.city?.toLowerCase())
        ) ||
        builder.headquarters?.country?.toLowerCase().includes(leadData.country?.toLowerCase()) ||
        builder.headquarters?.city?.toLowerCase().includes(leadData.city?.toLowerCase());

      // For demo purposes, assume all builders have credits
      // In production, check builder.subscriptionPlan, credits, etc.
      const hasActiveCredits = true;

      return servesLocation && hasActiveCredits && builder.contactInfo?.primaryEmail;
    });

    console.log(`🎯 Found ${eligibleBuilders.length} eligible builders for location: ${leadData.city}, ${leadData.country}`);

    if (eligibleBuilders.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No eligible builders found in ${leadData.city}, ${leadData.country}`,
        buildersNotified: 0
      });
    }

    // Send notifications to eligible builders
    let successfulNotifications = 0;
    const notificationResults = [];

    for (const builder of eligibleBuilders) {
      try {
        console.log(`📧 Sending lead notification to: ${builder.companyName} (${builder.contactInfo.primaryEmail})`);

        const result = await claimNotificationService.sendClaimNotification(
          'lead_notification',
          { 
            email: builder.contactInfo.primaryEmail, 
            name: builder.contactInfo.contactPerson || builder.companyName 
          },
          {
            builderName: builder.companyName,
            builderEmail: builder.contactInfo.primaryEmail,
            projectName: leadData.exhibitionName || 'Exhibition Stand Project',
            clientCompany: leadData.companyName,
            location: leadData.location,
            budget: leadData.budget || 'Not specified',
            eventDate: leadData.timeline || 'To be determined',
            standSize: leadData.standSize || 'Not specified',
            matchScore: '85', // Default match score
            leadUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/builder/dashboard?lead=${leadId}`,
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/builder/dashboard`,
            leadId: leadId
          },
          ['email']
        );

        if (result[0]?.success) {
          successfulNotifications++;
          notificationResults.push({
            builder: builder.companyName,
            email: builder.contactInfo.primaryEmail,
            success: true
          });
        } else {
          notificationResults.push({
            builder: builder.companyName,
            email: builder.contactInfo.primaryEmail,
            success: false,
            error: result[0]?.error
          });
        }

      } catch (emailError) {
        console.error(`❌ Failed to send notification to ${builder.companyName}:`, emailError);
        notificationResults.push({
          builder: builder.companyName,
          email: builder.contactInfo.primaryEmail,
          success: false,
          error: emailError instanceof Error ? emailError.message : 'Email sending failed'
        });
      }
    }

    console.log(`✅ Successfully sent ${successfulNotifications}/${eligibleBuilders.length} notifications`);

    return NextResponse.json({
      success: true,
      message: `Lead notifications sent successfully`,
      data: {
        leadId,
        location: leadData.location,
        totalEligibleBuilders: eligibleBuilders.length,
        buildersNotified: successfulNotifications,
        notificationResults
      },
      buildersNotified: successfulNotifications
    });

  } catch (error) {
    console.error('❌ Error in lead management API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to manage lead notifications'
    }, { status: 500 });
  }
}