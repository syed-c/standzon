// Builder Matching Service for Lead Assignment
// This service implements intelligent matching logic to connect leads with the most suitable builders

interface LeadRequirements {
  id: string;
  companyName: string;
  city: string;
  country: string;
  standSize: number;
  budget: string;
  timeline: string;
  standType: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  leadScore: number;
  estimatedValue: number;
  specialRequests?: string;
  needsInstallation: boolean;
  needsTransportation: boolean;
  needsStorage: boolean;
  needsAVEquipment: boolean;
  needsLighting: boolean;
  needsFurniture: boolean;
  needsGraphics: boolean;
}

interface BuilderProfile {
  id: string;
  companyName: string;
  contactEmail: string;
  verified: boolean;
  premiumMember: boolean;
  
  // Location & Coverage
  headquarters: {
    city: string;
    country: string;
  };
  serviceLocations: Array<{
    city: string;
    country: string;
    region?: string;
  }>;
  
  // Performance Metrics
  rating: number;
  reviewCount: number;
  projectsCompleted: number;
  responseTime: string;
  
  // Capabilities
  services: Array<{
    name: string;
    category: string;
  }>;
  specialties: string[];
  teamSize: number;
  establishedYear: number;
  
  // Business Status
  subscriptionPlan: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
  leadCreditsRemaining: number;
  lastActiveAt: string;
  
  // Portfolio & Credentials
  portfolioItems: number;
  certifications: string[];
  languages: string[];
}

interface MatchResult {
  builder: BuilderProfile;
  matchScore: number;
  matchReasons: string[];
  accessLevel: 'PREVIEW' | 'FULL';
}

interface MatchingCriteria {
  city: string;
  country: string;
  standSize?: number;
  budget?: string;
  timeline?: string;
  standType?: string[];
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

interface BuilderMatch {
  builder: BuilderProfile;
  matchScore: number;
  matchReasons: string[];
  accessLevel: 'PREVIEW' | 'FULL';
}

class BuilderMatchingService {
  
  /**
   * Find the best matching builders for a lead
   */
  async findMatchingBuilders(criteria: MatchingCriteria): Promise<BuilderMatch[]> {
    console.log('🔍 Finding builders for criteria:', criteria);

    try {
      // Find builders who serve the specified city/country
      // TODO: Replace with actual prisma query when database is connected
      const builders = await this.getAllActiveBuilders();

      console.log(`✅ Found ${builders.length} potential builders`);

      // Filter and score each builder
      const matches: MatchResult[] = [];
      
      for (const builder of builders) {
        const matchScore = this.calculateMatchScore(criteria, builder);
        
        // Only consider builders with a minimum match score
        if (matchScore >= 40) {
          const matchReasons = this.getMatchReasons(criteria, builder);
          const accessLevel = this.determineAccessLevel(builder, criteria);
          
          matches.push({
            builder,
            matchScore,
            matchReasons,
            accessLevel
          });
        }
      }
      
      // Sort by match score (descending) and return top matches
      const sortedMatches = matches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5); // Limit to top 5 matches
      
      console.log(`✅ Found ${sortedMatches.length} matching builders`);
      return sortedMatches;
    } catch (error) {
      console.error('Error finding matching builders:', error);
      return [];
    }
  }
  
  /**
   * Calculate match score between lead and builder (0-100)
   */
  private calculateMatchScore(lead: any, builder: any): number {
    let score = 0;
    const maxScore = 100;
    
    // 1. Geographic Match (25 points)
    const geoScore = this.calculateGeographicScore(lead, builder);
    score += geoScore * 0.25;
    
    // 2. Service Capability Match (20 points)
    const serviceScore = this.calculateServiceScore(lead, builder);
    score += serviceScore * 0.20;
    
    // 3. Budget Compatibility (15 points)
    const budgetScore = this.calculateBudgetScore(lead, builder);
    score += budgetScore * 0.15;
    
    // 4. Performance & Quality (15 points)
    const performanceScore = this.calculatePerformanceScore(builder);
    score += performanceScore * 0.15;
    
    // 5. Availability & Capacity (10 points)
    const availabilityScore = this.calculateAvailabilityScore(lead, builder);
    score += availabilityScore * 0.10;
    
    // 6. Timeline Compatibility (10 points)
    const timelineScore = this.calculateTimelineScore(lead, builder);
    score += timelineScore * 0.10;
    
    // 7. Verification & Trust (5 points)
    const trustScore = this.calculateTrustScore(builder);
    score += trustScore * 0.05;
    
    // Bonus factors
    if (builder.premiumMember) score += 5; // Premium member bonus
    if (builder.subscriptionPlan === 'ENTERPRISE') score += 3; // Enterprise bonus
    if (lead.priority === 'URGENT' && builder.responseTime.includes('24')) score += 5; // Fast response bonus
    
    return Math.min(Math.round(score), maxScore);
  }
  
  /**
   * Calculate geographic compatibility score
   */
  private calculateGeographicScore(lead: MatchingCriteria, builder: BuilderProfile): number {
    // Exact city match
    if (builder.headquarters.city.toLowerCase() === lead.city.toLowerCase()) {
      return 100;
    }
    
    // Service location city match
    const cityMatch = builder.serviceLocations.some(
      loc => loc.city.toLowerCase() === lead.city.toLowerCase()
    );
    if (cityMatch) return 90;
    
    // Country match
    if (builder.headquarters.country.toLowerCase() === lead.country.toLowerCase()) {
      return 70;
    }
    
    // Service location country match
    const countryMatch = builder.serviceLocations.some(
      loc => loc.country.toLowerCase() === lead.country.toLowerCase()
    );
    if (countryMatch) return 60;
    
    // Regional/international capability
    if (builder.serviceLocations.length > 5) return 30; // International builder
    
    return 0;
  }
  
  /**
   * Calculate service capability score
   */
  private calculateServiceScore(lead: MatchingCriteria, builder: BuilderProfile): number {
    let score = 0;
    const totalServices = 7; // Total number of service categories
    
    // Check stand type compatibility if available
    if (lead.standType && lead.standType.length > 0) {
      const standTypeMatch = lead.standType.some(type => 
        builder.services.some(service => 
          service.name.toLowerCase().includes(type.toLowerCase().replace(' ', '-'))
        )
      );
      if (standTypeMatch) score += 30;
    }
    
    // For basic matching criteria, give partial score based on general service availability
    // Additional detailed service scoring would require more detailed lead requirements
    
    return Math.min(score, 100);
  }
  
  /**
   * Calculate budget compatibility score
   */
  private calculateBudgetScore(lead: MatchingCriteria, builder: BuilderProfile): number {
    // Convert lead budget to numeric range for comparison
    const budgetRanges: Record<string, [number, number]> = {
      'under-10k': [0, 10000],
      '10k-25k': [10000, 25000],
      '25k-50k': [25000, 50000],
      '50k-100k': [50000, 100000],
      '100k-plus': [100000, 500000]
    };
    
    const [minBudget, maxBudget] = budgetRanges[lead.budget || '25k-50k'] || [25000, 50000];
    
    // Estimate builder's project range based on their completed projects and rating
    const builderMinProject = Math.max(5000, (builder.rating - 3) * 10000);
    const builderMaxProject = builder.projectsCompleted * 1000 + builder.rating * 20000;
    
    // Check overlap between lead budget and builder's typical project range
    const overlapStart = Math.max(minBudget, builderMinProject);
    const overlapEnd = Math.min(maxBudget, builderMaxProject);
    
    if (overlapEnd > overlapStart) {
      const overlapSize = overlapEnd - overlapStart;
      const leadRangeSize = maxBudget - minBudget;
      return Math.min((overlapSize / leadRangeSize) * 100, 100);
    }
    
    // If no overlap, check if builder typically works in higher or lower ranges
    if (minBudget > builderMaxProject) return 30; // Builder might consider higher budget
    if (maxBudget < builderMinProject) return 10; // Unlikely match
    
    return 50; // Default moderate score
  }
  
  /**
   * Calculate performance score based on builder metrics
   */
  private calculatePerformanceScore(builder: BuilderProfile): number {
    let score = 0;
    
    // Rating score (40% of performance)
    score += (builder.rating / 5) * 40;
    
    // Review count credibility (20% of performance)
    const reviewScore = Math.min(builder.reviewCount / 50, 1) * 20;
    score += reviewScore;
    
    // Experience score (25% of performance)
    const experienceYears = new Date().getFullYear() - builder.establishedYear;
    const experienceScore = Math.min(experienceYears / 10, 1) * 25;
    score += experienceScore;
    
    // Project completion score (15% of performance)
    const projectScore = Math.min(builder.projectsCompleted / 100, 1) * 15;
    score += projectScore;
    
    return Math.min(score, 100);
  }
  
  /**
   * Calculate availability score
   */
  private calculateAvailabilityScore(lead: MatchingCriteria, builder: BuilderProfile): number {
    let score = 50; // Base score
    
    // Check lead credits for non-premium builders
    if (builder.subscriptionPlan === 'FREE' && builder.leadCreditsRemaining <= 0) {
      return 0; // No credits = no availability
    }
    
    // Response time compatibility
    if (lead.priority === 'URGENT') {
      if (builder.responseTime.includes('24') || builder.responseTime.includes('same day')) {
        score += 30;
      } else {
        score -= 20;
      }
    }
    
    // Recent activity score
    const lastActive = new Date(builder.lastActiveAt);
    const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceActive <= 1) score += 20;
    else if (daysSinceActive <= 7) score += 10;
    else if (daysSinceActive <= 30) score -= 10;
    else score -= 30;
    
    return Math.max(0, Math.min(score, 100));
  }
  
  /**
   * Calculate timeline compatibility score
   */
  private calculateTimelineScore(lead: MatchingCriteria, builder: BuilderProfile): number {
    const timelineUrgency: Record<string, number> = {
      'asap': 100,
      '1-month': 80,
      '2-3-months': 60,
      '3-6-months': 40,
      '6-plus-months': 20
    };
    
    const urgencyLevel = timelineUrgency[lead.timeline || '3-6-months'] || 50;
    
    // Builders with faster response times score better for urgent projects
    if (urgencyLevel >= 80 && builder.responseTime.includes('24')) {
      return 100;
    }
    
    return Math.max(50, urgencyLevel);
  }
  
  /**
   * Calculate trust and verification score
   */
  private calculateTrustScore(builder: BuilderProfile): number {
    let score = 0;
    
    if (builder.verified) score += 50;
    if (builder.certifications.length > 0) score += 30;
    if (builder.portfolioItems >= 10) score += 20;
    
    return Math.min(score, 100);
  }
  
  /**
   * Generate human-readable match reasons
   */
  private getMatchReasons(lead: MatchingCriteria, builder: BuilderProfile): string[] {
    const reasons: string[] = [];
    
    // Geographic reasons
    if (builder.headquarters.city.toLowerCase() === lead.city.toLowerCase()) {
      reasons.push(`Located in ${lead.city}`);
    } else if (builder.serviceLocations.some(loc => loc.city.toLowerCase() === lead.city.toLowerCase())) {
      reasons.push(`Services ${lead.city} area`);
    }
    
    // Service capability reasons
    if (lead.standType && lead.standType.length > 0) {
      const standTypeMatch = lead.standType.some(type => 
        builder.services.some(service => 
          service.name.toLowerCase().includes(type.toLowerCase().replace(' ', '-'))
        )
      );
      if (standTypeMatch) {
        reasons.push('Specializes in your stand type');
      }
    }
    
    // Performance reasons
    if (builder.rating >= 4.5) {
      reasons.push(`Excellent rating (${builder.rating}/5)`);
    }
    
    if (builder.projectsCompleted >= 50) {
      reasons.push(`${builder.projectsCompleted}+ completed projects`);
    }
    
    // Timeline reasons
    if (lead.priority === 'URGENT' && builder.responseTime.includes('24')) {
      reasons.push('Fast response time');
    }
    
    // Trust reasons
    if (builder.verified) {
      reasons.push('Verified builder');
    }
    
    if (builder.premiumMember) {
      reasons.push('Premium member');
    }
    
    return reasons.slice(0, 4); // Limit to top 4 reasons
  }
  
  /**
   * Determine access level based on builder subscription
   */
  private determineAccessLevel(builder: BuilderProfile, lead: MatchingCriteria): 'PREVIEW' | 'FULL' {
    // Enterprise and Professional plans get full access
    if (builder.subscriptionPlan === 'ENTERPRISE' || builder.subscriptionPlan === 'PROFESSIONAL') {
      return 'FULL';
    }
    
    // Free plan with remaining credits gets full access
    if (builder.subscriptionPlan === 'FREE' && builder.leadCreditsRemaining > 0) {
      return 'FULL';
    }
    
    // Otherwise, preview only
    return 'PREVIEW';
  }
  
  /**
   * Get all active builders (mock data for now)
   */
  private async getAllActiveBuilders(): Promise<BuilderProfile[]> {
    // TODO: Replace with actual database query
    // return await prisma.builderProfile.findMany({ where: { status: 'ACTIVE' } });
    
    // Mock data for demonstration
    return [
      {
        id: 'builder-1',
        companyName: 'Premium Exhibitions Ltd',
        contactEmail: 'info@premiumexhibitions.com',
        verified: true,
        premiumMember: true,
        headquarters: { city: 'London', country: 'United Kingdom' },
        serviceLocations: [
          { city: 'London', country: 'United Kingdom' },
          { city: 'Paris', country: 'France' },
          { city: 'Berlin', country: 'Germany' }
        ],
        rating: 4.8,
        reviewCount: 127,
        projectsCompleted: 234,
        responseTime: 'Within 24 hours',
        services: [
          { name: 'Custom Design', category: 'design' },
          { name: 'Installation', category: 'installation' },
          { name: 'Graphics', category: 'graphics' }
        ],
        specialties: ['custom-build', 'luxury-stands'],
        teamSize: 25,
        establishedYear: 2010,
        subscriptionPlan: 'PROFESSIONAL',
        leadCreditsRemaining: 15,
        lastActiveAt: new Date().toISOString(),
        portfolioItems: 45,
        certifications: ['ISO 9001', 'AUMA'],
        languages: ['English', 'French']
      },
      {
        id: 'builder-2',
        companyName: 'Global Stand Solutions',
        contactEmail: 'sales@globalstands.com',
        verified: true,
        premiumMember: false,
        headquarters: { city: 'Berlin', country: 'Germany' },
        serviceLocations: [
          { city: 'Berlin', country: 'Germany' },
          { city: 'Munich', country: 'Germany' },
          { city: 'Frankfurt', country: 'Germany' }
        ],
        rating: 4.6,
        reviewCount: 89,
        projectsCompleted: 156,
        responseTime: 'Within 48 hours',
        services: [
          { name: 'Modular Systems', category: 'modular' },
          { name: 'Transportation', category: 'logistics' },
          { name: 'Storage', category: 'storage' }
        ],
        specialties: ['modular-systems', 'cost-effective'],
        teamSize: 18,
        establishedYear: 2015,
        subscriptionPlan: 'FREE',
        leadCreditsRemaining: 3,
        lastActiveAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        portfolioItems: 32,
        certifications: ['ISO 9001'],
        languages: ['German', 'English']
      },
      {
        id: 'builder-3',
        companyName: 'Expo Design Masters',
        contactEmail: 'hello@expodesign.com',
        verified: true,
        premiumMember: true,
        headquarters: { city: 'Dubai', country: 'UAE' },
        serviceLocations: [
          { city: 'Dubai', country: 'UAE' },
          { city: 'Abu Dhabi', country: 'UAE' },
          { city: 'Doha', country: 'Qatar' },
          { city: 'Riyadh', country: 'Saudi Arabia' }
        ],
        rating: 4.9,
        reviewCount: 203,
        projectsCompleted: 312,
        responseTime: 'Same day',
        services: [
          { name: 'Custom Design', category: 'design' },
          { name: 'Luxury Finishes', category: 'premium' },
          { name: 'AV Equipment', category: 'technology' },
          { name: 'Lighting Design', category: 'lighting' }
        ],
        specialties: ['luxury-stands', 'technology-integration'],
        teamSize: 42,
        establishedYear: 2008,
        subscriptionPlan: 'ENTERPRISE',
        leadCreditsRemaining: 999,
        lastActiveAt: new Date().toISOString(),
        portfolioItems: 78,
        certifications: ['ISO 9001', 'AUMA', 'Green Certificate'],
        languages: ['English', 'Arabic', 'Hindi']
      }
    ];
  }
}

// Export singleton instance
export const builderMatchingService = new BuilderMatchingService();

// Export types
export type { LeadRequirements, BuilderProfile, MatchResult, MatchingCriteria, BuilderMatch };