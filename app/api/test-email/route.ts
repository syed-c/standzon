import { NextRequest, NextResponse } from 'next/server';
import { claimNotificationService } from '@/lib/email/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, testType } = await request.json();
    console.log('🧪 Testing email service with:', { email, testType });
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email address is required'
      }, { status: 400 });
    }

    let templateId = 'otp_verification';
    let variables = {
      contactPerson: email.split('@')[0],
      otpCode: '123456',
      expiryTime: '5 minutes'
    };

    // Test different email types
    if (testType === 'welcome') {
      templateId = 'welcome_new_user';
      variables = {
        contactPerson: email.split('@')[0],
        userType: 'Exhibition Stand Builder',
        companyName: 'Test Company',
        dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/builder/dashboard`,
        supportUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/contact`,
        helpUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/help`
      };
    } else if (testType === 'lead') {
      templateId = 'lead_notification';
      variables = {
        builderName: 'Test Builder Company',
        tradeShowName: 'Test Exhibition 2024',
        city: 'Dubai',
        country: 'UAE',
        standSize: '20x30 meters',
        budget: '$50,000 - $75,000',
        timeline: '2-3 months',
        priority: 'HIGH',
        leadScore: '85',
        dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/builder/dashboard?tab=leads`
      };
    }

    console.log('📧 Sending test email with template:', templateId);
    
    const result = await claimNotificationService.sendClaimNotification(
      templateId,
      { email, name: email.split('@')[0] },
      variables,
      ['email']
    );

    if (result.length > 0 && result[0].success) {
      console.log('✅ Test email sent successfully:', result[0].messageId);
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result[0].messageId,
        template: templateId,
        recipient: email
      });
    } else {
      console.error('❌ Test email failed:', result[0]?.error);
      return NextResponse.json({
        success: false,
        error: result[0]?.error || 'Failed to send test email'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Email test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email testing endpoint',
    usage: 'POST with { email: "test@example.com", testType: "otp|welcome|lead" }',
    smtpConfig: {
      host: process.env.SMTP_HOST || 'Not configured',
      port: process.env.SMTP_PORT || 'Not configured',
      secure: process.env.SMTP_SECURE || 'Not configured',
      user: process.env.SMTP_USER ? '✅ Configured' : '❌ Missing',
      password: process.env.SMTP_PASSWORD ? '✅ Configured' : '❌ Missing'
    }
  });
}