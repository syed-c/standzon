const fs = require('fs');
const path = require('path');

// Import the actual data from the CMS
const { GLOBAL_EXHIBITION_DATA } = require('../lib/data/globalCities.ts');

// Define the base URL for the site
const BASE_URL = 'https://standszone.com';

// Helper function to generate XML sitemap
function generateSitemapXml() {
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

  // Add country pages from the actual CMS data
  GLOBAL_EXHIBITION_DATA.countries.forEach(country => {
    xml += `  <url>
    <loc>${BASE_URL}/exhibition-stands/${country.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  // Add city pages from the actual CMS data
  GLOBAL_EXHIBITION_DATA.cities.forEach(city => {
    // Find the country slug for this city
    const country = GLOBAL_EXHIBITION_DATA.countries.find(c => c.name === city.country);
    if (country) {
      xml += `  <url>
    <loc>${BASE_URL}/exhibition-stands/${country.slug}/${city.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    }
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
console.log(`Total URLs: ${16 + GLOBAL_EXHIBITION_DATA.countries.length + GLOBAL_EXHIBITION_DATA.cities.length}`);