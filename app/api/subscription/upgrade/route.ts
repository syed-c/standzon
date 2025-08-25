import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/lib/payments/stripeService';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export async function POST(request: NextRequest) {
  try {
    const { 
      builderId, 
      builderEmail, 
      planId, 
      paymentMethodId 
    } = await request.json();

    console.log('💳 Processing subscription upgrade:', { builderId, builderEmail, planId });

    if (!builderId || !builderEmail || !planId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: builderId, builderEmail, planId'
      }, { status: 400 });
    }

    // Get builder profile
    const builders = unifiedPlatformAPI.getBuilders();
    const builder = builders.find(b => b.id === builderId || b.contactEmail === builderEmail);

    if (!builder) {
      return NextResponse.json({
        success: false,
        error: 'Builder not found'
      }, { status: 404 });
    }

    try {
      // Create subscription with Stripe
      const subscriptionResult = await stripeService.createSubscription({
        userId: builderId,
        email: builderEmail,
        planId,
        paymentMethodId
      });

      console.log('✅ Stripe subscription created:', subscriptionResult.subscription.id);

      // Update builder's subscription in database
      const updatedBuilder = {
        ...builder,
        subscription: {
          id: subscriptionResult.subscription.id,
          plan: planId,
          status: 'active',
          customerId: subscriptionResult.subscription.customer as string,
          currentPeriodStart: new Date(subscriptionResult.subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscriptionResult.subscription.current_period_end * 1000),
          leadCredits: getLeadCreditsForPlan(planId),
          featuredListings: getFeaturedListingsForPlan(planId)
        },
        plan: planId,
        premiumMember: planId !== 'free',
        verified: true, // Premium subscribers are auto-verified
        updatedAt: new Date().toISOString()
      };

      const updateResult = unifiedPlatformAPI.updateBuilder(builderId, updatedBuilder);

      if (updateResult.success) {
        console.log('✅ Builder subscription updated in database');
        
        return NextResponse.json({
          success: true,
          data: {
            subscriptionId: subscriptionResult.subscription.id,
            clientSecret: subscriptionResult.clientSecret,
            plan: planId,
            leadCredits: getLeadCreditsForPlan(planId),
            featuredListings: getFeaturedListingsForPlan(planId),
            builder: updatedBuilder
          },
          message: `Successfully upgraded to ${planId} plan`
        });
      } else {
        console.error('❌ Failed to update builder in database:', updateResult.error);
        
        // Rollback Stripe subscription if database update fails
        try {
          await stripeService.cancelSubscription(subscriptionResult.subscription.id, true);
          console.log('✅ Stripe subscription rolled back');
        } catch (rollbackError) {
          console.error('❌ Failed to rollback Stripe subscription:', rollbackError);
        }
        
        return NextResponse.json({
          success: false,
          error: 'Failed to update subscription in database'
        }, { status: 500 });
      }

    } catch (stripeError) {
      console.error('❌ Stripe subscription creation failed:', stripeError);
      return NextResponse.json({
        success: false,
        error: stripeError instanceof Error ? stripeError.message : 'Payment processing failed'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Subscription upgrade error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const builderId = searchParams.get('builderId');
    const builderEmail = searchParams.get('builderEmail');

    if (!builderId && !builderEmail) {
      return NextResponse.json({
        success: false,
        error: 'Builder ID or email is required'
      }, { status: 400 });
    }

    // Get builder profile
    const builders = unifiedPlatformAPI.getBuilders();
    const builder = builders.find(b => 
      (builderId && b.id === builderId) || 
      (builderEmail && b.contactEmail === builderEmail)
    );

    if (!builder) {
      return NextResponse.json({
        success: false,
        error: 'Builder not found'
      }, { status: 404 });
    }

    // Get subscription details
    const subscription = builder.subscription || {
      plan: 'free',
      status: 'active',
      leadCredits: 3,
      featuredListings: 0
    };

    // Get available plans
    const availablePlans = stripeService.getSubscriptionPlans();

    return NextResponse.json({
      success: true,
      data: {
        currentSubscription: subscription,
        availablePlans,
        builder: {
          id: builder.id,
          companyName: builder.companyName,
          contactEmail: builder.contactEmail,
          plan: builder.plan || 'free',
          premiumMember: builder.premiumMember || false
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching subscription details:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch subscription details'
    }, { status: 500 });
  }
}

function getLeadCreditsForPlan(planId: string): number {
  const planCredits = {
    'free': 3,
    'professional': 25,
    'enterprise': 999
  };
  return planCredits[planId as keyof typeof planCredits] || 3;
}

function getFeaturedListingsForPlan(planId: string): number {
  const planListings = {
    'free': 0,
    'professional': 3,
    'enterprise': 999
  };
  return planListings[planId as keyof typeof planListings] || 0;
}