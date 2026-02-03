// Script to update country settings and revalidate pages
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Function to update the countries.ts file directly
async function updateCountriesFile() {
  console.log('Updating countries.ts file...');
  
  const countriesFilePath = path.join(__dirname, '..', 'lib', 'data', 'countries.ts');
  
  // Read the current file
  let content = fs.readFileSync(countriesFilePath, 'utf8');
  
  // Add new cities to respective countries
  // Japan - Chiba
  if (content.includes('name: "Japan"')) {
    const japanCitySection = content.indexOf('cities: [', content.indexOf('name: "Japan"'));
    if (japanCitySection !== -1) {
      const insertPosition = content.indexOf(']', japanCitySection);
      if (insertPosition !== -1) {
        const chibaCity = `,
      {
        name: "Chiba",
        population: 980000,
        isCapital: false,
        builderCount: 12,
        upcomingShows: 4,
        averageStandCost: "$3,500",
        venues: [
          {
            name: "Makuhari Messe",
            capacity: 75000,
            website: "https://www.m-messe.co.jp/en/",
          }
        ],
        transportation: {
          nearestAirport: "Narita International Airport",
          publicTransport: "Excellent train connections via JR lines",
          taxis: "Readily available throughout the city",
        }
      }`;
        
        content = content.slice(0, insertPosition) + chibaCity + content.slice(insertPosition);
        console.log('Added Chiba to Japan');
      }
    }
  }
  
  // Belgium - Kortrijk
  if (content.includes('name: "Belgium"')) {
    const belgiumCitySection = content.indexOf('cities: [', content.indexOf('name: "Belgium"'));
    if (belgiumCitySection !== -1) {
      const insertPosition = content.indexOf(']', belgiumCitySection);
      if (insertPosition !== -1) {
        const kortrijkCity = `,
      {
        name: "Kortrijk",
        population: 77000,
        isCapital: false,
        builderCount: 8,
        upcomingShows: 3,
        averageStandCost: "$2,800",
        venues: [
          {
            name: "Kortrijk Xpo",
            capacity: 40000,
            website: "https://www.kortrijkxpo.com/en/",
          }
        ],
        transportation: {
          nearestAirport: "Brussels Airport",
          publicTransport: "Regular train service to Kortrijk station",
          taxis: "Available at station and venues",
        }
      }`;
        
        content = content.slice(0, insertPosition) + kortrijkCity + content.slice(insertPosition);
        console.log('Added Kortrijk to Belgium');
      }
    }
  }
  
  // Thailand - Khon Kaen
  if (content.includes('name: "Thailand"')) {
    const thailandCitySection = content.indexOf('cities: [', content.indexOf('name: "Thailand"'));
    if (thailandCitySection !== -1) {
      const insertPosition = content.indexOf(']', thailandCitySection);
      if (insertPosition !== -1) {
        const khonKaenCity = `,
      {
        name: "Khon Kaen",
        population: 120000,
        isCapital: false,
        builderCount: 6,
        upcomingShows: 2,
        averageStandCost: "$2,200",
        venues: [
          {
            name: "Khon Kaen International Convention and Exhibition Center",
            capacity: 15000,
            website: "https://www.kice-center.com/",
          }
        ],
        transportation: {
          nearestAirport: "Khon Kaen Airport",
          publicTransport: "Local buses and songthaews",
          taxis: "Available throughout the city",
        }
      }`;
        
        content = content.slice(0, insertPosition) + khonKaenCity + content.slice(insertPosition);
        console.log('Added Khon Kaen to Thailand');
      }
    }
  }
  
  // France - Strasbourg
  if (content.includes('name: "France"')) {
    const franceCitySection = content.indexOf('cities: [', content.indexOf('name: "France"'));
    if (franceCitySection !== -1) {
      const insertPosition = content.indexOf(']', franceCitySection);
      if (insertPosition !== -1) {
        const strasbourgCity = `,
      {
        name: "Strasbourg",
        population: 280000,
        isCapital: false,
        builderCount: 15,
        upcomingShows: 5,
        averageStandCost: "$3,200",
        venues: [
          {
            name: "Strasbourg Exhibition Centre",
            capacity: 24000,
            website: "https://www.strasbourg-events.com/en/",
          }
        ],
        transportation: {
          nearestAirport: "Strasbourg Airport",
          publicTransport: "Excellent tram and bus network",
          taxis: "Available at stations and throughout the city",
        }
      }`;
        
        content = content.slice(0, insertPosition) + strasbourgCity + content.slice(insertPosition);
        console.log('Added Strasbourg to France');
      }
    }
  }
  
  // Netherlands - Maastricht, Rotterdam, Vijfhuizen
  if (content.includes('name: "Netherlands"')) {
    const netherlandsCitySection = content.indexOf('cities: [', content.indexOf('name: "Netherlands"'));
    if (netherlandsCitySection !== -1) {
      const insertPosition = content.indexOf(']', netherlandsCitySection);
      if (insertPosition !== -1) {
        const newCities = `,
      {
        name: "Maastricht",
        population: 120000,
        isCapital: false,
        builderCount: 10,
        upcomingShows: 4,
        averageStandCost: "$3,000",
        venues: [
          {
            name: "MECC Maastricht",
            capacity: 30000,
            website: "https://www.mecc.nl/en/",
          }
        ],
        transportation: {
          nearestAirport: "Maastricht Aachen Airport",
          publicTransport: "Regular train and bus services",
          taxis: "Available at station and venues",
        }
      },
      {
        name: "Rotterdam",
        population: 650000,
        isCapital: false,
        builderCount: 18,
        upcomingShows: 7,
        averageStandCost: "$3,500",
        venues: [
          {
            name: "Rotterdam Ahoy",
            capacity: 45000,
            website: "https://www.ahoy.nl/en/",
          }
        ],
        transportation: {
          nearestAirport: "Rotterdam The Hague Airport",
          publicTransport: "Excellent metro, tram and bus network",
          taxis: "Readily available throughout the city",
        }
      },
      {
        name: "Vijfhuizen",
        population: 5000,
        isCapital: false,
        builderCount: 5,
        upcomingShows: 2,
        averageStandCost: "$2,800",
        venues: [
          {
            name: "Expo Haarlemmermeer",
            capacity: 15000,
            website: "https://www.expohaarlemmermeer.nl/",
          }
        ],
        transportation: {
          nearestAirport: "Amsterdam Schiphol Airport",
          publicTransport: "Bus connections to Hoofddorp and Haarlem",
          taxis: "Available but pre-booking recommended",
        }
      }`;
        
        content = content.slice(0, insertPosition) + newCities + content.slice(insertPosition);
        console.log('Added Maastricht, Rotterdam, and Vijfhuizen to Netherlands');
      }
    }
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(countriesFilePath, content, 'utf8');
  console.log('Updated countries.ts file successfully');
}

// Function to revalidate pages
async function revalidatePages() {
  console.log('Revalidating pages...');
  
  const baseUrl = 'http://localhost:3001'; // Change to your actual base URL
  
  // Revalidate country pages
  const countriesToRevalidate = [
    'tw', 'hk', 'nz', 'vn', 'id', 'ph', 'in', 'au', 'es', 'ch', 'at',
    'jp', 'be', 'th', 'fr', 'nl'
  ];
  
  for (const country of countriesToRevalidate) {
    try {
      const response = await fetch(`${baseUrl}/api/revalidate?path=/exhibition-stands/${country}`);
      const data = await response.json();
      console.log(`Revalidated ${country}: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error(`Error revalidating ${country}:`, error);
    }
  }
  
  // Revalidate city pages
  const citiesToRevalidate = [
    'jp/chiba',
    'be/kortrijk',
    'th/khon-kaen',
    'fr/strasbourg',
    'nl/maastricht',
    'nl/rotterdam',
    'nl/vijfhuizen'
  ];
  
  for (const city of citiesToRevalidate) {
    try {
      const response = await fetch(`${baseUrl}/api/revalidate?path=/exhibition-stands/${city}`);
      const data = await response.json();
      console.log(`Revalidated ${city}: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error(`Error revalidating ${city}:`, error);
    }
  }
}

// Main function
async function main() {
  try {
    await updateCountriesFile();
    await revalidatePages();
    console.log('All updates completed successfully!');
  } catch (error) {
    console.error('Error during update process:', error);
  }
}

main();