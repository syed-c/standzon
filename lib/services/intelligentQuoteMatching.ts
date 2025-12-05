// Intelligent Quote Matching System - Phase 4 Implementation
// Advanced algorithms for matching exhibitors with optimal builders

import { ExhibitionBuilder, QuoteRequest, QuoteResponse, BuilderMatchingService } from '@/lib/data/exhibitionBuilders';
import { TradeShow, TradeShowUtils } from '@/lib/data/tradeShows';

export interface MatchingCriteria {
  geographicProximity: number; // 0-100
  experienceLevel: number; // 0-100
  qualityMetrics: number; // 0-100
  availabilityScore: number; // 0-100
  serviceFit: number; // 0-100
  responseTime: number; // 0-100
  priceAlignment: number; // 0-100
  sustainabilityMatch: number; // 0-100
}

export interface BuilderMatch {
  builder: ExhibitionBuilder;
  matchScore: number; // 0-100 total score
  matchBreakdown: MatchingCriteria;
  estimatedCost: number;
  recommendationReasons: string[];
  riskFactors: string[];
  timeToCompletion: number; // days
  confidence: 'High' | 'Medium' | 'Low';
}

export interface MatchingPreferences {
  prioritizeExperience: boolean;
  prioritizeCost: boolean;
  prioritizeSustainability: boolean;
  prioritizeLocalBuilders: boolean;
  maxBudget?: number;
  preferredLanguages?: string[];
  requiredCertifications?: string[];
}

export class IntelligentQuoteMatchingEngine {
  private static readonly WEIGHTS = {
    geographicProximity: 0.20,
    experienceLevel: 0.25,
    qualityMetrics: 0.20,
    availabilityScore: 0.10,
    serviceFit: 0.15,
    responseTime: 0.05,
    priceAlignment: 0.05,
    sustainabilityMatch: 0.00 // Default 0, increases if user prioritizes sustainability
  };

  /**
   * Main matching algorithm
   */
  static async matchBuildersForQuote(
    request: QuoteRequest, 
    tradeShow: TradeShow, 
    preferences: Partial<MatchingPreferences> = {}
  ): Promise<BuilderMatch[]> {
    console.log('Starting intelligent builder matching for trade show:', tradeShow.name);

    // Merge with default preferences to ensure all properties are present
    const fullPreferences: MatchingPreferences = {
      ...defaultPreferences,
      ...preferences
    };

    // Get all potential builders
    let candidateBuilders = this.getRelevantBuilders(request, tradeShow);
    
    // Apply filters based on preferences
    candidateBuilders = this.applyPreferenceFilters(candidateBuilders, fullPreferences);

    // Calculate match scores for each builder
    const matches: BuilderMatch[] = [];
    
    for (const builder of candidateBuilders) {
      const match = await this.calculateBuilderMatch(builder, request, tradeShow, fullPreferences);
      if (match.matchScore >= 30) { // Minimum threshold
        matches.push(match);
      }
    }

    // Sort by match score and return top 8 matches
    const sortedMatches = matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8);

    console.log(`Found ${sortedMatches.length} qualified builder matches`);
    return sortedMatches;
  }

  /**
   * Get builders relevant to the trade show and location
   */
  private static getRelevantBuilders(request: QuoteRequest, tradeShow: TradeShow): ExhibitionBuilder[] {
    console.log('Getting relevant builders for trade show:', tradeShow.name);

    // Start with builders who have experience with this specific trade show
    let builders = BuilderMatchingService.getBuildersByTradeShow(request.tradeShowSlug);
    
    // Add builders in the same city/country
    const locationBuilders = BuilderMatchingService.getBuildersByLocation(tradeShow.city, tradeShow.country);
    
    // Add builders with relevant industry experience
    const industryBuilders = tradeShow.industries.flatMap(industry => 
      BuilderMatchingService.getBuildersByIndustry(industry.slug)
    );

    // Combine and deduplicate
    const allBuilders = [...builders, ...locationBuilders, ...industryBuilders];
    const uniqueBuilders = Array.from(new Map(allBuilders.map(b => [b.id, b])).values());

    console.log(`Found ${uniqueBuilders.length} relevant builders`);
    return uniqueBuilders;
  }

  /**
   * Apply user preference filters
   */
  private static applyPreferenceFilters(
    builders: ExhibitionBuilder[], 
    preferences: MatchingPreferences
  ): ExhibitionBuilder[] {
    let filtered = builders;

    // Filter by budget if specified
    if (preferences.maxBudget) {
      filtered = filtered.filter(builder => 
        builder.priceRange.averageProject <= preferences.maxBudget!
      );
    }

    // Filter by required certifications
    if (preferences.requiredCertifications?.length) {
      filtered = filtered.filter(builder =>
        preferences.requiredCertifications!.some(cert =>
          builder.certifications.some(builderCert => 
            builderCert.name.toLowerCase().includes(cert.toLowerCase())
          )
        )
      );
    }

    // Filter by preferred languages
    if (preferences.preferredLanguages?.length) {
      filtered = filtered.filter(builder =>
        preferences.preferredLanguages!.some(lang =>
          builder.languages.some(builderLang => 
            builderLang.toLowerCase().includes(lang.toLowerCase())
          )
        )
      );
    }

    console.log(`Filtered to ${filtered.length} builders after preferences`);
    return filtered;
  }

  /**
   * Calculate comprehensive match score for a builder
   */
  private static async calculateBuilderMatch(
    builder: ExhibitionBuilder,
    request: QuoteRequest,
    tradeShow: TradeShow,
    preferences: MatchingPreferences
  ): Promise<BuilderMatch> {
    
    // Calculate individual criteria scores
    const criteria: MatchingCriteria = {
      geographicProximity: this.calculateGeographicScore(builder, tradeShow),
      experienceLevel: this.calculateExperienceScore(builder, request, tradeShow),
      qualityMetrics: this.calculateQualityScore(builder),
      availabilityScore: this.calculateAvailabilityScore(builder, request),
      serviceFit: this.calculateServiceFitScore(builder, request, tradeShow),
      responseTime: this.calculateResponseTimeScore(builder),
      priceAlignment: this.calculatePriceAlignmentScore(builder, request),
      sustainabilityMatch: this.calculateSustainabilityScore(builder, preferences)
    };

    // Adjust weights based on preferences
    const weights = this.adjustWeightsForPreferences(preferences);

    // Calculate weighted total score
    const matchScore = Math.round(
      criteria.geographicProximity * weights.geographicProximity +
      criteria.experienceLevel * weights.experienceLevel +
      criteria.qualityMetrics * weights.qualityMetrics +
      criteria.availabilityScore * weights.availabilityScore +
      criteria.serviceFit * weights.serviceFit +
      criteria.responseTime * weights.responseTime +
      criteria.priceAlignment * weights.priceAlignment +
      criteria.sustainabilityMatch * weights.sustainabilityMatch
    );

    // Generate recommendation reasons
    const recommendationReasons = this.generateRecommendationReasons(builder, criteria, tradeShow);
    
    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(builder, criteria, request);

    // Estimate project cost
    const estimatedCost = this.estimateProjectCost(builder, request);

    // Calculate time to completion
    const timeToCompletion = this.calculateTimeToCompletion(builder, request);

    // Determine confidence level
    const confidence = this.determineConfidenceLevel(criteria, builder);

    return {
      builder,
      matchScore,
      matchBreakdown: criteria,
      estimatedCost,
      recommendationReasons,
      riskFactors,
      timeToCompletion,
      confidence
    };
  }

  /**
   * Calculate geographic proximity score
   */
  private static calculateGeographicScore(builder: ExhibitionBuilder, tradeShow: TradeShow): number {
    // Same city = 100, same country = 80, same continent = 60, different continent = 40
    const hasLocalOffice = builder.serviceLocations.some(loc => 
      loc.city.toLowerCase() === tradeShow.city.toLowerCase() &&
      loc.country.toLowerCase() === tradeShow.country.toLowerCase()
    );
    
    if (hasLocalOffice) return 100;

    const hasCountryOffice = builder.serviceLocations.some(loc =>
      loc.country.toLowerCase() === tradeShow.country.toLowerCase()
    );
    
    if (hasCountryOffice) return 80;

    // For simplicity, assume European countries are close to each other
    const europeanCountries = ['germany', 'france', 'united kingdom', 'italy', 'spain', 'netherlands'];
    const builderInEurope = builder.serviceLocations.some(loc => 
      europeanCountries.includes(loc.country.toLowerCase())
    );
    const tradeShowInEurope = europeanCountries.includes(tradeShow.country.toLowerCase());

    if (builderInEurope && tradeShowInEurope) return 60;

    return 40; // Different continents
  }

  /**
   * Calculate experience level score
   */
  private static calculateExperienceScore(
    builder: ExhibitionBuilder, 
    request: QuoteRequest, 
    tradeShow: TradeShow
  ): number {
    let score = 0;

    // Trade show specific experience (40 points)
    if (builder.tradeshowExperience.includes(request.tradeShowSlug)) {
      score += 40;
    }

    // Industry experience (30 points)
    const hasIndustryExperience = tradeShow.industries.some(industry =>
      builder.specializations.some(spec => spec.slug === industry.slug)
    );
    if (hasIndustryExperience) score += 30;

    // Years of experience (20 points)
    const yearsInBusiness = new Date().getFullYear() - builder.establishedYear;
    score += Math.min(20, yearsInBusiness * 2);

    // Project count (10 points)
    score += Math.min(10, builder.projectsCompleted / 50);

    return Math.min(100, score);
  }

  /**
   * Calculate quality metrics score
   */
  private static calculateQualityScore(builder: ExhibitionBuilder): number {
    let score = 0;

    // Rating (40 points)
    score += (builder.rating / 5) * 40;

    // Verification status (20 points)
    if (builder.verified) score += 20;

    // Certifications (20 points)
    score += Math.min(20, builder.certifications.length * 5);

    // Awards (10 points)
    score += Math.min(10, builder.awards.length * 2);

    // Premium membership (10 points)
    if (builder.premiumMember) score += 10;

    return Math.min(100, score);
  }

  /**
   * Calculate availability score (simplified)
   */
  private static calculateAvailabilityScore(builder: ExhibitionBuilder, request: QuoteRequest): number {
    // In a real system, this would check actual calendar availability
    // For now, use team size and recent project load as indicators
    
    let score = 70; // Base availability

    // Larger teams = better availability
    if (builder.teamSize >= 40) score += 20;
    else if (builder.teamSize >= 25) score += 15;
    else if (builder.teamSize >= 15) score += 10;

    // Response time indicates current workload
    const responseHours = parseInt(builder.responseTime.match(/\d+/)?.[0] || '24');
    if (responseHours <= 2) score += 10;
    else if (responseHours <= 6) score += 5;
    else score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate service fit score
   */
  private static calculateServiceFitScore(
    builder: ExhibitionBuilder, 
    request: QuoteRequest, 
    tradeShow: TradeShow
  ): number {
    let score = 0;

    // Check if builder offers relevant services for the stand size
    const standSize = request.standSize;
    const hasCustomDesign = builder.services.some(s => s.category === 'Design');
    const hasTechnology = builder.services.some(s => s.category === 'Technology');
    const hasConstruction = builder.services.some(s => s.category === 'Construction');

    // Large stands need custom design
    if (standSize >= 100 && hasCustomDesign) score += 30;
    else if (standSize < 100) score += 20; // Smaller stands are easier

    // Technology exhibitions benefit from tech services
    const isTechShow = tradeShow.industries.some(i => i.slug === 'technology');
    if (isTechShow && hasTechnology) score += 25;

    // Construction capability
    if (hasConstruction) score += 25;

    // Language compatibility
    const requiredLanguages = ['english']; // Default
    const hasLanguageSupport = requiredLanguages.some(lang =>
      builder.languages.some(builderLang => 
        builderLang.toLowerCase().includes(lang.toLowerCase())
      )
    );
    if (hasLanguageSupport) score += 20;

    return Math.min(100, score);
  }

  /**
   * Calculate response time score
   */
  private static calculateResponseTimeScore(builder: ExhibitionBuilder): number {
    const responseHours = parseInt(builder.responseTime.match(/\d+/)?.[0] || '24');
    
    if (responseHours <= 2) return 100;
    if (responseHours <= 4) return 85;
    if (responseHours <= 8) return 70;
    if (responseHours <= 24) return 50;
    return 30;
  }

  /**
   * Calculate price alignment score
   */
  private static calculatePriceAlignmentScore(builder: ExhibitionBuilder, request: QuoteRequest): number {
    // Extract budget from request (simplified)
    const budgetMap = {
      'budget-friendly': 30000,
      'mid-range': 75000,
      'premium': 150000,
      'luxury': 300000
    };

    const requestBudget = budgetMap[request.budget.toLowerCase() as keyof typeof budgetMap] || 75000;
    const builderAverage = builder.priceRange.averageProject;

    // Calculate how well the builder's pricing aligns with the budget
    const ratio = requestBudget / builderAverage;
    
    if (ratio >= 0.8 && ratio <= 1.2) return 100; // Perfect alignment
    if (ratio >= 0.6 && ratio <= 1.5) return 80;  // Good alignment
    if (ratio >= 0.4 && ratio <= 2.0) return 60;  // Acceptable alignment
    return 30; // Poor alignment
  }

  /**
   * Calculate sustainability score
   */
  private static calculateSustainabilityScore(
    builder: ExhibitionBuilder, 
    preferences: MatchingPreferences
  ): number {
    if (!preferences.prioritizeSustainability) return 0;
    
    return builder.sustainability.sustainabilityScore;
  }

  /**
   * Adjust weights based on user preferences
   */
  private static adjustWeightsForPreferences(preferences: MatchingPreferences): typeof this.WEIGHTS {
    const weights = { ...this.WEIGHTS };

    if (preferences.prioritizeExperience) {
      weights.experienceLevel = 0.35;
      weights.qualityMetrics = 0.25;
      weights.geographicProximity = 0.15;
    }

    if (preferences.prioritizeCost) {
      weights.priceAlignment = 0.20;
      weights.geographicProximity = 0.15;
      weights.experienceLevel = 0.20;
    }

    if (preferences.prioritizeSustainability) {
      weights.sustainabilityMatch = 0.15;
      weights.qualityMetrics = 0.15;
      weights.experienceLevel = 0.20;
    }

    if (preferences.prioritizeLocalBuilders) {
      weights.geographicProximity = 0.35;
      weights.experienceLevel = 0.20;
      weights.responseTime = 0.10;
    }

    return weights;
  }

  /**
   * Generate recommendation reasons
   */
  private static generateRecommendationReasons(
    builder: ExhibitionBuilder, 
    criteria: MatchingCriteria, 
    tradeShow: TradeShow
  ): string[] {
    const reasons: string[] = [];

    if (criteria.geographicProximity >= 80) {
      reasons.push(`Local presence in ${tradeShow.city}, ${tradeShow.country}`);
    }

    if (criteria.experienceLevel >= 80) {
      reasons.push(`Extensive experience with ${tradeShow.name} and similar events`);
    }

    if (criteria.qualityMetrics >= 85) {
      reasons.push(`Excellent rating (${builder.rating}/5) with ${builder.reviewCount} verified reviews`);
    }

    if (builder.awards.length > 0) {
      reasons.push(`Award-winning design team with ${builder.awards.length} industry recognition(s)`);
    }

    if (builder.premiumMember) {
      reasons.push('Premium certified builder with enhanced service guarantees');
    }

    if (criteria.sustainabilityMatch >= 80) {
      reasons.push('Industry leader in sustainable exhibition practices');
    }

    if (criteria.responseTime >= 85) {
      reasons.push(`Fast response time: ${builder.responseTime}`);
    }

    if (builder.teamSize >= 30) {
      reasons.push(`Large dedicated team (${builder.teamSize} professionals) for complex projects`);
    }

    return reasons;
  }

  /**
   * Identify potential risk factors
   */
  private static identifyRiskFactors(
    builder: ExhibitionBuilder, 
    criteria: MatchingCriteria, 
    request: QuoteRequest
  ): string[] {
    const risks: string[] = [];

    if (criteria.geographicProximity < 60) {
      risks.push('International builder may have higher logistics costs');
    }

    if (criteria.experienceLevel < 50) {
      risks.push('Limited experience with this type of exhibition');
    }

    if (criteria.availabilityScore < 60) {
      risks.push('May have limited availability due to high demand');
    }

    if (builder.reviewCount < 20) {
      risks.push('Limited client feedback available');
    }

    if (criteria.priceAlignment < 50) {
      risks.push('Pricing may not align well with stated budget');
    }

    return risks;
  }

  /**
   * Estimate project cost
   */
  private static estimateProjectCost(builder: ExhibitionBuilder, request: QuoteRequest): number {
    const standSize = request.standSize;
    const budgetLevel = request.budget.toLowerCase();

    let projectType: 'basic' | 'custom' | 'premium' = 'custom';
    
    if (budgetLevel.includes('budget') || budgetLevel.includes('basic')) {
      projectType = 'basic';
    } else if (budgetLevel.includes('premium') || budgetLevel.includes('luxury')) {
      projectType = 'premium';
    }

    return BuilderMatchingService.calculateProjectCost(builder, standSize, projectType);
  }

  /**
   * Calculate estimated time to completion
   */
  private static calculateTimeToCompletion(builder: ExhibitionBuilder, request: QuoteRequest): number {
    // Base time from builder's typical turnaround
    const baseDays = 42; // 6 weeks average
    
    // Adjust for stand size
    const sizeMultiplier = Math.max(1, request.standSize / 100);
    
    // Adjust for team size (larger teams work faster)
    const teamMultiplier = Math.max(0.7, 50 / builder.teamSize);
    
    return Math.round(baseDays * sizeMultiplier * teamMultiplier);
  }

  /**
   * Determine confidence level
   */
  private static determineConfidenceLevel(
    criteria: MatchingCriteria, 
    builder: ExhibitionBuilder
  ): 'High' | 'Medium' | 'Low' {
    const avgScore = (
      criteria.geographicProximity + 
      criteria.experienceLevel + 
      criteria.qualityMetrics
    ) / 3;

    if (avgScore >= 80 && builder.verified && builder.reviewCount >= 50) {
      return 'High';
    } else if (avgScore >= 60 && builder.verified) {
      return 'Medium';
    } else {
      return 'Low';
    }
  }

  /**
   * Real-time quote request processing
   */
  static async processQuoteRequest(request: QuoteRequest): Promise<{
    matches: BuilderMatch[];
    requestId: string;
    estimatedResponseTime: string;
  }> {
    console.log('Processing quote request:', request.id);

    // Find the trade show
    const tradeShow = await this.findTradeShow(request.tradeShowSlug);
    if (!tradeShow) {
      throw new Error('Trade show not found');
    }

    // Get intelligent matches
    const matches = await this.matchBuildersForQuote(request, tradeShow);

    // Send notifications to matched builders (in a real system)
    await this.notifyMatchedBuilders(matches, request);

    // Calculate estimated response time
    const avgResponseTime = this.calculateAverageResponseTime(matches);

    return {
      matches,
      requestId: request.id,
      estimatedResponseTime: avgResponseTime
    };
  }

  /**
   * Find trade show by slug
   */
  private static async findTradeShow(slug: string): Promise<TradeShow | null> {
    // Import trade shows data (simplified)
    const { tradeShows } = await import('@/lib/data/tradeShows');
    return tradeShows.find(show => show.slug === slug) || null;
  }

  /**
   * Notify matched builders
   */
  private static async notifyMatchedBuilders(matches: BuilderMatch[], request: QuoteRequest): Promise<void> {
    console.log(`Notifying ${matches.length} matched builders for quote ${request.id}`);
    
    // In a real system, this would send emails/notifications to builders
    // For now, just log the notification
    matches.forEach(match => {
      console.log(`Notifying ${match.builder.companyName} (Match Score: ${match.matchScore}%)`);
    });
  }

  /**
   * Calculate average response time
   */
  private static calculateAverageResponseTime(matches: BuilderMatch[]): string {
    if (matches.length === 0) return '48 hours';

    const avgHours = matches.reduce((sum, match) => {
      const hours = parseInt(match.builder.responseTime.match(/\d+/)?.[0] || '24');
      return sum + hours;
    }, 0) / matches.length;

    if (avgHours <= 2) return '2-4 hours';
    if (avgHours <= 6) return '6-12 hours';
    if (avgHours <= 24) return '24-48 hours';
    return '2-3 business days';
  }

  /**
   * Generate analytics for quote matching performance
   */
  static generateMatchingAnalytics(recentMatches: BuilderMatch[][]): {
    avgMatchScore: number;
    topPerformingCriteria: string;
    geographicCoverage: number;
    qualityDistribution: { high: number; medium: number; low: number };
  } {
    const allMatches = recentMatches.flat();
    
    if (allMatches.length === 0) {
      return {
        avgMatchScore: 0,
        topPerformingCriteria: 'none',
        geographicCoverage: 0,
        qualityDistribution: { high: 0, medium: 0, low: 0 }
      };
    }

    const avgMatchScore = allMatches.reduce((sum, match) => sum + match.matchScore, 0) / allMatches.length;

    // Find top performing criteria
    const criteriaAverages = {
      geographicProximity: allMatches.reduce((sum, m) => sum + m.matchBreakdown.geographicProximity, 0) / allMatches.length,
      experienceLevel: allMatches.reduce((sum, m) => sum + m.matchBreakdown.experienceLevel, 0) / allMatches.length,
      qualityMetrics: allMatches.reduce((sum, m) => sum + m.matchBreakdown.qualityMetrics, 0) / allMatches.length,
      serviceFit: allMatches.reduce((sum, m) => sum + m.matchBreakdown.serviceFit, 0) / allMatches.length
    };

    const topPerformingCriteria = Object.entries(criteriaAverages)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Geographic coverage
    const uniqueCountries = new Set(allMatches.map(m => 
      m.builder.headquarters.country
    )).size;
    const geographicCoverage = (uniqueCountries / 25) * 100; // Out of 25 major countries

    // Quality distribution
    const qualityDistribution = allMatches.reduce((acc, match) => {
      if (match.confidence === 'High') acc.high++;
      else if (match.confidence === 'Medium') acc.medium++;
      else acc.low++;
      return acc;
    }, { high: 0, medium: 0, low: 0 });

    return {
      avgMatchScore: Math.round(avgMatchScore),
      topPerformingCriteria,
      geographicCoverage: Math.round(geographicCoverage),
      qualityDistribution
    };
  }
}

// Default matching preferences if none provided
export const defaultPreferences: MatchingPreferences = {
  prioritizeExperience: true,
  prioritizeCost: false,
  prioritizeSustainability: false,
  prioritizeLocalBuilders: true
};

// Export for easy access
export default IntelligentQuoteMatchingEngine;

console.log('Intelligent Quote Matching Engine loaded successfully');