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

    console.log('🔍 GET services request for builder:', builderId);

    if (!builderId) {
      return NextResponse.json(
        { success: false, error: 'Builder ID is required' },
        { status: 400 }
      );
    }

    // Get services for this builder
    const { data: services, error } = await supabase
      .from('builder_services')
      .select('*')
      .eq('builder_id', builderId)
      .order('created_at', { ascending: false });

    console.log('📊 Raw services from database:', services);
    console.log('📊 Database error:', error);

    if (error) {
      console.error('❌ Error fetching services:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch services' },
        { status: 500 }
      );
    }

    // Map the data to match frontend expectations
    const mappedServices = (services || []).map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category || 'CUSTOM_DESIGN',
      priceFrom: service.price_from ? service.price_from.toString() : null,
      currency: service.currency || 'USD',
      unit: service.unit || 'per project',
      locations: [] // Not stored in this schema
    }));

    console.log('✅ Mapped services for frontend:', mappedServices);

    return NextResponse.json({
      success: true,
      data: mappedServices
    });

  } catch (error) {
    console.error('Error in services API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const serviceData = await request.json();
    const { builderId, ...service } = serviceData;

    if (!builderId) {
      return NextResponse.json(
        { success: false, error: 'Builder ID is required' },
        { status: 400 }
      );
    }

    // Map category to enum value
    const categoryMap: Record<string, string> = {
      'Storage': 'STORAGE',
      'Custom Design': 'CUSTOM_DESIGN',
      'Modular Systems': 'MODULAR_SYSTEMS',
      'Portable Displays': 'PORTABLE_DISPLAYS',
      'Installation': 'INSTALLATION',
      'Transportation': 'TRANSPORTATION',
      'Graphics': 'GRAPHICS',
      'Lighting': 'LIGHTING',
      'Furniture': 'FURNITURE',
      'AV Equipment': 'AV_EQUIPMENT'
    };

    // Create new service - map fields to match database schema
    const serviceInsertData = {
      builder_id: builderId,
      name: service.name,
      description: service.description,
      category: categoryMap[service.category] || 'CUSTOM_DESIGN', // Required field
      price_from: service.priceFrom ? parseFloat(service.priceFrom) : null,
      currency: service.currency || 'USD',
      unit: service.unit || 'per project',
      popular: false,
      turnover_time: '4-6 weeks'
    };

    console.log('🛠️ Creating service with data:', serviceInsertData);

    const { data, error } = await supabase
      .from('builder_services')
      .insert(serviceInsertData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating service:', error);
      return NextResponse.json(
        { success: false, error: `Failed to create service: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Service created successfully:', data);

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in services create API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { serviceId, ...updateData } = await request.json();

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Update service
    const { data, error } = await supabase
      .from('builder_services')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceId)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update service' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in services update API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Delete service
    const { error } = await supabase
      .from('builder_services')
      .delete()
      .eq('id', serviceId);

    if (error) {
      console.error('Error deleting service:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete service' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Error in services delete API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
