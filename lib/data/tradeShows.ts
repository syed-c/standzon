// Trade show interfaces and utilities (Data migrated to Supabase)

import { Industry } from "./industries";
export type { Industry };

export interface TradeShow {
  id: string;
  name: string;
  slug: string;
  year: number;
  startDate: string;
  endDate: string;
  venue: Venue;
  city: string;
  country: string;
  countryCode: string;
  industries: Industry[];
  description: string;
  website: string;
  expectedVisitors: number;
  expectedExhibitors: number;
  standSpace: number; // total sqm
  ticketPrice: string;
  organizerName: string;
  organizerContact: string;
  isAnnual: boolean;
  significance: "Major" | "Regional" | "Specialized" | "Emerging";
  builderRecommendations: BuilderMatch[];
  previousEditionStats?: {
    visitors: number;
    exhibitors: number;
    countries: number;
    feedback: number; // rating out of 5
  };
  whyExhibit: string[];
  keyFeatures: string[];
  targetAudience: string[];
  networkingOpportunities: string[];
  costs: CostBreakdown;
}

export interface Venue {
  name: string;
  address: string;
  totalSpace: number; // sqm
  hallCount: number;
  facilities: string[];
  nearbyHotels: string[];
  transportAccess: string[];
  parkingSpaces: number;
  cateringOptions: string[];
  wifiQuality: "Excellent" | "Good" | "Fair";
  loadingBays: number;
}

export interface BuilderMatch {
  builderId: string;
  builderName: string;
  experienceLevel: "Expert" | "Experienced" | "Qualified";
  pastProjects: number;
  specializations: string[];
  recommendationScore: number; // 0-100
  whyRecommended: string[];
  portfolio: string[];
  averageStandCost: number;
  responseTime: string;
  languages: string[];
}

export interface CostBreakdown {
  standRental: {
    min: number;
    max: number;
    unit: "per sqm" | "per booth";
    currency: string;
  };
  services: {
    basicStand: number;
    customStand: number;
    premiumStand: number;
  };
  additionalCosts: Array<{
    item: string;
    cost: number;
    mandatory: boolean;
  }>;
}

// Static data removed (moved to Supabase)
export const tradeShows: TradeShow[] = [];

// Helper functions content remains but will work with empty array unless data is passed
export class TradeShowUtils {
  static formatDate(dateString: string): string {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  static calculateDuration(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
  }

  static generateSEOKeywords(show: TradeShow): string[] {
    return [
      `${show.name.toLowerCase()}`,
      `${show.name.toLowerCase()} ${show.year}`,
      `${show.city.toLowerCase()} trade show`,
      `${show.country.toLowerCase()} exhibition`,
      ...show.industries.map(
        (industry) => `${industry.name.toLowerCase()} exhibition`
      ),
      `${show.venue.name.toLowerCase()}`,
      "exhibition stand builders",
      "trade show displays",
      "booth contractors",
    ];
  }
}
