import { NextRequest, NextResponse } from 'next/server';
import { claimNotificationService } from '@/lib/email/emailService';

export async function POST(request: NextRequest) {
  try {
    const { to, type = 'test' } = await request.json();

    if (!to) {
      return NextResponse.json({
        success: false,
        error: 'Email address is required'
      }, { status: 400 });
    }

    console.log('📧 Testing SMTP functionality...');
    console.log('📧 Recipient:', to);

    // Test sending an OTP email
    const result = await claimNotificationService.sendClaimNotification(
      'otp_verification',
      { email: to, name: to.split('@')[0] },
      { 
        otpCode: '123456',
        contactPerson: to.split('@')[0],
        expiryTime: '5 minutes'
      },
      ['email']
    );

    console.log('📧 SMTP test result:', result);

    return NextResponse.json({
      success: true,
      message: 'SMTP test completed',
      results: result,
      smtpConfig: {
        host: process.env.SMTP_HOST || 'Not configured',
        port: process.env.SMTP_PORT || 'Not configured',
        user: process.env.SMTP_USER ? '✅ Configured' : '❌ Missing',
        password: process.env.SMTP_PASSWORD ? '✅ Configured' : '❌ Missing'
      }
    });

  } catch (error) {
    console.error('❌ SMTP test error:', error);
    return NextResponse.json({
      success: false,
      error: 'SMTP test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}