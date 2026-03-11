// Exhibition services and types

import { Exhibition } from './exhibitions.types';
export * from './exhibitions.types';
import { realExhibitions } from './realExhibitions';
import { industries as allIndustries } from './industries';

export const exhibitions: Exhibition[] = []; // Keep for backward compatibility

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
  static getFeaturedExhibitions(limit: number = 6): any[] {
    return realExhibitions.filter(e => e.featured).slice(0, limit);
  }

  static getTrendingExhibitions(limit: number = 6): any[] {
    return realExhibitions.filter(e => e.trending).slice(0, limit);
  }

  static getUpcomingExhibitions(limit: number = 6): any[] {
    return realExhibitions
      .filter(e => e.status === 'Upcoming')
      .sort((a, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, limit);
  }
}
