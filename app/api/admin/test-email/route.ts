import { NextRequest, NextResponse } from 'next/server';
import { claimNotificationService } from '@/lib/email/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, testType } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }

    console.log('🧪 Testing email service configuration...');
    console.log('📧 Environment variables check:', {
      SMTP_HOST: process.env.SMTP_HOST ? '✅ Set' : '❌ Missing',
      SMTP_USER: process.env.SMTP_USER ? '✅ Set' : '❌ Missing',
      SMTP_PASSWORD: process.env.SMTP_PASSWORD ? '✅ Set' : '❌ Missing',
      SMTP_PORT: process.env.SMTP_PORT || '587',
      SMTP_SECURE: process.env.SMTP_SECURE || 'false',
      EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'auto-detected',
      FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@exhibitbay.com'
    });

    const testOTP = '123456';
    
    // Test OTP email template
    const result = await claimNotificationService.sendClaimNotification(
      'otp_verification',
      { email, name: email.split('@')[0] },
      { 
        otpCode: testOTP,
        contactPerson: email.split('@')[0],
        expiryTime: '5 minutes'
      },
      ['email']
    );

    console.log('📧 Email test result:', result);

    if (result.length > 0 && result[0].success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${email}`,
        messageId: result[0].messageId,
        testOTP: testOTP,
        smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD)
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result[0]?.error || 'Failed to send test email',
        smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD)
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Email test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Email test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD)
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    smtpConfig: {
      host: process.env.SMTP_HOST ? '✅ Configured' : '❌ Missing',
      user: process.env.SMTP_USER ? '✅ Configured' : '❌ Missing', 
      password: process.env.SMTP_PASSWORD ? '✅ Configured' : '❌ Missing',
      port: process.env.SMTP_PORT || '587',
      secure: process.env.SMTP_SECURE || 'false',
      fromEmail: process.env.FROM_EMAIL || 'noreply@exhibitbay.com'
    },
    message: 'Use POST to send test email'
  });
}