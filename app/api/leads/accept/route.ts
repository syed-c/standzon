import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  console.log('🤝 Lead acceptance API called');
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const leadId = searchParams.get('leadId');
    const builderEmail = searchParams.get('builderEmail');
    
    console.log('📋 Lead acceptance data:', { leadId, builderEmail });
    
    if (!leadId || !builderEmail) {
      console.error('❌ Missing required parameters');
      return NextResponse.redirect(new URL('/builder/dashboard?error=invalid-link', request.url));
    }
    
    // Store the lead acceptance intent
    await recordLeadAcceptance(leadId, builderEmail);
    
    // Redirect to builder login with return URL
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnTo', `/builder/dashboard?acceptedLead=${leadId}`);
    loginUrl.searchParams.set('builderEmail', builderEmail);
    loginUrl.searchParams.set('action', 'accept-lead');
    
    console.log('🔄 Redirecting to login:', loginUrl.toString());
    
    return NextResponse.redirect(loginUrl);
    
  } catch (error) {
    console.error('❌ Lead acceptance error:', error);
    return NextResponse.redirect(new URL('/builder/dashboard?error=acceptance-failed', request.url));
  }
}

// Store lead acceptance in memory (in production, this would be database)
async function recordLeadAcceptance(leadId: string, builderEmail: string) {
  console.log('💾 Recording lead acceptance:', { leadId, builderEmail });
  
  try {
    if (typeof globalThis !== 'undefined') {
      if (!globalThis.exhibitBayLeadAcceptances) {
        globalThis.exhibitBayLeadAcceptances = [];
      }
      
      const acceptance = {
        leadId,
        builderEmail,
        acceptedAt: new Date().toISOString(),
        status: 'ACCEPTED'
      };
      
      // Remove any existing acceptance for this lead/builder combo
      globalThis.exhibitBayLeadAcceptances = globalThis.exhibitBayLeadAcceptances.filter(
        (acc: any) => !(acc.leadId === leadId && acc.builderEmail === builderEmail)
      );
      
      // Add new acceptance
      globalThis.exhibitBayLeadAcceptances.push(acceptance);
      
      console.log(`✅ Lead acceptance recorded. Total acceptances: ${globalThis.exhibitBayLeadAcceptances.length}`);
    }
  } catch (error) {
    console.error('❌ Error recording lead acceptance:', error);
  }
}

export async function POST(request: NextRequest) {
  return GET(request); // Handle both GET and POST for flexibility
}