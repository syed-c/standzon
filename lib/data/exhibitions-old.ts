// Exhibition interfaces (Data migrated to Supabase)

import { Industry } from "./industries";

export interface Exhibition {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  year: number;
  city: string;
  country: string;
  countryCode: string;
  venue: ExhibitionVenue;
  industry: Industry;
  tags: string[];
  website: string;
  status: 'Upcoming' | 'Live' | 'Completed' | 'Cancelled' | 'Postponed';
  expectedAttendees: number;
  expectedExhibitors: number;
  hallsUsed: number;
  totalSpace: number; // sqm
  pricing: ExhibitionPricing;
  organizer: Organizer;
  registrationInfo: RegistrationInfo;
  keyFeatures: string[];
  targetAudience: string[];
  specialEvents: SpecialEvent[];
  images: string[];
  logo: string;
  socialMedia: SocialMedia;
  contactInfo: ContactInfo;
  linkedVendors: LinkedVendor[];
  previousEditions: PreviousEdition[];
  accessibility: AccessibilityInfo;
  sustainability: SustainabilityFeatures;
  covid19Measures: string[];
  networkingOpportunities: string[];
  awards: string[];
  mediaPartners: string[];
  sponsorshipLevels: SponsorshipLevel[];
  featured: boolean;
  trending: boolean;
  newEvent: boolean;
}

export interface ExhibitionVenue {
  name: string;
  address: string;
  city: string;
  country: string;
  totalHalls: number;
  totalSpace: number; // sqm
  parkingSpaces: number;
  nearestAirport: string;
  distanceFromAirport: string;
  publicTransport: string[];
  facilities: string[];
  website: string;
  rating: number;
}

export interface ExhibitionPricing {
  standardBooth: { min: number; max: number; currency: string; unit: string };
  premiumBooth: { min: number; max: number; currency: string; unit: string };
  cornerBooth: { min: number; max: number; currency: string; unit: string };
  islandBooth: { min: number; max: number; currency: string; unit: string };
  shellScheme: boolean;
  spaceOnly: boolean;
  earlyBirdDiscount: number; // percentage
  currency: string;
}

export interface Organizer {
  name: string;
  website: string;
  email: string;
  phone: string;
  headquarters: string;
  establishedYear: number;
  otherEvents: string[];
  rating: number;
}

export interface RegistrationInfo {
  exhibitorRegistration: {
    opens: string;
    closes: string;
    fee: number;
    currency: string;
    requirements: string[];
  };
  visitorRegistration: {
    opens: string;
    closes: string;
    fee: number;
    currency: string;
    freeOptions: string[];
  };
  deadlines: {
    earlyBird: string;
    final: string;
    onSite: boolean;
  };
}

export interface SpecialEvent {
  name: string;
  type: 'Conference' | 'Workshop' | 'Networking' | 'Awards' | 'Keynote';
  date: string;
  time: string;
  duration: string;
  speaker?: string;
  description: string;
  fee: number;
  currency: string;
  capacity: number;
  registrationRequired: boolean;
}

export interface SocialMedia {
  website: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  hashtag: string;
}

export interface ContactInfo {
  generalInfo: string;
  exhibitorServices: string;
  visitorServices: string;
  media: string;
  emergencyContact: string;
}

export interface LinkedVendor {
  id: string;
  name: string;
  type: 'Booth Builder' | 'Event Planner';
  rating: number;
  experienceWithEvent: number; // years
  recommendedBy: 'Organizer' | 'Community' | 'Previous Clients';
}

export interface PreviousEdition {
  year: number;
  attendees: number;
  exhibitors: number;
  countries: number;
  highlights: string[];
  growthRate: number; // percentage from previous year
}

export interface AccessibilityInfo {
  wheelchairAccessible: boolean;
  assistedListening: boolean;
  signLanguage: boolean;
  brailleSignage: boolean;
  accessibleParking: boolean;
  services: string[];
}

export interface SustainabilityFeatures {
  carbonNeutral: boolean;
  wasteReduction: boolean;
  digitalFirst: boolean;
  publicTransportIncentives: boolean;
  sustainableCatering: boolean;
  greenCertifications: string[];
  environmentalGoals: string[];
}

export interface SponsorshipLevel {
  name: string;
  price: number;
  currency: string;
  benefits: string[];
}

// Static data removed (moved to Supabase)
export const exhibitions: Exhibition[] = [];

// Helper to avoid circular dependencies in components
import { realExhibitions } from './realExhibitions';
import { industries as allIndustries } from './industries';

export const exhibitionIndustries = allIndustries;

export const exhibitionStats = {
  totalCount: realExhibitions.length,
  upcomingCount: realExhibitions.filter(e => e.status === 'Upcoming').length,
  featuredCount: realExhibitions.filter(e => e.featured).length,
  trendingCount: realExhibitions.filter(e => e.trending).length,
  totalExpectedAttendees: realExhibitions.reduce((sum, e) => sum + (e.expectedAttendees || 0), 0),
  totalExpectedExhibitors: realExhibitions.reduce((sum, e) => sum + (e.expectedExhibitors || 0), 0),
};

export class ExhibitionMatchingService {
  static getFeaturedExhibitions(limit: number = 6): Exhibition[] {
    return realExhibitions.filter(e => e.featured).slice(0, limit);
  }

  static getTrendingExhibitions(limit: number = 6): Exhibition[] {
    return realExhibitions.filter(e => e.trending).slice(0, limit);
  }

  static getUpcomingExhibitions(limit: number = 6): Exhibition[] {
    return realExhibitions
      .filter(e => e.status === 'Upcoming')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, limit);
  }
}