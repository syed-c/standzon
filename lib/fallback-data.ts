// Fallback data for build time when Supabase is not available
export const FALLBACK_EXHIBITION = {
  id: 'fallback-exhibition',
  slug: 'fallback-exhibition',
  name: 'Exhibition Data Unavailable',
  description: 'Exhibition information is temporarily unavailable. Please check back later.',
  location: 'TBD',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  website: '',
  venue: 'TBD',
  country: 'Unknown',
  city: 'Unknown',
  active: true,
  featured: false,
  industry: 'General',
  expectedVisitors: 'N/A',
  organizer: 'TBD'
};

export const FALLBACK_TRADE_SHOW = {
  id: 'fallback-trade-show',
  slug: 'fallback-trade-show',
  name: 'Trade Show Data Unavailable',
  description: 'Trade show information is temporarily unavailable. Please check back later.',
  location: 'TBD',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000).toISOString(),
  website: '',
  venue: 'TBD',
  country: 'Unknown',
  city: 'Unknown',
  active: true,
  featured: false,
  industry: 'General',
  expectedVisitors: 'N/A',
  organizer: 'TBD'
};

export function getFallbackData(type: 'exhibition' | 'trade-show' | 'builder') {
  switch (type) {
    case 'exhibition':
      return FALLBACK_EXHIBITION;
    case 'trade-show':
      return FALLBACK_TRADE_SHOW;
    default:
      return null;
  }
}