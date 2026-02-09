import { NextResponse } from 'next/server';
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities';

// Define the base URL for the site
const BASE_URL = 'https://standszone.com';

// Helper function to generate XML sitemap
function generateSitemapXml(): string {
  // Start with XML declaration and opening urlset tag
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages
  const staticPages = [
    { path: '', priority: '1.0' },
    { path: '/about', priority: '0.8' },
    { path: '/contact', priority: '0.8' },
    { path: '/services', priority: '0.8' },
    { path: '/blog', priority: '0.7' },
    { path: '/builders', priority: '0.8' },
    { path: '/exhibitions', priority: '0.7' },
    { path: '/trade-shows', priority: '0.7' },
    { path: '/exhibition-stands', priority: '0.9' },
    { path: '/custom-booth', priority: '0.8' },
    { path: '/booth-rental', priority: '0.8' },
    { path: '/trade-show-graphics-printing', priority: '0.7' },
    { path: '/trade-show-installation-and-dismantle', priority: '0.7' },
    { path: '/trade-show-project-management', priority: '0.7' },
    { path: '/quote', priority: '0.8' },
    { path: '/subscription', priority: '0.7' }
  ];

  // Add static pages to sitemap
  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add country pages (limit to top countries to prevent timeout)
  const topCountries = GLOBAL_EXHIBITION_DATA.countries
    .sort((a, b) => b.exhibitionRanking - a.exhibitionRanking)
    .slice(0, 50); // Limit to top 50 countries
  
  topCountries.forEach(country => {
    xml += `  <url>
    <loc>${BASE_URL}/exhibition-stands/${country.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  // Add major city pages (limit to prevent timeout)
  const majorCities = GLOBAL_EXHIBITION_DATA.cities
    .filter(city => city.isCapital || city.annualEvents > 100)
    .slice(0, 100); // Limit to 100 major cities
  
  majorCities.forEach(city => {
    // Find the country slug for this city
    const country = GLOBAL_EXHIBITION_DATA.countries.find(c => c.name === city.country);
    if (country) {
      xml += `  <url>
    <loc>${BASE_URL}/exhibition-stands/${country.slug}/${city.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }
  });

  // Close urlset tag
  xml += '</urlset>';

  return xml;
}

// GET handler for the sitemap
export async function GET() {
  const sitemapXml = generateSitemapXml();

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}