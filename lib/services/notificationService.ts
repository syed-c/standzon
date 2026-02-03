// Enhanced Notification Service for Builder Profile Claims
// Handles email templates, SMS notifications, and internal system alerts

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'claim_invitation' | 'verification_reminder' | 'plan_upgrade' | 'showcase_interest' | 'welcome' | 'otp_verification';
  variables: string[];
}

interface NotificationData {
  builderId: string;
  companyName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  claimUrl?: string;
  verificationUrl?: string;
  upgradeUrl?: string;
  showcaseUrl?: string;
  otpCode?: string;
  [key: string]: any;
}

interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  sentAt: string;
  method: 'email' | 'sms' | 'internal';
}

export class NotificationService {
  private static instance: NotificationService;
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';

  // Enhanced email templates with professional design
  private emailTemplates: NotificationTemplate[] = [
    {
      id: 'claim_invitation',
      name: 'Profile Claim Invitation',
      subject: 'Claim Your Business Profile - Get More Exhibition Leads! 🎯',
      type: 'claim_invitation',
      variables: ['companyName', 'city', 'country', 'claimUrl', 'contactPerson'],
      content: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claim Your Business Profile</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎯 Claim Your Business Profile</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Unlock Your Exhibition Business Potential</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">Hello {{contactPerson}},</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Great news! We've discovered your business in our comprehensive exhibition directory:
            </p>

            <!-- Business Info Card -->
            <div style="background: #f8fafc; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                        <span style="color: white; font-size: 20px;">🏢</span>
                    </div>
                    <div>
                        <h3 style="margin: 0; color: #1f2937; font-size: 18px; font-weight: bold;">{{companyName}}</h3>
                        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">📍 {{city}}, {{country}}</p>
                    </div>
                </div>
                <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
                        ⚠️ Current Status: <strong>Unclaimed Profile</strong>
                    </p>
                </div>
            </div>

            <!-- Benefits Section -->
            <div style="margin: 30px 0;">
                <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px;">🚀 Claim Your Profile to Unlock:</h3>
                
                <div style="display: grid; gap: 15px;">
                    <div style="display: flex; align-items: flex-start;">
                        <div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; margin-top: 2px;">
                            <span style="color: white; font-size: 12px; font-weight: bold;">✓</span>
                        </div>
                        <div>
                            <strong style="color: #1f2937; font-size: 15px;">Direct Lead Management</strong>
                            <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 14px;">Respond directly to customer inquiries and quote requests</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start;">
                        <div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; margin-top: 2px;">
                            <span style="color: white; font-size: 12px; font-weight: bold;">✓</span>
                        </div>
                        <div>
                            <strong style="color: #1f2937; font-size: 15px;">Priority Search Placement</strong>
                            <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 14px;">Get featured prominently when customers search in your area</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start;">
                        <div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; margin-top: 2px;">
                            <span style="color: white; font-size: 12px; font-weight: bold;">✓</span>
                        </div>
                        <div>
                            <strong style="color: #1f2937; font-size: 15px;">Analytics & Insights</strong>
                            <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 14px;">Track views, inquiries, and conversion rates</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start;">
                        <div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; margin-top: 2px;">
                            <span style="color: white; font-size: 12px; font-weight: bold;">✓</span>
                        </div>
                        <div>
                            <strong style="color: #1f2937; font-size: 15px;">Profile Customization</strong>
                            <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 14px;">Upload portfolio images, update services, and showcase your work</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{claimUrl}}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.4);">
                    🔐 Claim Your Profile Now
                </a>
                <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">⏱️ Takes less than 2 minutes with instant verification</p>
            </div>

            <!-- Trust Indicators -->
            <div style="background: #f0f9ff; border: 1px solid #0284c7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h4 style="margin: 0 0 10px 0; color: #0c4a6e; font-size: 16px;">🔒 Secure & Trusted Process</h4>
                <ul style="margin: 0; padding-left: 20px; color: #075985; font-size: 14px;">
                    <li>Verified business ownership through OTP</li>
                    <li>No spam or unwanted marketing</li>
                    <li>Cancel anytime with one click</li>
                    <li>Trusted by 1000+ exhibition businesses</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Questions? Reply to this email or visit our help center.
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                The Exhibition Platform Team<br>
                Connecting businesses with exhibition opportunities worldwide
            </p>
        </div>
    </div>
</body>
</html>`
    },
    {
      id: 'verification_reminder',
      name: 'Verification Reminder',
      subject: 'Complete Your Profile Verification - Don\'t Miss Out! ⏰',
      type: 'verification_reminder',
      variables: ['companyName', 'contactPerson', 'verificationUrl', 'claimStarted'],
      content: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Your Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 26px; font-weight: bold;">⏰ Complete Your Verification</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">You're Almost There!</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">Hello {{contactPerson}},</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                You started claiming your business profile but haven't completed the verification yet. Don't let this opportunity slip away!
            </p>

            <!-- Business Status Card -->
            <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px;">📋 Verification Status</h3>
                <div style="display: grid; gap: 10px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #78350f; font-weight: 500;">Business:</span>
                        <span style="color: #78350f; font-weight: bold;">{{companyName}}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #78350f; font-weight: 500;">Started:</span>
                        <span style="color: #78350f;">{{claimStarted}}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #78350f; font-weight: 500;">Status:</span>
                        <span style="background: #fbbf24; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">⏳ VERIFICATION PENDING</span>
                    </div>
                </div>
            </div>

            <!-- Urgency Message -->
            <div style="background: #fee2e2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <div style="display: flex; align-items: center;">
                    <span style="font-size: 24px; margin-right: 12px;">⚠️</span>
                    <div>
                        <h4 style="margin: 0 0 5px 0; color: #dc2626; font-size: 16px;">Time-Sensitive: Verification Expires Soon</h4>
                        <p style="margin: 0; color: #991b1b; font-size: 14px;">Your verification code expires in 24 hours. Complete now to secure your profile!</p>
                    </div>
                </div>
            </div>

            <!-- What You're Missing -->
            <div style="margin: 30px 0;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">💰 What You're Missing Out On:</h3>
                <div style="background: #f0f9ff; border-radius: 8px; padding: 20px;">
                    <ul style="margin: 0; padding-left: 20px; color: #0c4a6e; font-size: 14px; line-height: 1.6;">
                        <li><strong>Immediate lead notifications</strong> - Get instant alerts when customers inquire</li>
                        <li><strong>Higher search ranking</strong> - Verified profiles appear first in search results</li>
                        <li><strong>Customer trust</strong> - Verified badge increases conversion by 40%</li>
                        <li><strong>Professional credibility</strong> - Stand out from unverified competitors</li>
                    </ul>
                </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{verificationUrl}}" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; text-decoration: none; padding: 18px 36px; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.4);">
                    🚀 Complete Verification Now
                </a>
                <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">⏱️ Less than 60 seconds to complete</p>
            </div>

            <!-- Help Section -->
            <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">❓ Need Help?</h4>
                <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
                    Having trouble with verification? Simply reply to this email and our team will assist you personally within 2 hours.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                This verification link is secure and expires in 24 hours.
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                The Exhibition Platform Team<br>
                Helping businesses succeed in the exhibition industry
            </p>
        </div>
    </div>
</body>
</html>`
    },
    {
      id: 'plan_upgrade',
      name: 'Plan Upgrade Offer',
      subject: 'Unlock Premium Features - 50% OFF Limited Time! 💎',
      type: 'plan_upgrade',
      variables: ['companyName', 'contactPerson', 'upgradeUrl'],
      content: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Upgrade Offer</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">💎 Unlock Premium Features</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Special 50% OFF Limited Time Offer</p>
        </div>

        <!-- Congratulations Banner -->
        <div style="background: #d1fae5; border: 2px solid #10b981; border-radius: 12px; padding: 20px; margin: 30px;">
            <div style="text-align: center;">
                <span style="font-size: 32px;">🎉</span>
                <h2 style="margin: 10px 0 5px 0; color: #059669; font-size: 20px;">Congratulations {{contactPerson}}!</h2>
                <p style="margin: 0; color: #047857; font-size: 16px;">You've successfully claimed your profile for <strong>{{companyName}}</strong></p>
            </div>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Now that you're verified, it's time to supercharge your business with our premium features designed specifically for exhibition professionals like you.
            </p>

            <!-- Current vs Premium Comparison -->
            <div style="margin: 30px 0;">
                <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; text-align: center;">🚀 See What Premium Unlocks</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0;">
                    <!-- Free Plan -->
                    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                        <h4 style="margin: 0 0 15px 0; color: #6b7280; font-size: 16px; text-align: center;">Current: Free Plan</h4>
                        <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 1.8;">
                            <li>Basic profile listing</li>
                            <li>Limited contact info</li>
                            <li>Standard search placement</li>
                            <li>Basic portfolio (3 images)</li>
                            <li>Email notifications</li>
                        </ul>
                    </div>
                    
                    <!-- Premium Plan -->
                    <div style="border: 2px solid #8b5cf6; border-radius: 8px; padding: 20px; background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);">
                        <h4 style="margin: 0 0 15px 0; color: #7c3aed; font-size: 16px; text-align: center; font-weight: bold;">💎 Premium Plan</h4>
                        <ul style="margin: 0; padding-left: 20px; color: #6b46c1; font-size: 14px; line-height: 1.8; font-weight: 500;">
                            <li>🔥 Priority search placement</li>
                            <li>📊 Advanced analytics dashboard</li>
                            <li>🎨 Custom profile branding</li>
                            <li>📸 Unlimited portfolio images</li>
                            <li>📞 Direct contact integration</li>
                            <li>⭐ Featured listing badge</li>
                            <li>📈 Lead conversion tracking</li>
                            <li>🎯 Targeted promotion</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- ROI Section -->
            <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 25px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #059669; font-size: 18px; text-align: center;">💰 ROI Guarantee</h3>
                <div style="text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #047857; font-size: 16px; font-weight: 500;">Premium users get on average:</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 20px 0;">
                        <div style="text-align: center;">
                            <div style="font-size: 28px; font-weight: bold; color: #059669;">300%</div>
                            <div style="font-size: 12px; color: #047857;">More Profile Views</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 28px; font-weight: bold; color: #059669;">5x</div>
                            <div style="font-size: 12px; color: #047857;">More Inquiries</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 28px; font-weight: bold; color: #059669;">40%</div>
                            <div style="font-size: 12px; color: #047857;">Higher Conversion</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Special Offer -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 22px;">🎁 EXCLUSIVE OFFER</h3>
                <p style="margin: 0 0 15px 0; color: #78350f; font-size: 18px; font-weight: bold;">50% OFF Your First 3 Months!</p>
                <div style="margin: 20px 0;">
                    <div style="text-decoration: line-through; color: #92400e; font-size: 16px;">Regular Price: $49/month</div>
                    <div style="color: #dc2626; font-size: 24px; font-weight: bold;">Special Price: $24.50/month</div>
                    <div style="color: #78350f; font-size: 14px; margin-top: 5px;">Save $73.50 in your first 3 months!</div>
                </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{upgradeUrl}}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 18px 36px; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 6px 20px 0 rgba(139, 92, 246, 0.4);">
                    💎 Upgrade to Premium Now
                </a>
                <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">⏰ This offer expires in 7 days • Cancel anytime</p>
            </div>

            <!-- Trust & Guarantee -->
            <div style="background: #f0f9ff; border: 1px solid #0284c7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h4 style="margin: 0 0 10px 0; color: #0c4a6e; font-size: 16px;">🛡️ 30-Day Money-Back Guarantee</h4>
                <p style="margin: 0; color: #075985; font-size: 14px; line-height: 1.5;">
                    Not satisfied with premium features? Get a full refund within 30 days, no questions asked. Join 1000+ successful exhibition businesses already using Premium.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Questions about premium features? Reply to this email for personalized assistance.
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                The Exhibition Platform Team<br>
                Empowering exhibition businesses worldwide
            </p>
        </div>
    </div>
</body>
</html>`
    },
    {
      id: 'showcase_interest',
      name: 'Showcase Participation Interest',
      subject: 'Invitation: Feature Your Work in Our Global Showcase! 🌟',
      type: 'showcase_interest',
      variables: ['companyName', 'contactPerson', 'showcaseUrl', 'deadline'],
      content: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Showcase Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🌟 Global Showcase Invitation</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Exclusive Opportunity for {{companyName}}</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">Dear {{contactPerson}},</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                We're impressed with <strong>{{companyName}}</strong> and would love to feature your exceptional work in our upcoming <strong>Global Exhibition Showcase</strong>!
            </p>

            <!-- Selection Notice -->
            <div style="background: #dbeafe; border: 2px solid #3b82f6; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
                <span style="font-size: 32px;">🎯</span>
                <h3 style="margin: 10px 0 5px 0; color: #1e40af; font-size: 20px;">You've Been Selected!</h3>
                <p style="margin: 0; color: #1e3a8a; font-size: 16px;">Based on your profile quality and work excellence, you're among our top candidates</p>
            </div>

            <!-- Showcase Benefits -->
            <div style="margin: 30px 0;">
                <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">🚀 Showcase Benefits Include:</h3>
                
                <div style="display: grid; gap: 15px;">
                    <div style="display: flex; align-items: flex-start; padding: 15px; background: #f0f9ff; border-radius: 8px;">
                        <div style="width: 30px; height: 30px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; margin-top: 2px;">
                            <span style="color: white; font-size: 14px;">🌟</span>
                        </div>
                        <div>
                            <strong style="color: #1e40af; font-size: 16px;">Homepage Feature</strong>
                            <p style="margin: 2px 0 0 0; color: #1e3a8a; font-size: 14px;">Your best work displayed prominently on our homepage for 30 days</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start; padding: 15px; background: #ecfdf5; border-radius: 8px;">
                        <div style="width: 30px; height: 30px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; margin-top: 2px;">
                            <span style="color: white; font-size: 14px;">📸</span>
                        </div>
                        <div>
                            <strong style="color: #059669; font-size: 16px;">Professional Photography</strong>
                            <p style="margin: 2px 0 0 0; color: #047857; font-size: 14px;">FREE professional booth photography at your next exhibition (worth $2,000)</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start; padding: 15px; background: #fef3c7; border-radius: 8px;">
                        <div style="width: 30px; height: 30px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; margin-top: 2px;">
                            <span style="color: white; font-size: 14px;">📰</span>
                        </div>
                        <div>
                            <strong style="color: #92400e; font-size: 16px;">Press Coverage & Marketing</strong>
                            <p style="margin: 2px 0 0 0; color: #78350f; font-size: 14px;">Featured articles, social media promotion, and industry publication mentions</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start; padding: 15px; background: #fce7f3; border-radius: 8px;">
                        <div style="width: 30px; height: 30px; background: #ec4899; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; margin-top: 2px;">
                            <span style="color: white; font-size: 14px;">🔗</span>
                        </div>
                        <div>
                            <strong style="color: #be185d; font-size: 16px;">High-Quality Backlinks</strong>
                            <p style="margin: 2px 0 0 0; color: #9d174d; font-size: 14px;">Premium backlinks to boost your website's SEO and search rankings</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start; padding: 15px; background: #f3e8ff; border-radius: 8px;">
                        <div style="width: 30px; height: 30px; background: #8b5cf6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; margin-top: 2px;">
                            <span style="color: white; font-size: 14px;">🎯</span>
                        </div>
                        <div>
                            <strong style="color: #7c3aed; font-size: 16px;">Increased Lead Generation</strong>
                            <p style="margin: 2px 0 0 0; color: #6b46c1; font-size: 14px;">Showcase participants see 400% increase in qualified leads</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Exclusivity -->
            <div style="background: #fee2e2; border: 2px solid #ef4444; border-radius: 12px; padding: 25px; margin: 30px 0;">
                <div style="text-align: center;">
                    <span style="font-size: 28px;">⚡</span>
                    <h3 style="margin: 10px 0 5px 0; color: #dc2626; font-size: 20px;">Limited Opportunity</h3>
                    <p style="margin: 0 0 15px 0; color: #991b1b; font-size: 16px;">Only <strong>20 builders</strong> will be selected globally</p>
                    <div style="background: #dc2626; color: white; padding: 10px 20px; border-radius: 6px; display: inline-block; font-weight: bold;">
                        Application Deadline: {{deadline}}
                    </div>
                </div>
            </div>

            <!-- Social Proof -->
            <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h4 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">💬 What Previous Participants Say:</h4>
                <div style="border-left: 4px solid #3b82f6; padding-left: 15px; margin: 15px 0;">
                    <p style="margin: 0 0 5px 0; color: #4b5563; font-style: italic; font-size: 14px;">
                        "Being featured in the showcase brought us 15 new high-value clients in just 30 days. Best marketing investment we've made."
                    </p>
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">— Sarah Chen, Premium Exhibition Builders</p>
                </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{showcaseUrl}}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; padding: 18px 36px; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 6px 20px 0 rgba(245, 158, 11, 0.4);">
                    🌟 Apply for Showcase Now
                </a>
                <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">⏰ Applications close on {{deadline}} - Don't miss out!</p>
            </div>

            <!-- Next Steps -->
            <div style="background: #f0f9ff; border: 1px solid #0284c7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h4 style="margin: 0 0 10px 0; color: #0c4a6e; font-size: 16px;">📋 Simple Application Process:</h4>
                <ol style="margin: 0; padding-left: 20px; color: #075985; font-size: 14px; line-height: 1.6;">
                    <li>Submit your best 5 exhibition booth photos</li>
                    <li>Brief description of your most impressive project</li>
                    <li>Client testimonial or case study (optional)</li>
                    <li>Our team reviews and contacts selected participants</li>
                </ol>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Questions about the showcase? Reply to this email for more information.
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                The Exhibition Platform Team<br>
                Showcasing excellence in the exhibition industry
            </p>
        </div>
    </div>
</body>
</html>`
    }
  ];

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Send notification using template
  public async sendNotification(
    templateId: string,
    data: NotificationData,
    method: 'email' | 'sms' | 'internal' = 'email'
  ): Promise<NotificationResult> {
    try {
      console.log(`📧 Sending ${method} notification using template: ${templateId} to builder: ${data.builderId}`);

      const template = this.emailTemplates.find(t => t.id === templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      // Generate dynamic URLs
      const enhancedData = {
        ...data,
        claimUrl: `${this.baseUrl}/builders/${data.builderId}?action=claim`,
        verificationUrl: `${this.baseUrl}/builders/${data.builderId}?action=verify`,
        upgradeUrl: `${this.baseUrl}/subscription?builder=${data.builderId}`,
        showcaseUrl: `${this.baseUrl}/showcase/apply?builder=${data.builderId}`,
        claimStarted: new Date().toLocaleDateString(),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      };

      // Replace template variables
      const subject = this.replaceVariables(template.subject, enhancedData);
      const content = this.replaceVariables(template.content, enhancedData);

      let result: NotificationResult;

      if (method === 'email') {
        result = await this.sendEmail(data.email || '', subject, content);
      } else if (method === 'sms') {
        result = await this.sendSMS(data.phone || '', this.htmlToText(content));
      } else {
        result = await this.sendInternalNotification(data.builderId, subject, content);
      }

      // Log notification
      await this.logNotification({
        builderId: data.builderId,
        templateId,
        method,
        subject,
        status: result.success ? 'sent' : 'failed',
        sentAt: result.sentAt,
        error: result.error
      });

      return result;
    } catch (error) {
      console.error('❌ Notification sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        sentAt: new Date().toISOString(),
        method
      };
    }
  }

  // Send bulk notifications
  public async sendBulkNotifications(
    templateId: string,
    builders: NotificationData[],
    method: 'email' | 'sms' | 'internal' = 'email'
  ): Promise<{ sent: number; failed: number; results: NotificationResult[] }> {
    console.log(`📧 Sending bulk ${method} notifications to ${builders.length} builders using template: ${templateId}`);

    const results = await Promise.all(
      builders.map(builder => this.sendNotification(templateId, builder, method))
    );

    const sent = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`✅ Bulk notification complete: ${sent} sent, ${failed} failed`);

    return { sent, failed, results };
  }

  // Replace template variables
  private replaceVariables(template: string, data: NotificationData): string {
    let result = template;
    
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value || ''));
    });

    return result;
  }

  // Send email (simulated - integrate with real service)
  private async sendEmail(email: string, subject: string, content: string): Promise<NotificationResult> {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simulate 95% success rate
    if (Math.random() > 0.05) {
      console.log(`📧 [SIMULATED EMAIL SENT]`);
      console.log(`To: ${email}`);
      console.log(`Subject: ${subject}`);
      
      return {
        success: true,
        messageId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sentAt: new Date().toISOString(),
        method: 'email'
      };
    } else {
      return {
        success: false,
        error: 'Email service temporarily unavailable',
        sentAt: new Date().toISOString(),
        method: 'email'
      };
    }
  }

  // Send SMS (simulated - integrate with real service)
  private async sendSMS(phone: string, message: string): Promise<NotificationResult> {
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));

    // Simulate 92% success rate
    if (Math.random() > 0.08) {
      console.log(`📱 [SIMULATED SMS SENT]`);
      console.log(`To: ${phone}`);
      console.log(`Message: ${message.substring(0, 100)}...`);
      
      return {
        success: true,
        messageId: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sentAt: new Date().toISOString(),
        method: 'sms'
      };
    } else {
      return {
        success: false,
        error: 'SMS service temporarily unavailable',
        sentAt: new Date().toISOString(),
        method: 'sms'
      };
    }
  }

  // Send internal notification
  private async sendInternalNotification(builderId: string, subject: string, content: string): Promise<NotificationResult> {
    console.log(`🔔 [INTERNAL NOTIFICATION] Builder: ${builderId}, Subject: ${subject}`);
    
    return {
      success: true,
      messageId: `internal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sentAt: new Date().toISOString(),
      method: 'internal'
    };
  }

  // Convert HTML to text for SMS
  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 1600); // SMS length limit
  }

  // Log notification
  private async logNotification(log: any): Promise<void> {
    if (typeof global !== 'undefined') {
      if (!global.notificationLogs) {
        global.notificationLogs = [];
      }
      global.notificationLogs.push({
        ...log,
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Get templates
  public getTemplates(): NotificationTemplate[] {
    return this.emailTemplates;
  }

  // Get template by ID
  public getTemplate(id: string): NotificationTemplate | undefined {
    return this.emailTemplates.find(t => t.id === id);
  }

  // Update template
  public updateTemplate(id: string, updates: Partial<NotificationTemplate>): boolean {
    const index = this.emailTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.emailTemplates[index] = { ...this.emailTemplates[index], ...updates };
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();