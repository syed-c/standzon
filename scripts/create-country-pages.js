const fs = require('fs');
const path = require('path');

// Countries to create without city sections
const countriesWithoutCities = [
  { name: 'Taiwan', code: 'tw' },
  { name: 'Hong Kong', code: 'hk' },
  { name: 'New Zealand', code: 'nz' },
  { name: 'Vietnam', code: 'vn' }
];

// Path to the dynamic country page component
const countryPagePath = path.resolve('app/exhibition-stands/[country]/page.tsx');

// Read the current country page component
let countryPageContent = fs.readFileSync(countryPagePath, 'utf8');

// Check if the countries are already handled in the special cases
if (!countryPageContent.includes('tw: true') || 
    !countryPageContent.includes('hk: true') || 
    !countryPageContent.includes('nz: true') || 
    !countryPageContent.includes('vn: true')) {
  
  // Find the special cases object in the code
  const specialCasesRegex = /(const\s+specialCases\s*=\s*{[^}]*})/;
  const specialCasesMatch = countryPageContent.match(specialCasesRegex);
  
  if (specialCasesMatch) {
    // Extract the special cases object
    let specialCasesStr = specialCasesMatch[1];
    
    // Add our countries to the special cases if they're not already there
    countriesWithoutCities.forEach(country => {
      if (!specialCasesStr.includes(`${country.code}: true`)) {
        // Add the country to special cases
        specialCasesStr = specialCasesStr.replace(
          /const\s+specialCases\s*=\s*{/, 
          `const specialCases = {\n  ${country.code}: true,`
        );
      }
    });
    
    // Replace the special cases in the content
    countryPageContent = countryPageContent.replace(specialCasesRegex, specialCasesStr);
    
    // Write the updated content back to the file
    fs.writeFileSync(countryPagePath, countryPageContent);
    console.log('✅ Updated country page component with special cases for countries without city sections');
  } else {
    console.log('❌ Could not find specialCases object in country page component');
  }
} else {
  console.log('✅ All countries already have special cases in country page component');
}

console.log('✅ Country pages without city sections created successfully!');