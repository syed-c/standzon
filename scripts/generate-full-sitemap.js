const fs = require('fs');
const path = require('path');

// Define the base URL for the site
const BASE_URL = 'https://standszone.com';

// Manually define ALL countries and cities data
// This includes all the countries and major cities from the actual data
const countries = [
  // 🌍 EUROPE - Complete Integration
  { name: 'United Kingdom', slug: 'united-kingdom' },
  { name: 'France', slug: 'france' },
  { name: 'Germany', slug: 'germany' },
  { name: 'Italy', slug: 'italy' },
  { name: 'Spain', slug: 'spain' },
  { name: 'Belgium', slug: 'belgium' },
  { name: 'Netherlands', slug: 'netherlands' },
  { name: 'Switzerland', slug: 'switzerland' },
  { name: 'Austria', slug: 'austria' },
  { name: 'Sweden', slug: 'sweden' },
  { name: 'Norway', slug: 'norway' },
  { name: 'Denmark', slug: 'denmark' },
  { name: 'Finland', slug: 'finland' },
  { name: 'Poland', slug: 'poland' },
  { name: 'Czech Republic', slug: 'czech-republic' },
  { name: 'Hungary', slug: 'hungary' },
  { name: 'Portugal', slug: 'portugal' },
  { name: 'Greece', slug: 'greece' },
  { name: 'Ireland', slug: 'ireland' },
  { name: 'Russia', slug: 'russia' },
  { name: 'Romania', slug: 'romania' },
  { name: 'Ukraine', slug: 'ukraine' },
  { name: 'Croatia', slug: 'croatia' },
  { name: 'Serbia', slug: 'serbia' },
  { name: 'Bulgaria', slug: 'bulgaria' },
  { name: 'Slovakia', slug: 'slovakia' },
  { name: 'Slovenia', slug: 'slovenia' },
  { name: 'Estonia', slug: 'estonia' },
  { name: 'Latvia', slug: 'latvia' },
  { name: 'Lithuania', slug: 'lithuania' },
  { name: 'Luxembourg', slug: 'luxembourg' },
  { name: 'Malta', slug: 'malta' },
  { name: 'Cyprus', slug: 'cyprus' },
  { name: 'Iceland', slug: 'iceland' },
  { name: 'Turkey', slug: 'turkey' },
  
  // 🌏 ASIA - Complete Integration
  { name: 'China', slug: 'china' },
  { name: 'Japan', slug: 'japan' },
  { name: 'India', slug: 'india' },
  { name: 'South Korea', slug: 'south-korea' },
  { name: 'Indonesia', slug: 'indonesia' },
  { name: 'Thailand', slug: 'thailand' },
  { name: 'Malaysia', slug: 'malaysia' },
  { name: 'Philippines', slug: 'philippines' },
  { name: 'Vietnam', slug: 'vietnam' },
  { name: 'Singapore', slug: 'singapore' },
  { name: 'Taiwan', slug: 'taiwan' },
  { name: 'Hong Kong', slug: 'hong-kong' },
  { name: 'Israel', slug: 'israel' },
  { name: 'Saudi Arabia', slug: 'saudi-arabia' },
  { name: 'UAE', slug: 'uae' },
  { name: 'Qatar', slug: 'qatar' },
  { name: 'Kuwait', slug: 'kuwait' },
  { name: 'Bahrain', slug: 'bahrain' },
  { name: 'Oman', slug: 'oman' },
  { name: 'Lebanon', slug: 'lebanon' },
  { name: 'Jordan', slug: 'jordan' },
  { name: 'Iraq', slug: 'iraq' },
  { name: 'Iran', slug: 'iran' },
  { name: 'Pakistan', slug: 'pakistan' },
  { name: 'Bangladesh', slug: 'bangladesh' },
  { name: 'Sri Lanka', slug: 'sri-lanka' },
  { name: 'Nepal', slug: 'nepal' },
  { name: 'Myanmar', slug: 'myanmar' },
  { name: 'Cambodia', slug: 'cambodia' },
  { name: 'Laos', slug: 'laos' },
  { name: 'Mongolia', slug: 'mongolia' },
  { name: 'Kazakhstan', slug: 'kazakhstan' },
  { name: 'Uzbekistan', slug: 'uzbekistan' },
  { name: 'Azerbaijan', slug: 'azerbaijan' },
  { name: 'Georgia', slug: 'georgia' },
  { name: 'Armenia', slug: 'armenia' },
  
  // 🌎 NORTH AMERICA - Complete Integration
  { name: 'United States', slug: 'united-states' },
  { name: 'Canada', slug: 'canada' },
  { name: 'Mexico', slug: 'mexico' },
  { name: 'Guatemala', slug: 'guatemala' },
  { name: 'Belize', slug: 'belize' },
  { name: 'El Salvador', slug: 'el-salvador' },
  { name: 'Honduras', slug: 'honduras' },
  { name: 'Nicaragua', slug: 'nicaragua' },
  { name: 'Costa Rica', slug: 'costa-rica' },
  { name: 'Panama', slug: 'panama' },
  
  // 🌍 SOUTH AMERICA - Complete Integration
  { name: 'Brazil', slug: 'brazil' },
  { name: 'Argentina', slug: 'argentina' },
  { name: 'Chile', slug: 'chile' },
  { name: 'Peru', slug: 'peru' },
  { name: 'Colombia', slug: 'colombia' },
  { name: 'Venezuela', slug: 'venezuela' },
  { name: 'Ecuador', slug: 'ecuador' },
  { name: 'Bolivia', slug: 'bolivia' },
  { name: 'Paraguay', slug: 'paraguay' },
  { name: 'Uruguay', slug: 'uruguay' },
  { name: 'Guyana', slug: 'guyana' },
  { name: 'Suriname', slug: 'suriname' },
  
  // 🌍 AFRICA - Complete Integration
  { name: 'South Africa', slug: 'south-africa' },
  { name: 'Egypt', slug: 'egypt' },
  { name: 'Nigeria', slug: 'nigeria' },
  { name: 'Algeria', slug: 'algeria' },
  { name: 'Sudan', slug: 'sudan' },
  { name: 'Kenya', slug: 'kenya' },
  { name: 'Ethiopia', slug: 'ethiopia' },
  { name: 'Ghana', slug: 'ghana' },
  { name: 'Morocco', slug: 'morocco' },
  { name: 'Tanzania', slug: 'tanzania' },
  { name: 'Uganda', slug: 'uganda' },
  { name: 'Mozambique', slug: 'mozambique' },
  { name: 'Madagascar', slug: 'madagascar' },
  { name: 'Cameroon', slug: 'cameroon' },
  { name: 'Ivory Coast', slug: 'ivory-coast' },
  { name: 'Niger', slug: 'niger' },
  { name: 'Burkina Faso', slug: 'burkina-faso' },
  { name: 'Mali', slug: 'mali' },
  { name: 'Malawi', slug: 'malawi' },
  { name: 'Zambia', slug: 'zambia' },
  { name: 'Senegal', slug: 'senegal' },
  { name: 'Zimbabwe', slug: 'zimbabwe' },
  { name: 'Angola', slug: 'angola' },
  { name: 'Botswana', slug: 'botswana' },
  { name: 'Lesotho', slug: 'lesotho' },
  { name: 'Swaziland', slug: 'swaziland' },
  { name: 'Namibia', slug: 'namibia' },
  
  // 🌊 OCEANIA - Complete Integration
  { name: 'Australia', slug: 'australia' },
  { name: 'New Zealand', slug: 'new-zealand' },
  { name: 'Fiji', slug: 'fiji' },
  { name: 'Papua New Guinea', slug: 'papua-new-guinea' },
  { name: 'Solomon Islands', slug: 'solomon-islands' },
  { name: 'Vanuatu', slug: 'vanuatu' },
  { name: 'Samoa', slug: 'samoa' },
  { name: 'Tonga', slug: 'tonga' }
];

// Define major cities for each country (this is a simplified version)
const cities = [
  // UK
  { name: 'London', country: 'United Kingdom', slug: 'london' },
  { name: 'Birmingham', country: 'United Kingdom', slug: 'birmingham' },
  { name: 'Manchester', country: 'United Kingdom', slug: 'manchester' },
  { name: 'Glasgow', country: 'United Kingdom', slug: 'glasgow' },
  { name: 'Liverpool', country: 'United Kingdom', slug: 'liverpool' },
  { name: 'Leeds', country: 'United Kingdom', slug: 'leeds' },
  { name: 'Sheffield', country: 'United Kingdom', slug: 'sheffield' },
  { name: 'Edinburgh', country: 'United Kingdom', slug: 'edinburgh' },
  { name: 'Cardiff', country: 'United Kingdom', slug: 'cardiff' },
  { name: 'Belfast', country: 'United Kingdom', slug: 'belfast' },
  
  // France
  { name: 'Paris', country: 'France', slug: 'paris' },
  { name: 'Lyon', country: 'France', slug: 'lyon' },
  { name: 'Cannes', country: 'France', slug: 'cannes' },
  { name: 'Strasbourg', country: 'France', slug: 'strasbourg' },
  { name: 'Nice', country: 'France', slug: 'nice' },
  { name: 'Marseille', country: 'France', slug: 'marseille' },
  { name: 'Bordeaux', country: 'France', slug: 'bordeaux' },
  { name: 'Toulouse', country: 'France', slug: 'toulouse' },
  { name: 'Nantes', country: 'France', slug: 'nantes' },
  { name: 'Lille', country: 'France', slug: 'lille' },
  
  // Germany
  { name: 'Berlin', country: 'Germany', slug: 'berlin' },
  { name: 'Frankfurt', country: 'Germany', slug: 'frankfurt' },
  { name: 'Munich', country: 'Germany', slug: 'munich' },
  { name: 'Hamburg', country: 'Germany', slug: 'hamburg' },
  { name: 'Cologne', country: 'Germany', slug: 'cologne' },
  { name: 'Dusseldorf', country: 'Germany', slug: 'dusseldorf' },
  { name: 'Stuttgart', country: 'Germany', slug: 'stuttgart' },
  { name: 'Dortmund', country: 'Germany', slug: 'dortmund' },
  { name: 'Essen', country: 'Germany', slug: 'essen' },
  { name: 'Leipzig', country: 'Germany', slug: 'leipzig' },
  { name: 'Dresden', country: 'Germany', slug: 'dresden' },
  { name: 'Hanover', country: 'Germany', slug: 'hanover' },
  { name: 'Nuremberg', country: 'Germany', slug: 'nuremberg' },
  { name: 'Duisburg', country: 'Germany', slug: 'duisburg' },
  { name: 'Bremen', country: 'Germany', slug: 'bremen' },
  
  // Italy
  { name: 'Milan', country: 'Italy', slug: 'milan' },
  { name: 'Rome', country: 'Italy', slug: 'rome' },
  { name: 'Naples', country: 'Italy', slug: 'naples' },
  { name: 'Turin', country: 'Italy', slug: 'turin' },
  { name: 'Palermo', country: 'Italy', slug: 'palermo' },
  { name: 'Genoa', country: 'Italy', slug: 'genoa' },
  { name: 'Bologna', country: 'Italy', slug: 'bologna' },
  { name: 'Florence', country: 'Italy', slug: 'florence' },
  { name: 'Bari', country: 'Italy', slug: 'bari' },
  { name: 'Catania', country: 'Italy', slug: 'catania' },
  { name: 'Venice', country: 'Italy', slug: 'venice' },
  { name: 'Verona', country: 'Italy', slug: 'verona' },
  { name: 'Messina', country: 'Italy', slug: 'messina' },
  { name: 'Padua', country: 'Italy', slug: 'padua' },
  { name: 'Trieste', country: 'Italy', slug: 'trieste' },
  
  // Spain
  { name: 'Madrid', country: 'Spain', slug: 'madrid' },
  { name: 'Barcelona', country: 'Spain', slug: 'barcelona' },
  { name: 'Valencia', country: 'Spain', slug: 'valencia' },
  { name: 'Seville', country: 'Spain', slug: 'seville' },
  { name: 'Zaragoza', country: 'Spain', slug: 'zaragoza' },
  { name: 'Malaga', country: 'Spain', slug: 'malaga' },
  { name: 'Murcia', country: 'Spain', slug: 'murcia' },
  { name: 'Palma', country: 'Spain', slug: 'palma' },
  { name: 'Las Palmas', country: 'Spain', slug: 'las-palmas' },
  { name: 'Bilbao', country: 'Spain', slug: 'bilbao' },
  
  // Add more cities for other countries...
  // Netherlands
  { name: 'Amsterdam', country: 'Netherlands', slug: 'amsterdam' },
  { name: 'Rotterdam', country: 'Netherlands', slug: 'rotterdam' },
  { name: 'The Hague', country: 'Netherlands', slug: 'the-hague' },
  { name: 'Utrecht', country: 'Netherlands', slug: 'utrecht' },
  { name: 'Eindhoven', country: 'Netherlands', slug: 'eindhoven' },
  { name: 'Tilburg', country: 'Netherlands', slug: 'tilburg' },
  { name: 'Groningen', country: 'Netherlands', slug: 'groningen' },
  { name: 'Almere', country: 'Netherlands', slug: 'almere' },
  { name: 'Breda', country: 'Netherlands', slug: 'breda' },
  { name: 'Nijmegen', country: 'Netherlands', slug: 'nijmegen' },
  
  // Belgium
  { name: 'Brussels', country: 'Belgium', slug: 'brussels' },
  { name: 'Antwerp', country: 'Belgium', slug: 'antwerp' },
  { name: 'Ghent', country: 'Belgium', slug: 'ghent' },
  { name: 'Charleroi', country: 'Belgium', slug: 'charleroi' },
  { name: 'Liege', country: 'Belgium', slug: 'liege' },
  { name: 'Bruges', country: 'Belgium', slug: 'bruges' },
  { name: 'Namur', country: 'Belgium', slug: 'namur' },
  { name: 'Leuven', country: 'Belgium', slug: 'leuven' },
  { name: 'Mons', country: 'Belgium', slug: 'mons' },
  { name: 'Aalst', country: 'Belgium', slug: 'aalst' },
  
  // Switzerland
  { name: 'Zurich', country: 'Switzerland', slug: 'zurich' },
  { name: 'Geneva', country: 'Switzerland', slug: 'geneva' },
  { name: 'Basel', country: 'Switzerland', slug: 'basel' },
  { name: 'Bern', country: 'Switzerland', slug: 'bern' },
  { name: 'Lausanne', country: 'Switzerland', slug: 'lausanne' },
  { name: 'Winterthur', country: 'Switzerland', slug: 'winterthur' },
  { name: 'Lucerne', country: 'Switzerland', slug: 'lucerne' },
  { name: 'St. Gallen', country: 'Switzerland', slug: 'st-gallen' },
  { name: 'Lugano', country: 'Switzerland', slug: 'lugano' },
  { name: 'Biel', country: 'Switzerland', slug: 'biel' },
  
  // Austria
  { name: 'Vienna', country: 'Austria', slug: 'vienna' },
  { name: 'Graz', country: 'Austria', slug: 'graz' },
  { name: 'Linz', country: 'Austria', slug: 'linz' },
  { name: 'Salzburg', country: 'Austria', slug: 'salzburg' },
  { name: 'Innsbruck', country: 'Austria', slug: 'innsbruck' },
  { name: 'Klagenfurt', country: 'Austria', slug: 'klagenfurt' },
  { name: 'Villach', country: 'Austria', slug: 'villach' },
  { name: 'Wels', country: 'Austria', slug: 'wels' },
  { name: 'Sankt Polten', country: 'Austria', slug: 'sankt-polten' },
  { name: 'Dornbirn', country: 'Austria', slug: 'dornbirn' },
  
  // Sweden
  { name: 'Stockholm', country: 'Sweden', slug: 'stockholm' },
  { name: 'Gothenburg', country: 'Sweden', slug: 'gothenburg' },
  { name: 'Malmo', country: 'Sweden', slug: 'malmo' },
  { name: 'Uppsala', country: 'Sweden', slug: 'uppsala' },
  { name: 'Vasteras', country: 'Sweden', slug: 'vasteras' },
  { name: 'Orebro', country: 'Sweden', slug: 'orebro' },
  { name: 'Linkoping', country: 'Sweden', slug: 'linkoping' },
  { name: 'Helsingborg', country: 'Sweden', slug: 'helsingborg' },
  { name: 'Jonkoping', country: 'Sweden', slug: 'jonkoping' },
  { name: 'Norrkoping', country: 'Sweden', slug: 'norrkoping' },
  
  // Norway
  { name: 'Oslo', country: 'Norway', slug: 'oslo' },
  { name: 'Bergen', country: 'Norway', slug: 'bergen' },
  { name: 'Trondheim', country: 'Norway', slug: 'trondheim' },
  { name: 'Stavanger', country: 'Norway', slug: 'stavanger' },
  { name: 'Drammen', country: 'Norway', slug: 'drammen' },
  { name: 'Fredrikstad', country: 'Norway', slug: 'fredrikstad' },
  { name: 'Kristiansand', country: 'Norway', slug: 'kristiansand' },
  { name: 'Sandnes', country: 'Norway', slug: 'sandnes' },
  { name: 'Tromso', country: 'Norway', slug: 'tromso' },
  { name: 'Sarpsborg', country: 'Norway', slug: 'sarpsborg' },
  
  // Denmark
  { name: 'Copenhagen', country: 'Denmark', slug: 'copenhagen' },
  { name: 'Aarhus', country: 'Denmark', slug: 'aarhus' },
  { name: 'Odense', country: 'Denmark', slug: 'odense' },
  { name: 'Aalborg', country: 'Denmark', slug: 'aalborg' },
  { name: 'Esbjerg', country: 'Denmark', slug: 'esbjerg' },
  { name: 'Randers', country: 'Denmark', slug: 'randers' },
  { name: 'Kolding', country: 'Denmark', slug: 'kolding' },
  { name: 'Horsens', country: 'Denmark', slug: 'horsens' },
  { name: 'Vejle', country: 'Denmark', slug: 'vejle' },
  { name: 'Roskilde', country: 'Denmark', slug: 'roskilde' },
  
  // Finland
  { name: 'Helsinki', country: 'Finland', slug: 'helsinki' },
  { name: 'Espoo', country: 'Finland', slug: 'espoo' },
  { name: 'Tampere', country: 'Finland', slug: 'tampere' },
  { name: 'Vantaa', country: 'Finland', slug: 'vantaa' },
  { name: 'Oulu', country: 'Finland', slug: 'oulu' },
  { name: 'Turku', country: 'Finland', slug: 'turku' },
  { name: 'Jyvaskyla', country: 'Finland', slug: 'jyvaskyla' },
  { name: 'Lahti', country: 'Finland', slug: 'lahti' },
  { name: 'Kuopio', country: 'Finland', slug: 'kuopio' },
  { name: 'Kouvola', country: 'Finland', slug: 'kouvola' },
  
  // Poland
  { name: 'Warsaw', country: 'Poland', slug: 'warsaw' },
  { name: 'Krakow', country: 'Poland', slug: 'krakow' },
  { name: 'Lodz', country: 'Poland', slug: 'lodz' },
  { name: 'Wroclaw', country: 'Poland', slug: 'wroclaw' },
  { name: 'Poznan', country: 'Poland', slug: 'poznan' },
  { name: 'Gdansk', country: 'Poland', slug: 'gdansk' },
  { name: 'Szczecin', country: 'Poland', slug: 'szczecin' },
  { name: 'Bydgoszcz', country: 'Poland', slug: 'bydgoszcz' },
  { name: 'Lublin', country: 'Poland', slug: 'lublin' },
  { name: 'Katowice', country: 'Poland', slug: 'katowice' },
  
  // Add more countries and cities as needed...
];

// Helper function to generate XML sitemap
function generateSitemapXml() {
  // Start with XML declaration and opening urlset tag
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

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
    '/subscription'
  ];

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
  countries.forEach(country => {
    xml += `  <url>
    <loc>${BASE_URL}/exhibition-stands/${country.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  // Add city pages
  cities.forEach(city => {
    // Find the country slug for this city
    const country = countries.find(c => c.name === city.country);
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
console.log(`Total URLs: ${16 + countries.length + cities.length}`);