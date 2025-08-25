// AI-Powered Builder Matching Service for StandsZone
// This service uses intelligent algorithms to match exhibitors with the best builders

export interface ProjectRequirements {
  location: {
    country: string;
    city?: string;
    venue?: string;
  };
  budget: {
    min?: number;
    max?: number;
    currency: string;
  };
  timeline: {
    eventDate: Date;
    setupDays?: number;
    designDeadline?: Date;
  };
  standSpecs: {
    size: string; // e.g., "3x3", "6x4", "custom"
    type: 'modular' | 'custom' | 'portable' | 'double-decker';
    height?: number;
    specialRequirements?: string[];
  };
  industry: string;
  brandStyle: {
    modern?: boolean;
    minimalist?: boolean;
    luxurious?: boolean;
    interactive?: boolean;
    sustainable?: boolean;
  };
  services: string[]; // e.g., ['design', 'build', 'install', 'storage']
  previousExperience?: {
    similarProjects?: boolean;
    industryExperience?: boolean;
    venueExperience?: boolean;
  };
}

export interface BuilderProfile {
  _id: string;
  companyName: string;
  slug: string;
  location: {
    country: string;
    city: string;
  };
  services: string[];
  specializations: string[];
  industries: string[];
  portfolio: {
    totalProjects: number;
    averageBudget: number;
    standTypes: string[];
    venues: string[];
  };
  ratings: {
    overall: number;
    quality: number;
    timeline: number;
    communication: number;
    value: number;
  };
  pricing: {
    hourlyRate?: number;
    projectMinimum?: number;
    currency: string;
  };
  availability: {
    nextAvailable: Date;
    capacity: number;
  };
  certifications: string[];
  verified: boolean;
  responseTime: number; // hours
}

export interface MatchResult {
  builder: BuilderProfile;
  matchScore: number;
  matchReasons: string[];
  concerns: string[];
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: {
    designPhase: number; // days
    buildPhase: number; // days
    totalDuration: number; // days
  };
  confidence: 'high' | 'medium' | 'low';
}

export class AIBuilderMatchingService {
  private static instance: AIBuilderMatchingService;
  
  public static getInstance(): AIBuilderMatchingService {
    if (!AIBuilderMatchingService.instance) {
      AIBuilderMatchingService.instance = new AIBuilderMatchingService();
    }
    return AIBuilderMatchingService.instance;
  }

  /**
   * Main matching algorithm that scores builders based on project requirements
   */
  public async matchBuilders(
    requirements: ProjectRequirements,
    availableBuilders: BuilderProfile[],
    maxResults: number = 10
  ): Promise<MatchResult[]> {
    console.log('🤖 AI Builder Matching: Starting analysis for', requirements.location);
    
    const matches: MatchResult[] = [];
    
    for (const builder of availableBuilders) {
      const matchResult = await this.calculateMatch(requirements, builder);
      if (matchResult.matchScore > 0.3) { // Minimum threshold
        matches.push(matchResult);
      }
    }
    
    // Sort by match score and return top results
    matches.sort((a, b) => b.matchScore - a.matchScore);
    
    console.log(`🤖 AI Builder Matching: Found ${matches.length} suitable matches`);
    return matches.slice(0, maxResults);
  }

  /**
   * Calculate match score between requirements and builder
   */
  private async calculateMatch(
    requirements: ProjectRequirements,
    builder: BuilderProfile
  ): Promise<MatchResult> {
    let totalScore = 0;
    let maxPossibleScore = 0;
    const matchReasons: string[] = [];
    const concerns: string[] = [];

    // 1. Location Matching (Weight: 25%)
    const locationScore = this.calculateLocationScore(requirements.location, builder.location);
    totalScore += locationScore * 0.25;
    maxPossibleScore += 0.25;
    
    if (locationScore > 0.8) {
      matchReasons.push(`Local builder in ${builder.location.city}`);
    } else if (locationScore > 0.5) {
      matchReasons.push(`Regional builder in ${builder.location.country}`);
    } else {
      concerns.push(`Builder located far from project site`);
    }

    // 2. Service Capability (Weight: 20%)
    const serviceScore = this.calculateServiceScore(requirements.services, builder.services);
    totalScore += serviceScore * 0.20;
    maxPossibleScore += 0.20;
    
    if (serviceScore > 0.9) {
      matchReasons.push('Offers all required services');
    } else if (serviceScore > 0.7) {
      matchReasons.push('Offers most required services');
    } else {
      concerns.push('Limited service offerings for your needs');
    }

    // 3. Industry Experience (Weight: 15%)
    const industryScore = this.calculateIndustryScore(requirements.industry, builder.industries);
    totalScore += industryScore * 0.15;
    maxPossibleScore += 0.15;
    
    if (industryScore > 0.8) {
      matchReasons.push(`Specialized in ${requirements.industry} industry`);
    } else if (industryScore < 0.3) {
      concerns.push('Limited experience in your industry');
    }

    // 4. Budget Compatibility (Weight: 15%)
    const budgetScore = this.calculateBudgetScore(requirements.budget, builder.pricing);
    totalScore += budgetScore * 0.15;
    maxPossibleScore += 0.15;
    
    if (budgetScore > 0.8) {
      matchReasons.push('Budget aligns well with builder pricing');
    } else if (budgetScore < 0.4) {
      concerns.push('Budget may not align with builder pricing');
    }

    // 5. Timeline Feasibility (Weight: 10%)
    const timelineScore = this.calculateTimelineScore(requirements.timeline, builder.availability);
    totalScore += timelineScore * 0.10;
    maxPossibleScore += 0.10;
    
    if (timelineScore > 0.8) {
      matchReasons.push('Available for your project timeline');
    } else if (timelineScore < 0.5) {
      concerns.push('May have scheduling conflicts');
    }

    // 6. Quality & Ratings (Weight: 10%)
    const qualityScore = builder.ratings.overall / 5; // Normalize to 0-1
    totalScore += qualityScore * 0.10;
    maxPossibleScore += 0.10;
    
    if (builder.ratings.overall >= 4.5) {
      matchReasons.push('Excellent customer ratings');
    } else if (builder.ratings.overall < 3.5) {
      concerns.push('Below average customer ratings');
    }

    // 7. Stand Type Expertise (Weight: 5%)
    const standTypeScore = this.calculateStandTypeScore(requirements.standSpecs, builder.portfolio);
    totalScore += standTypeScore * 0.05;
    maxPossibleScore += 0.05;
    
    if (standTypeScore > 0.8) {
      matchReasons.push(`Expert in ${requirements.standSpecs.type} stands`);
    }

    // Calculate final match score
    const matchScore = maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;
    
    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low' = 'low';
    if (matchScore > 0.8 && matchReasons.length >= 3) confidence = 'high';
    else if (matchScore > 0.6 && matchReasons.length >= 2) confidence = 'medium';

    // Estimate costs and timeline
    const estimatedCost = this.estimateProjectCost(requirements, builder);
    const timeline = this.estimateTimeline(requirements, builder);

    return {
      builder,
      matchScore,
      matchReasons,
      concerns,
      estimatedCost,
      timeline,
      confidence
    };
  }

  private calculateLocationScore(reqLocation: ProjectRequirements['location'], builderLocation: BuilderProfile['location']): number {
    // Same city = 1.0
    if (reqLocation.city && reqLocation.city.toLowerCase() === builderLocation.city.toLowerCase()) {
      return 1.0;
    }
    
    // Same country = 0.7
    if (reqLocation.country.toLowerCase() === builderLocation.country.toLowerCase()) {
      return 0.7;
    }
    
    // Different country = 0.3 (still possible for international builders)
    return 0.3;
  }

  private calculateServiceScore(requiredServices: string[], builderServices: string[]): number {
    if (requiredServices.length === 0) return 1.0;
    
    const matchedServices = requiredServices.filter(service => 
      builderServices.some(bs => bs.toLowerCase().includes(service.toLowerCase()))
    );
    
    return matchedServices.length / requiredServices.length;
  }

  private calculateIndustryScore(requiredIndustry: string, builderIndustries: string[]): number {
    const industryMatch = builderIndustries.some(industry => 
      industry.toLowerCase().includes(requiredIndustry.toLowerCase()) ||
      requiredIndustry.toLowerCase().includes(industry.toLowerCase())
    );
    
    return industryMatch ? 1.0 : 0.5; // 0.5 for general experience
  }

  private calculateBudgetScore(reqBudget: ProjectRequirements['budget'], builderPricing: BuilderProfile['pricing']): number {
    if (!reqBudget.max || !builderPricing.projectMinimum) return 0.7; // Neutral if no data
    
    const budgetMid = ((reqBudget.min || 0) + reqBudget.max) / 2;
    const builderMin = builderPricing.projectMinimum;
    
    // If builder minimum is within budget range
    if (builderMin <= reqBudget.max && builderMin >= (reqBudget.min || 0)) {
      return 1.0;
    }
    
    // If builder minimum is slightly above budget
    if (builderMin <= reqBudget.max * 1.2) {
      return 0.7;
    }
    
    // If builder minimum is way above budget
    if (builderMin > reqBudget.max * 1.5) {
      return 0.2;
    }
    
    return 0.5;
  }

  private calculateTimelineScore(reqTimeline: ProjectRequirements['timeline'], builderAvailability: BuilderProfile['availability']): number {
    const daysUntilEvent = Math.floor((reqTimeline.eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const builderAvailableDays = Math.floor((builderAvailability.nextAvailable.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    // Builder available immediately
    if (builderAvailableDays <= 0) return 1.0;
    
    // Builder available with time to spare
    if (builderAvailableDays < daysUntilEvent * 0.5) return 0.9;
    
    // Builder available but tight timeline
    if (builderAvailableDays < daysUntilEvent * 0.8) return 0.7;
    
    // Timeline conflict
    if (builderAvailableDays >= daysUntilEvent) return 0.2;
    
    return 0.5;
  }

  private calculateStandTypeScore(reqSpecs: ProjectRequirements['standSpecs'], builderPortfolio: BuilderProfile['portfolio']): number {
    const hasExperience = builderPortfolio.standTypes.includes(reqSpecs.type);
    return hasExperience ? 1.0 : 0.6;
  }

  private estimateProjectCost(requirements: ProjectRequirements, builder: BuilderProfile): MatchResult['estimatedCost'] {
    // Basic cost estimation based on stand size and builder pricing
    const baseMultiplier = this.getStandSizeMultiplier(requirements.standSpecs.size);
    const builderRate = builder.pricing.projectMinimum || 5000;
    
    const estimatedMin = builderRate * baseMultiplier * 0.8;
    const estimatedMax = builderRate * baseMultiplier * 1.3;
    
    return {
      min: Math.round(estimatedMin),
      max: Math.round(estimatedMax),
      currency: builder.pricing.currency
    };
  }

  private estimateTimeline(requirements: ProjectRequirements, builder: BuilderProfile): MatchResult['timeline'] {
    // Basic timeline estimation
    const complexity = this.getProjectComplexity(requirements);
    
    const designPhase = complexity * 7; // 1-3 weeks
    const buildPhase = complexity * 10; // 1-4 weeks
    
    return {
      designPhase,
      buildPhase,
      totalDuration: designPhase + buildPhase
    };
  }

  private getStandSizeMultiplier(size: string): number {
    const sizeMap: Record<string, number> = {
      '3x3': 1.0,
      '3x6': 1.5,
      '6x6': 2.0,
      '6x9': 2.5,
      '9x9': 3.0,
      'custom': 2.5
    };
    
    return sizeMap[size] || 2.0;
  }

  private getProjectComplexity(requirements: ProjectRequirements): number {
    let complexity = 1;
    
    if (requirements.standSpecs.type === 'custom') complexity += 1;
    if (requirements.standSpecs.type === 'double-decker') complexity += 2;
    if (requirements.brandStyle.interactive) complexity += 1;
    if (requirements.standSpecs.specialRequirements?.length) complexity += 1;
    
    return Math.min(complexity, 4); // Cap at 4
  }

  /**
   * Get personalized recommendations based on user behavior
   */
  public async getPersonalizedRecommendations(
    userId: string,
    requirements: ProjectRequirements,
    builders: BuilderProfile[]
  ): Promise<MatchResult[]> {
    // This would integrate with user behavior tracking
    // For now, return standard matches with slight personalization
    const matches = await this.matchBuilders(requirements, builders);
    
    // Add personalization factors (placeholder for future ML integration)
    return matches.map(match => ({
      ...match,
      matchReasons: [
        ...match.matchReasons,
        // Add personalized reasons based on user history
      ]
    }));
  }

  /**
   * Explain why a specific builder was recommended
   */
  public explainRecommendation(match: MatchResult): string {
    const { builder, matchScore, matchReasons, confidence } = match;
    
    let explanation = `${builder.companyName} is a ${confidence} confidence match (${Math.round(matchScore * 100)}% compatibility) because:\n\n`;
    
    matchReasons.forEach((reason, index) => {
      explanation += `${index + 1}. ${reason}\n`;
    });
    
    if (match.concerns.length > 0) {
      explanation += `\nConsiderations:\n`;
      match.concerns.forEach((concern, index) => {
        explanation += `• ${concern}\n`;
      });
    }
    
    return explanation;
  }
}

// Export singleton instance
export const aiBuilderMatching = AIBuilderMatchingService.getInstance();