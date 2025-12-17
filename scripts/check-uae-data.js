const fs = require('fs');

// Simple check for UAE data
console.log('Checking UAE data...');

// Check if UAE country exists in global data
const globalCitiesPath = './lib/data/globalCities.ts';
if (fs.existsSync(globalCitiesPath)) {
  const content = fs.readFileSync(globalCitiesPath, 'utf8');
  const hasUAE = content.includes('United Arab Emirates') || content.includes('united-arab-emirates');
  console.log('UAE data in globalCities.ts:', hasUAE ? 'YES' : 'NO');
  
  if (hasUAE) {
    // Count occurrences
    const uaeMatches = (content.match(/United Arab Emirates/g) || []).length;
    const uaeSlugMatches = (content.match(/united-arab-emirates/g) || []).length;
    console.log(`Found ${uaeMatches} occurrences of "United Arab Emirates"`);
    console.log(`Found ${uaeSlugMatches} occurrences of "united-arab-emirates"`);
  }
} else {
  console.log('globalCities.ts not found');
}

// Check sitemap
const sitemapPath = './public/sitemap.xml';
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const dubaiExists = sitemapContent.includes('/exhibition-stands/united-arab-emirates/dubai');
  const abuDhabiExists = sitemapContent.includes('/exhibition-stands/united-arab-emirates/abu-dhabi');
  const uaeExists = sitemapContent.includes('/exhibition-stands/united-arab-emirates');
  
  console.log('Sitemap entries:');
  console.log('- UAE Country Page:', uaeExists ? 'INCLUDED' : 'MISSING');
  console.log('- Dubai City Page:', dubaiExists ? 'INCLUDED' : 'MISSING');
  console.log('- Abu Dhabi City Page:', abuDhabiExists ? 'INCLUDED' : 'MISSING');
} else {
  console.log('sitemap.xml not found');
}