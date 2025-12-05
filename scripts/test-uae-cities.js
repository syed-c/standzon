const fs = require('fs');
const path = require('path');

// Test if UAE cities are included in the global data
try {
  // Import the global data
  const { GLOBAL_EXHIBITION_DATA } = require('../lib/data/globalCities');
  
  console.log('=== UAE Country Check ===');
  const uaeCountry = GLOBAL_EXHIBITION_DATA.countries.find(c => c.slug === 'united-arab-emirates');
  console.log('UAE Country:', uaeCountry ? 'FOUND' : 'NOT FOUND');
  if (uaeCountry) {
    console.log('Country Data:', {
      name: uaeCountry.name,
      slug: uaeCountry.slug,
      majorCities: uaeCountry.majorCities
    });
  }
  
  console.log('\n=== UAE Cities Check ===');
  const uaeCities = GLOBAL_EXHIBITION_DATA.cities.filter(c => c.country === 'United Arab Emirates');
  console.log('UAE Cities Count:', uaeCities.length);
  uaeCities.forEach(city => {
    console.log(`- ${city.name} (${city.slug})`);
  });
  
  console.log('\n=== Sitemap Check ===');
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    const dubaiExists = sitemapContent.includes('/exhibition-stands/united-arab-emirates/dubai');
    const abuDhabiExists = sitemapContent.includes('/exhibition-stands/united-arab-emirates/abu-dhabi');
    const uaeExists = sitemapContent.includes('/exhibition-stands/united-arab-emirates');
    
    console.log('UAE Country Page:', uaeExists ? 'INCLUDED' : 'MISSING');
    console.log('Dubai City Page:', dubaiExists ? 'INCLUDED' : 'MISSING');
    console.log('Abu Dhabi City Page:', abuDhabiExists ? 'INCLUDED' : 'MISSING');
    
    if (!dubaiExists || !abuDhabiExists || !uaeExists) {
      console.log('\n=== Missing URLs ===');
      if (!uaeExists) console.log('- https://standszone.com/exhibition-stands/united-arab-emirates');
      if (!dubaiExists) console.log('- https://standszone.com/exhibition-stands/united-arab-emirates/dubai');
      if (!abuDhabiExists) console.log('- https://standszone.com/exhibition-stands/united-arab-emirates/abu-dhabi');
    }
  } else {
    console.log('Sitemap file not found');
  }
  
} catch (error) {
  console.error('Error testing UAE cities:', error);
}