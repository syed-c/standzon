const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Countries to ensure are in CMS
const countriesToFix = [
  // Countries without city sections
  { 
    countryName: 'Taiwan', 
    countryCode: 'TW', 
    countrySlug: 'taiwan', 
    continent: 'Asia',
    noCities: true 
  },
  { 
    countryName: 'Hong Kong', 
    countryCode: 'HK', 
    countrySlug: 'hong-kong', 
    continent: 'Asia',
    noCities: true 
  },
  { 
    countryName: 'New Zealand', 
    countryCode: 'NZ', 
    countrySlug: 'new-zealand', 
    continent: 'Oceania',
    noCities: true 
  },
  { 
    countryName: 'Vietnam', 
    countryCode: 'VN', 
    countrySlug: 'vietnam', 
    continent: 'Asia',
    noCities: true 
  },
  // Countries with CMS connection issues
  { 
    countryName: 'India', 
    countryCode: 'IN', 
    countrySlug: 'india', 
    continent: 'Asia',
    fixCities: true 
  },
  { 
    countryName: 'Australia', 
    countryCode: 'AU', 
    countrySlug: 'australia', 
    continent: 'Oceania',
    fixCities: true 
  },
  { 
    countryName: 'Thailand', 
    countryCode: 'TH', 
    countrySlug: 'thailand', 
    continent: 'Asia',
    fixCities: true 
  },
  { 
    countryName: 'Philippines', 
    countryCode: 'PH', 
    countrySlug: 'philippines', 
    continent: 'Asia',
    fixCities: true 
  },
  { 
    countryName: 'Spain', 
    countryCode: 'ES', 
    countrySlug: 'spain', 
    continent: 'Europe',
    fixCities: true 
  },
  { 
    countryName: 'Switzerland', 
    countryCode: 'CH', 
    countrySlug: 'switzerland', 
    continent: 'Europe',
    fixCities: true 
  },
  { 
    countryName: 'Austria', 
    countryCode: 'AT', 
    countrySlug: 'austria', 
    continent: 'Europe',
    fixCities: true 
  }
];

// Fix countries in CMS
async function fixCountriesInCMS() {
  console.log('🔄 Fixing countries in CMS...');
  
  for (const country of countriesToFix) {
    try {
      // Check if country exists in Supabase
      const { data: existingCountry, error: countryError } = await supabase
        .from('countries')
        .select('*')
        .eq('country_code', country.countryCode)
        .single();
      
      if (countryError && countryError.code === 'PGRST116') {
        // Country doesn't exist, create it
        console.log(`🌍 Creating country: ${country.countryName}`);
        
        const { data: newCountry, error: createError } = await supabase
          .from('countries')
          .insert({
            country_name: country.countryName,
            country_code: country.countryCode,
            country_slug: country.countrySlug,
            continent: country.continent,
            currency: getCurrencyForCountry(country.countryCode),
            timezone: getTimezoneForCountry(country.countryCode),
            language: getLanguageForCountry(country.countryCode),
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
        
        if (createError) {
          console.error(`❌ Error creating country ${country.countryName}:`, createError);
          continue;
        }
        
        console.log(`✅ Created country: ${country.countryName}`);
        
        // Create page content for the country
        await createCountryPageContent(country);
      } else if (existingCountry) {
        console.log(`✅ Country already exists: ${country.countryName}`);
        
        // Update the country to ensure it's active
        const { error: updateError } = await supabase
          .from('countries')
          .update({
            active: true,
            updated_at: new Date().toISOString()
          })
          .eq('country_code', country.countryCode);
        
        if (updateError) {
          console.error(`❌ Error updating country ${country.countryName}:`, updateError);
        }
        
        // Ensure page content exists
        await createCountryPageContent(country);
      }
      
      // Fix cities if needed
      if (country.fixCities) {
        await fixCitiesForCountry(country);
      }
    } catch (error) {
      console.error(`❌ Error processing country ${country.countryName}:`, error);
    }
  }
}

// Create page content for a country
async function createCountryPageContent(country) {
  try {
    const pageId = country.countrySlug;
    const path = `/exhibition-stands/${country.countrySlug}`;
    
    // Check if page content already exists
    const { data: existingContent, error: contentError } = await supabase
      .from('page_contents')
      .select('*')
      .eq('id', pageId)
      .single();
    
    if (contentError && contentError.code === 'PGRST116') {
      // Page content doesn't exist, create it
      console.log(`📄 Creating page content for: ${country.countryName}`);
      
      const content = {
        sections: {
          countryPages: {
            [country.countrySlug]: {
              whyChooseHeading: `Why Choose Local Builders in ${country.countryName}?`,
              whyChooseParagraph: `Local builders offer unique advantages including market knowledge, logistical expertise, and established vendor relationships.`,
              infoCards: [
                {
                  title: "Local Market Knowledge",
                  text: `Understand local regulations, venue requirements, and cultural preferences specific to ${country.countryName}.`
                },
                {
                  title: "Faster Project Delivery",
                  text: "Reduced logistics time, easier coordination, and faster response times for urgent modifications or support."
                },
                {
                  title: "Cost-Effective Solutions",
                  text: "Lower transportation costs, established supplier networks, and competitive local pricing structures."
                }
              ],
              quotesParagraph: `Connect with 3-5 verified local builders who understand your market. No registration required, quotes within 24 hours.`,
              servicesHeading: `Exhibition Stand Builders in ${country.countryName}: Services, Costs, and Tips`,
              servicesParagraph: `Finding the right exhibition stand partner in ${country.countryName} can dramatically improve your event ROI. Local builders offer end-to-end services including custom design, fabrication, graphics, logistics, and on-site installation—ensuring your brand presents a professional, high‑impact presence on the show floor.`
            }
          }
        }
      };
      
      const { error: createError } = await supabase
        .from('page_contents')
        .insert({
          id: pageId,
          path: path,
          content: content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (createError) {
        console.error(`❌ Error creating page content for ${country.countryName}:`, createError);
        return;
      }
      
      console.log(`✅ Created page content for: ${country.countryName}`);
    } else if (existingContent) {
      console.log(`✅ Page content already exists for: ${country.countryName}`);
    }
  } catch (error) {
    console.error(`❌ Error creating page content for ${country.countryName}:`, error);
  }
}

// Fix cities for a country
async function fixCitiesForCountry(country) {
  try {
    console.log(`🔄 Fixing cities for country: ${country.countryName}`);
    
    // Get country ID
    const { data: countryData, error: countryError } = await supabase
      .from('countries')
      .select('id')
      .eq('country_code', country.countryCode)
      .single();
    
    if (countryError) {
      console.error(`❌ Error getting country ID for ${country.countryName}:`, countryError);
      return;
    }
    
    const countryId = countryData.id;
    
    // Get cities for this country from locationData
    const fs = require('fs');
    const path = require('path');
    const locationDataPath = path.join(process.cwd(), 'lib', 'data', 'locationData.ts');
    const locationDataContent = fs.readFileSync(locationDataPath, 'utf8');
    
    // Extract cities for this country using regex
    const regex = new RegExp(`countryName: "${country.countryName}"[\\s\\S]*?cities: \\[([\\s\\S]*?)\\]`, 'g');
    const match = regex.exec(locationDataContent);
    
    if (!match || !match[1]) {
      console.log(`⚠️ No cities found in locationData for ${country.countryName}`);
      return;
    }
    
    const citiesContent = match[1];
    const cityRegex = /{\s*cityName:\s*"([^"]+)"\s*,\s*citySlug:\s*"([^"]+)"/g;
    let cityMatch;
    const cities = [];
    
    while ((cityMatch = cityRegex.exec(citiesContent)) !== null) {
      cities.push({
        cityName: cityMatch[1],
        citySlug: cityMatch[2]
      });
    }
    
    console.log(`📍 Found ${cities.length} cities for ${country.countryName} in locationData`);
    
    // Ensure each city exists in Supabase
    for (const city of cities) {
      // Check if city exists
      const { data: existingCity, error: cityError } = await supabase
        .from('cities')
        .select('*')
        .eq('city_slug', city.citySlug)
        .eq('country_id', countryId)
        .single();
      
      if (cityError && cityError.code === 'PGRST116') {
        // City doesn't exist, create it
        console.log(`📍 Creating city: ${city.cityName}, ${country.countryName}`);
        
        const { error: createError } = await supabase
          .from('cities')
          .insert({
            city_name: city.cityName,
            city_slug: city.citySlug,
            country_id: countryId,
            country_name: country.countryName,
            country_code: country.countryCode,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (createError) {
          console.error(`❌ Error creating city ${city.cityName}:`, createError);
          continue;
        }
        
        console.log(`✅ Created city: ${city.cityName}, ${country.countryName}`);
        
        // Create page content for the city
        await createCityPageContent(country, city);
      } else if (existingCity) {
        console.log(`✅ City already exists: ${city.cityName}, ${country.countryName}`);
        
        // Update the city to ensure it's active
        const { error: updateError } = await supabase
          .from('cities')
          .update({
            active: true,
            updated_at: new Date().toISOString()
          })
          .eq('city_slug', city.citySlug)
          .eq('country_id', countryId);
        
        if (updateError) {
          console.error(`❌ Error updating city ${city.cityName}:`, updateError);
        }
        
        // Ensure page content exists
        await createCityPageContent(country, city);
      }
    }
  } catch (error) {
    console.error(`❌ Error fixing cities for ${country.countryName}:`, error);
  }
}

// Create page content for a city
async function createCityPageContent(country, city) {
  try {
    const pageId = `${country.countrySlug}-${city.citySlug}`;
    const path = `/exhibition-stands/${country.countrySlug}/${city.citySlug}`;
    
    // Check if page content already exists
    const { data: existingContent, error: contentError } = await supabase
      .from('page_contents')
      .select('*')
      .eq('id', pageId)
      .single();
    
    if (contentError && contentError.code === 'PGRST116') {
      // Page content doesn't exist, create it
      console.log(`📄 Creating page content for: ${city.cityName}, ${country.countryName}`);
      
      const content = {
        sections: {
          cityPages: {
            [pageId]: {
              whyChooseHeading: `Why Choose Local Builders in ${city.cityName}?`,
              whyChooseParagraph: `Local builders in ${city.cityName} offer unique advantages including market knowledge, logistical expertise, and established vendor relationships.`,
              infoCards: [
                {
                  title: "Local Market Knowledge",
                  text: `Understand local regulations, venue requirements, and cultural preferences specific to ${city.cityName}.`
                },
                {
                  title: "Faster Project Delivery",
                  text: "Reduced logistics time, easier coordination, and faster response times for urgent modifications or support."
                },
                {
                  title: "Cost-Effective Solutions",
                  text: "Lower transportation costs, established supplier networks, and competitive local pricing structures."
                }
              ],
              quotesParagraph: `Connect with 3-5 verified local builders who understand your market. No registration required, quotes within 24 hours.`,
              servicesHeading: `Exhibition Stand Builders in ${city.cityName}: Services, Costs, and Tips`,
              servicesParagraph: `Finding the right exhibition stand partner in ${city.cityName} can dramatically improve your event ROI. Local builders offer end-to-end services including custom design, fabrication, graphics, logistics, and on-site installation—ensuring your brand presents a professional, high‑impact presence on the show floor.`
            }
          }
        }
      };
      
      const { error: createError } = await supabase
        .from('page_contents')
        .insert({
          id: pageId,
          path: path,
          content: content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (createError) {
        console.error(`❌ Error creating page content for ${city.cityName}, ${country.countryName}:`, createError);
        return;
      }
      
      console.log(`✅ Created page content for: ${city.cityName}, ${country.countryName}`);
    } else if (existingContent) {
      console.log(`✅ Page content already exists for: ${city.cityName}, ${country.countryName}`);
    }
  } catch (error) {
    console.error(`❌ Error creating page content for ${city.cityName}, ${country.countryName}:`, error);
  }
}

// Helper functions for country data
function getCurrencyForCountry(countryCode) {
  const currencies = {
    'TW': 'TWD',
    'HK': 'HKD',
    'NZ': 'NZD',
    'VN': 'VND',
    'IN': 'INR',
    'AU': 'AUD',
    'TH': 'THB',
    'PH': 'PHP',
    'ES': 'EUR',
    'CH': 'CHF',
    'AT': 'EUR'
  };
  
  return currencies[countryCode] || 'USD';
}

function getTimezoneForCountry(countryCode) {
  const timezones = {
    'TW': 'Asia/Taipei',
    'HK': 'Asia/Hong_Kong',
    'NZ': 'Pacific/Auckland',
    'VN': 'Asia/Ho_Chi_Minh',
    'IN': 'Asia/Kolkata',
    'AU': 'Australia/Sydney',
    'TH': 'Asia/Bangkok',
    'PH': 'Asia/Manila',
    'ES': 'Europe/Madrid',
    'CH': 'Europe/Zurich',
    'AT': 'Europe/Vienna'
  };
  
  return timezones[countryCode] || 'UTC';
}

function getLanguageForCountry(countryCode) {
  const languages = {
    'TW': 'zh',
    'HK': 'zh',
    'NZ': 'en',
    'VN': 'vi',
    'IN': 'hi',
    'AU': 'en',
    'TH': 'th',
    'PH': 'en',
    'ES': 'es',
    'CH': 'de',
    'AT': 'de'
  };
  
  return languages[countryCode] || 'en';
}

// Run the script
console.log('🚀 Starting CMS connections fix script...');
console.log('📋 Countries to fix:', countriesToFix.length);
fixCountriesInCMS()
  .then(() => {
    console.log('✅ CMS connections fixed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error fixing CMS connections:', error);
    process.exit(1);
  });