import { NextRequest, NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

// Smart email claiming system for GMB profiles
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('🔐 GMB Profile Claim Request:', data);
    
    const { 
      profileId, 
      emailPrefix, 
      websiteDomain, 
      claimMethod, 
      phoneNumber,
      businessName 
    } = data;
    
    // Validate required fields
    if (!profileId || !claimMethod) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: profileId, claimMethod'
      }, { status: 400 });
    }
    
    // Handle email claiming
    if (claimMethod === 'email') {
      if (!emailPrefix || !websiteDomain) {
        return NextResponse.json({
          success: false,
          error: 'Email prefix and website domain are required for email claiming'
        }, { status: 400 });
      }
      
      // Construct the business email
      const businessEmail = `${emailPrefix}@${websiteDomain}`;
      
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      console.log(`📧 Sending OTP to business email: ${businessEmail}`);
      console.log(`🔑 OTP Code: ${otp}`);
      
      // In production, send actual email here
      // await sendClaimVerificationEmail(businessEmail, otp, businessName);
      
      // Store claim attempt temporarily
      const claimAttempt = {
        profileId,
        businessEmail,
        otp,
        claimMethod: 'email',
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        status: 'pending'
      };
      
      console.log('✅ Claim attempt stored:', claimAttempt);
      
      return NextResponse.json({
        success: true,
        message: `Verification email sent to ${businessEmail}`,
        data: {
          claimId: `claim_${Date.now()}_${profileId}`,
          email: businessEmail,
          expiresIn: 15 * 60, // 15 minutes in seconds
          verificationMethod: 'email'
        }
      });
    }
    
    // Handle phone claiming
    if (claimMethod === 'phone') {
      if (!phoneNumber) {
        return NextResponse.json({
          success: false,
          error: 'Phone number is required for phone claiming'
        }, { status: 400 });
      }
      
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      console.log(`📱 Sending OTP to phone: ${phoneNumber}`);
      console.log(`🔑 OTP Code: ${otp}`);
      
      // In production, send actual SMS here
      // await sendClaimVerificationSMS(phoneNumber, otp, businessName);
      
      // Store claim attempt temporarily
      const claimAttempt = {
        profileId,
        phoneNumber,
        otp,
        claimMethod: 'phone',
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        status: 'pending'
      };
      
      console.log('✅ Claim attempt stored:', claimAttempt);
      
      return NextResponse.json({
        success: true,
        message: `Verification SMS sent to ${phoneNumber}`,
        data: {
          claimId: `claim_${Date.now()}_${profileId}`,
          phone: phoneNumber,
          expiresIn: 15 * 60, // 15 minutes in seconds
          verificationMethod: 'phone'
        }
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid claim method. Use "email" or "phone"'
    }, { status: 400 });
    
  } catch (error) {
    console.error('❌ GMB Profile Claim Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process profile claim'
    }, { status: 500 });
  }
}

// Verify OTP and complete claim
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('🔐 GMB Profile Claim Verification:', data);
    
    const { claimId, otp, userDetails } = data;
    
    if (!claimId || !otp) {
      return NextResponse.json({
        success: false,
        error: 'Claim ID and OTP are required'
      }, { status: 400 });
    }
    
    // In production, verify OTP against stored claim attempt
    // const claimAttempt = await getClaimAttempt(claimId);
    
    // Mock verification - in production, check against actual stored OTP
    if (otp.length === 6) {
      console.log('✅ OTP verified successfully');
      
      // ✅ NEW: Handle unified profile claiming - link ALL locations to single account
      const profileId = claimId.split('_')[2];
      console.log('🔄 Processing unified profile claim for:', profileId);
      
      // ✅ Use the new unified claiming API
      const claimResult = unifiedPlatformAPI.claimUnifiedProfile(profileId, {
        claimedBy: userDetails || {},
        businessEmail: userDetails?.email || '',
        businessPhone: userDetails?.phone || ''
      }, 'website');
      
      if (claimResult.success) {
        console.log('🎉 Unified profile claimed successfully:', claimResult.data);
        
        return NextResponse.json({
          success: true,
          message: `Profile claimed successfully! ${claimResult.data.locationsLinked} location(s) linked to your account.`,
          data: {
            profileId: claimResult.data.profileId,
            claimStatus: 'claimed',
            claimedAt: claimResult.data.claimedAt,
            locationsLinked: claimResult.data.locationsLinked,
            allLocations: claimResult.data.allLocations,
            dashboardUrl: `/builder/dashboard?profileId=${claimResult.data.profileId}`,
            unifiedAccount: true
          }
        });
      } else {
        console.error('❌ Failed to claim unified profile:', claimResult.error);
        return NextResponse.json({
          success: false,
          error: claimResult.error || 'Failed to claim profile'
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid OTP. Please try again.'
    }, { status: 400 });
    
  } catch (error) {
    console.error('❌ GMB Profile Claim Verification Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to verify profile claim'
    }, { status: 500 });
  }
}

// Function removed - now using unifiedPlatformAPI.claimUnifiedProfile

// ✅ NEW: Enhanced business matching for claiming (more permissive than regular deduplication)
function isSameBusinessForClaiming(targetBuilder: any, compareBuilder: any): boolean {
  // Don't match with self
  if (targetBuilder.id === compareBuilder.id) {
    return false;
  }
  
  // Only match GMB imported profiles
  if (!targetBuilder.gmbImported || !compareBuilder.gmbImported) {
    return false;
  }
  
  // 1. Phone number match (most reliable)
  const phone1 = targetBuilder.contactInfo?.phone?.replace(/\D/g, '');
  const phone2 = compareBuilder.contactInfo?.phone?.replace(/\D/g, '');
  
  if (phone1 && phone2 && phone1.length >= 7 && phone2.length >= 7) {
    if (phone1.includes(phone2) || phone2.includes(phone1)) {
      console.log(`📞 Phone match for claiming: ${phone1} vs ${phone2}`);
      return true;
    }
  }
  
  // 2. Website domain match
  const domain1 = (targetBuilder as any).websiteDomain?.toLowerCase();
  const domain2 = (compareBuilder as any).websiteDomain?.toLowerCase();
  
  if (domain1 && domain2 && domain1 !== 'unknown.com' && domain2 !== 'unknown.com' && domain1 === domain2) {
    console.log(`🌐 Domain match for claiming: ${domain1}`);
    return true;
  }
  
  // 3. Very similar business names (higher threshold for claiming)
  const name1 = targetBuilder.companyName?.toLowerCase().trim();
  const name2 = compareBuilder.companyName?.toLowerCase().trim();
  
  if (name1 && name2) {
    // Simple exact match or one contains the other
    if (name1 === name2 || name1.includes(name2) || name2.includes(name1)) {
      console.log(`📝 Name match for claiming: ${name1} vs ${name2}`);
      return true;
    }
  }
  
  return false;
}