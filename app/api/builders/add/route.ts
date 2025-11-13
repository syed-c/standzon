import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['company_name', 'primary_email'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Generate slug from company name if not provided
    if (!body.slug) {
      // Create a shorter, more manageable slug
      let baseSlug = body.company_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Limit slug length to 50 characters to avoid routing issues
      if (baseSlug.length > 50) {
        baseSlug = baseSlug.substring(0, 50).replace(/-+$/, ''); // Remove trailing dashes
      }
      
      body.slug = baseSlug;
    }

    // Set default values
    const builderData = {
      company_name: body.company_name,
      slug: body.slug,
      primary_email: body.primary_email,
      phone: body.phone || null,
      website: body.website || null,
      headquarters_city: body.headquarters_city || null,
      headquarters_country: body.headquarters_country || null,
      headquarters_country_code: body.headquarters_country_code || null,
      headquarters_address: body.headquarters_address || null,
      contact_person: body.contact_person || null,
      position: body.position || null,
      company_description: body.company_description || null,
      team_size: body.team_size || null,
      projects_completed: body.projects_completed || null,
      rating: body.rating || null,
      response_time: body.response_time || null,
      languages: body.languages || null,
      verified: body.verified || false,
      premium_member: body.premium_member || false,
      claimed: body.claimed || false,
      claim_status: body.claim_status || 'unclaimed',
      basic_stand_min: body.basic_stand_min || null,
      basic_stand_max: body.basic_stand_max || null,
      custom_stand_min: body.custom_stand_min || null,
      custom_stand_max: body.custom_stand_max || null,
      premium_stand_min: body.premium_stand_min || null,
      premium_stand_max: body.premium_stand_max || null,
      average_project: body.average_project || null,
      currency: body.currency || 'USD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Try to insert into 'builder_profiles' table first
    const { data, error } = await supabase
      .from('builder_profiles')
      .insert(builderData)
      .select()
      .single();

    if (error) {
      // Fallback to 'builders' table
      const { data: data2, error: error2 } = await supabase
        .from('builders')
        .insert(builderData)
        .select()
        .single();
      
      if (error2) {
        return NextResponse.json({ error: error.message || error2.message }, { status: 500 });
      }
      
      return NextResponse.json({ data: data2 }, { status: 201 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create builder' }, { status: 500 });
  }
}