



// Lead Routing and Assignment Service
// Automatically matches and assigns leads to qualified builders

import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';
import { IntelligentQuoteMatchingEngine } from './intelligentQuoteMatching';
import { claimNotificationService } from '@/lib/email/emailService';

interface LeadAssignment {
  leadId: string;
  builderId: string;
  builderEmail: string;
  matchScore: number;
  assignedAt: string;
  notificationSent: boolean;
}

interface RoutingResult {
  success: boolean;
  leadId: string;
  assignmentsCreated: number;
  notificationsSent: number;
  matchedBuilders: string[];
  errors?: string[];
}

export class LeadRoutingService {
  
  /**
   * Main lead routing function - called when a new lead is submitted
   */
  static async routeNewLead(leadId: string): Promise<RoutingResult> {
    console.log('🎯 Starting lead routing for:', leadId);
    
    try {
      // Get the lead details
      const leads = unifiedPlatformAPI.getLeads();
      const lead = leads.find(l => l.id === leadId);
      
      if (!lead) {
        return {
          success: false,
          leadId,
          assignmentsCreated: 0,
          notificationsSent: 0,
          matchedBuilders: [],
          errors: ['Lead not found']
        };
      }

      // Find qualified builders
      const qualifiedBuilders = await this.findQualifiedBuilders(lead);
      
      if (qualifiedBuilders.length === 0) {
        console.log('⚠️ No qualified builders found for lead:', leadId);
        return {
          success: true,
          leadId,
          assignmentsCreated: 0,
          notificationsSent: 0,
          matchedBuilders: [],
          errors: ['No qualified builders in the area']
        };
      }

      // Create assignments
      const assignments = await this.createLeadAssignments(lead, qualifiedBuilders);
      
      // Send notifications to builders
      const notificationResults = await this.notifyBuilders(lead, assignments);
      
      // Update lead with assignment information
      const updatedLead = {
        ...lead,
        assignedBuilders: assignments.map(a => a.builderId),
        builderEmails: assignments.map(a => a.builderEmail),
        matchingBuilders: assignments.length,
        routedAt: new Date().toISOString(),
        status: 'routed'
      };
      
      unifiedPlatformAPI.updateLead(leadId, updatedLead);
      
      console.log(`✅ Lead routing completed: ${assignments.length} builders assigned, ${notificationResults.sent} notifications sent`);
      
      return {
        success: true,
        leadId,
        assignmentsCreated: assignments.length,
        notificationsSent: notificationResults.sent,
        matchedBuilders: assignments.map(a => a.builderId),
        errors: notificationResults.errors
      };
      
    } catch (error) {
      console.error('❌ Lead routing failed:', error);
      return {
        success: false,
        leadId,
        assignmentsCreated: 0,
        notificationsSent: 0,
        matchedBuilders: [],
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Find builders qualified for this lead
   */
  private static async findQualifiedBuilders(lead: any): Promise<any[]> {
    console.log('🔍 Finding qualified builders for lead in:', lead.city, lead.country);
    
    // ✅ FIXED: Use synchronous getBuilders method
    const allBuilders = unifiedPlatformAPI.getBuilders();
    
    // Filter builders based on service areas and availability
    const qualifiedBuilders = allBuilders.filter(builder => {
      // Check service locations
      const hasServiceArea = builder.serviceLocations?.some((location: any) => 
        location.city.toLowerCase() === lead.city?.toLowerCase() ||
        location.country.toLowerCase() === lead.country?.toLowerCase()
      );
      
      if (!hasServiceArea) return false;
      
      // Check if builder is active and verified
      if (!builder.verified || builder.status === 'inactive') return false;
      
      // Check if builder has capacity (not overloaded with leads)
      const currentLeads = this.getBuilderCurrentLeads(builder.id);
      const maxLeads = this.getMaxLeadsForPlan(builder.plan || builder.planType || 'free');
      
      if (currentLeads >= maxLeads) return false;
      
      return true;
    });
    
    // Sort by match score and premium status
    qualifiedBuilders.sort((a, b) => {
      // Premium members get priority
      if (a.premiumMember && !b.premiumMember) return -1;
      if (!a.premiumMember && b.premiumMember) return 1;
      
      // Then by rating
      return (b.rating || 0) - (a.rating || 0);
    });
    
    // Return top 8 builders maximum
    const selectedBuilders = qualifiedBuilders.slice(0, 8);
    
    console.log(`✅ Found ${selectedBuilders.length} qualified builders out of ${allBuilders.length} total`);
    
    return selectedBuilders;
  }

  /**
   * Create lead assignments
   */
  private static async createLeadAssignments(lead: any, builders: any[]): Promise<LeadAssignment[]> {
    console.log('📋 Creating lead assignments for', builders.length, 'builders');
    
    const assignments: LeadAssignment[] = [];
    
    for (const builder of builders) {
      const matchScore = this.calculateMatchScore(builder, lead);
      
      const assignment: LeadAssignment = {
        leadId: lead.id,
        builderId: builder.id,
        builderEmail: builder.contactEmail || builder.contactInfo?.primaryEmail || '',
        matchScore,
        assignedAt: new Date().toISOString(),
        notificationSent: false
      };
      
      assignments.push(assignment);
    }
    
    // Store assignments in unified platform (as part of lead data)
    assignments.forEach(assignment => {
      console.log(`📝 Created assignment: ${assignment.builderId} -> ${assignment.leadId} (${assignment.matchScore}% match)`);
    });
    
    return assignments;
  }

  /**
   * Send notifications to assigned builders
   */
  private static async notifyBuilders(lead: any, assignments: LeadAssignment[]): Promise<{
    sent: number;
    errors: string[];
  }> {
    console.log('📧 Sending notifications to', assignments.length, 'builders');
    
    let sent = 0;
    const errors: string[] = [];
    
    for (const assignment of assignments) {
      try {
        // Get builder details
        const builders = unifiedPlatformAPI.getBuilders();
        const builder = builders.find(b => b.id === assignment.builderId);
        
        if (!builder) {
          errors.push(`Builder ${assignment.builderId} not found`);
          continue;
        }
        
        const builderEmail = builder.contactEmail || builder.contactInfo?.primaryEmail;
        if (!builderEmail) {
          errors.push(`No email found for builder ${assignment.builderId}`);
          continue;
        }
        
        // Prepare notification data
        const notificationData = {
          builderName: builder.companyName,
          builderEmail: builderEmail,
          leadId: lead.id,
          projectName: lead.tradeShowName || 'Exhibition Project',
          clientCompany: lead.companyName || 'Client Company',
          location: `${lead.city}, ${lead.country}`,
          budget: lead.budget || 'Not specified',
          eventDate: lead.eventDate || 'TBD',
          standSize: lead.standSize || 'Standard',
          matchScore: assignment.matchScore.toString(),
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/builder/dashboard`,
          leadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/builder/dashboard?tab=leads&leadId=${lead.id}`
        };
        
        // Send email notification
        const result = await claimNotificationService.sendClaimNotification(
          'lead_notification',
          {
            email: builderEmail,
            name: builder.companyName
          },
          notificationData,
          ['email']
        );
        
        if (result[0]?.success) {
          assignment.notificationSent = true;
          sent++;
          console.log(`✅ Notification sent to ${builderEmail}`);
        } else {
          errors.push(`Failed to notify ${builderEmail}: ${result[0]?.error}`);
        }
        
      } catch (error) {
        const errorMsg = `Error notifying builder ${assignment.builderId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error('❌', errorMsg);
      }
    }
    
    console.log(`📊 Notification summary: ${sent} sent, ${errors.length} errors`);
    
    return { sent, errors };
  }

  /**
   * Calculate match score between builder and lead
   */
  private static calculateMatchScore(builder: any, lead: any): number {
    let score = 60; // Base score

    // Location proximity (30 points)
    const hasExactCityMatch = builder.serviceLocations?.some((location: any) => 
      location.city.toLowerCase() === lead.city?.toLowerCase()
    );
    const hasCountryMatch = builder.serviceLocations?.some((location: any) => 
      location.country.toLowerCase() === lead.country?.toLowerCase()
    );

    if (hasExactCityMatch) score += 30;
    else if (hasCountryMatch) score += 20;

    // Experience and quality (25 points)
    if (builder.verified) score += 10;
    if (builder.premiumMember) score += 10;
    if (builder.rating >= 4.5) score += 5;

    // Availability (10 points)
    const currentLeads = this.getBuilderCurrentLeads(builder.id);
    if (currentLeads === 0) score += 10;
    else if (currentLeads <= 2) score += 5;

    // Budget alignment (10 points)
    if (lead.estimatedValue && builder.priceRange?.averageProject) {
      const ratio = lead.estimatedValue / builder.priceRange.averageProject;
      if (ratio >= 0.8 && ratio <= 1.2) score += 10;
      else if (ratio >= 0.6 && ratio <= 1.5) score += 5;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Get current active leads for a builder
   */
  private static getBuilderCurrentLeads(builderId: string): number {
    const leads = unifiedPlatformAPI.getLeads();
    return leads.filter(lead => 
      lead.assignedBuilders?.includes(builderId) && 
      ['new', 'viewed', 'quoted'].includes(lead.status)
    ).length;
  }

  /**
   * Get maximum leads per plan
   */
  private static getMaxLeadsForPlan(plan: string): number {
    const maxLeads = {
      'free': 5,
      'professional': 20,
      'enterprise': 100
    };
    return maxLeads[plan as keyof typeof maxLeads] || 5;
  }

  /**
   * Re-route lead if no responses received
   */
  static async reRouteInactiveLeads(): Promise<void> {
    console.log('🔄 Checking for inactive leads to re-route...');
    
    const leads = unifiedPlatformAPI.getLeads();
    const cutoffTime = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 hours ago
    
    const inactiveLeads = leads.filter(lead => 
      lead.status === 'routed' &&
      new Date(lead.routedAt || lead.createdAt) < cutoffTime &&
      !lead.reRouted
    );
    
    console.log(`📋 Found ${inactiveLeads.length} inactive leads to re-route`);
    
    for (const lead of inactiveLeads) {
      try {
        // Mark as re-routed to avoid infinite loops
        const updatedLead = { ...lead, reRouted: true };
        unifiedPlatformAPI.updateLead(lead.id, updatedLead);
        
        // Try routing to additional builders
        await this.routeNewLead(lead.id);
        
      } catch (error) {
        console.error(`❌ Failed to re-route lead ${lead.id}:`, error);
      }
    }
  }

  /**
   * Get routing analytics
   */
  static async getRoutingAnalytics(): Promise<{
    totalLeads: number;
    routedLeads: number;
    activeAssignments: number;
    averageMatchScore: number;
    builderUtilization: { [builderId: string]: number };
  }> {
    const leads = unifiedPlatformAPI.getLeads();
    const routedLeads = leads.filter(l => l.assignedBuilders?.length > 0);
    
    const totalAssignments = routedLeads.reduce((sum, lead) => 
      sum + (lead.assignedBuilders?.length || 0), 0
    );
    
    const averageMatchScore = routedLeads.length > 0 
      ? routedLeads.reduce((sum, lead) => sum + (lead.matchScore || 0), 0) / routedLeads.length
      : 0;
    
    // Calculate builder utilization - fix async issue
    const builderUtilization: { [builderId: string]: number } = {};
    const builders = unifiedPlatformAPI.getBuilders();
    
    builders.forEach(builder => {
      builderUtilization[builder.id] = this.getBuilderCurrentLeads(builder.id);
    });
    
    return {
      totalLeads: leads.length,
      routedLeads: routedLeads.length,
      activeAssignments: totalAssignments,
      averageMatchScore: Math.round(averageMatchScore),
      builderUtilization
    };
  }
}

// Export for use in API routes
export default LeadRoutingService;
