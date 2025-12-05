// Hardcode the Supabase credentials for direct access
const SUPABASE_URL = 'https://elipizumpfnzmzifrcnl.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaXBpenVtcGZuem16aWZyY25sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI5OTQ4NiwiZXhwIjoyMDcxODc1NDg2fQ.ITtRDQ9QxL2zsa8E95bg5IuvlUtpA8kVommxMpDSb-4';

const { createClient } = require('@supabase/supabase-js');

// Define the base URL for the site
const BASE_URL = 'https://standszone.com';

async function fetchPageContentsFromSupabase() {
  try {
    console.log('🔍 Connecting to Supabase...');
    
    // Create Supabase client with hardcoded credentials
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    console.log('🔍 Fetching page contents from Supabase...');
    
    // Fetch all records from page_contents table
    const { data, error } = await supabase
      .from('page_contents')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching page contents:', error);
      return [];
    }
    
    console.log(`✅ Successfully fetched ${data.length} pages from Supabase`);
    
    // Process the page data to extract paths
    const pages = data.map(record => {
      // Extract path from the record
      let path = record.path || '';
      
      // If no path, try to construct from id
      if (!path && record.id) {
        // For country pages: id is the country slug
        // For city pages: id is country-city
        if (record.id.includes('-') && !['home', 'custom-booth', 'booth-rental'].includes(record.id)) {
          // This is likely a city page
          const parts = record.id.split('-');
          if (parts.length >= 2) {
            // Reconstruct path for city page
            path = `/exhibition-stands/${parts[0]}/${parts.slice(1).join('-')}`;
          }
        } else if (!['home', 'custom-booth', 'booth-rental', '3d-rendering-and-concept-development', 
                      'trade-show-installation-and-dismantle', 'trade-show-project-management', 
                      'trade-show-graphics-printing'].includes(record.id)) {
          // This is likely a country page
          path = `/exhibition-stands/${record.id}`;
        } else {
          // This is a static page
          if (record.id === 'home') {
            path = '/';
          } else {
            path = `/${record.id.replace(/-/g, '-')}`;
          }
        }
      }
      
      return {
        id: record.id,
        path: path,
        updated_at: record.updated_at
      };
    });
    
    // Log some examples
    console.log('\n📄 Sample pages found:');
    pages.slice(0, 10).forEach(page => {
      console.log(`  - ${page.path} (ID: ${page.id})`);
    });
    
    if (pages.length > 10) {
      console.log(`  ... and ${pages.length - 10} more pages`);
    }
    
    return pages;
  } catch (error) {
    console.error('❌ Error connecting to Supabase:', error);
    return [];
  }
}

function generateSitemapXml(pages) {
  // Start with XML declaration and opening urlset tag
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add all pages to sitemap
  pages.forEach(page => {
    // Skip invalid paths
    if (!page.path) return;
    
    // Determine priority based on page type
    let priority = '0.5';
    if (page.path === '/') {
      priority = '1.0';
    } else if (page.path.startsWith('/exhibition-stands/') && page.path.split('/').length === 3) {
      // Country pages
      priority = '0.8';
    } else if (page.path.startsWith('/exhibition-stands/') && page.path.split('/').length === 4) {
      // City pages
      priority = '0.7';
    } else {
      // Static pages
      const staticPagePriorities = {
        '/about': '0.8',
        '/contact': '0.8',
        '/services': '0.8',
        '/blog': '0.7',
        '/builders': '0.8',
        '/exhibitions': '0.7',
        '/trade-shows': '0.7',
        '/exhibition-stands': '0.9',
        '/custom-booth': '0.8',
        '/booth-rental': '0.8',
        '/trade-show-graphics-printing': '0.7',
        '/trade-show-installation-and-dismantle': '0.7',
        '/trade-show-project-management': '0.7',
        '/quote': '0.8',
        '/subscription': '0.7'
      };
      priority = staticPagePriorities[page.path] || '0.5';
    }
    
    // Format the date for lastmod
    let lastMod = '';
    if (page.updated_at) {
      // Convert to YYYY-MM-DD format
      const date = new Date(page.updated_at);
      lastMod = `
    <lastmod>${date.toISOString().split('T')[0]}</lastmod>`;
    }
    
    xml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>${lastMod}
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>
`;
  });

  // Close urlset tag
  xml += '</urlset>';

  return xml;
}

async function main() {
  try {
    console.log('🚀 Starting Supabase page content fetch...');
    
    // Fetch pages from Supabase
    const pages = await fetchPageContentsFromSupabase();
    
    if (pages.length === 0) {
      console.log('⚠️ No pages found in Supabase. Using fallback sitemap generation.');
      return;
    }
    
    // Generate sitemap XML
    const sitemapXml = generateSitemapXml(pages);
    
    // Save to file
    const fs = require('fs');
    const path = require('path');
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    
    fs.writeFileSync(sitemapPath, sitemapXml);
    console.log(`\n✅ Sitemap generated successfully at ${sitemapPath}`);
    console.log(`📊 Total URLs included: ${pages.length}`);
    
    // Show summary
    const countryPages = pages.filter(p => p.path.startsWith('/exhibition-stands/') && p.path.split('/').length === 3);
    const cityPages = pages.filter(p => p.path.startsWith('/exhibition-stands/') && p.path.split('/').length === 4);
    const staticPages = pages.filter(p => !p.path.startsWith('/exhibition-stands/'));
    
    console.log('\n📈 Sitemap Summary:');
    console.log(`   Static pages: ${staticPages.length}`);
    console.log(`   Country pages: ${countryPages.length}`);
    console.log(`   City pages: ${cityPages.length}`);
    
    // Check specifically for UAE pages
    const uaePages = pages.filter(p => 
      p.path.includes('united-arab-emirates') || 
      p.path.includes('dubai') || 
      p.path.includes('abu-dhabi') ||
      p.path.includes('sharjah')
    );
    
    if (uaePages.length > 0) {
      console.log('\n🏢 UAE Pages Found:');
      uaePages.forEach(page => {
        console.log(`   - ${page.path}`);
      });
    } else {
      console.log('\n⚠️ No UAE pages found in the database');
    }
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
}

// Run the script
main();