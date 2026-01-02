/**
 * Types for content fetching and parsing
 */

export interface ParsedContentBlock {
  id: string;
  type: string;
  data: any;
  order: number;
}

export interface ParsedPageContent {
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  hero: {
    title: string;
    description: string;
    subtitle: string;
    ctaText: string;
  };
  content: {
    introduction: string;
    whyChooseSection: string;
    industryOverview: string;
    venueInformation: string;
    builderAdvantages: string;
    conclusion: string;
  };
  design: {
    primaryColor: string;
    accentColor: string;
    layout: 'modern' | 'classic' | 'minimal';
    showStats: boolean;
    showMap: boolean;
  };
  galleryImages: string[];
  sections: ParsedContentBlock[];
}

export interface ContentFetchResult {
  content: ParsedPageContent;
  builders: any[];
  cities: any[];
  stats: {
    totalBuilders: number;
    averageRating: number;
    verifiedBuilders: number;
    totalProjects: number;
  };
}
