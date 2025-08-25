import { NextRequest, NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';
import { hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { builderId, password, companyName } = await request.json();
    
    console.log('🔑 Setting up password for builder:', builderId);
    
    if (!builderId || !password || !companyName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: builderId, password, or companyName'
      }, { status: 400 });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 8 characters long'
      }, { status: 400 });
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json({
        success: false,
        error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }, { status: 400 });
    }
    
    // Get the builder
    const builder = unifiedPlatformAPI.getBuilderById(builderId);
    if (!builder) {
      return NextResponse.json({
        success: false,
        error: 'Builder not found'
      }, { status: 404 });
    }
    
    // Hash password securely
    const hashedPassword = await hash(password, 12);
    
    // Update builder with password and dashboard access
    const updateResult = unifiedPlatformAPI.updateBuilder(builderId, {
      dashboardAccess: true,
      accountSetupComplete: true,
      setupCompletedAt: new Date().toISOString(),
      loginEnabled: true,
      claimStatus: 'verified',
      claimed: true,
      verified: true,
      // Store password hash securely
      authData: {
        password: hashedPassword,
        setupAt: new Date().toISOString(),
        lastPasswordChange: new Date().toISOString()
      }
    } as any);
    
    if (updateResult.success) {
      console.log('✅ Password setup completed for builder:', companyName);
      
      return NextResponse.json({
        success: true,
        message: 'Password setup completed successfully',
        data: {
          builderId: builderId,
          companyName: companyName,
          loginEnabled: true,
          loginEmail: builder.contactInfo.primaryEmail
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: updateResult.error || 'Failed to update builder'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Password setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during password setup'
    }, { status: 500 });
  }
}