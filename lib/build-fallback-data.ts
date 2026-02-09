// Build-time fallback data to prevent data fetching timeouts during build
// This provides minimal data for static generation without Supabase dependencies

export const BUILD_FALLBACK_DATA = {
  // Minimal exhibition data for build time
  exhibitions: [
    {
      id: 'ces-2025',
      slug: 'ces-2025',
      title: 'CES 2025',
      location_city: 'Las Vegas',
      location_country: 'United States',
      start_date: '2025-01-07',
      end_date: '2025-01-10',
      description: 'CES is the world\'s most powerful tech event, driving future innovation across industries.',
      venue_name: 'Las Vegas Convention Center',
      venue_address: '3150 Paradise Rd, Las Vegas, NV 89109',
      website: 'https://www.ces.tech',
      organizer: 'Consumer Technology Association',
      industry_id: 'technology',
      is_featured: true,
      status: 'published',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'hannover-messe-2025',
      slug: 'hannover-messe-2025',
      title: 'Hannover Messe 2025',
      location_city: 'Hannover',
      location_country: 'Germany',
      start_date: '2025-03-31',
      end_date: '2025-04-04',
      description: 'The world\'s leading trade fair for industrial technology and digital transformation.',
      venue_name: 'Hannover Exhibition Centre',
      venue_address: 'Messegelände, 30521 Hannover, Germany',
      website: 'https://www.hannovermesse.de',
      organizer: 'Deutsche Messe AG',
      industry_id: 'industrial',
      is_featured: true,
      status: 'published',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ],
  
  // Minimal trade show data for build time
  tradeShows: [
    {
      id: 'ifa-berlin-2025',
      slug: 'ifa-berlin-2025',
      title: 'IFA Berlin 2025',
      location_city: 'Berlin',
      location_country: 'Germany',
      start_date: '2025-09-05',
      end_date: '2025-09-09',
      description: 'Europe\'s largest consumer electronics trade show showcasing innovation and technology.',
      venue_name: 'Messe Berlin',
      venue_address: 'Messeplatz 1, 13353 Berlin, Germany',
      website: 'https://www.ifa-berlin.com',
      organizer: 'Messe Berlin',
      industry_id: 'technology',
      is_featured: true,
      status: 'published',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ],
  
  // Minimal builder data for build time
  builders: [
    {
      id: 'premium-stands-london',
      slug: 'premium-stands-london',
      company_name: 'Premium Stands London',
      headquarters_city: 'London',
      headquarters_country: 'United Kingdom',
      verified: true,
      claimed: true,
      claim_status: 'claimed',
      rating: 4.8,
      review_count: 127,
      projects_completed: 350,
      team_size: 45,
      established_year: 2010,
      primary_email: 'info@premiumstandslondon.com',
      phone: '+44 20 7123 4567',
      website: 'https://www.premiumstandslondon.com',
      company_description: 'Leading exhibition stand builders in London with over 15 years of experience creating custom displays for international trade shows.',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]
};

// Helper functions to get fallback data
export function getFallbackExhibition(slug: string) {
  return BUILD_FALLBACK_DATA.exhibitions.find(ex => ex.slug === slug);
}

export function getFallbackTradeShow(slug: string) {
  return BUILD_FALLBACK_DATA.tradeShows.find(ts => ts.slug === slug);
}

export function getFallbackBuilder(slug: string) {
  return BUILD_FALLBACK_DATA.builders.find(b => b.slug === slug);
}

export function getAllFallbackExhibitionSlugs() {
  return BUILD_FALLBACK_DATA.exhibitions.map(ex => ex.slug);
}

export function getAllFallbackTradeShowSlugs() {
  return BUILD_FALLBACK_DATA.tradeShows.map(ts => ts.slug);
}

export function getAllFallbackBuilderSlugs() {
  return BUILD_FALLBACK_DATA.builders.map(b => b.slug);
}