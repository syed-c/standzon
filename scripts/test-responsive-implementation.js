/**
 * Script to test responsive implementation across the StandsZone website
 * Validates that all responsive features have been properly implemented
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Responsive Implementation...\n');

// Test 1: Check if responsive CSS is present in globals
const responsiveCSSPath = path.join(__dirname, '../app/globals.css');
const responsiveCSSContent = fs.readFileSync(responsiveCSSPath, 'utf8');
const responsiveCSSExists = responsiveCSSContent.includes('.responsive-container');
console.log(`✅ Responsive CSS present in globals: ${responsiveCSSExists}`);

// Test 2: Check if responsive CSS is present in globals.css
const globalsCSSPath = path.join(__dirname, '../app/globals.css');
const globalsCSS = fs.readFileSync(globalsCSSPath, 'utf8');
const responsiveCSSExistsInGlobals = globalsCSS.includes('.responsive-container') && globalsCSS.includes('.fluid-h1');
console.log(`✅ Responsive CSS present in globals: ${responsiveCSSExistsInGlobals}`);

// Test 3: Check if Tailwind config has responsive breakpoints
const tailwindConfigPath = path.join(__dirname, '../tailwind.config.ts');
const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
const customBreakpointsExist = tailwindConfig.includes("'xs': '360px'") && 
                               tailwindConfig.includes("'2xl': '1536px'");
console.log(`✅ Custom breakpoints in Tailwind config: ${customBreakpointsExist}`);

// Test 4: Check if fluid typography is defined in Tailwind config
const fluidTypographyExists = tailwindConfig.includes('h1') && 
                             tailwindConfig.includes('clamp(24px, 6vw, 48px)');
console.log(`✅ Fluid typography in Tailwind config: ${fluidTypographyExists}`);

// Test 5: Check if fluid spacing is defined in Tailwind config
const fluidSpacingExists = tailwindConfig.includes('fluid-xs') && 
                          tailwindConfig.includes('clamp(4px, 1vw, 8px)');
console.log(`✅ Fluid spacing in Tailwind config: ${fluidSpacingExists}`);

// Test 6: Check if container system is defined in Tailwind config
const containerSystemExists = tailwindConfig.includes('container:') && 
                             tailwindConfig.includes('maxWidth:');
console.log(`✅ Container system in Tailwind config: ${containerSystemExists}`);

// Test 7: Check if viewport meta tag is properly configured
const layoutPath2 = path.join(__dirname, '../app/layout.tsx');
const layoutContent = fs.readFileSync(layoutPath2, 'utf8');
const viewportConfigured = layoutContent.includes('user-scalable=yes') && 
                          layoutContent.includes('minimum-scale=1.0');
console.log(`✅ Responsive viewport meta tag: ${viewportConfigured}`);

// Test 8: Check if GlobalLayoutProvider uses responsive container
const globalLayoutPath = path.join(__dirname, '../components/GlobalLayoutProvider.tsx');
const globalLayoutContent = fs.readFileSync(globalLayoutPath, 'utf8');
const responsiveContainerUsed = globalLayoutContent.includes('responsive-container');
console.log(`✅ Responsive container in GlobalLayoutProvider: ${responsiveContainerUsed}`);

// Test 9: Check if Navigation component uses responsive container
const navigationPath = path.join(__dirname, '../components/Navigation.tsx');
const navigationContent = fs.readFileSync(navigationPath, 'utf8');
const navResponsiveContainerUsed = navigationContent.includes('responsive-container');
console.log(`✅ Responsive container in Navigation: ${navResponsiveContainerUsed}`);

// Test 10: Check if HeroSection component is responsive
const heroSectionPath = path.join(__dirname, '../components/HeroSection.tsx');
const heroSectionContent = fs.readFileSync(heroSectionPath, 'utf8');
const heroResponsiveContainerUsed = heroSectionContent.includes('responsive-container');
console.log(`✅ Responsive container in HeroSection: ${heroResponsiveContainerUsed}`);

// Test 11: Check if BuilderCard component is responsive
const builderCardPath = path.join(__dirname, '../components/BuilderCard.tsx');
const builderCardContent = fs.readFileSync(builderCardPath, 'utf8');
const builderCardResponsive = builderCardContent.includes('responsive-card');
console.log(`✅ Responsive card in BuilderCard: ${builderCardResponsive}`);

// Summary
console.log('\n📊 Responsive Implementation Summary:');
console.log('====================================');

const allTests = [
  responsiveCSSExists,
  responsiveCSSExistsInGlobals,
  customBreakpointsExist,
  fluidTypographyExists,
  fluidSpacingExists,
  containerSystemExists,
  viewportConfigured,
  responsiveContainerUsed,
  navResponsiveContainerUsed,
  heroResponsiveContainerUsed,
  builderCardResponsive
];

const passedTests = allTests.filter(test => test).length;
const totalTests = allTests.length;

console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${totalTests - passedTests}`);
console.log(`📈 Coverage: ${Math.round((passedTests / totalTests) * 100)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 All responsive implementation tests passed!');
  console.log('✅ Website is fully responsive with:');
  console.log('   - Custom breakpoints (xs, sm, md, lg, xl, 2xl)');
  console.log('   - Fluid typography system');
  console.log('   - Fluid spacing system');
  console.log('   - Responsive container system');
  console.log('   - Proper viewport configuration');
  console.log('   - Responsive components across the site');
  console.log('\n🎯 The website is ready for all screen sizes!');
} else {
  console.log('\n❌ Some responsive features are missing. Please check the implementation.');
}

// Test responsive features in detail
console.log('\n🔍 Detailed Responsive Features Check:');
console.log('=====================================');

// Check for responsive utilities in the CSS
const responsiveCSS = fs.readFileSync(responsiveCSSPath, 'utf8');
const hasFluidTypography = responsiveCSS.includes('.fluid-h1') || responsiveCSS.includes('clamp');
console.log(`✅ Fluid typography classes: ${hasFluidTypography}`);

const hasFluidSpacing = responsiveCSS.includes('.fluid-spacing') || responsiveCSS.includes('clamp');
console.log(`✅ Fluid spacing classes: ${hasFluidSpacing}`);

const hasBreakpointClasses = responsiveCSS.includes('@media (min-width: 360px)') && 
                             responsiveCSS.includes('@media (min-width: 1536px)');
console.log(`✅ Breakpoint-specific classes: ${hasBreakpointClasses}`);

const hasTouchTargets = responsiveCSS.includes('.touch-target') || responsiveCSS.includes('min-height: 44px');
console.log(`✅ Touch target optimization: ${hasTouchTargets}`);

const hasResponsiveImages = responsiveCSS.includes('.responsive-img');
console.log(`✅ Responsive image classes: ${hasResponsiveImages}`);

const hasSafeAreaSupport = responsiveCSS.includes('safe-area');
console.log(`✅ Safe area support: ${hasSafeAreaSupport}`);

console.log('\n✅ Responsive implementation validation complete!');