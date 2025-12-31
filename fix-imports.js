const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Component mappings
const componentMappings = {
  // Admin components
  'AddBuilderForm': 'admin',
  'AdminBuilderManager': 'admin',
  'AdminClaimsManager': 'admin',
  'AdminManagementSystem': 'admin',
  'AdvancedAdminDashboard': 'admin',
  'AdvancedAnalytics': 'admin',
  'AdvancedBulkOperations': 'admin',
  'AutoGenerationSystem': 'admin',
  'BulkBuilderImporter': 'admin',
  'BulkUploadSystem': 'admin',
  'BusinessIntelligenceDashboard': 'admin',
  'DataAuditSystem': 'admin',
  'DataCompletenessDashboard': 'admin',
  'DataPersistenceMonitor': 'admin',
  'EnhancedBuilderManagement': 'admin',
  'EnhancedLeadManagement': 'admin',
  'EnhancedMessagingSystem': 'admin',
  'EnhancedSuperAdminControls': 'admin',
  'FeaturedBuildersManager': 'admin',
  'RealTimeBuilderManager': 'admin',
  'Sidebar': 'admin',
  'SidebarComponents': 'admin',
  'SuperAdminDashboard': 'admin',
  'SuperAdminLocationManager': 'admin',
  'SuperAdminWebsiteSettings': 'admin',
  'SuperAdminWebsiteSettingsClient': 'admin',
  'SystemSettingsPanel': 'admin',
  'TradeShowManagement': 'admin',
  'UnifiedAdminDashboard': 'admin',
  'UserDashboard': 'admin',
  'UserManagement': 'admin',
  'WebsiteCustomization': 'admin',
  'WebsitePagesManager': 'admin',
  'WorkingGlobalPagesManager': 'admin',

  // Builder components
  'BuilderCard': 'builder',
  'BuilderDashboard': 'builder',
  'BuilderLeadFlow': 'builder',
  'BuilderProfileTemplate': 'builder',
  'BuilderSignupForm': 'builder',
  'ComprehensiveBuilderFlow': 'builder',
  'EnhancedBuilderRegistration': 'builder',
  'EnhancedBuilderSignup': 'builder',
  'UnifiedBuilderDashboard': 'builder',

  // Public components
  'AboutPageContent': 'public',
  'BoothRentalPageContent': 'public',
  'BuildersDirectoryContent': 'public',
  'ContactPageContent': 'public',
  'CountryCityPage': 'public',
  'CountryGallery': 'public',
  'CustomBoothPageContent': 'public',
  'EnhancedCityPage': 'public',
  'EnhancedCountryPage': 'public',
  'EnhancedLocationPage': 'public',
  'ExhibitionPage': 'public',
  'ExhibitionStandsContent': 'public',
  'FeaturedBuilders': 'public',
  'FeatureShowcase': 'public',
  'UltraFastHero': 'public',

  // Shared components
  'AnimatedBackground': 'shared',
  'AnimatedCounter': 'shared',
  'AuthPage': 'shared',
  'BreadcrumbNavigation': 'shared',
  'CitySelector': 'shared',
  'ContactSection': 'shared',
  'EnhancedHeroWithQuote': 'shared',
  'EventPlannerSignupForm': 'shared',
  'PerformanceMonitor': 'shared',
  'PhoneInput': 'shared',
  'ServiceWorkerRegistration': 'shared',
  'TestimonialsCarousel': 'shared',
  'TradeStyleBanner': 'shared',
  'WhatsAppFloat': 'shared',
};

// Find all TSX/TS files in app directory
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.match(/\.(tsx|ts|jsx|js)$/)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

const files = findFiles('./app');
console.log(`Found ${files.length} files to process`);

let fixedCount = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix imports
  Object.keys(componentMappings).forEach(componentName => {
    const folder = componentMappings[componentName];
    const oldPattern = new RegExp(`from ['"]@/components/${componentName}['"]`, 'g');
    const newPattern = `from '@/components/${folder}/${componentName}'`;

    if (oldPattern.test(content)) {
      content = content.replace(oldPattern, newPattern);
      modified = true;
      console.log(`Fixed ${componentName} in ${filePath}`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} files`);
