import { NextRequest, NextResponse } from 'next/server';
import { UserManager } from '@/lib/auth/config';
import { claimNotificationService } from '@/lib/email/emailService';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      userType,
      companyName,
      // Additional builder data
      country,
      city,
      address,
      postalCode,
      establishedYear,
      teamSize,
      yearsOfExperience,
      projectsCompleted,
      companyDescription,
      website,
      services,
      serviceCountries,
      serviceCities,
      specializations
    } = await request.json();

    console.log('📝 Registration attempt:', { email, userType, firstName, lastName });

    // Validation
    if (!email || !password || !firstName || !lastName || !phone || !userType) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
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

    // Check if user already exists
    const existingUser = await UserManager.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'An account with this email already exists'
      }, { status: 409 });
    }

    // For builders, also check if email exists in builder profiles (both in-memory and Supabase)
    if (userType === 'builder') {
      // Check in-memory first
      const builders = unifiedPlatformAPI.getBuilders();
      const existingBuilder = builders.find(b => 
        b.contactInfo?.primaryEmail?.toLowerCase() === email.toLowerCase()
      );
      
      if (existingBuilder) {
        return NextResponse.json({
          success: false,
          error: 'A builder profile with this email already exists'
        }, { status: 409 });
      }

      // Also check Supabase
      try {
        const { getServerSupabase } = await import('@/lib/supabase');
        const sb = getServerSupabase();
        if (sb) {
          const { data: supabaseBuilder } = await sb
            .from('builder_profiles')
            .select('id, primary_email')
            .eq('primary_email', email)
            .single();
          
          if (supabaseBuilder) {
            return NextResponse.json({
              success: false,
              error: 'A builder profile with this email already exists'
            }, { status: 409 });
          }
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase duplicate check failed (non-fatal):', supabaseError);
        // Continue with registration if Supabase check fails
      }
    }

    // Create user
    const newUser = await UserManager.createUser({
      email,
      password,
      name: `${firstName} ${lastName}`,
      role: userType === 'builder' ? 'builder' : 'client',
      companyName: companyName || undefined,
      phone,
      country: 'Unknown' // Can be updated later in profile
    });

    console.log('✅ User created successfully:', { id: newUser.id, email: newUser.email });

    // If user is a builder, create builder profile in unified platform
    if (userType === 'builder' && companyName) {
      // Generate a proper UUID for Supabase compatibility
      const builderId = crypto.randomUUID();
      
      // sanitize slug: collapse non-alphanumerics to '-' and trim leading/trailing '-'
      const sanitizedSlug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const builderProfile = {
        id: builderId,
        companyName,
        slug: sanitizedSlug,
        contactInfo: {
          primaryEmail: email,
          contactPerson: `${firstName} ${lastName}`,
          phone,
          website: website || null
        },
        headquarters: {
          city: city || 'Unknown',
          country: country || 'Unknown',
          countryCode: country ? country.slice(0, 2).toUpperCase() : 'US',
          address: address || '',
          latitude: 0,
          longitude: 0,
          isHeadquarters: true
        },
        serviceLocations: [
          {
            city: city || 'Unknown',
            country: country || 'Unknown',
            countryCode: country ? country.slice(0, 2).toUpperCase() : 'US',
            address: address || '',
            latitude: 0,
            longitude: 0,
            isHeadquarters: true
          }
        ],
        rating: 0,
        reviewCount: 0,
        projectsCompleted: projectsCompleted || 0,
        responseTime: 'New to platform',
        verified: false,
        claimed: true, // Auto-claimed since user registered
        claimStatus: 'verified',
        claimedAt: new Date().toISOString(),
        claimedBy: email,
        planType: 'free',
        premiumMember: false,
        specializations: specializations || [],
        keyStrengths: [],
        companyDescription: companyDescription || `${companyName} - Professional exhibition stand builder`,
        services: services || [],
        portfolio: [],
        tradeshowExperience: [],
        establishedYear: establishedYear || new Date().getFullYear(),
        teamSize: teamSize || 0,
        hashedPassword: Buffer.from(password).toString('base64'), // Simple hashing for demo
        createdAt: new Date().toISOString(),
        registeredViaForm: true,
        authUserId: newUser.id
      };

      console.log('🏗️ Creating builder profile:', { builderId, companyName });
      
      // Add builder to unified platform (in-memory) - will be normalized internally and persisted to Supabase
      console.log('🔄 Calling unifiedPlatformAPI.addBuilder...');
      const addResult = await unifiedPlatformAPI.addBuilder(builderProfile as any);
      console.log('📊 addBuilder result:', addResult);
      
      console.log('✅ Builder profile created in unified platform');
    }

    // Send welcome email
    try {
      await claimNotificationService.sendClaimNotification(
        'welcome_new_user',
        { email, name: `${firstName} ${lastName}` },
        { 
          companyName: companyName || 'ExhibitBay',
          contactPerson: `${firstName} ${lastName}`,
          userType: userType === 'builder' ? 'Builder' : 'Client'
        },
        ['email']
      );
      console.log('✅ Welcome email sent successfully');
    } catch (emailError) {
      console.error('⚠️ Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during registration'
    }, { status: 500 });
  }
}