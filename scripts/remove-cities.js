/**
 * Script to remove specific cities from the global exhibition database
 * This script will remove city entries while preserving country data
 */

const fs = require('fs');
const path = require('path');

// List of cities to remove (these were incorrectly listed as countries)
// Format: { slug: 'city-slug', countrySlug: 'country-slug' }
const citiesToRemove = [
  // Austria - Vienna
  { slug: 'vienna', countrySlug: 'austria' },
  
  // Czech Republic - Prague
  { slug: 'prague', countrySlug: 'czech-republic' },
  
  // United States - Tallahassee and Hollywood
  { slug: 'tallahassee', countrySlug: 'united-states' },
  { slug: 'hollywood', countrySlug: 'united-states' }
];

// Additional cities to remove based on your original list
const additionalCitiesToRemove = [
  // Qatar cities
  { slug: 'doha', countrySlug: 'qatar' },
  { slug: 'al-rayyan', countrySlug: 'qatar' },
  { slug: 'al-wakrah', countrySlug: 'qatar' },
  { slug: 'al-khor', countrySlug: 'qatar' },
  { slug: 'messaieed', countrySlug: 'qatar' },
  { slug: 'dawhah', countrySlug: 'qatar' },
  
  // Kuwait cities
  { slug: 'kuwait-city', countrySlug: 'kuwait' },
  { slug: 'hawalli', countrySlug: 'kuwait' },
  { slug: 'ahmadi', countrySlug: 'kuwait' },
  { slug: 'al-farwaniyah', countrySlug: 'kuwait' },
  { slug: 'jubail', countrySlug: 'kuwait' },
  { slug: 'sabah-al-salem', countrySlug: 'kuwait' },
  
  // Oman cities
  { slug: 'muscat', countrySlug: 'oman' },
  { slug: 'al-masqat', countrySlug: 'oman' },
  { slug: 'al-sib', countrySlug: 'oman' },
  { slug: 'al-khawd', countrySlug: 'oman' },
  { slug: 'mussaqah', countrySlug: 'oman' },
  
  // Egypt cities
  { slug: 'cairo', countrySlug: 'egypt' },
  { slug: 'alexandria', countrySlug: 'egypt' },
  { slug: 'luxor', countrySlug: 'egypt' },
  { slug: 'sharm-el-sheikh', countrySlug: 'egypt' },
  
  // Iran cities
  { slug: 'tehran', countrySlug: 'iran' },
  { slug: 'mashhad', countrySlug: 'iran' },
  { slug: 'isfahan', countrySlug: 'iran' },
  
  // Iraq cities
  { slug: 'baghdad', countrySlug: 'iraq' },
  { slug: 'basra', countrySlug: 'iraq' },
  { slug: 'erbil', countrySlug: 'iraq' },
  { slug: 'karbala', countrySlug: 'iraq' },
  
  // China cities
  { slug: 'beijing', countrySlug: 'china' },
  { slug: 'shanghai', countrySlug: 'china' },
  { slug: 'chengdu', countrySlug: 'china' },
  { slug: 'shenzhen', countrySlug: 'china' },
  { slug: 'xiamen', countrySlug: 'china' },
  
  // Japan cities
  { slug: 'tokyo', countrySlug: 'japan' },
  { slug: 'osaka', countrySlug: 'japan' },
  { slug: 'kyoto', countrySlug: 'japan' },
  { slug: 'fukuoka', countrySlug: 'japan' },
  
  // Singapore cities
  { slug: 'singapore', countrySlug: 'singapore' },
  
  // India cities
  { slug: 'new-delhi', countrySlug: 'india' },
  { slug: 'mumbai', countrySlug: 'india' },
  { slug: 'bangalore', countrySlug: 'india' },
  { slug: 'chennai', countrySlug: 'india' },
  { slug: 'delhi', countrySlug: 'india' },
  { slug: 'hyderabad', countrySlug: 'india' },
  { slug: 'ahmedabad', countrySlug: 'india' },
  
  // South Korea cities
  { slug: 'seoul', countrySlug: 'south-korea' },
  { slug: 'busan', countrySlug: 'south-korea' },
  { slug: 'daegu', countrySlug: 'south-korea' },
  { slug: 'incheon', countrySlug: 'south-korea' },
  { slug: 'gwangju', countrySlug: 'south-korea' },
  
  // Australia cities
  { slug: 'sydney', countrySlug: 'australia' },
  { slug: 'melbourne', countrySlug: 'australia' },
  { slug: 'adelaide', countrySlug: 'australia' },
  { slug: 'brisbane', countrySlug: 'australia' },
  
  // Indonesia cities
  { slug: 'jakarta', countrySlug: 'indonesia' },
  { slug: 'makassar', countrySlug: 'indonesia' },
  { slug: 'bali', countrySlug: 'indonesia' },
  
  // Philippines cities
  { slug: 'manila', countrySlug: 'philippines' },
  { slug: 'cebu', countrySlug: 'philippines' },
  { slug: 'davao', countrySlug: 'philippines' },
  
  // Vietnam cities
  { slug: 'ho-chi-minh-city', countrySlug: 'vietnam' },
  { slug: 'hanoi', countrySlug: 'vietnam' },
  { slug: 'da-nang', countrySlug: 'vietnam' },
  
  // United Kingdom cities
  { slug: 'london', countrySlug: 'united-kingdom' },
  { slug: 'edinburgh', countrySlug: 'united-kingdom' },
  { slug: 'glasgow', countrySlug: 'united-kingdom' },
  
  // France cities
  { slug: 'paris', countrySlug: 'france' },
  { slug: 'lyon', countrySlug: 'france' },
  { slug: 'marseille', countrySlug: 'france' },
  { slug: 'nice', countrySlug: 'france' },
  { slug: 'toulouse', countrySlug: 'france' },
  
  // Italy cities
  { slug: 'rome', countrySlug: 'italy' },
  { slug: 'milan', countrySlug: 'italy' },
  { slug: 'naples', countrySlug: 'italy' },
  { slug: 'turin', countrySlug: 'italy' },
  
  // Poland cities
  { slug: 'warsaw', countrySlug: 'poland' },
  { slug: 'kielce', countrySlug: 'poland' },
  { slug: 'poznan', countrySlug: 'poland' },
  
  // Turkey cities
  { slug: 'istanbul', countrySlug: 'turkey' },
  { slug: 'ankara', countrySlug: 'turkey' },
  { slug: 'adana', countrySlug: 'turkey' },
  { slug: 'bursa', countrySlug: 'turkey' },
  
  // Canada cities
  { slug: 'toronto', countrySlug: 'canada' },
  { slug: 'vancouver', countrySlug: 'canada' },
  { slug: 'edmonton', countrySlug: 'canada' },
  
  // Mexico cities
  { slug: 'mexico-city', countrySlug: 'mexico' },
  { slug: 'cancun', countrySlug: 'mexico' },
  { slug: 'monterrey', countrySlug: 'mexico' },
  { slug: 'tijuana', countrySlug: 'mexico' },
  
  // Brazil cities
  { slug: 'sao-paulo', countrySlug: 'brazil' },
  { slug: 'rio-de-janeiro', countrySlug: 'brazil' },
  { slug: 'brasilia', countrySlug: 'brazil' },
  { slug: 'fortaleza', countrySlug: 'brazil' },
  { slug: 'salvador', countrySlug: 'brazil' },
  
  // Chile cities
  { slug: 'santiago', countrySlug: 'chile' },
  { slug: 'valparaiso', countrySlug: 'chile' },
  { slug: 'concepcion', countrySlug: 'chile' },
  
  // Colombia cities
  { slug: 'bogota', countrySlug: 'colombia' },
  { slug: 'medellin', countrySlug: 'colombia' },
  { slug: 'barranquilla', countrySlug: 'colombia' },
  
  // Costa Rica cities
  { slug: 'san-jose', countrySlug: 'costa-rica' },
  { slug: 'alajuela', countrySlug: 'costa-rica' },
  
  // Panama cities
  { slug: 'panama-city', countrySlug: 'panama' },
  { slug: 'colon', countrySlug: 'panama' }
];

// Combine all cities to remove
const allCitiesToRemove = [...citiesToRemove, ...additionalCitiesToRemove];

// Function to remove cities from the global exhibition database
function removeCitiesFromDatabase() {
  const databasePath = path.join(__dirname, '..', 'lib', 'data', 'globalExhibitionDatabase.ts');
  let databaseContent = fs.readFileSync(databasePath, 'utf8');
  
  console.log('🔍 Starting city removal process...');
  console.log(`📝 Found ${allCitiesToRemove.length} cities to remove\n`);
  
  let citiesRemoved = 0;
  
  // Remove each city from the GLOBAL_CITIES array
  allCitiesToRemove.forEach(city => {
    // Create a pattern to match the city entry
    // This pattern looks for a city object with the specific slug and countrySlug
    const cityPattern = new RegExp(
      `\\s*//\\s*[A-Z ]+\\s*\\n\\s*\\{[^}]*id:[^}]*name:[^}]*country:[^}]*countryCode:[^}]*slug:\\s*"${city.slug}"[^}]*countrySlug:\\s*"${city.countrySlug}"[^}]*\\}\\s*,?\\s*`,
      'g'
    );
    
    // Check if the city exists before attempting to remove
    const match = databaseContent.match(cityPattern);
    if (match) {
      console.log(`✅ Found and removing city: ${city.slug} in ${city.countrySlug}`);
      databaseContent = databaseContent.replace(cityPattern, '\n');
      citiesRemoved++;
    } else {
      // Try a simpler pattern
      const simplePattern = new RegExp(
        `\\s*\\{[^}]*slug:\\s*"${city.slug}"[^}]*countrySlug:\\s*"${city.countrySlug}"[^}]*\\}\\s*,?\\s*`,
        'g'
      );
      if (simplePattern.test(databaseContent)) {
        console.log(`✅ Found and removing city (simple pattern): ${city.slug} in ${city.countrySlug}`);
        databaseContent = databaseContent.replace(simplePattern, '\n');
        citiesRemoved++;
      } else {
        console.log(`⚠️  City not found: ${city.slug} in ${city.countrySlug}`);
      }
    }
  });
  
  // Write the updated content back to the file
  fs.writeFileSync(databasePath, databaseContent, 'utf8');
  
  console.log(`\n✨ City removal process complete!`);
  console.log(`📊 Removed ${citiesRemoved} cities from the database`);
  
  return citiesRemoved;
}

// Function to clean up CMS references
function cleanUpCMS() {
  console.log('\n🧹 Cleaning up CMS references...');
  
  // This would involve updating the pages-editor route and any other CMS-related files
  // For now, we'll just log what needs to be done
  console.log('📝 CMS cleanup would involve:');
  console.log('   • Updating pages-editor route to remove city references');
  console.log('   • Cleaning up any city-specific CMS entries');
  console.log('   • Verifying that only country pages remain in the CMS');
  
  console.log('✨ CMS cleanup notes provided');
  return true;
}

// Run the removal process
try {
  const removedCount = removeCitiesFromDatabase();
  cleanUpCMS();
  
  console.log('\n🎉 All city removal tasks completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Restart your development server');
  console.log('   2. Clear your browser cache');
  console.log('   3. Verify that only countries appear in the CMS');
  console.log('   4. Check that city pages are no longer accessible');
  
  console.log(`\n📊 Summary: Removed ${removedCount} cities from the database`);
  
} catch (error) {
  console.error('❌ Error during city removal process:', error);
}