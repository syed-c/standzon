// Unified Vendor System - Booth Builders + Exhibition Builders Only

import { ExhibitionBuilder } from './exhibitionBuilders';

export type VendorType = 'booth-builder' | 'exhibition-builder' | 'venue-provider';

export interface UnifiedVendor {
  id: string;
  vendorType: VendorType;
  companyName: string;
  slug: string;
  logo: string;
  establishedYear: number;
  headquarters: VendorLocation;
  serviceLocations: VendorLocation[];
  // Contact info stored but not shown publicly per requirements
  contactInfo: VendorContactInfo;
  rating: number;
  reviewCount: number;
  verified: boolean;
  premiumMember: boolean;
  status: 'Pending' | 'Verified' | 'Featured' | 'Suspended';
  profileCompleteness: number; // 0-100%
  lastActivity: string;
  joinDate: string;
  leadCount: number;
  responseRate: number; // percentage
  responseTime: string;
  languages: string[];
  
  // Additional metadata for admin management
  adminNotes: string;
  verificationDocuments: VerificationDocument[];
  subscriptionTier: 'Basic' | 'Professional' | 'Premium' | 'Enterprise';
  monthlyFeePaid: boolean;
  contractExpiryDate: string;
  
  // SEO and marketing
  seoKeywords: string[];
  metaDescription: string;
  socialProof: SocialProofMetrics;
  
  // Performance metrics
  metrics: VendorMetrics;
}

export interface VendorLocation {
  city: string;
  country: string;
  countryCode: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isHeadquarters?: boolean;
  serviceRadius?: number; // in kilometers
}

export interface VendorContactInfo {
  primaryEmail: string;
  phone: string;
  website: string;
  contactPerson: string;
  position: string;
  emergencyContact?: string;
  salesEmail?: string;
  supportEmail?: string;
  whatsapp?: string;
  skype?: string;
}

export interface VerificationDocument {
  type: 'Business License' | 'Insurance Certificate' | 'Tax Registration' | 'Professional Certification';
  fileName: string;
  uploadDate: string;
  expiryDate?: string;
  verified: boolean;
  verifiedBy?: string;
  verificationDate?: string;
}

export interface SocialProofMetrics {
  totalProjects: number;
  featuredProjects: number;
  clientTestimonials: number;
  awardsReceived: number;
  mediaFeatures: number;
  industryRecognitions: string[];
}

export interface VendorMetrics {
  profileViews: number;
  leadInquiries: number;
  quotesSubmitted: number;
  projectsWon: number;
  conversionRate: number; // percentage
  averageProjectValue: number;
  customerSatisfactionScore: number; // 0-100
  repeatClientRate: number; // percentage
  monthlyGrowthRate: number; // percentage
}

export interface VendorQuoteRequest {
  id: string;
  vendorId: string;
  vendorType: VendorType;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  projectType: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  location: string;
  specialRequirements: string;
  attachments: string[];
  status: 'New' | 'Contacted' | 'Quote Sent' | 'Won' | 'Lost' | 'Expired';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  submittedAt: string;
  respondedAt?: string;
  responseTime?: string; // calculated
  quotedAmount?: number;
  currency?: string;
  adminNotes: string;
  leadSource: 'Website' | 'Exhibition' | 'Referral' | 'Direct' | 'Partner';
}

export interface VendorAnalytics {
  totalVendors: number;
  vendorsByType: Record<VendorType, number>;
  vendorsByStatus: Record<string, number>;
  vendorsByCountry: Record<string, number>;
  vendorsByCity: Record<string, number>;
  totalQuoteRequests: number;
  averageResponseTime: string;
  topPerformingVendors: UnifiedVendor[];
  recentlyJoined: UnifiedVendor[];
  needsAttention: UnifiedVendor[];
  revenue: {
    totalMonthlyRevenue: number;
    revenueByTier: Record<string, number>;
    projectedAnnualRevenue: number;
    currency: string;
  };
  leadMetrics: {
    totalLeads: number;
    leadsThisMonth: number;
    conversionRate: number;
    averageLeadValue: number;
  };
}

// Vendor Management Service
export class VendorManagementService {
  
  static getAllVendors(): UnifiedVendor[] {
    // This would integrate with exhibitionBuilders and eventPlanners data
    // For now, returning empty array as this is the structure
    return [];
  }
  
  static getVendorsByType(type: VendorType): UnifiedVendor[] {
    return this.getAllVendors().filter(vendor => vendor.vendorType === type);
  }
  
  static getVendorsByStatus(status: string): UnifiedVendor[] {
    return this.getAllVendors().filter(vendor => vendor.status === status);
  }
  
  static getVendorsByLocation(city: string, country: string): UnifiedVendor[] {
    return this.getAllVendors().filter(vendor =>
      vendor.serviceLocations.some(location => 
        location.city.toLowerCase() === city.toLowerCase() && 
        location.country.toLowerCase() === country.toLowerCase()
      )
    );
  }
  
  static searchVendors(query: string): UnifiedVendor[] {
    const searchTerm = query.toLowerCase();
    return this.getAllVendors().filter(vendor =>
      vendor.companyName.toLowerCase().includes(searchTerm) ||
      vendor.serviceLocations.some(location => 
        location.city.toLowerCase().includes(searchTerm) ||
        location.country.toLowerCase().includes(searchTerm)
      ) ||
      vendor.seoKeywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
  }
  
  static getTopPerformingVendors(limit: number = 10): UnifiedVendor[] {
    return this.getAllVendors()
      .sort((a, b) => {
        // Sort by rating, then by review count, then by lead conversion
        if (a.rating !== b.rating) return b.rating - a.rating;
        if (a.reviewCount !== b.reviewCount) return b.reviewCount - a.reviewCount;
        return b.metrics.conversionRate - a.metrics.conversionRate;
      })
      .slice(0, limit);
  }
  
  static getVendorsNeedingAttention(): UnifiedVendor[] {
    return this.getAllVendors().filter(vendor =>
      vendor.profileCompleteness < 80 ||
      vendor.responseRate < 70 ||
      vendor.status === 'Pending' ||
      !vendor.monthlyFeePaid ||
      new Date(vendor.contractExpiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Expires in 30 days
    );
  }
  
  static getRecentlyJoined(days: number = 30): UnifiedVendor[] {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.getAllVendors()
      .filter(vendor => new Date(vendor.joinDate) > cutoffDate)
      .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
  }
  
  static calculateAnalytics(): VendorAnalytics {
    const allVendors = this.getAllVendors();
    
    return {
      totalVendors: allVendors.length,
      vendorsByType: {
        'booth-builder': allVendors.filter(v => v.vendorType === 'booth-builder').length,
        'event-planner': allVendors.filter(v => v.vendorType === 'event-planner').length,
        'celebration-planner': allVendors.filter(v => v.vendorType === 'celebration-planner').length,
        'venue-provider': allVendors.filter(v => v.vendorType === 'venue-provider').length
      },
      vendorsByStatus: {
        'Pending': allVendors.filter(v => v.status === 'Pending').length,
        'Verified': allVendors.filter(v => v.status === 'Verified').length,
        'Featured': allVendors.filter(v => v.status === 'Featured').length,
        'Suspended': allVendors.filter(v => v.status === 'Suspended').length
      },
      vendorsByCountry: this.groupByField(allVendors, v => v.headquarters.country),
      vendorsByCity: this.groupByField(allVendors, v => v.headquarters.city),
      totalQuoteRequests: allVendors.reduce((sum, v) => sum + v.leadCount, 0),
      averageResponseTime: this.calculateAverageResponseTime(allVendors),
      topPerformingVendors: this.getTopPerformingVendors(5),
      recentlyJoined: this.getRecentlyJoined(30),
      needsAttention: this.getVendorsNeedingAttention(),
      revenue: this.calculateRevenueMetrics(allVendors),
      leadMetrics: this.calculateLeadMetrics(allVendors)
    };
  }
  
  private static groupByField<T>(array: T[], accessor: (item: T) => string): Record<string, number> {
    return array.reduce((acc, item) => {
      const key = accessor(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
  
  private static calculateAverageResponseTime(vendors: UnifiedVendor[]): string {
    if (vendors.length === 0) return '0 hours';
    
    const totalHours = vendors.reduce((sum, vendor) => {
      const hours = parseFloat(vendor.responseTime.replace(/[^\d.]/g, ''));
      return sum + (isNaN(hours) ? 0 : hours);
    }, 0);
    
    const average = totalHours / vendors.length;
    return `${average.toFixed(1)} hours`;
  }
  
  private static calculateRevenueMetrics(vendors: UnifiedVendor[]) {
    const subscriptionRevenue = {
      'Basic': 99,
      'Professional': 199,
      'Premium': 399,
      'Enterprise': 799
    };
    
    const monthlyRevenue = vendors.reduce((sum, vendor) => {
      return sum + (vendor.monthlyFeePaid ? subscriptionRevenue[vendor.subscriptionTier] : 0);
    }, 0);
    
    return {
      totalMonthlyRevenue: monthlyRevenue,
      revenueByTier: {
        'Basic': vendors.filter(v => v.subscriptionTier === 'Basic' && v.monthlyFeePaid).length * 99,
        'Professional': vendors.filter(v => v.subscriptionTier === 'Professional' && v.monthlyFeePaid).length * 199,
        'Premium': vendors.filter(v => v.subscriptionTier === 'Premium' && v.monthlyFeePaid).length * 399,
        'Enterprise': vendors.filter(v => v.subscriptionTier === 'Enterprise' && v.monthlyFeePaid).length * 799
      },
      projectedAnnualRevenue: monthlyRevenue * 12,
      currency: 'USD'
    };
  }
  
  private static calculateLeadMetrics(vendors: UnifiedVendor[]) {
    const totalLeads = vendors.reduce((sum, vendor) => sum + vendor.leadCount, 0);
    const totalProjectsWon = vendors.reduce((sum, vendor) => sum + vendor.metrics.projectsWon, 0);
    const totalProjectValue = vendors.reduce((sum, vendor) => 
      sum + (vendor.metrics.averageProjectValue * vendor.metrics.projectsWon), 0);
    
    return {
      totalLeads,
      leadsThisMonth: Math.floor(totalLeads * 0.15), // Estimate 15% of leads are from this month
      conversionRate: totalLeads > 0 ? (totalProjectsWon / totalLeads) * 100 : 0,
      averageLeadValue: totalProjectsWon > 0 ? totalProjectValue / totalProjectsWon : 0
    };
  }
}

// Lead Management Service
export class LeadManagementService {
  
  static getAllQuoteRequests(): VendorQuoteRequest[] {
    // This would fetch from database
    return [];
  }
  
  static getQuoteRequestsByVendor(vendorId: string): VendorQuoteRequest[] {
    return this.getAllQuoteRequests().filter(request => request.vendorId === vendorId);
  }
  
  static getQuoteRequestsByStatus(status: string): VendorQuoteRequest[] {
    return this.getAllQuoteRequests().filter(request => request.status === status);
  }
  
  static getQuoteRequestsByPriority(priority: string): VendorQuoteRequest[] {
    return this.getAllQuoteRequests().filter(request => request.priority === priority);
  }
  
  static getRecentQuoteRequests(days: number = 7): VendorQuoteRequest[] {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.getAllQuoteRequests()
      .filter(request => new Date(request.submittedAt) > cutoffDate)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }
  
  static getOverdueQuoteRequests(): VendorQuoteRequest[] {
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    return this.getAllQuoteRequests().filter(request => 
      request.status === 'New' && 
      new Date(request.submittedAt) < fortyEightHoursAgo
    );
  }
}

// Default vendor type configurations
export const vendorTypeConfigs = {
  'booth-builder': {
    displayName: 'Exhibition Booth Builder',
    description: 'Specialized in designing and building exhibition stands and trade show booths',
    icon: '🏗️',
    color: '#3B82F6',
    defaultServices: ['Custom Stand Design', 'Modular Systems', 'Stand Rental', 'Installation Services'],
    requiredDocuments: ['Business License', 'Insurance Certificate', 'Portfolio Samples'],
    subscriptionTiers: ['Basic', 'Professional', 'Premium', 'Enterprise']
  },
  'event-planner': {
    displayName: 'Event Planner',
    description: 'Professional event planning and coordination services',
    icon: '🎉',
    color: '#10B981',
    defaultServices: ['Event Planning', 'Venue Coordination', 'Vendor Management', 'Day-of Coordination'],
    requiredDocuments: ['Business License', 'Insurance Certificate', 'Event Planning Certification'],
    subscriptionTiers: ['Basic', 'Professional', 'Premium', 'Enterprise']
  },
  'celebration-planner': {
    displayName: 'Celebration Planner',
    description: 'Specialized in personal celebrations, birthdays, and social events',
    icon: '🎂',
    color: '#F59E0B',
    defaultServices: ['Birthday Parties', 'Anniversary Celebrations', 'Social Events', 'Theme Parties'],
    requiredDocuments: ['Business License', 'Insurance Certificate'],
    subscriptionTiers: ['Basic', 'Professional', 'Premium']
  },
  'venue-provider': {
    displayName: 'Venue Provider',
    description: 'Event venues and location services',
    icon: '🏛️',
    color: '#8B5CF6',
    defaultServices: ['Venue Rental', 'Catering Services', 'Audio/Visual Equipment', 'Event Support'],
    requiredDocuments: ['Business License', 'Insurance Certificate', 'Fire Safety Certificate', 'Venue Photos'],
    subscriptionTiers: ['Professional', 'Premium', 'Enterprise']
  }
};

// Privacy and Security Settings
export const contactInfoPolicy = {
  hiddenFields: ['primaryEmail', 'phone', 'whatsapp', 'skype'],
  publicFields: ['website'],
  internalOnlyFields: ['emergencyContact', 'salesEmail', 'supportEmail'],
  note: 'As per requirements, direct contact information is not shown publicly. All inquiries go through the platform.'
};

console.log('Unified Vendor System loaded with', Object.keys(vendorTypeConfigs).length, 'vendor types');

export default VendorManagementService;