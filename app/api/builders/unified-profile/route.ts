import { NextRequest, NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

// Enhanced API for unified builder profile management
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const builderId = searchParams.get('id');
    const email = searchParams.get('email');
    
    console.log('🔍 Unified Profile API - GET request:', { builderId, email });
    
    if (!builderId && !email) {
      return NextResponse.json({
        success: false,
        error: 'Builder ID or email is required'
      }, { status: 400 });
    }
    
    // Get builder from unified platform
    let builder = null;
    
    if (builderId) {
      builder = unifiedPlatformAPI.getBuilderById(builderId);
    } else if (email) {
      const allBuilders = unifiedPlatformAPI.getBuilders();
      builder = allBuilders.find(b => 
        b.contactInfo?.primaryEmail === email || 
        (b as any).email === email
      );
    }
    
    if (!builder) {
      return NextResponse.json({
        success: false,
        error: 'Builder profile not found'
      }, { status: 404 });
    }
    
    const b: any = builder;
    
    // Transform to unified profile structure
    const unifiedProfile = {
      id: b.id,
      companyName: b.companyName,
      slug: b.slug,
      contactName: b.contactInfo?.contactPerson || b.contactName,
      email: b.contactInfo?.primaryEmail || b.email,
      phone: b.contactInfo?.phone || b.phone,
      website: b.contactInfo?.website || b.website,
      description: b.companyDescription || b.description,
      logo: b.logo || '/images/builders/default-logo.png',
      
      establishedYear: b.establishedYear,
      businessType: b.businessType || 'company',
      teamSize: b.teamSize,
      yearsOfExperience: b.yearsOfExperience || 5,
      projectsCompleted: b.projectsCompleted,
      
      headquarters: b.headquarters || {
        country: 'United States',
        city: 'Las Vegas',
        address: '123 Business Street',
        postalCode: '12345'
      },
      
      services: b.services || [],
      serviceLocations: b.serviceLocations || [],
      specializations: b.specializations?.map((s: any) => s.name || s) || [],
      
      verified: b.verified || false,
      claimed: b.claimed || false,
      subscriptionPlan: b.planType || 'free',
      subscriptionExpiry: b.subscriptionExpiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      
      profileViews: Math.floor(Math.random() * 500) + 100,
      leadCount: Math.floor(Math.random() * 10) + 2,
      responseRate: Math.floor(Math.random() * 30) + 70,
      rating: b.rating || 4.0,
      reviewCount: b.reviewCount || 0,
      
      createdAt: b.createdAt || new Date().toISOString(),
      lastUpdated: b.lastUpdated || new Date().toISOString(),
      source: b.source || 'registration'
    };
    
    console.log('✅ Unified profile retrieved:', unifiedProfile.companyName);
    
    return NextResponse.json({
      success: true,
      data: unifiedProfile
    });
    
  } catch (error) {
    console.error('❌ Error retrieving unified profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { builderId, updates } = data;
    
    console.log('🔄 Unified Profile API - PUT request:', { builderId, updates });
    
    if (!builderId) {
      return NextResponse.json({
        success: false,
        error: 'Builder ID is required'
      }, { status: 400 });
    }
    
    // Get current builder
    const currentBuilder = unifiedPlatformAPI.getBuilderById(builderId);
    if (!currentBuilder) {
      return NextResponse.json({
        success: false,
        error: 'Builder not found'
      }, { status: 404 });
    }
    
    // Transform updates to unified platform format
    const transformedUpdates: any = { ...updates };
    
    // Handle nested updates
    if (updates.headquarters) {
      transformedUpdates.headquarters = {
        ...currentBuilder.headquarters,
        ...updates.headquarters
      };
    }
    
    if (updates.services) {
      transformedUpdates.services = updates.services.map((service: any) => ({
        id: service.id || service.name?.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: service.name,
        description: service.description,
        category: service.category || 'Design',
        priceRange: service.priceRange,
        popular: service.popular || true,
        turnoverTime: service.turnoverTime || '4-6 weeks'
      }));
    }
    
    if (updates.serviceLocations) {
      transformedUpdates.serviceLocations = updates.serviceLocations.map((location: any) => ({
        country: location.country,
        cities: location.cities || [],
        countryCode: location.country?.slice(0, 2).toUpperCase(),
        active: true
      }));
    }
    
    // Add timestamp
    transformedUpdates.lastUpdated = new Date().toISOString();
    
    // Update using unified platform API
    const result = unifiedPlatformAPI.updateBuilder(builderId, transformedUpdates, 'website');
    
    if (result.success) {
      console.log('✅ Unified profile updated successfully');
      
      // Trigger public listing refresh
      try {
        await refreshPublicListings(builderId);
      } catch (refreshError) {
        console.log('⚠️ Could not refresh public listings:', refreshError);
      }
      
      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to update profile'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Error updating unified profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('🆕 Unified Profile API - POST request (new profile):', data);
    
    // Create new unified builder profile
    const unifiedBuilderData = {
      id: data.id || `unified_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      companyName: data.companyName,
      slug: data.slug || data.companyName?.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      
      // Contact Information
      contactInfo: {
        primaryEmail: data.primaryEmail || data.email,
        phone: data.phoneNumber || data.phone,
        website: data.website,
        contactPerson: data.contactName,
        position: data.contactTitle
      },
      
      // Business Details
      establishedYear: data.establishedYear,
      businessType: data.businessType,
      teamSize: data.teamSize,
      projectsCompleted: data.projectsCompleted,
      
      // Location
      headquarters: data.headquarters || {
        country: data.country,
        city: data.city,
        address: data.address,
        postalCode: data.postalCode,
        countryCode: data.country?.slice(0, 2).toUpperCase(),
        latitude: 0,
        longitude: 0,
        isHeadquarters: true
      },
      
      // Services & Specializations
      services: data.services || [],
      serviceLocations: data.serviceLocations || [],
      specializations: data.specializations?.map((spec: string) => ({
        name: spec,
        slug: spec.toLowerCase().replace(/[^a-z0-9]/g, '-')
      })) || [],
      
      // Profile Details
      companyDescription: data.companyDescription,
      logo: data.logo || '/images/builders/default-logo.png',
      
      // Account Status
      verified: data.emailVerified || false,
      claimed: true,
      planType: data.subscriptionPlan || 'free',
      
      // Meta
      source: data.source || 'unified_registration',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      
      // Additional fields for compatibility
      rating: 4.0,
      reviewCount: 0,
      responseTime: 'Within 24 hours',
      languages: ['English'],
      premiumMember: false,
      keyStrengths: data.specializations?.slice(0, 3) || []
    };
    
    // Add to unified platform
    const result: any = await unifiedPlatformAPI.addBuilder(unifiedBuilderData as any, 'website');
    
    if (result.success) {
      console.log('✅ New unified profile created successfully');
      
      return NextResponse.json({
        success: true,
        message: 'Unified profile created successfully',
        data: {
          id: result.data.id,
          companyName: result.data.companyName,
          slug: result.data.slug,
          createdAt: result.data.createdAt
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to create profile'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Error creating unified profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Helper function to refresh public listings
async function refreshPublicListings(builderId: string) {
  try {
    // This would trigger a refresh of all public listing pages
    // where this builder appears (city pages, country pages, etc.)
    console.log('🔄 Refreshing public listings for builder:', builderId);
    
    // In production, this might:
    // 1. Clear relevant caches
    // 2. Regenerate static pages
    // 3. Update search indices
    // 4. Notify CDN of changes
    
    return true;
  } catch (error) {
    console.error('❌ Error refreshing public listings:', error);
    return false;
  }
}