import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/supabase/database";
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  console.log('🔧 Running Supabase migration...');
  
  const dbService = new DatabaseService();
  
  try {
    // Read migration files
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
    
    console.log(`Found ${sqlFiles.length} migration files`);
    
    // Execute each migration
    for (const file of sqlFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`Executing migration: ${file}`);
      
      // Execute SQL using RPC
      const { data, error } = await dbService.rpc('exec_sql', { 
        sql: sql 
      });
      
      if (error) {
        console.error(`Error executing migration ${file}:`, error);
        return NextResponse.json({ 
          success: false, 
          error: `Migration failed: ${file} - ${error.message}` 
        });
      }
      
      console.log(`Successfully executed migration: ${file}`);
    }
    
    // Test connection by querying a table
    try {
      const { error: execError } = await dbService.from('_migrations').select('*').limit(0);
      if (execError) {
        console.warn('Warning: Could not verify database connection:', execError);
      } else {
        console.log('✅ Database connection verified successfully');
      }
    } catch (verifyError) {
      console.warn('Warning: Could not verify database connection:', verifyError);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully executed ${sqlFiles.length} migrations` 
    });
    
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Unknown error occurred during migration' 
    });
  }
}