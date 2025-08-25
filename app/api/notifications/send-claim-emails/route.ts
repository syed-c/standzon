import { NextRequest, NextResponse } from 'next/server';
import { 
  claimNotificationTemplates,
  getTemplateById,
  replaceTemplateVariables,
  getSMSContent
} from '@/lib/email/claimNotificationTemplates';
import { createClaimNotificationService } from '@/lib/email/emailService';

// Send claim notification emails API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      templateType, 
      recipients, 
      customContent, 
      sendMethod = 'email' // 'email', 'sms', or 'both'
    } = body;

    console.log('📧 Claim notification request:', { 
      templateType, 
      recipientCount: recipients?.length, 
      sendMethod 
    });

    // Validate required fields
    if (!templateType || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: templateType and recipients array'
      }, { status: 400 });
    }

    // Validate template type
    const validTemplates = claimNotificationTemplates.map(t => t.id);
    if (!validTemplates.includes(templateType)) {
      return NextResponse.json({
        success: false,
        error: `Invalid template type. Valid types: ${validTemplates.join(', ')}`
      }, { status: 400 });
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
      details: [] as any[]
    };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Process each recipient
    for (const recipient of recipients) {
      try {
        const { 
          builderId, 
          companyName, 
          email, 
          phone, 
          contactPerson = 'Business Owner' 
        } = recipient;

        if (!builderId || !companyName) {
          throw new Error(`Missing builderId or companyName for recipient`);
        }

        // Generate dynamic links
        const claimLink = `${baseUrl}/builders/${builderId}/claim`;
        const verificationLink = `${baseUrl}/builders/${builderId}/verify`;
        const upgradeLink = `${baseUrl}/subscription?builderId=${builderId}`;
        const dashboardLink = `${baseUrl}/builder/dashboard?id=${builderId}`;

        // Prepare template variables
        const templateVariables = {
          builderName: companyName,
          city: recipient.city || 'Unknown',
          country: recipient.country || 'Unknown',
          claimUrl: claimLink,
          verifyUrl: verificationLink,
          upgradeUrl: upgradeLink,
          participateUrl: dashboardLink,
          showcaseUrl: `${baseUrl}/showcase`,
          supportUrl: `${baseUrl}/contact`,
          unsubscribeUrl: `${baseUrl}/unsubscribe?id=${builderId}`,
          verificationMethod: 'phone',
          planType: recipient.planType || 'free',
          profileViews: String(Math.floor(Math.random() * 100) + 50),
          leadsReceived: String(Math.floor(Math.random() * 20) + 5),
          plansUrl: `${baseUrl}/pricing`
        };

        const recipientResult = {
          builderId,
          companyName,
          email,
          phone,
          status: 'pending',
          sentMethods: [] as string[],
          errors: [] as string[]
        };

        // Send email if requested and email is available
        if ((sendMethod === 'email' || sendMethod === 'both') && email) {
          try {
            const template = getTemplateById(templateType);
            if (!template) {
              throw new Error(`Template not found: ${templateType}`);
            }

            const subject = replaceTemplateVariables(template.subject, templateVariables);
            const htmlContent = replaceTemplateVariables(template.htmlContent, templateVariables);
            const textContent = replaceTemplateVariables(template.textContent, templateVariables);

            // In a real implementation, use a service like SendGrid, AWS SES, or similar
            console.log(`📧 Sending email to ${email}:`, {
              to: email,
              subject: subject,
              htmlPreview: htmlContent.substring(0, 100) + '...'
            });

            // Simulate email sending
            await simulateEmailSending(email, { subject, htmlContent, textContent });
            
            recipientResult.sentMethods.push('email');
            console.log(`✅ Email sent successfully to ${companyName} (${email})`);

          } catch (emailError) {
            const errorMsg = `Email failed for ${companyName}: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`;
            console.error('❌', errorMsg);
            recipientResult.errors.push(errorMsg);
          }
        }

        // Send SMS if requested and phone is available
        if ((sendMethod === 'sms' || sendMethod === 'both') && phone) {
          try {
            const template = getTemplateById(templateType);
            if (!template) {
              throw new Error(`Template not found: ${templateType}`);
            }

            const smsContent = getSMSContent(template, templateVariables);

            console.log(`📱 Sending SMS to ${phone}:`, {
              to: phone,
              content: smsContent
            });

            // Simulate SMS sending
            await simulateSMSSending(phone, smsContent);
            
            recipientResult.sentMethods.push('sms');
            console.log(`✅ SMS sent successfully to ${companyName} (${phone})`);

          } catch (smsError) {
            const errorMsg = `SMS failed for ${companyName}: ${smsError instanceof Error ? smsError.message : 'Unknown error'}`;
            console.error('❌', errorMsg);
            recipientResult.errors.push(errorMsg);
          }
        }

        // Update status based on results
        if (recipientResult.sentMethods.length > 0) {
          recipientResult.status = 'sent';
          results.sent++;
        } else {
          recipientResult.status = 'failed';
          results.failed++;
          if (recipientResult.errors.length === 0) {
            recipientResult.errors.push('No valid contact method available');
          }
        }

        results.details.push(recipientResult);

      } catch (recipientError) {
        const errorMsg = `Failed to process recipient: ${recipientError instanceof Error ? recipientError.message : 'Unknown error'}`;
        console.error('❌', errorMsg);
        results.failed++;
        results.errors.push(errorMsg);
      }
    }

    // Log audit trail
    const auditEntry = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      templateType,
      sendMethod,
      recipientCount: recipients.length,
      successCount: results.sent,
      failureCount: results.failed,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    };

    console.log('📝 Notification audit entry:', auditEntry);

    return NextResponse.json({
      success: true,
      message: `Notifications processed: ${results.sent} sent, ${results.failed} failed`,
      data: {
        ...results,
        auditId: auditEntry.id,
        templateType,
        sendMethod
      }
    });

  } catch (error) {
    console.error('❌ Notification sending error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send notifications. Please try again.'
    }, { status: 500 });
  }
}

// GET endpoint to retrieve notification history and templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'templates') {
      // Return available email templates
      const templatesList = claimNotificationTemplates.map(template => ({
        id: template.id,
        name: template.name,
        subject: template.subject,
        variables: template.variables,
        type: template.type,
        channels: template.channels
      }));

      return NextResponse.json({
        success: true,
        data: {
          templates: templatesList,
          totalTemplates: templatesList.length
        }
      });
    }

    // Return notification history (mock data)
    const notificationHistory = [
      {
        id: 'notif_1',
        templateType: 'CLAIM_INVITATION',
        recipientCount: 25,
        successCount: 23,
        failureCount: 2,
        sendMethod: 'email',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'notif_2', 
        templateType: 'VERIFICATION_REMINDER',
        recipientCount: 12,
        successCount: 10,
        failureCount: 2,
        sendMethod: 'both',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        history: notificationHistory,
        stats: {
          totalSent: 156,
          totalFailed: 8,
          successRate: '95.1%'
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching notification data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notification data'
    }, { status: 500 });
  }
}

// Helper functions for simulation (replace with real services in production)
async function simulateEmailSending(email: string, processedEmail: any): Promise<void> {
  // Simulate email service delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Simulate occasional failures (5% failure rate)
  if (Math.random() < 0.05) {
    throw new Error('Email service temporarily unavailable');
  }

  // In production, integrate with:
  // - SendGrid: https://sendgrid.com/
  // - AWS SES: https://aws.amazon.com/ses/
  // - Mailgun: https://www.mailgun.com/
  // - Postmark: https://postmarkapp.com/
  
  console.log(`📧 [SIMULATED] Email sent to ${email}`);
}

async function simulateSMSSending(phone: string, content: string): Promise<void> {
  // Simulate SMS service delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
  
  // Simulate occasional failures (3% failure rate)
  if (Math.random() < 0.03) {
    throw new Error('SMS service temporarily unavailable');
  }

  // In production, integrate with:
  // - Twilio: https://www.twilio.com/
  // - AWS SNS: https://aws.amazon.com/sns/
  // - MessageBird: https://www.messagebird.com/
  // - Nexmo/Vonage: https://www.vonage.com/
  
  console.log(`📱 [SIMULATED] SMS sent to ${phone}: ${content.substring(0, 50)}...`);
}

function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}