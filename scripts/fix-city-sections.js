const fs = require('fs');
const path = require('path');

// Create dedicated country pages for Germany and United Kingdom
const countriesToFix = [
  { name: 'Germany', code: 'de' },
  { name: 'United Kingdom', code: 'gb' }
];

// Path to create the country pages
const countryPagesDir = path.resolve('app/exhibition-stands');

// Create country pages based on existing templates
countriesToFix.forEach(country => {
  const countryPageDir = path.join(countryPagesDir, country.code);
  const countryPagePath = path.join(countryPageDir, 'page.tsx');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(countryPageDir)) {
    fs.mkdirSync(countryPageDir, { recursive: true });
    console.log(`✅ Created directory for ${country.name}`);
  }
  
  // Create country page if it doesn't exist
  if (!fs.existsSync(countryPagePath)) {
    // Use Israel's page as a template
    const templatePath = path.join(countryPagesDir, 'israel', 'page.tsx');
    let templateContent = '';
    
    try {
      templateContent = fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
      console.log(`❌ Could not read template file: ${error.message}`);
      return;
    }
    
    // Replace Israel-specific content with the target country
    const countryContent = templateContent
      .replace(/Israel/g, country.name)
      .replace(/israel/g, country.code)
      .replace(/🇮🇱/g, country.code === 'de' ? '🇩🇪' : '🇬🇧')
      .replace(/IsraelPage/g, `${country.name.replace(/\s+/g, '')}Page`)
      .replace(/Middle East/g, country.code === 'de' ? 'Europe' : 'Europe')
      .replace(/Israel is a thriving center for innovation and trade shows in the Middle East/g, 
        country.code === 'de' 
          ? 'Germany is a leading hub for international trade shows and exhibitions in Europe'
          : 'The United Kingdom is a major center for international trade shows and exhibitions in Europe');
    
    fs.writeFileSync(countryPagePath, countryContent);
    console.log(`✅ Created country page for ${country.name}`);
  } else {
    console.log(`⚠️ Country page for ${country.name} already exists`);
  }
});

// Now update the dynamic country page component to handle these countries correctly
const dynamicCountryPagePath = path.resolve('app/exhibition-stands/[country]/page.tsx');
let dynamicPageContent = fs.readFileSync(dynamicCountryPagePath, 'utf8');

// Add special handling for Germany and UK if not already present
if (!dynamicPageContent.includes("const isSpecialCountry = ['jordan', 'lebanon', 'israel', 'de', 'gb']")) {
  dynamicPageContent = dynamicPageContent.replace(
    "const isSpecialCountry = ['jordan', 'lebanon', 'israel']",
    "const isSpecialCountry = ['jordan', 'lebanon', 'israel', 'de', 'gb']"
  );
  
  fs.writeFileSync(dynamicCountryPagePath, dynamicPageContent);
  console.log('✅ Updated dynamic country page with special handling for Germany and UK');
}

console.log('✅ City section display issues fixed for Germany and United Kingdom!');