const fs = require('fs');
const path = require('path');

// Define the base URL for the site
const BASE_URL = 'https://standszone.com';

// Function to generate a comprehensive sitemap with all CMS pages
function generateComprehensiveSitemap() {
  try {
    // Define static pages
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

    // Define a comprehensive list of countries and cities
    // This is a representative sample - in a real implementation, you would fetch this from your CMS
    const countries = [
      'united-kingdom', 'france', 'germany', 'italy', 'spain', 'netherlands', 'belgium', 'switzerland',
      'austria', 'sweden', 'norway', 'denmark', 'finland', 'poland', 'czech-republic', 'hungary',
      'portugal', 'greece', 'ireland', 'russia', 'romania', 'ukraine', 'croatia', 'serbia',
      'bulgaria', 'slovakia', 'slovenia', 'estonia', 'latvia', 'lithuania', 'luxembourg', 'malta',
      'cyprus', 'iceland', 'turkey', 'china', 'japan', 'india', 'south-korea', 'indonesia',
      'thailand', 'malaysia', 'philippines', 'vietnam', 'singapore', 'taiwan', 'hong-kong', 'israel',
      'saudi-arabia', 'united-arab-emirates', 'qatar', 'kuwait', 'bahrain', 'oman', 'lebanon', 'jordan',
      'iraq', 'iran', 'pakistan', 'bangladesh', 'sri-lanka', 'nepal', 'myanmar', 'cambodia',
      'laos', 'mongolia', 'kazakhstan', 'uzbekistan', 'azerbaijan', 'georgia', 'armenia',
      'united-states', 'canada', 'mexico', 'guatemala', 'belize', 'el-salvador', 'honduras',
      'nicaragua', 'costa-rica', 'panama', 'brazil', 'argentina', 'chile', 'peru', 'colombia',
      'venezuela', 'ecuador', 'bolivia', 'paraguay', 'uruguay', 'guyana', 'suriname',
      'south-africa', 'egypt', 'nigeria', 'algeria', 'sudan', 'kenya', 'ethiopia', 'ghana',
      'morocco', 'tanzania', 'uganda', 'mozambique', 'madagascar', 'cameroon', 'ivory-coast',
      'niger', 'burkina-faso', 'mali', 'malawi', 'zambia', 'senegal', 'zimbabwe', 'angola',
      'botswana', 'lesotho', 'swaziland', 'namibia', 'australia', 'new-zealand', 'fiji',
      'papua-new-guinea', 'solomon-islands', 'vanuatu', 'samoa', 'tonga'
    ];

    const cities = [
      // UK
      { country: 'united-kingdom', city: 'london' },
      { country: 'united-kingdom', city: 'birmingham' },
      { country: 'united-kingdom', city: 'manchester' },
      { country: 'united-kingdom', city: 'glasgow' },
      { country: 'united-kingdom', city: 'liverpool' },
      { country: 'united-kingdom', city: 'leeds' },
      { country: 'united-kingdom', city: 'sheffield' },
      { country: 'united-kingdom', city: 'edinburgh' },
      { country: 'united-kingdom', city: 'cardiff' },
      { country: 'united-kingdom', city: 'belfast' },
      
      // France
      { country: 'france', city: 'paris' },
      { country: 'france', city: 'lyon' },
      { country: 'france', city: 'cannes' },
      { country: 'france', city: 'strasbourg' },
      { country: 'france', city: 'nice' },
      { country: 'france', city: 'marseille' },
      { country: 'france', city: 'bordeaux' },
      { country: 'france', city: 'toulouse' },
      { country: 'france', city: 'nantes' },
      { country: 'france', city: 'lille' },
      
      // Germany
      { country: 'germany', city: 'berlin' },
      { country: 'germany', city: 'frankfurt' },
      { country: 'germany', city: 'munich' },
      { country: 'germany', city: 'hamburg' },
      { country: 'germany', city: 'cologne' },
      { country: 'germany', city: 'dusseldorf' },
      { country: 'germany', city: 'stuttgart' },
      { country: 'germany', city: 'dortmund' },
      { country: 'germany', city: 'essen' },
      { country: 'germany', city: 'leipzig' },
      
      // UAE
      { country: 'united-arab-emirates', city: 'dubai' },
      { country: 'united-arab-emirates', city: 'abu-dhabi' },
      { country: 'united-arab-emirates', city: 'sharjah' },
      
      // Add more cities for other major countries...
      { country: 'italy', city: 'milan' },
      { country: 'italy', city: 'rome' },
      { country: 'spain', city: 'madrid' },
      { country: 'spain', city: 'barcelona' },
      { country: 'united-states', city: 'new-york' },
      { country: 'united-states', city: 'los-angeles' },
      { country: 'united-states', city: 'chicago' },
      { country: 'canada', city: 'toronto' },
      { country: 'canada', city: 'vancouver' },
      { country: 'china', city: 'shanghai' },
      { country: 'china', city: 'beijing' },
      { country: 'japan', city: 'tokyo' },
      { country: 'japan', city: 'osaka' },
      { country: 'india', city: 'mumbai' },
      { country: 'india', city: 'delhi' },
      { country: 'brazil', city: 'sao-paulo' },
      { country: 'brazil', city: 'rio-de-janeiro' },
      { country: 'australia', city: 'sydney' },
      { country: 'australia', city: 'melbourne' }
    ];

    // Start with XML declaration and opening urlset tag
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages to sitemap
    staticPages.forEach(page => {
      xml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Add ALL country pages
    countries.forEach(country => {
      xml += `  <url>
    <loc>${BASE_URL}/exhibition-stands/${country}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Add ALL city pages
    cities.forEach(city => {
      xml += `  <url>
    <loc>${BASE_URL}/exhibition-stands/${city.country}/${city.city}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    // Close urlset tag
    xml += '</urlset>';

    return xml;
  } catch (error) {
    console.error('Error generating comprehensive sitemap:', error);
    throw error;
  }
}

// Generate and save the sitemap
function generateSitemap() {
  try {
    const xml = generateComprehensiveSitemap();
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xml);
    console.log(`Sitemap generated successfully at ${sitemapPath}`);
    
    // Count the URLs by parsing the XML
    const urlCount = (xml.match(/<url>/g) || []).length;
    console.log(`Total URLs: ${urlCount}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to basic sitemap
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    const basicXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://standszone.com</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://standszone.com/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://standszone.com/contact</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://standszone.com/services</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://standszone.com/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://standszone.com/builders</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://standszone.com/exhibitions</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://standszone.com/trade-shows</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://standszone.com/exhibition-stands</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://standszone.com/custom-booth</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://standszone.com/booth-rental</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://standszone.com/trade-show-graphics-printing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://standszone.com/trade-show-installation-and-dismantle</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://standszone.com/trade-show-project-management</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://standszone.com/quote</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://standszone.com/subscription</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
    
    fs.writeFileSync(sitemapPath, basicXml);
    console.log(`Basic sitemap generated successfully at ${sitemapPath}`);
    console.log(`Total URLs: 16`);
  }
}

generateSitemap();