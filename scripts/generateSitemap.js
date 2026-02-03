const fs = require('fs');
const path = require('path');

// Import the global exhibition data
const { GLOBAL_EXHIBITION_DATA } = require('./lib/data/globalCities');

// Define the base URL for the site
const BASE_URL = 'https://standszone.com';

// Add static pages
const staticPages = [
  '',
  '/about',
  '/contact',
  '/services',
  '/blog',
  '/builders',
  '/exhibitions',
  '/trade-shows',
  '/exhibition-stands',
  '/custom-booth',
  '/booth-rental',
  '/trade-show-graphics-printing',
  '/trade-show-installation-and-dismantle',
  '/trade-show-project-management',
  '/quote',
  '/subscription',
  '/sitemap'
];

// Helper function to generate XML sitemap
function generateSitemapXml() {
  // Start with XML declaration and opening urlset tag
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages to sitemap
  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${BASE_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
  });

  // Add country pages
  GLOBAL_EXHIBITION_DATA.countries.forEach(country => {
    xml += `  <url>
    <loc>${BASE_URL}/exhibition-stands/${country.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  // Add city pages
  GLOBAL_EXHIBITION_DATA.cities.forEach(city => {
    // Find the country slug for this city
    const country = GLOBAL_EXHIBITION_DATA.countries.find(c => c.name === city.country);
    const countrySlug = country ? country.slug : city.country.toLowerCase().replace(/\s+/g, '-');
    
    xml += `  <url>
    <loc>${BASE_URL}/exhibition-stands/${countrySlug}/${city.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  });

  // Close urlset tag
  xml += '</urlset>';

  return xml;
}

// Generate and save the sitemap
const sitemapXml = generateSitemapXml();
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemapXml);

console.log(`Sitemap generated successfully at ${sitemapPath}`);
console.log(`Total URLs: ${staticPages.length + GLOBAL_EXHIBITION_DATA.countries.length + GLOBAL_EXHIBITION_DATA.cities.length}`);