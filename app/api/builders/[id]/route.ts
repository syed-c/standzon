import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase as anonSupabase } from '@/lib/supabase/client';

const supabase = supabaseAdmin || anonSupabase;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('builder_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Try the 'builders' table as fallback
      const { data: data2, error: error2 } = await supabase
        .from('builders')
        .select('*')
        .eq('id', id)
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
        .eq('id', id)
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const body = await request.json();
    
    // Remove fields that shouldn't be updated directly
    const { id, created_at, ...updateData } = body;
    
    // Set updated timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('builder_profiles')
      .update(updateData)
      .eq('id', paramId)
      .select()
      .single();

    if (error) {
      // Try the 'builders' table as fallback
      const { data: data2, error: error2 } = await supabase
        .from('builders')
        .update(updateData)
        .eq('id', paramId)
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
        .eq('id', paramId)
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    // First try to delete from 'builder_profiles' table
    const { error } = await supabase
      .from('builder_profiles')
      .delete()
      .eq('id', paramId);

    if (error) {
      // Try the 'builders' table as fallback
      const { error: error2 } = await supabase
        .from('builders')
        .delete()
        .eq('id', paramId);
      
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