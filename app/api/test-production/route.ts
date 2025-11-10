import { NextResponse } from 'next/server';

export async function GET() {
  // Check the Supabase URL in the environment
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  // Check if it has the correct domain (without the typo)
  const hasCorrectDomain = supabaseUrl && supabaseUrl.includes('elipzumpfnzmzifrcnl');
  const hasTypoDomain = supabaseUrl && supabaseUrl.includes('elipizumpfnzmzifrcnl');
  
  // Check other important environment variables
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasAnonKey = !!(process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  return NextResponse.json({ 
    success: true, 
    message: 'Production API test working',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    supabaseConfig: {
      supabaseUrl: supabaseUrl ? '[REDACTED]' : null,
      hasCorrectDomain,
      hasTypoDomain,
      hasServiceKey,
      hasAnonKey
    },
    urlCheck: {
      correct: 'elipzumpfnzmzifrcnl',
      typo: 'elipizumpfnzmzifrcnl'
    }
  });
}