const fs = require('fs');
const path = require('path');

// Define the base URL for the site
const BASE_URL = 'https://standszone.com';

// Helper function to fetch all pages from CMS
async function fetchAllPagesFromCMS() {
  try {
    // Since we're running this as a script, we'll use the local data files
    // Use the correct path for the data file
    const dataPath = path.join(__dirname, '..', 'lib', 'data', 'globalCities.ts');
    // For JavaScript scripts, we'll use a simpler approach and include the data directly
    
    const pages = [];
    
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
    
    pages.push(...staticPages);
    
    // Add country pages (using a subset for now)
    const countryPages = [
      { path: '/exhibition-stands/united-kingdom', priority: '0.8' },
      { path: '/exhibition-stands/france', priority: '0.8' },
      { path: '/exhibition-stands/germany', priority: '0.8' },
      { path: '/exhibition-stands/italy', priority: '0.8' },
      { path: '/exhibition-stands/spain', priority: '0.8' },
      { path: '/exhibition-stands/united-states', priority: '0.8' },
      { path: '/exhibition-stands/canada', priority: '0.8' },
      { path: '/exhibition-stands/china', priority: '0.8' },
      { path: '/exhibition-stands/japan', priority: '0.8' },
      { path: '/exhibition-stands/india', priority: '0.8' },
      { path: '/exhibition-stands/brazil', priority: '0.8' },
      { path: '/exhibition-stands/australia', priority: '0.8' }
    ];
    
    pages.push(...countryPages);
    
    // Add some city pages
    const cityPages = [
      { path: '/exhibition-stands/united-kingdom/london', priority: '0.7' },
      { path: '/exhibition-stands/france/paris', priority: '0.7' },
      { path: '/exhibition-stands/germany/berlin', priority: '0.7' },
      { path: '/exhibition-stands/italy/rome', priority: '0.7' },
      { path: '/exhibition-stands/spain/madrid', priority: '0.7' },
      { path: '/exhibition-stands/united-states/new-york', priority: '0.7' },
      { path: '/exhibition-stands/canada/toronto', priority: '0.7' },
      { path: '/exhibition-stands/china/shanghai', priority: '0.7' },
      { path: '/exhibition-stands/japan/tokyo', priority: '0.7' },
      { path: '/exhibition-stands/india/mumbai', priority: '0.7' },
      { path: '/exhibition-stands/brazil/sao-paulo', priority: '0.7' },
      { path: '/exhibition-stands/australia/sydney', priority: '0.7' }
    ];
    
    pages.push(...cityPages);
    
    return pages;
  } catch (error) {
    console.error('Error fetching pages from CMS:', error);
    // Fallback to basic static pages
    return [
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
  }
}

// Helper function to generate XML sitemap
async function generateSitemapXml() {
  // Start with XML declaration and opening urlset tag
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Fetch all pages from CMS
  const pages = await fetchAllPagesFromCMS();
  
  // Add all pages to sitemap
  pages.forEach(page => {
    xml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Close urlset tag
  xml += '</urlset>';

  return xml;
}

// Generate and save the sitemap
async function generateSitemap() {
  const sitemapXml = await generateSitemapXml();
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

  fs.writeFileSync(sitemapPath, sitemapXml);
  console.log(`Sitemap generated successfully at ${sitemapPath}`);
  const pages = await fetchAllPagesFromCMS();
  console.log(`Total URLs: ${pages.length}`);
}

generateSitemap();