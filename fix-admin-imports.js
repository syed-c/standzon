const fs = require('fs');
const path = require('path');

// Find all TSX/TS files in components directory
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

const files = findFiles('./components');
console.log(`Found ${files.length} files to process`);

let fixedCount = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix admin component imports within components
  const adminComponents = [
    'AdminClaimsManager', 'AdminManagementSystem', 'SystemSettingsPanel',
    'DataAuditSystem', 'DataCompletenessDashboard', 'AdvancedAdminDashboard',
    'AdvancedAnalytics', 'AdvancedBulkOperations', 'AutoGenerationSystem',
    'BulkBuilderImporter', 'BulkUploadSystem', 'BusinessIntelligenceDashboard',
    'DataPersistenceMonitor', 'EnhancedBuilderManagement',
    'EnhancedLeadManagement', 'EnhancedMessagingSystem',
    'EnhancedSuperAdminControls', 'FeaturedBuildersManager',
    'RealTimeBuilderManager', 'Sidebar', 'SidebarComponents',
    'SuperAdminDashboard', 'SuperAdminLocationManager',
    'SuperAdminWebsiteSettings', 'SuperAdminWebsiteSettingsClient',
    'TradeShowManagement', 'UnifiedAdminDashboard',
    'UserDashboard', 'UserManagement', 'WebsiteCustomization',
    'WebsitePagesManager', 'WorkingGlobalPagesManager'
  ];

  adminComponents.forEach(componentName => {
    const oldPattern = new RegExp(`from ['"]@/components/${componentName}['"]`, 'g');
    const newPattern = `from '@/components/admin/${componentName}'`;

    if (oldPattern.test(content)) {
      content = content.replace(oldPattern, newPattern);
      modified = true;
      console.log(`Fixed ${componentName} in ${filePath}`);
    }
  });

  // Fix builder component imports
  const builderComponents = [
    'BuilderCard', 'BuilderDashboard', 'BuilderLeadFlow',
    'BuilderProfileTemplate', 'BuilderSignupForm',
    'ComprehensiveBuilderFlow', 'EnhancedBuilderRegistration',
    'EnhancedBuilderSignup', 'UnifiedBuilderDashboard'
  ];

  builderComponents.forEach(componentName => {
    const oldPattern = new RegExp(`from ['"]@/components/${componentName}['"]`, 'g');
    const newPattern = `from '@/components/builder/${componentName}'`;

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
