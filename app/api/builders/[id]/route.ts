import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from('builder_profiles')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      // Try the 'builders' table as fallback
      const { data: data2, error: error2 } = await supabase
        .from('builders')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (error2) {
        return NextResponse.json({ error: error.message || error2.message }, { status: 500 });
      }
      
      return NextResponse.json({ data: data2 }, { status: 200 });
    }

    if (!data) {
      // Try the 'builders' table as fallback
      const { data: data2, error: error2 } = await supabase
        .from('builders')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (error2 || !data2) {
        return NextResponse.json({ error: 'Builder not found' }, { status: 404 });
      }
      
      return NextResponse.json({ data: data2 }, { status: 200 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch builder' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    
    // Remove fields that shouldn't be updated directly
    const { id, created_at, ...updateData } = body;
    
    // Set updated timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('builder_profiles')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      // Try the 'builders' table as fallback
      const { data: data2, error: error2 } = await supabase
        .from('builders')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single();
      
      if (error2) {
        return NextResponse.json({ error: error.message || error2.message }, { status: 500 });
      }
      
      return NextResponse.json({ data: data2 }, { status: 200 });
    }

    if (!data) {
      // Try the 'builders' table as fallback
      const { data: data2, error: error2 } = await supabase
        .from('builders')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single();
      
      if (error2 || !data2) {
        return NextResponse.json({ error: 'Builder not found' }, { status: 404 });
      }
      
      return NextResponse.json({ data: data2 }, { status: 200 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update builder' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // First try to delete from 'builder_profiles' table
    const { error } = await supabase
      .from('builder_profiles')
      .delete()
      .eq('id', params.id);

    if (error) {
      // Try the 'builders' table as fallback
      const { error: error2 } = await supabase
        .from('builders')
        .delete()
        .eq('id', params.id);
      
      if (error2) {
        return NextResponse.json({ error: error.message || error2.message }, { status: 500 });
      }
      
      return NextResponse.json({ message: 'Builder deleted successfully' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Builder deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete builder' }, { status: 500 });
  }
}