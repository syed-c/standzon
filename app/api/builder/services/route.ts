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

    // Get services for this builder
    const { data: services, error } = await supabase
      .from('builder_services')
      .select('*')
      .eq('builder_id', builderId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching services:', error);
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
      category: 'CUSTOM_DESIGN', // Default category since it's not in the schema
      priceFrom: service.price_range ? service.price_range.split(' ')[0] : null,
      currency: service.price_range ? service.price_range.split(' ')[1] : 'USD',
      unit: service.price_range ? service.price_range.split(' ').slice(2).join(' ') : 'per project',
      locations: service.locations || []
    }));

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

    // Create new service - map fields to match database schema
    const serviceInsertData = {
      builder_id: builderId,
      name: service.name,
      description: service.description,
      price_range: service.priceFrom ? `${service.priceFrom} ${service.currency} ${service.unit}` : null,
      locations: [], // Will be populated separately if needed
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('builder_services')
      .insert(serviceInsertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create service' },
        { status: 500 }
      );
    }

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
