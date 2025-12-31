const fs = require('fs');
const path = require('path');

// Component mappings for components directory
const componentMappings = {
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

  // Public components
  'UltraFastHero': 'public',
};

// Find all TSX/TS files in components directory
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== 'ui' && file !== 'admin' && file !== 'builder' && file !== 'public' && file !== 'shared') {
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
