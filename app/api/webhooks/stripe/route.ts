import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/lib/payments/stripeService';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';
import { claimNotificationService } from '@/lib/email/emailService';

export async function POST(request: NextRequest) {
  console.log('🔗 Stripe webhook received');
  
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      console.error('❌ Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify and parse webhook
    const webhookResult = await stripeService.handleWebhook(body, signature);
    
    if (!webhookResult.success) {
      console.error('❌ Webhook verification failed:', webhookResult.error);
      return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
    }

    const event = webhookResult.event!;
    console.log('📨 Processing webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handleSuccessfulPayment(event.data.object as any);
        break;

      case 'invoice.payment_failed':
        await handleFailedPayment(event.data.object as any);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as any);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as any);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSuccess(event.data.object as any);
        break;

      default:
        console.log('🤷 Unhandled webhook event type:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleSuccessfulPayment(invoice: any): Promise<void> {
  console.log('✅ Processing successful payment for invoice:', invoice.id);

  try {
    const subscriptionId = invoice.subscription;
    if (!subscriptionId) return;

    const customerId = invoice.customer;
    const metadata = invoice.metadata || {};

    // Find builder by customer ID or subscription ID
    const builders = unifiedPlatformAPI.getBuilders();
    const builder = builders.find(b => 
      b.subscription?.customerId === customerId ||
      b.subscription?.id === subscriptionId
    );

    if (!builder) {
      console.error('❌ Builder not found for successful payment');
      return;
    }

    // Update builder subscription status
    const updatedBuilder = {
      ...builder,
      subscription: {
        ...builder.subscription,
        status: 'active',
        currentPeriodStart: new Date(invoice.period_start * 1000),
        currentPeriodEnd: new Date(invoice.period_end * 1000),
        lastPaymentAt: new Date(),
        // Reset lead credits for new billing period
        leadCredits: getLeadCreditsForPlan(builder.plan || 'free')
      },
      premiumMember: builder.plan !== 'free',
      updatedAt: new Date().toISOString()
    };

    const updateResult = unifiedPlatformAPI.updateBuilder(builder.id, updatedBuilder);
    
    if (updateResult.success) {
      console.log('✅ Builder subscription activated:', builder.companyName);

      // Send confirmation email
      try {
        await claimNotificationService.sendClaimNotification(
          'payment_confirmation',
          {
            email: builder.contactEmail,
            name: builder.companyName
          },
          {
            builderName: builder.companyName,
            planName: builder.plan,
            amount: (invoice.amount_paid / 100).toFixed(2),
            currency: invoice.currency.toUpperCase(),
            periodStart: updatedBuilder.subscription.currentPeriodStart.toLocaleDateString(),
            periodEnd: updatedBuilder.subscription.currentPeriodEnd.toLocaleDateString(),
            leadCredits: updatedBuilder.subscription.leadCredits,
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/builder/dashboard`
          },
          ['email']
        );
        console.log('✅ Payment confirmation email sent');
      } catch (emailError) {
        console.error('❌ Failed to send payment confirmation email:', emailError);
      }
    }

  } catch (error) {
    console.error('❌ Error processing successful payment:', error);
  }
}

async function handleFailedPayment(invoice: any): Promise<void> {
  console.log('❌ Processing failed payment for invoice:', invoice.id);

  try {
    const subscriptionId = invoice.subscription;
    if (!subscriptionId) return;

    const customerId = invoice.customer;

    // Find builder
    const builders = unifiedPlatformAPI.getBuilders();
    const builder = builders.find(b => 
      b.subscription?.customerId === customerId
    );

    if (!builder) {
      console.error('❌ Builder not found for failed payment');
      return;
    }

    // Update subscription status
    const updatedBuilder = {
      ...builder,
      subscription: {
        ...builder.subscription,
        status: 'past_due',
        lastFailedPaymentAt: new Date()
      },
      updatedAt: new Date().toISOString()
    };

    unifiedPlatformAPI.updateBuilder(builder.id, updatedBuilder);

    // Send payment failure notification
    try {
      await claimNotificationService.sendClaimNotification(
        'payment_failed',
        {
          email: builder.contactEmail,
          name: builder.companyName
        },
        {
          builderName: builder.companyName,
          planName: builder.plan,
          amount: (invoice.amount_due / 100).toFixed(2),
          currency: invoice.currency.toUpperCase(),
          retryDate: new Date(invoice.next_payment_attempt * 1000).toLocaleDateString(),
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/builder/dashboard`,
          billingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/builder/dashboard?tab=billing`
        },
        ['email']
      );
      console.log('✅ Payment failure notification sent');
    } catch (emailError) {
      console.error('❌ Failed to send payment failure notification:', emailError);
    }

  } catch (error) {
    console.error('❌ Error processing failed payment:', error);
  }
}

async function handleSubscriptionUpdate(subscription: any): Promise<void> {
  console.log('🔄 Processing subscription update:', subscription.id);

  try {
    const customerId = subscription.customer;
    const metadata = subscription.metadata || {};

    // Find builder
    const builders = unifiedPlatformAPI.getBuilders();
    const builder = builders.find(b => 
      b.subscription?.customerId === customerId ||
      b.subscription?.id === subscription.id
    );

    if (!builder) {
      console.error('❌ Builder not found for subscription update');
      return;
    }

    // Update subscription details
    const updatedBuilder = {
      ...builder,
      subscription: {
        ...builder.subscription,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      },
      updatedAt: new Date().toISOString()
    };

    unifiedPlatformAPI.updateBuilder(builder.id, updatedBuilder);
    console.log('✅ Subscription updated for builder:', builder.companyName);

  } catch (error) {
    console.error('❌ Error processing subscription update:', error);
  }
}

async function handleSubscriptionCancellation(subscription: any): Promise<void> {
  console.log('❌ Processing subscription cancellation:', subscription.id);

  try {
    const customerId = subscription.customer;

    // Find builder
    const builders = unifiedPlatformAPI.getBuilders();
    const builder = builders.find(b => 
      b.subscription?.customerId === customerId
    );

    if (!builder) {
      console.error('❌ Builder not found for subscription cancellation');
      return;
    }

    // Downgrade to free plan
    const updatedBuilder = {
      ...builder,
      plan: 'free',
      subscription: {
        ...builder.subscription,
        status: 'cancelled',
        cancelledAt: new Date(),
        leadCredits: 3, // Free plan credits
        featuredListings: 0
      },
      premiumMember: false,
      updatedAt: new Date().toISOString()
    };

    unifiedPlatformAPI.updateBuilder(builder.id, updatedBuilder);

    // Send cancellation confirmation
    try {
      await claimNotificationService.sendClaimNotification(
        'subscription_cancelled',
        {
          email: builder.contactEmail,
          name: builder.companyName
        },
        {
          builderName: builder.companyName,
          cancellationDate: new Date().toLocaleDateString(),
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/builder/dashboard`
        },
        ['email']
      );
      console.log('✅ Cancellation confirmation sent');
    } catch (emailError) {
      console.error('❌ Failed to send cancellation confirmation:', emailError);
    }

    console.log('✅ Builder downgraded to free plan:', builder.companyName);

  } catch (error) {
    console.error('❌ Error processing subscription cancellation:', error);
  }
}

async function handlePaymentIntentSuccess(paymentIntent: any): Promise<void> {
  console.log('✅ Processing successful payment intent:', paymentIntent.id);

  try {
    const metadata = paymentIntent.metadata;

    if (metadata.type === 'lead_access') {
      // Grant access to lead
      const leadId = metadata.leadId;
      const builderId = metadata.builderId;

      const leads = unifiedPlatformAPI.getLeads();
      const lead = leads.find(l => l.id === leadId);

      if (lead) {
        const updatedLead = {
          ...lead,
          accessGranted: true,
          unlockedAt: new Date().toISOString(),
          unlockedBy: builderId,
          accessPrice: paymentIntent.amount
        };

        unifiedPlatformAPI.updateLead(leadId, updatedLead);
        console.log('✅ Lead access granted for payment:', paymentIntent.id);
      }
    }

  } catch (error) {
    console.error('❌ Error processing payment intent success:', error);
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