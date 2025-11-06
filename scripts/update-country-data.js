// Script to update country data with new cities and remove specified cities
const fs = require('fs');
const path = require('path');

// Path to the countries.ts file
const countriesFilePath = path.join(__dirname, '..', 'lib', 'data', 'countries.ts');

// Read the countries.ts file
let countriesContent = fs.readFileSync(countriesFilePath, 'utf8');

// Cities to add
const citiesToAdd = [
  {
    country: 'Japan',
    city: {
      name: 'Chiba',
      slug: 'chiba',
      population: 6200000,
      isCapital: false,
      builderCount: 65,
      upcomingShows: 85,
      averageStandCost: 490,
      majorVenues: [
        {
          name: 'Makuhari Messe',
          totalSpace: 210000,
          hallCount: 11,
          facilities: ['International Events', 'Convention Center', 'Exhibition Halls'],
          nearbyBuilderCount: 45
        }
      ],
      transportation: {
        airports: ['Narita'],
        publicTransport: ['JR', 'Buses'],
        accessibility: 'Keiyo Line to Makuhari Messe'
      }
    }
  },
  {
    country: 'Belgium',
    city: {
      name: 'Kortrijk',
      slug: 'kortrijk',
      population: 78000,
      isCapital: false,
      builderCount: 25,
      upcomingShows: 15,
      averageStandCost: 320,
      majorVenues: [
        {
          name: 'Kortrijk Xpo',
          totalSpace: 55000,
          hallCount: 6,
          facilities: ['Modern Design', 'Flexible Space', 'Technical Support'],
          nearbyBuilderCount: 15
        }
      ],
      transportation: {
        airports: ['Brussels Airport', 'Lille Airport'],
        publicTransport: ['Train', 'Buses'],
        accessibility: 'Direct train from Brussels to Kortrijk'
      }
    }
  },
  {
    country: 'Thailand',
    city: {
      name: 'Khon Kaen',
      slug: 'khon-kaen',
      population: 450000,
      isCapital: false,
      builderCount: 15,
      upcomingShows: 10,
      averageStandCost: 250,
      majorVenues: [
        {
          name: 'Khon Kaen International Convention and Exhibition Center',
          totalSpace: 15000,
          hallCount: 3,
          facilities: ['Modern Facilities', 'Regional Hub', 'Technical Support'],
          nearbyBuilderCount: 8
        }
      ],
      transportation: {
        airports: ['Khon Kaen Airport'],
        publicTransport: ['Buses', 'Taxis'],
        accessibility: 'Airport shuttle to convention center'
      }
    }
  },
  {
    country: 'France',
    city: {
      name: 'Strasbourg',
      slug: 'strasbourg',
      population: 280000,
      isCapital: false,
      builderCount: 35,
      upcomingShows: 25,
      averageStandCost: 380,
      majorVenues: [
        {
          name: 'Strasbourg Exhibition Centre',
          totalSpace: 24000,
          hallCount: 4,
          facilities: ['European Parliament Proximity', 'Modern Design', 'Technical Support'],
          nearbyBuilderCount: 20
        }
      ],
      transportation: {
        airports: ['Strasbourg Airport'],
        publicTransport: ['Tram', 'Buses', 'Train'],
        accessibility: 'Tram line direct to exhibition center'
      }
    }
  },
  {
    country: 'Netherlands',
    cities: [
      {
        name: 'Maastricht',
        slug: 'maastricht',
        population: 120000,
        isCapital: false,
        builderCount: 20,
        upcomingShows: 15,
        averageStandCost: 350,
        majorVenues: [
          {
            name: 'MECC Maastricht',
            totalSpace: 30000,
            hallCount: 4,
            facilities: ['Border Location', 'International Events', 'Modern Facilities'],
            nearbyBuilderCount: 12
          }
        ],
        transportation: {
          airports: ['Maastricht Aachen Airport', 'Eindhoven Airport'],
          publicTransport: ['Train', 'Buses'],
          accessibility: 'Direct bus from station to MECC'
        }
      },
      {
        name: 'Rotterdam',
        slug: 'rotterdam',
        population: 650000,
        isCapital: false,
        builderCount: 45,
        upcomingShows: 30,
        averageStandCost: 380,
        majorVenues: [
          {
            name: 'Rotterdam Ahoy',
            totalSpace: 35000,
            hallCount: 6,
            facilities: ['Port City', 'Modern Design', 'Technical Support'],
            nearbyBuilderCount: 25
          }
        ],
        transportation: {
          airports: ['Rotterdam The Hague Airport'],
          publicTransport: ['Metro', 'Tram', 'Buses'],
          accessibility: 'Metro line direct to Ahoy'
        }
      },
      {
        name: 'Vijfhuizen',
        slug: 'vijfhuizen',
        population: 5000,
        isCapital: false,
        builderCount: 15,
        upcomingShows: 10,
        averageStandCost: 320,
        majorVenues: [
          {
            name: 'Expo Haarlemmermeer',
            totalSpace: 20000,
            hallCount: 3,
            facilities: ['Near Schiphol', 'Modern Facilities', 'Flexible Space'],
            nearbyBuilderCount: 10
          }
        ],
        transportation: {
          airports: ['Schiphol Airport'],
          publicTransport: ['Bus', 'Train'],
          accessibility: 'Shuttle from Hoofddorp station'
        }
      }
    ]
  }
];

// Cities to remove (by country and city slug)
const citiesToRemove = [
  { country: 'United States', citySlug: 'las-vegas' },
  { country: 'United States', citySlug: 'miami' },
  { country: 'United States', citySlug: 'san-diego' },
  { country: 'United States', citySlug: 'san-francisco' },
  { country: 'Germany', citySlug: 'hamburg' },
  { country: 'Germany', citySlug: 'leipzig' },
  { country: 'Germany', citySlug: 'stuttgart' },
  { country: 'United Kingdom', citySlug: 'manchester' },
  { country: 'United Kingdom', citySlug: 'glasgow' },
  { country: 'Italy', citySlug: 'bologna' },
  { country: 'Italy', citySlug: 'verona' },
  { country: 'Spain', citySlug: 'bilbao' },
  { country: 'Spain', citySlug: 'valencia' },
  { country: 'China', citySlug: 'chengdu' },
  { country: 'China', citySlug: 'shenzhen' },
  { country: 'UAE', citySlug: 'abu-dhabi' },
  { country: 'Brazil', citySlug: 'rio-de-janeiro' },
  { country: 'Canada', citySlug: 'montreal' },
  { country: 'Canada', citySlug: 'vancouver' },
  { country: 'Australia', citySlug: 'melbourne' },
  { country: 'Australia', citySlug: 'brisbane' },
  { country: 'Singapore', citySlug: 'singapore' },
  { country: 'South Korea', citySlug: 'busan' },
  { country: 'Turkey', citySlug: 'istanbul' },
  { country: 'Russia', citySlug: 'moscow' },
  { country: 'Russia', citySlug: 'saint-petersburg' },
  { country: 'India', citySlug: 'mumbai' },
  { country: 'India', citySlug: 'bangalore' },
  { country: 'Mexico', citySlug: 'mexico-city' },
  { country: 'South Africa', citySlug: 'johannesburg' },
  { country: 'South Africa', citySlug: 'cape-town' }
];

// Add new cities to countries
for (const cityData of citiesToAdd) {
  const { country, city, cities } = cityData;
  
  // Find the country section in the file
  const countryRegex = new RegExp(`// ${country}[^{]*{[^}]*name: ['"]${country}['"]`, 's');
  const countryMatch = countriesContent.match(countryRegex);
  
  if (countryMatch) {
    const countryStartIndex = countryMatch.index;
    
    // Find the majorCities array in the country section
    const majorCitiesRegex = /majorCities: \[/g;
    majorCitiesRegex.lastIndex = countryStartIndex;
    const majorCitiesMatch = majorCitiesRegex.exec(countriesContent);
    
    if (majorCitiesMatch) {
      const majorCitiesStartIndex = majorCitiesMatch.index + majorCitiesMatch[0].length;
      
      // If we have a single city to add
      if (city) {
        // Convert city object to string
        const cityString = JSON.stringify(city, null, 2)
          .replace(/"([^"]+)":/g, '$1:') // Remove quotes from property names
          .replace(/"/g, "'"); // Replace double quotes with single quotes
        
        // Insert the city at the beginning of the majorCities array
        const formattedCityString = `\n      ${cityString.replace(/\n/g, '\n      ')},`;
        countriesContent = countriesContent.slice(0, majorCitiesStartIndex) + formattedCityString + countriesContent.slice(majorCitiesStartIndex);
        
        console.log(`✅ Added ${city.name} to ${country}`);
      } 
      // If we have multiple cities to add
      else if (cities) {
        for (const cityItem of cities) {
          // Convert city object to string
          const cityString = JSON.stringify(cityItem, null, 2)
            .replace(/"([^"]+)":/g, '$1:') // Remove quotes from property names
            .replace(/"/g, "'"); // Replace double quotes with single quotes
          
          // Insert the city at the beginning of the majorCities array
          const formattedCityString = `\n      ${cityString.replace(/\n/g, '\n      ')},`;
          countriesContent = countriesContent.slice(0, majorCitiesStartIndex) + formattedCityString + countriesContent.slice(majorCitiesStartIndex);
          
          console.log(`✅ Added ${cityItem.name} to ${country}`);
        }
      }
    } else {
      console.log(`❌ Could not find majorCities array for ${country}`);
    }
  } else {
    console.log(`❌ Could not find country section for ${country}`);
  }
}

// Remove specified cities from countries
for (const { country, citySlug } of citiesToRemove) {
  // Find the country section in the file
  const countryRegex = new RegExp(`// ${country}[^{]*{[^}]*name: ['"]${country}['"]`, 's');
  const countryMatch = countriesContent.match(countryRegex);
  
  if (countryMatch) {
    const countryStartIndex = countryMatch.index;
    
    // Find the city in the majorCities array
    const cityRegex = new RegExp(`\\{\\s*name: ['"][^'"]*['"],\\s*slug: ['"]${citySlug}['"][^}]*\\}`, 's');
    const cityMatch = countriesContent.slice(countryStartIndex).match(cityRegex);
    
    if (cityMatch) {
      const cityStartIndex = countryStartIndex + cityMatch.index;
      
      // Check if there's a comma after the city object
      const afterCity = countriesContent.slice(cityStartIndex + cityMatch[0].length, cityStartIndex + cityMatch[0].length + 10);
      const hasCommaAfter = afterCity.trim().startsWith(',');
      
      // Check if there's a comma before the city object
      const beforeCity = countriesContent.slice(Math.max(0, cityStartIndex - 10), cityStartIndex);
      const hasCommaBefore = beforeCity.trim().endsWith(',');
      
      // Remove the city and handle commas properly
      if (hasCommaAfter) {
        // If there's a comma after, remove the city and the comma
        countriesContent = countriesContent.slice(0, cityStartIndex) + countriesContent.slice(cityStartIndex + cityMatch[0].length + 1);
      } else if (hasCommaBefore) {
        // If there's a comma before, remove the city and the comma before it
        const commaIndex = beforeCity.lastIndexOf(',');
        countriesContent = countriesContent.slice(0, cityStartIndex - (beforeCity.length - commaIndex)) + countriesContent.slice(cityStartIndex + cityMatch[0].length);
      } else {
        // Just remove the city
        countriesContent = countriesContent.slice(0, cityStartIndex) + countriesContent.slice(cityStartIndex + cityMatch[0].length);
      }
      
      console.log(`✅ Removed ${citySlug} from ${country}`);
    } else {
      console.log(`⚠️ Could not find city ${citySlug} in ${country}`);
    }
  } else {
    console.log(`❌ Could not find country section for ${country}`);
  }
}

// Write the updated content back to the file
fs.writeFileSync(countriesFilePath, countriesContent, 'utf8');
console.log('✅ Country data updated successfully!');