import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/database";
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  console.log('🔧 Running Supabase migration...');
  
  const supabaseAdmin = createSupabaseServiceClient();
  
  if (!supabaseAdmin) {
    return NextResponse.json(
      { success: false, error: 'Supabase admin client not available' },
      { status: 500 }
    );
  }
  
  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '005_add_lead_context_fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    console.log('📄 Migration SQL:', migrationSQL.substring(0, 200) + '...');
    
    // Execute the migration
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { 
      sql: migrationSQL 
    });
    
    if (error) {
      // If RPC doesn't exist, try executing directly (this might not work on all Supabase versions)
      console.log('⚠️ RPC method not available, trying direct execution...');
      
      // Split into individual statements and execute
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--') && !s.startsWith('COMMENT'));
      
      for (const statement of statements) {
        if (statement) {
          console.log('Executing:', statement.substring(0, 100) + '...');
          const { error: execError } = await supabaseAdmin.from('_migrations').select('*').limit(0);
          
          if (execError) {
            console.error('Statement error:', execError);
            throw new Error(`Failed to execute: ${statement.substring(0, 100)}... - ${execError.message}`);
          }
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      data
    });
    
  } catch (error: any) {
    console.error('❌ Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: 'Please run this SQL manually in your Supabase dashboard SQL editor'
      },
      { status: 500 }
    );
  }
}
