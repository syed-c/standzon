// Stripe Payment Service for ExhibitBay
// Handles subscription billing, lead payments, and transaction management

import Stripe from "stripe";

interface SubscriptionPlan {
  id: string;
  name: string;
  priceId: string; // Stripe Price ID
  amount: number; // in cents
  currency: string;
  interval: "month" | "year";
  features: string[];
  leadCredits: number;
  featuredListings: number;
}

interface CreateSubscriptionParams {
  userId: string;
  email: string;
  planId: string;
  paymentMethodId?: string;
}

interface CreateCustomerParams {
  userId: string;
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

interface ProcessLeadPaymentParams {
  builderId: string;
  leadId: string;
  amount: number; // in cents
  currency: string;
  paymentMethodId: string;
}

class StripeService {
  private stripe: Stripe | null;
  private webhookSecret: string;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      this.stripe = null;
      this.webhookSecret = "";
      return;
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-05-28.basil",
    });

    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  }

  /**
   * Check if Stripe is configured
   */
  private isConfigured(): boolean {
    return this.stripe !== null;
  }

  /**
   * Subscription Plans Configuration
   */
  getSubscriptionPlans(): SubscriptionPlan[] {
    return [
      {
        id: "free",
        name: "Free",
        priceId: "", // No Stripe price for free plan
        amount: 0,
        currency: "usd",
        interval: "month",
        features: [
          "3 quote responses per month",
          "Basic profile listing",
          "Standard support",
        ],
        leadCredits: 3,
        featuredListings: 0,
      },
      {
        id: "professional",
        name: "Professional",
        priceId:
          process.env.STRIPE_PROFESSIONAL_PRICE_ID || "price_professional",
        amount: 4900, // $49.00
        currency: "usd",
        interval: "month",
        features: [
          "25 quote responses per month",
          "Enhanced profile with gallery",
          "Priority support",
          "Advanced analytics",
          "3 featured listings per month",
        ],
        leadCredits: 25,
        featuredListings: 3,
      },
      {
        id: "enterprise",
        name: "Enterprise",
        priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise",
        amount: 14900, // $149.00
        currency: "usd",
        interval: "month",
        features: [
          "Unlimited quote responses",
          "Premium profile with custom branding",
          "Dedicated account manager",
          "Full analytics suite",
          "Unlimited featured listings",
          "API access",
        ],
        leadCredits: 999,
        featuredListings: 999,
      },
    ];
  }

  /**
   * Create or retrieve Stripe customer
   */
  async createCustomer(params: CreateCustomerParams): Promise<Stripe.Customer> {
    if (!this.stripe) {
      throw new Error(
        "Stripe service is not configured. Please set STRIPE_SECRET_KEY."
      );
    }



    try {
      // Check if customer already exists
      const existingCustomers = await this.stripe.customers.list({
        email: params.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0];
      }

      // Create new customer
      const customer = await this.stripe.customers.create({
        email: params.email,
        name: params.name,
        phone: params.phone,
        metadata: {
          userId: params.userId,
          platform: "exhibitbay",
          ...params.metadata,
        },
      });

      return customer;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create subscription for a builder
   */
  async createSubscription(params: CreateSubscriptionParams): Promise<{
    subscription: Stripe.Subscription;
    clientSecret?: string;
  }> {


    try {
      const plan = this.getSubscriptionPlans().find(
        (p) => p.id === params.planId
      );
      if (!plan || plan.id === "free") {
        throw new Error("Invalid plan selected");
      }

      // Create or get customer
      const customer = await this.createCustomer({
        userId: params.userId,
        email: params.email,
      });

      // Create subscription
      const subscriptionData: Stripe.SubscriptionCreateParams = {
        customer: customer.id,
        items: [{ price: plan.priceId }],
        metadata: {
          userId: params.userId,
          planId: params.planId,
          platform: "exhibitbay",
        },
        expand: ["latest_invoice.payment_intent"],
      };

      // If payment method provided, use it
      if (params.paymentMethodId) {
        subscriptionData.default_payment_method = params.paymentMethodId;
      } else {
        // Create setup intent for future payments
        subscriptionData.payment_behavior = "default_incomplete";
      }

      const subscription =
        await this.stripe.subscriptions.create(subscriptionData);



      // Extract client secret for frontend confirmation
      let clientSecret: string | undefined;
      if (
        subscription.latest_invoice &&
        typeof subscription.latest_invoice === "object"
      ) {
        const latestInvoice = subscription.latest_invoice as any;
        const paymentIntent = latestInvoice.payment_intent;
        if (paymentIntent && typeof paymentIntent === "object") {
          clientSecret = paymentIntent.client_secret || undefined;
        }
      }

      return {
        subscription,
        clientSecret,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    immediately = false
  ): Promise<Stripe.Subscription> {


    try {
      const subscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: !immediately,
          ...(immediately && { cancel_at: Math.floor(Date.now() / 1000) }),
        }
      );

      return subscription;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update subscription plan
   */
  async updateSubscription(
    subscriptionId: string,
    newPlanId: string
  ): Promise<Stripe.Subscription> {


    try {
      const newPlan = this.getSubscriptionPlans().find(
        (p) => p.id === newPlanId
      );
      if (!newPlan || newPlan.id === "free") {
        throw new Error("Invalid plan selected");
      }

      // Get current subscription
      const currentSubscription =
        await this.stripe.subscriptions.retrieve(subscriptionId);

      // Update subscription with new price
      const subscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          items: [
            {
              id: currentSubscription.items.data[0].id,
              price: newPlan.priceId,
            },
          ],
          metadata: {
            ...currentSubscription.metadata,
            planId: newPlanId,
          },
        }
      );

      return subscription;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Process one-time payment for lead access
   */
  async processLeadPayment(
    params: ProcessLeadPaymentParams
  ): Promise<Stripe.PaymentIntent> {


    try {
      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: params.amount,
        currency: params.currency,
        payment_method: params.paymentMethodId,
        confirm: true,
        metadata: {
          type: "lead_access",
          builderId: params.builderId,
          leadId: params.leadId,
          platform: "exhibitbay",
        },
        description: `Lead access payment - Lead ${params.leadId}`,
      });

      return paymentIntent;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create setup intent for saving payment methods
   */
  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {


    try {
      const setupIntent = await this.stripe.setupIntents.create({
        customer: customerId,
        usage: "off_session",
        metadata: {
          platform: "exhibitbay",
        },
      });

      return setupIntent;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get customer's payment methods
   */
  async getPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {


    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });

      return paymentMethods.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(
    payload: string,
    signature: string
  ): Promise<{
    success: boolean;
    event?: Stripe.Event;
    error?: string;
  }> {


    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );

      switch (event.type) {
        case "invoice.payment_succeeded":
          await this.handleSuccessfulPayment(
            event.data.object as Stripe.Invoice
          );
          break;

        case "invoice.payment_failed":
          await this.handleFailedPayment(event.data.object as Stripe.Invoice);
          break;

        case "customer.subscription.updated":
          await this.handleSubscriptionUpdate(
            event.data.object as Stripe.Subscription
          );
          break;

        case "customer.subscription.deleted":
          await this.handleSubscriptionCancellation(
            event.data.object as Stripe.Subscription
          );
          break;

        case "payment_intent.succeeded":
          await this.handlePaymentIntentSuccess(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        default:
      }

      return { success: true, event };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Handle successful subscription payment
   */
  private async handleSuccessfulPayment(
    invoice: Stripe.Invoice
  ): Promise<void> {


    try {
      const subscriptionId = (invoice as any).subscription;
      if (!subscriptionId) return;

      // TODO: Update database subscription status
      // await prisma.subscription.update({
      //   where: { stripeSubscriptionId: subscriptionId as string },
      //   data: {
      //     status: 'ACTIVE',
      //     currentPeriodStart: new Date(invoice.period_start * 1000),
      //     currentPeriodEnd: new Date(invoice.period_end * 1000)
      //   }
      // });

      // TODO: Reset lead credits based on plan
      // await resetLeadCredits(userId, planId);

      // TODO: Send confirmation email
      // await sendPaymentConfirmationEmail(userId, invoice);
    } catch (error) {
      console.error("❌ Error processing successful payment:", error);
    }
  }

  /**
   * Handle failed subscription payment
   */
  private async handleFailedPayment(invoice: Stripe.Invoice): Promise<void> {


    try {
      const subscriptionId = (invoice as any).subscription;
      if (!subscriptionId) return;

      // TODO: Update database subscription status
      // await prisma.subscription.update({
      //   where: { stripeSubscriptionId: subscriptionId as string },
      //   data: { status: 'PAST_DUE' }
      // });

      // TODO: Send payment failure notification
      // await sendPaymentFailureEmail(userId, invoice);
    } catch (error) {
      console.error("❌ Error processing payment failure:", error);
    }
  }

  /**
   * Handle subscription updates
   */
  private async handleSubscriptionUpdate(
    subscription: Stripe.Subscription
  ): Promise<void> {


    try {
      // TODO: Update database with new subscription details
      // await prisma.subscription.update({
      //   where: { stripeSubscriptionId: subscription.id },
      //   data: {
      //     status: subscription.status.toUpperCase() as any,
      //     currentPeriodStart: new Date(subscription.current_period_start * 1000),
      //     currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      //   }
      // });
    } catch (error) {
      console.error("❌ Error processing subscription update:", error);
    }
  }

  /**
   * Handle subscription cancellation
   */
  private async handleSubscriptionCancellation(
    subscription: Stripe.Subscription
  ): Promise<void> {


    try {
      // TODO: Update database subscription status
      // await prisma.subscription.update({
      //   where: { stripeSubscriptionId: subscription.id },
      //   data: {
      //     status: 'CANCELLED',
      //     cancelledAt: new Date()
      //   }
      // });

      // TODO: Downgrade to free plan
      // await downgradeToFreePlan(userId);
    } catch (error) {
      console.error("❌ Error processing subscription cancellation:", error);
    }
  }

  /**
   * Handle successful payment intent (for one-time payments)
   */
  private async handlePaymentIntentSuccess(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {


    try {
      const metadata = paymentIntent.metadata;

      if (metadata.type === "lead_access") {
        // Grant access to lead
        // TODO: Update lead assignment with access granted
        // await prisma.leadAssignment.update({
        //   where: {
        //     leadId_builderId: {
        //       leadId: metadata.leadId,
        //       builderId: metadata.builderId
        //     }
        //   },
        //   data: {
        //     accessGranted: true,
        //     accessPrice: paymentIntent.amount
        //   }
        // });
      }
    } catch (error) {
      console.error("❌ Error processing payment intent success:", error);
    }
  }

  /**
   * Retrieve subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Get customer billing portal URL
   */
  async createBillingPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<string> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  }
}

// Export singleton instance
export const stripeService = new StripeService();

// Export types
export type {
  SubscriptionPlan,
  CreateSubscriptionParams,
  ProcessLeadPaymentParams,
};
