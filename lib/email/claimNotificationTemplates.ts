
// Claim Notification Email Templates
export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  type: 'claim_invitation' | 'verification_reminder' | 'plan_upgrade' | 'showcase_interest' | 'otp_verification' | 'welcome_new_user';
  channels: ('email' | 'sms' | 'internal')[];
  variables: string[];
}

export const claimNotificationTemplates: NotificationTemplate[] = [
  {
    id: 'lead_notification',
    name: 'New Lead Notification',
    subject: '🎯 New Exhibition Lead: {{projectName}} in {{location}}',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Exhibition Lead</h1>
          <p style="color: #e2e8f0; font-size: 16px; margin: 10px 0 0 0;">
            A qualified client is looking for exhibition services
          </p>
        </div>
        
        <div style="background: white; padding: 30px;">
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">{{projectName}}</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
              <div><strong>Client:</strong> {{clientCompany}}</div>
              <div><strong>Location:</strong> {{location}}</div>
              <div><strong>Budget:</strong> {{budget}}</div>
              <div><strong>Event Date:</strong> {{eventDate}}</div>
              <div><strong>Stand Size:</strong> {{standSize}}</div>
              <div><strong>Match Score:</strong> <span style="color: #059669; font-weight: bold;">{{matchScore}}%</span></div>
            </div>
          </div>
          
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
            <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px;">Why you're a great match:</h3>
            <ul style="color: #047857; margin: 0; padding-left: 20px;">
              <li>You serve the {{location}} area</li>
              <li>High match score based on your expertise</li>
              <li>Client budget aligns with your services</li>
              <li>Available for the project timeline</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{leadUrl}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">
              View Full Lead Details
            </a>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin-top: 25px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>⏰ Act Fast:</strong> This lead was sent to multiple qualified builders. 
              Quick response time increases your chances of winning this project.
            </p>
          </div>
        </div>
        
        <div style="background: #1e293b; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">
            Need help? Visit your <a href="{{dashboardUrl}}" style="color: #60a5fa;">dashboard</a> or contact support.
          </p>
          <p style="color: #64748b; margin: 0; font-size: 12px;">
            ExhibitBay - Connecting exhibitors with qualified builders worldwide
          </p>
        </div>
      </div>
    `,
    textContent: `
🎯 NEW EXHIBITION LEAD: {{projectName}}

Client Company: {{clientCompany}}
Location: {{location}}
Budget: {{budget}}
Event Date: {{eventDate}}
Stand Size: {{standSize}}
Match Score: {{matchScore}}%

WHY YOU'RE A GREAT MATCH:
- You serve the {{location}} area
- High match score based on your expertise  
- Client budget aligns with your services
- Available for the project timeline

⏰ ACT FAST: This lead was sent to multiple qualified builders.
Quick response time increases your chances of winning this project.

View full details: {{leadUrl}}
Visit dashboard: {{dashboardUrl}}

ExhibitBay - Connecting exhibitors with qualified builders worldwide
    `,
    type: 'showcase_interest',
    channels: ['email', 'sms'],
    variables: [
      'builderName', 'builderEmail', 'projectName', 'clientCompany', 
      'location', 'budget', 'eventDate', 'standSize', 'matchScore',
      'leadUrl', 'dashboardUrl', 'leadId'
    ]
  },
  
  {
    id: 'verification_reminder',
    name: 'Profile Verification Reminder',
    subject: '⏰ Complete Your Profile Verification - Stands Zone',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Complete Your Verification</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 1rem 0; }
        .urgent { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin: 1.5rem 0; border-radius: 4px; }
        .footer { background: #1e293b; color: #94a3b8; padding: 2rem; text-align: center; font-size: 0.875rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ Verification Pending</h1>
            <p>Complete your profile verification to start receiving leads</p>
        </div>
        
        <div class="content">
            <p>Hi <strong>{{builderName}}</strong>,</p>
            
            <p>You started claiming your business profile but haven't completed the verification process yet.</p>
            
            <div class="urgent">
                <h3 style="margin: 0 0 0.5rem 0; color: #92400e;">🕒 Verification Status</h3>
                <p style="margin: 0;"><strong>Business:</strong> {{builderName}}</p>
                <p style="margin: 0;"><strong>Method:</strong> {{verificationMethod}}</p>
                <p style="margin: 0;"><strong>Status:</strong> Waiting for verification</p>
            </div>
            
            <p><strong>Complete your verification to:</strong></p>
            <ul>
                <li>Start receiving customer inquiries and quote requests</li>
                <li>Access your profile management dashboard</li>
                <li>Display the verified business badge</li>
                <li>Unlock premium features and analytics</li>
            </ul>
            
            <div style="text-align: center; margin: 2rem 0;">
                <a href="{{verifyUrl}}" class="button" style="color: white;">✅ Complete Verification</a>
            </div>
            
            <p style="color: #64748b; font-size: 0.875rem;">
                <strong>Need help?</strong> If you're having trouble with verification, reply to this email or contact our support team. We're here to help!
            </p>
            
            <p>Best regards,<br>
            <strong>Stands Zone Support Team</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>Stands Zone</strong> - Your Exhibition Business Partner</p>
            <p><a href="{{supportUrl}}" style="color: #64748b;">Contact Support</a> | <a href="{{unsubscribeUrl}}" style="color: #64748b;">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>`,
    textContent: `Hi {{builderName}},

You started claiming your business profile but haven't completed the verification process yet.

🕒 **Verification Pending**: {{builderName}}
📱 **Method**: {{verificationMethod}}

Complete your verification to:
• Start receiving customer inquiries
• Manage your profile information
• Display verified business badge
• Access premium features

**Complete verification**: {{verifyUrl}}

Need help? Reply to this email or contact our support team.

Best regards,
Stands Zone Support Team

---
Contact Support: {{supportUrl}}
Unsubscribe: {{unsubscribeUrl}}`,
    type: 'verification_reminder',
    channels: ['email', 'sms'],
    variables: ['builderName', 'verificationMethod', 'verifyUrl', 'supportUrl', 'unsubscribeUrl']
  },

  {
    id: 'plan_upgrade',
    name: 'Plan Upgrade Offer',
    subject: '🚀 Boost Your Stands Zone Profile - Exclusive Upgrade Offer',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Exclusive Upgrade Offer</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .button { display: inline-block; background: #8b5cf6; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 1rem 0; }
        .offer { background: #faf5ff; border: 2px solid #8b5cf6; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; text-align: center; }
        .comparison { background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 2rem; text-align: center; font-size: 0.875rem; }
        .highlight { background: #fbbf24; color: #92400e; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Exclusive Upgrade Offer</h1>
            <p>Boost your profile visibility and get more leads!</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{builderName}}</strong>,</p>
            
            <p>Your profile on Stands Zone is performing well! We have an <strong>exclusive offer</strong> to take your business to the next level.</p>
            
            <div style="background: #dbeafe; padding: 1rem; border-radius: 8px; margin: 1.5rem 0;">
                <p style="margin: 0;"><strong>📊 Current Plan:</strong> {{planType}}</p>
                <p style="margin: 0;"><strong>🎯 Profile Views:</strong> {{profileViews}} this month</p>
                <p style="margin: 0;"><strong>📨 Leads Received:</strong> {{leadsReceived}} inquiries</p>
            </div>
            
            <div class="offer">
                <h2 style="color: #7c3aed; margin-top: 0;">💰 Limited Time Offer</h2>
                <p style="font-size: 1.5rem; margin: 0.5rem 0;"><span class="highlight">50% OFF</span></p>
                <p style="margin: 0; font-weight: 600;">First 3 months of Premium Plan</p>
                <p style="font-size: 0.875rem; color: #64748b; margin: 0.5rem 0;">Offer expires in 7 days</p>
            </div>
            
            <div class="comparison">
                <h3 style="color: #1e40af; margin-top: 0;">🎯 Premium Plan Benefits:</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <h4 style="margin: 0 0 0.5rem 0; color: #059669;">✅ What You'll Get:</h4>
                        <ul style="margin: 0; padding-left: 1.5rem; font-size: 0.875rem;">
                            <li>3x more profile views</li>
                            <li>Featured listing placement</li>
                            <li>Priority in search results</li>
                            <li>Advanced analytics dashboard</li>
                            <li>Custom portfolio showcase</li>
                            <li>Priority customer support</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 0.5rem 0; color: #dc2626;">📈 Expected Results:</h4>
                        <ul style="margin: 0; padding-left: 1.5rem; font-size: 0.875rem;">
                            <li>200% increase in visibility</li>
                            <li>3-5x more quote requests</li>
                            <li>Higher quality leads</li>
                            <li>Faster customer responses</li>
                            <li>Improved conversion rates</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin: 2rem 0;">
                <a href="{{upgradeUrl}}" class="button" style="color: white;">🚀 Upgrade Now - 50% Off</a>
            </div>
            
            <p style="color: #64748b; font-size: 0.875rem; text-align: center; background: #f8fafc; padding: 1rem; border-radius: 6px;">
                <strong>⏰ Limited Time:</strong> This exclusive offer expires in 7 days. Don't miss out on boosting your business visibility!
            </p>
            
            <p>Questions about upgrading? Reply to this email and we'll help you choose the perfect plan.</p>
            
            <p>Best regards,<br>
            <strong>Stands Zone Sales Team</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>Stands Zone</strong> - Grow Your Exhibition Business</p>
            <p><a href="{{plansUrl}}" style="color: #64748b;">View All Plans</a> | <a href="{{unsubscribeUrl}}" style="color: #64748b;">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>`,
    textContent: `Hello {{builderName}},

Your profile on Stands Zone is performing well! Here's an exclusive offer to boost your visibility:

📊 **Current Plan**: {{planType}}
🎯 **Upgrade Benefits**:
• 3x more profile views
• Featured listing placement
• Advanced analytics dashboard
• Priority customer support
• Custom portfolio showcase

💰 **Special Offer**: 50% off first 3 months

**Upgrade now**: {{upgradeUrl}}

This offer expires in 7 days.

Best regards,
Stands Zone Sales Team

---
View All Plans: {{plansUrl}}
Unsubscribe: {{unsubscribeUrl}}`,
    type: 'plan_upgrade',
    channels: ['email', 'internal'],
    variables: ['builderName', 'planType', 'profileViews', 'leadsReceived', 'upgradeUrl', 'plansUrl', 'unsubscribeUrl']
  },

  {
    id: 'showcase_interest',
    name: 'Showcase Participation Interest',
    subject: '⭐ Featured Showcase Opportunity - Stands Zone',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Featured Showcase Opportunity</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .button { display: inline-block; background: #06b6d4; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 1rem 0; }
        .showcase { background: #f0f9ff; border-left: 4px solid #06b6d4; padding: 1.5rem; margin: 1.5rem 0; border-radius: 4px; }
        .requirements { background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 2rem; text-align: center; font-size: 0.875rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⭐ Featured Showcase Invitation</h1>
            <p>Showcase your best work to thousands of potential customers</p>
        </div>
        
        <div class="content">
            <p>Dear <strong>{{builderName}}</strong>,</p>
            
            <p>We're excited to invite you to participate in our <strong>monthly featured showcase</strong>! Based on your excellent work and customer reviews, we'd love to highlight your business to our entire community.</p>
            
            <div class="showcase">
                <h3 style="margin: 0 0 1rem 0; color: #0369a1;">🌟 Showcase Benefits</h3>
                <ul style="margin: 0; padding-left: 1.5rem;">
                    <li><strong>Homepage Feature:</strong> 30 days of prime real estate on our homepage</li>
                    <li><strong>Dedicated Article:</strong> In-depth case study showcasing your expertise</li>
                    <li><strong>Social Media Promotion:</strong> Featured across all our social channels</li>
                    <li><strong>Newsletter Feature:</strong> Highlighted to our 10,000+ subscribers</li>
                    <li><strong>SEO Benefits:</strong> High-quality backlinks to boost your online presence</li>
                </ul>
            </div>
            
            <div class="requirements">
                <h3 style="color: #1e40af; margin-top: 0;">📝 What We Need from You</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <h4 style="margin: 0 0 0.5rem 0;">📸 Visual Content:</h4>
                        <ul style="margin: 0; padding-left: 1.5rem; font-size: 0.875rem;">
                            <li>3-5 high-quality project photos</li>
                            <li>Before/after shots (if applicable)</li>
                            <li>Team or setup process images</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 0.5rem 0;">📖 Written Content:</h4>
                        <ul style="margin: 0; padding-left: 1.5rem; font-size: 0.875rem;">
                            <li>Project description (200-300 words)</li>
                            <li>Challenges and solutions</li>
                            <li>Client testimonial (optional)</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <p style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 1rem; margin: 1.5rem 0; border-radius: 4px;">
                <strong>💡 Why Participate?</strong> Showcase participants typically see a 40% increase in profile views and 25% more quote requests during their feature month!
            </p>
            
            <div style="text-align: center; margin: 2rem 0;">
                <a href="{{participateUrl}}" class="button" style="color: white;">⭐ Yes, I'm Interested!</a>
            </div>
            
            <p style="color: #64748b; font-size: 0.875rem;">
                <strong>Timeline:</strong> We'll need your materials within 2 weeks, and your showcase will go live at the beginning of next month. Our team will handle all the writing and design work!
            </p>
            
            <p>Have questions or want to discuss your project? Simply reply to this email!</p>
            
            <p>Best regards,<br>
            <strong>Stands Zone Marketing Team</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>Stands Zone</strong> - Showcasing Excellence in Exhibition</p>
            <p><a href="{{showcaseUrl}}" style="color: #64748b;">View Previous Showcases</a> | <a href="{{unsubscribeUrl}}" style="color: #64748b;">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>`,
    textContent: `Dear {{builderName}},

We're featuring top exhibition builders in our monthly showcase and would love to include your business!

🌟 **Showcase Benefits**:
• Featured on homepage for 30 days
• Dedicated case study article
• Social media promotion
• Newsletter feature to 10,000+ subscribers
• SEO benefits and backlinks

📝 **What we need**:
• 3-5 high-quality project photos
• Brief project description (200-300 words)
• Client testimonial (optional)

💡 **Results**: Participants typically see 40% more profile views and 25% more quote requests!

**Participate**: {{participateUrl}}

Interested? Reply with your project details!

Best regards,
Stands Zone Marketing Team

---
View Previous Showcases: {{showcaseUrl}}
Unsubscribe: {{unsubscribeUrl}}`,
    type: 'showcase_interest',
    channels: ['email'],
    variables: ['builderName', 'participateUrl', 'showcaseUrl', 'unsubscribeUrl']
  },

  {
    id: 'otp_verification',
    name: 'OTP Verification Code',
    subject: '🔐 Your Login Code for Stands Zone',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your Login Code</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .otp-code { background: #f1f5f9; border: 2px solid #3b82f6; padding: 2rem; text-align: center; border-radius: 12px; margin: 2rem 0; }
        .code { font-size: 3rem; font-weight: bold; color: #1e40af; letter-spacing: 0.5rem; margin: 1rem 0; font-family: 'Monaco', 'Courier New', monospace; }
        .footer { background: #1e293b; color: #94a3b8; padding: 2rem; text-align: center; font-size: 0.875rem; }
        .security-note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin: 1.5rem 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Your Login Code</h1>
            <p>One-time password for secure access</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{contactPerson}}</strong>,</p>
            
            <p>You requested a one-time password to access your Stands Zone account. Use the code below to complete your login:</p>
            
            <div class="otp-code">
                <p style="margin: 0; font-size: 1rem; color: #64748b;">Your verification code is:</p>
                <div class="code">{{otpCode}}</div>
                <p style="margin: 0; font-size: 0.875rem; color: #64748b;">This code expires in 5 minutes</p>
            </div>
            
            <div class="security-note">
                <h3 style="margin: 0 0 0.5rem 0; color: #92400e;">🛡️ Security Notice</h3>
                <ul style="margin: 0; padding-left: 1.5rem; font-size: 0.875rem;">
                    <li>Never share this code with anyone</li>
                    <li>Stands Zone will never ask for your OTP via phone or email</li>
                    <li>If you didn't request this code, please ignore this email</li>
                    <li>This code expires in 5 minutes for your security</li>
                </ul>
            </div>
            
            <p style="text-align: center; margin: 2rem 0;">
                <strong>Having trouble?</strong> Copy and paste this code: <span style="background: #f1f5f9; padding: 0.5rem 1rem; border-radius: 4px; font-family: monospace; font-size: 1.2rem;">{{otpCode}}</span>
            </p>
            
            <p>If you didn't request this login code, you can safely ignore this email. Your account remains secure.</p>
            
            <p>Best regards,<br>
            <strong>Stands Zone Security Team</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>Stands Zone</strong> - Secure Access to Your Account</p>
            <p>This is an automated security email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>`,
    textContent: `Hello {{contactPerson}},

You requested a one-time password to access your Stands Zone account.

🔐 **Your verification code**: {{otpCode}}
⏰ **Expires**: 5 minutes

**Security reminders**:
• Never share this code with anyone
• Stands Zone will never ask for your OTP via phone
• If you didn't request this, ignore this email
• Code expires in 5 minutes for security

Having trouble? Copy this code: {{otpCode}}

Best regards,
Stands Zone Security Team

---
This is an automated security email. Please do not reply.`,
    type: 'otp_verification',
    channels: ['email'],
    variables: ['contactPerson', 'otpCode', 'expiryTime']
  },

  {
    id: 'welcome_new_user',
    name: 'Welcome New User',
    subject: '🎉 Welcome to Stands Zone - Your Journey Starts Here!',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Stands Zone</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .welcome-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 1.5rem; margin: 1.5rem 0; border-radius: 4px; }
        .next-steps { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 1.5rem; margin: 1.5rem 0; border-radius: 4px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 1rem 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 2rem; text-align: center; font-size: 0.875rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to Stands Zone!</h1>
            <p>Your journey in the exhibition industry starts here</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{contactPerson}}</strong>,</p>
            
            <p>Welcome to <strong>Stands Zone</strong>! We're thrilled to have you join our community of exhibition professionals.</p>
            
            <div class="welcome-box">
                <h3 style="margin: 0 0 1rem 0; color: #065f46;">🚀 Your Account Details</h3>
                <p style="margin: 0;"><strong>Name:</strong> {{contactPerson}}</p>
                <p style="margin: 0;"><strong>Account Type:</strong> {{userType}}</p>
                <p style="margin: 0;"><strong>Company:</strong> {{companyName}}</p>
            </div>
            
            <div class="next-steps">
                <h3 style="color: #1e40af; margin-top: 0;">🎯 What's Next?</h3>
                <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
                    <div style="border-left: 3px solid #3b82f6; padding-left: 1rem;">
                        <h4 style="margin: 0 0 0.5rem 0;">1. Complete Your Profile</h4>
                        <p style="margin: 0; font-size: 0.875rem; color: #64748b;">Add your company details, services, and portfolio</p>
                    </div>
                    <div style="border-left: 3px solid #8b5cf6; padding-left: 1rem;">
                        <h4 style="margin: 0 0 0.5rem 0;">2. Explore Features</h4>
                        <p style="margin: 0; font-size: 0.875rem; color: #64748b;">Discover how to get leads and grow your business</p>
                    </div>
                    <div style="border-left: 3px solid #f59e0b; padding-left: 1rem;">
                        <h4 style="margin: 0 0 0.5rem 0;">3. Connect with Clients</h4>
                        <p style="margin: 0; font-size: 0.875rem; color: #64748b;">Start receiving inquiries and building relationships</p>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin: 2rem 0;">
                <a href="{{dashboardUrl}}" class="button" style="color: white;">🏠 Access Your Dashboard</a>
            </div>
            
            <p style="background: #dbeafe; padding: 1rem; border-radius: 6px; margin: 1.5rem 0;">
                <strong>💡 Pro Tip:</strong> Complete your profile today to start appearing in search results and receiving your first leads!
            </p>
            
            <p>Need help getting started? Our support team is here to assist you every step of the way. Simply reply to this email with any questions.</p>
            
            <p>Welcome aboard!<br>
            <strong>The Stands Zone Team</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>Stands Zone</strong> - Connecting Exhibition Professionals Worldwide</p>
            <p><a href="{{supportUrl}}" style="color: #64748b;">Contact Support</a> | <a href="{{helpUrl}}" style="color: #64748b;">Help Center</a></p>
        </div>
    </div>
</body>
</html>`,
    textContent: `Hello {{contactPerson}},

Welcome to Stands Zone! We're thrilled to have you join our community of exhibition professionals.

🚀 **Your Account Details**:
• Name: {{contactPerson}}
• Account Type: {{userType}}
• Company: {{companyName}}

🎯 **What's Next?**
1. Complete your profile with company details and portfolio
2. Explore features to grow your business
3. Start connecting with potential clients

**Access your dashboard**: {{dashboardUrl}}

💡 **Pro Tip**: Complete your profile today to start receiving leads!

Need help? Reply to this email with any questions.

Welcome aboard!
The Stands Zone Team

---
Contact Support: {{supportUrl}}
Help Center: {{helpUrl}}`,
    type: 'welcome_new_user',
    channels: ['email'],
    variables: ['contactPerson', 'userType', 'companyName', 'dashboardUrl', 'supportUrl', 'helpUrl']
  },

  {
    id: 'builder_welcome',
    name: 'Builder Welcome & Email Verification',
    subject: '🎉 Welcome to Stands Zone - Verify Your Email to Get Started!',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Stands Zone</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .welcome-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 1.5rem; margin: 1.5rem 0; border-radius: 4px; }
        .verification-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1.5rem; margin: 1.5rem 0; border-radius: 4px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 1rem 0; }
        .verify-button { background: #f59e0b; }
        .footer { background: #1e293b; color: #94a3b8; padding: 2rem; text-align: center; font-size: 0.875rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to Stands Zone!</h1>
            <p>Your exhibition stand building profile is ready</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{contactPerson}}</strong>,</p>
            
            <p>Congratulations! Your builder profile for <strong>{{companyName}}</strong> has been successfully created on Stands Zone. You're now part of our global network of exhibition professionals.</p>
            
            <div class="welcome-box">
                <h3 style="margin: 0 0 1rem 0; color: #065f46;">🚀 Your Profile is Live!</h3>
                <p style="margin: 0;">✅ Your company profile is now visible to potential clients</p>
                <p style="margin: 0;">✅ You can start receiving quote requests immediately</p>
                <p style="margin: 0;">✅ Access your dashboard to manage everything</p>
            </div>
            
            <div class="verification-box">
                <h3 style="margin: 0 0 1rem 0; color: #92400e;">📧 Verify Your Email Address</h3>
                <p style="margin: 0 0 1rem 0;">To ensure account security and enable all features, please verify your email address:</p>
                <div style="text-align: center; margin: 1rem 0;">
                    <a href="{{verificationLink}}" class="button verify-button" style="color: white;">✅ Verify Email Address</a>
                </div>
                <p style="margin: 0; font-size: 0.875rem; color: #92400e;">You can also verify your email later from your profile dashboard.</p>
            </div>
            
            <h3 style="color: #1e40af;">🎯 What's Next?</h3>
            <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
                <div style="border-left: 3px solid #3b82f6; padding-left: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0;">1. Complete Your Profile</h4>
                    <p style="margin: 0; font-size: 0.875rem; color: #64748b;">Add more services, portfolio images, and company details</p>
                </div>
                <div style="border-left: 3px solid #8b5cf6; padding-left: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0;">2. Set Your Availability</h4>
                    <p style="margin: 0; font-size: 0.875rem; color: #64748b;">Update your service locations and project capacity</p>
                </div>
                <div style="border-left: 3px solid #f59e0b; padding-left: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0;">3. Start Receiving Leads</h4>
                    <p style="margin: 0; font-size: 0.875rem; color: #64748b;">Respond quickly to quote requests to build your reputation</p>
                </div>
            </div>
            
            <div style="text-align: center; margin: 2rem 0;">
                <a href="{{dashboardLink}}" class="button" style="color: white;">🏠 Access Your Dashboard</a>
            </div>
            
            <p style="background: #dbeafe; padding: 1rem; border-radius: 6px; margin: 1.5rem 0;">
                <strong>💡 Pro Tip:</strong> Builders who complete their profiles within the first week receive 3x more quote requests!
            </p>
            
            <p>Need help getting started? Our support team is here to assist you. Simply reply to this email or contact us at <a href="mailto:{{supportEmail}}">{{supportEmail}}</a>.</p>
            
            <p>Welcome to the Stands Zone family!<br>
            <strong>The Stands Zone Team</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>Stands Zone</strong> - Connecting Exhibition Professionals Worldwide</p>
            <p><a href="{{dashboardLink}}" style="color: #64748b;">Dashboard</a> | <a href="mailto:{{supportEmail}}" style="color: #64748b;">Support</a></p>
        </div>
    </div>
</body>
</html>`,
    textContent: `Hello {{contactPerson}},

Congratulations! Your builder profile for {{companyName}} has been successfully created on Stands Zone.

🚀 **Your Profile is Live!**
✅ Your company profile is now visible to potential clients
✅ You can start receiving quote requests immediately  
✅ Access your dashboard to manage everything

📧 **Verify Your Email Address**
To ensure account security, please verify your email: {{verificationLink}}

🎯 **What's Next?**
1. Complete your profile with more details and portfolio
2. Set your service locations and availability
3. Start receiving and responding to quote requests

**Access your dashboard**: {{dashboardLink}}

💡 **Pro Tip**: Builders who complete their profiles within the first week receive 3x more quote requests!

Need help? Contact us at {{supportEmail}}

Welcome to the Stands Zone family!
The Stands Zone Team

---
Dashboard: {{dashboardLink}}
Support: {{supportEmail}}`,
    type: 'welcome_new_user',
    channels: ['email'],
    variables: ['contactPerson', 'companyName', 'verificationLink', 'dashboardLink', 'supportEmail']
  }
];

// Helper function to get template by ID
export function getTemplateById(templateId: string): NotificationTemplate | undefined {
  return claimNotificationTemplates.find(template => template.id === templateId);
}

// Helper function to get templates by type
export function getTemplatesByType(type: NotificationTemplate['type']): NotificationTemplate[] {
  return claimNotificationTemplates.filter(template => template.type === type);
}

// Helper function to replace variables in template content
export function replaceTemplateVariables(
  content: string, 
  variables: Record<string, string>
): string {
  let result = content;
  
  // Replace {{variable}} patterns
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
}

// Helper function to get SMS-optimized version of template
export function getSMSContent(template: NotificationTemplate, variables: Record<string, string>): string {
  // For SMS, use a shorter version
  const smsTemplates: Record<string, string> = {
    claim_invitation: `🏗️ Stands Zone: Claim your business profile for {{builderName}} in {{city}}! Get more leads and manage your listing. Claim now: {{claimUrl}}`,
    verification_reminder: `⏰ Stands Zone: Complete your profile verification for {{builderName}}. Verify now: {{verifyUrl}}`,
    plan_upgrade: `🚀 Stands Zone: Special 50% off upgrade offer for {{builderName}}! Boost your visibility. Upgrade: {{upgradeUrl}}`,
    showcase_interest: `⭐ Stands Zone: You're invited to our featured showcase! Showcase your work to 10k+ subscribers. Join: {{participateUrl}}`,
    otp_verification: `🔐 Stands Zone: Your login code is {{otpCode}}. This code expires in 5 minutes. Never share this code with anyone.`,
    welcome_new_user: `🎉 Welcome to Stands Zone, {{contactPerson}}! Your {{userType}} account is ready. Complete your profile to start receiving leads.`
  };
  
  const smsContent = smsTemplates[template.id] || template.textContent.substring(0, 160);
  return replaceTemplateVariables(smsContent, variables);
}
