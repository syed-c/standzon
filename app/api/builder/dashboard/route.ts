import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const builderId = searchParams.get('builderId');

    if (!builderId) {
      return NextResponse.json(
        { success: false, error: 'Builder ID is required' },
        { status: 400 }
      );
    }

    // Get builder profile first - try Supabase, fallback to admin API
    let builder = null;
    let builderError = null;

    try {
      console.log('🔍 Fetching builder profile from Supabase for ID:', builderId);
      const { data: builderData, error: error } = await supabase
        .from('builder_profiles')
        .select('*')
        .eq('id', builderId)
        .single();

      if (error) {
        console.log('❌ Supabase builder fetch failed, trying admin API:', error);
        builderError = error;
      } else {
        console.log('✅ Builder profile found in Supabase:', {
          id: builderData.id,
          company_name: builderData.company_name,
          description: builderData.company_description,
          phone: builderData.phone,
          team_size: builderData.team_size
        });
        builder = builderData;
      }
    } catch (error) {
      console.log('❌ Supabase connection failed, trying admin API:', error);
      builderError = error;
    }

    // Fallback to admin API if Supabase fails
    if (!builder && builderError) {
      try {
        const adminResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/builders?limit=100&prioritize_real=true`);
        const adminData = await adminResponse.json();
        
        if (adminData.success && adminData.data?.builders?.length > 0) {
          builder = adminData.data.builders.find((b: any) => b.id === builderId);
        }
      } catch (adminError) {
        console.error('Admin API fallback failed:', adminError);
      }
    }

    if (!builder) {
      return NextResponse.json(
        { success: false, error: 'Builder not found' },
        { status: 404 }
      );
    }

    // Get leads for this builder (with error handling)
    let leads = [];
    try {
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('builder_id', builderId)
        .order('created_at', { ascending: false });

      if (!leadsError && leadsData) {
        leads = leadsData;
      }
    } catch (error) {
      console.log('Leads table not found, using empty array');
      leads = [];
    }

    // Process service locations - try from Supabase table first, then from builder data
    const serviceLocations: Array<{country: string, cities: string[]}> = [];
    
    try {
      const { data: serviceLocationsData } = await supabase
        .from('builder_service_locations')
        .select('*')
        .eq('builder_id', builderId);

      console.log(`🔍 Service locations from database for builder ${builderId}:`, serviceLocationsData);

      if (serviceLocationsData && serviceLocationsData.length > 0) {
        const countryMap = new Map<string, string[]>();
        serviceLocationsData.forEach((loc: any) => {
          if (loc.country && loc.city) {
            if (!countryMap.has(loc.country)) {
              countryMap.set(loc.country, []);
            }
            countryMap.get(loc.country)!.push(loc.city);
          }
        });
        
        countryMap.forEach((cities: string[], country: string) => {
          serviceLocations.push({
            country,
            cities: [...new Set(cities)] // Remove duplicates
          });
        });
        console.log(`✅ Processed service locations:`, serviceLocations);
      } else {
        console.log(`⚠️ No service locations found in database for builder ${builderId}`);
      }
    } catch (error) {
      console.log('Service locations table not found, trying builder data:', error);
      
      // Fallback to service locations from builder data
      if (builder.serviceLocations && Array.isArray(builder.serviceLocations)) {
        console.log(`📋 Using service locations from builder data:`, builder.serviceLocations);
        serviceLocations.push(...builder.serviceLocations);
      } else {
        console.log(`⚠️ No service locations in builder data either`);
      }
    }

    // Process services - try from Supabase table first, then from builder data
    let services = [];
    try {
      const { data: servicesData } = await supabase
        .from('builder_services')
        .select('*')
        .eq('builder_id', builderId);
      
      services = servicesData || [];
    } catch (error) {
      console.log('Services table not found, trying builder data');
      
      // Fallback to services from builder data
      if (builder.services && Array.isArray(builder.services)) {
        services = builder.services;
      }
    }

    // Process subscription
    let subscription = {
      plan: 'free',
      status: 'active',
      end_date: null
    };
    try {
      const { data: subscriptionData } = await supabase
        .from('builder_subscriptions')
        .select('*')
        .eq('builder_id', builderId)
        .single();
      
      if (subscriptionData) {
        subscription = subscriptionData;
      }
    } catch (error) {
      console.log('Subscriptions table not found, using default');
    }

    // Format the response
    const dashboardData = {
      id: builder.id,
      companyName: builder.company_name,
      slug: builder.slug,
      logo: builder.logo || '/images/builders/default-logo.png',
      description: (() => {
        let desc = builder.company_description || '';
        // Remove SERVICE_LOCATIONS JSON from description
        desc = desc.replace(/\n\nSERVICE_LOCATIONS:.*$/g, '');
        desc = desc.replace(/SERVICE_LOCATIONS:.*$/g, '');
        desc = desc.trim();
        return desc || 'No description available';
      })(),
      establishedYear: builder.established_year || new Date().getFullYear(),
      teamSize: builder.team_size || 0,
      projectsCompleted: builder.projects_completed || 0,
      rating: builder.rating || 0,
      reviewCount: builder.review_count || 0,
      verified: !!builder.verified,
      claimed: !!builder.claimed,
      headquarters: {
        city: builder.headquarters_city || 'Unknown',
        country: builder.headquarters_country || 'Unknown',
        address: builder.headquarters_address || ''
      },
      contactInfo: {
        primaryEmail: builder.primary_email || '',
        phone: builder.phone || '',
        website: builder.website || '',
        contactPerson: builder.contact_person || '',
        position: builder.position || ''
      },
      serviceLocations: serviceLocations.length > 0 ? serviceLocations : [
        {
          country: builder.headquarters_country || 'Unknown',
          cities: [builder.headquarters_city || 'Unknown']
        }
      ],
      services,
      subscription: {
        plan: subscription.plan || 'free',
        status: subscription.status || 'active',
        expiry: subscription.end_date || null
      },
      subscriptionPlan: subscription.plan || 'free',
      subscriptionExpiry: subscription.end_date || null,
      leads: leads || []
    };

    console.log('📊 Dashboard data being returned:', {
      id: dashboardData.id,
      companyName: dashboardData.companyName,
      description: dashboardData.description,
      teamSize: dashboardData.teamSize,
      phone: dashboardData.contactInfo.phone
    });

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Error in dashboard API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
