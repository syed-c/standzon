import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayService } from '@/lib/payments/razorpayService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    console.log('🔹 Razorpay API endpoint called:', action);

    // Get Razorpay configuration from admin settings
    const razorpayConfig = {
      keyId: process.env.RAZORPAY_KEY_ID || '',
      testMode: process.env.NODE_ENV !== 'production',
      currency: 'INR'
    };

    // Create Razorpay service instance
    const razorpayService = createRazorpayService(razorpayConfig);

    switch (action) {
      case 'create_order':
        const order = await razorpayService.createPaymentOrder({
          amount: params.amount,
          currency: params.currency || 'INR',
          orderId: params.orderId,
          description: params.description,
          customerEmail: params.customerEmail,
          customerPhone: params.customerPhone,
          customerName: params.customerName
        });

        return NextResponse.json({
          success: true,
          data: order
        });

      case 'verify_payment':
        const verification = await razorpayService.verifyPaymentSignature({
          orderId: params.orderId,
          paymentId: params.paymentId,
          signature: params.signature
        });

        return NextResponse.json({
          success: verification.success,
          error: verification.error
        });

      case 'create_subscription':
        const subscription = await razorpayService.createSubscription({
          planId: params.planId,
          customerId: params.customerId,
          totalCount: params.totalCount || 12,
          customerNotify: params.customerNotify || true
        });

        return NextResponse.json({
          success: true,
          data: subscription
        });

      case 'cancel_subscription':
        const cancellation = await razorpayService.cancelSubscription(params.subscriptionId);

        return NextResponse.json({
          success: cancellation.success,
          data: { status: cancellation.status }
        });

      case 'test_connection':
        const connectionTest = await razorpayService.testConnection();

        return NextResponse.json({
          success: connectionTest.success,
          error: connectionTest.error
        });

      case 'get_payment_details':
        const paymentDetails = await razorpayService.getPaymentDetails(params.paymentId);

        return NextResponse.json({
          success: true,
          data: paymentDetails
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Razorpay API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed'
    }, { status: 500 });
  }
}

// Handle GET requests for configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'config') {
      // Return public configuration (without sensitive data)
      return NextResponse.json({
        success: true,
        data: {
          keyId: process.env.RAZORPAY_KEY_ID || '',
          testMode: process.env.NODE_ENV !== 'production',
          supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'CAD', 'AUD']
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action specified'
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Razorpay config error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get configuration'
    }, { status: 500 });
  }
}