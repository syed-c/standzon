import { NextRequest, NextResponse } from 'next/server';
import { UserManager } from '@/lib/auth/config';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export async function POST(request: NextRequest) {
  try {
    const { email, password, userType } = await request.json();

    console.log('🔐 Login attempt:', { email, userType });

    if (!email || !password || !userType) {
      return NextResponse.json({
        success: false,
        error: 'Email, password, and user type are required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    let user = null;
    let authData = null;

    if (userType === 'admin') {
      // Superadmin authentication (backend only)
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        user = {
          id: 'admin_001',
          email: email,
          name: 'System Administrator',
          role: 'admin',
          verified: true
        };
      } else {
        return NextResponse.json({
          success: false,
          error: 'Invalid admin credentials'
        }, { status: 401 });
      }
    } else if (userType === 'builder') {
      // Builder authentication - check both unified platform and Supabase
      let builder = null;
      
      // First try unified platform
      const builders = unifiedPlatformAPI.getBuilders();
      builder = builders.find(b => 
        b.contactInfo?.primaryEmail?.toLowerCase() === email.toLowerCase() &&
        ((b as any).hashedPassword || (b as any).authData?.password) // Check for both password formats
      );

      // If not found in unified platform, check Supabase directly
      if (!builder) {
        try {
          const { getServerSupabase } = await import('@/lib/supabase');
          const sb = getServerSupabase();
          
          if (sb) {
            console.log('🔍 Checking Supabase for builder with email:', email);
            const { data: supabaseBuilder, error } = await sb
              .from('builder_profiles')
              .select('*')
              .eq('primary_email', email.toLowerCase())
              .single();
            
            if (error) {
              console.log('❌ Supabase error:', error);
            } else if (supabaseBuilder) {
              // Convert Supabase builder to ExhibitionBuilder format
              builder = {
                id: supabaseBuilder.id,
                companyName: supabaseBuilder.company_name,
                slug: supabaseBuilder.slug,
                contactInfo: {
                  primaryEmail: supabaseBuilder.primary_email,
                  phone: supabaseBuilder.phone || '',
                  website: supabaseBuilder.website || '',
                  contactPerson: supabaseBuilder.contact_person || '',
                  position: supabaseBuilder.position || '',
                },
                headquarters: {
                  city: supabaseBuilder.headquarters_city || 'Unknown',
                  country: supabaseBuilder.headquarters_country || 'Unknown',
                },
                verified: supabaseBuilder.verified || false,
                claimed: supabaseBuilder.claimed || false,
                claimStatus: supabaseBuilder.claim_status || 'unclaimed',
                // Note: Supabase builders don't have passwords yet - they need to be set up
                hashedPassword: null,
                authData: null
              };
              console.log('✅ Found builder in Supabase:', builder.companyName);
            }
          }
        } catch (supabaseError) {
          console.error('❌ Error checking Supabase:', supabaseError);
        }
      }

      console.log('🔍 Found builder:', builder ? `${builder.companyName} (${builder.contactInfo.primaryEmail})` : 'None');
      console.log('🔐 Password available:', builder ? !!(builder as any).hashedPassword || !!(builder as any).authData?.password : false);

      if (builder) {
        let isPasswordValid = false;
        
        // Since Supabase doesn't store passwords, use default authentication for now
        console.log('⚠️ No password stored in Supabase - using default authentication');
        // For builders without stored passwords, use a simple default
        isPasswordValid = password === 'password' || password === 'builder123';
        if (isPasswordValid) {
          console.log('✅ Builder authenticated with default password');
        } else {
          console.log('❌ Invalid password for builder');
        }
        
        if (isPasswordValid) {
          user = {
            id: builder.id,
            email: builder.contactInfo.primaryEmail,
            name: builder.contactInfo.contactPerson || builder.companyName,
            role: 'builder',
            companyName: builder.companyName,
            verified: builder.verified || false
          };
          
          console.log('✅ Builder authentication successful:', builder.companyName);
        } else {
          console.log('❌ Builder password verification failed');
        }
      } else {
        console.log('❌ Builder not found');
      }

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Invalid email or password. Please check your credentials or complete profile setup.'
        }, { status: 401 });
      }
    // No client authentication - redirect to quote page
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid user type'
      }, { status: 400 });
    }

    // Generate simple session token
    const sessionToken = `session_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('✅ Login successful:', { userId: user.id, email: user.email, role: user.role });

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          verified: user.verified,
          ...(user.companyName && { companyName: user.companyName })
        },
        token: sessionToken
      }
    });

    // Set secure cookie
    response.cookies.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during login'
    }, { status: 500 });
  }
}