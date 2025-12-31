const fs = require('fs');
const path = require('path');

// Find all TSX/TS files
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

  // Fix all remaining @/components imports that aren't ui or shared
  const patterns = [
    { regex: /from ['"]@\/components\/(WhatsAppFloat|TradeStyleBanner)['"]/g, replacement: (match, comp) => `from '@/components/shared/${comp}'` },
    { regex: /from ['"]@\/components\/(FeaturedBuilders)['"]/g, replacement: (match, comp) => `from '@/components/public/${comp}'` },
    { regex: /from ['"]@\/components\/(ConvexProvider|ThemeProvider)['"]/g, replacement: (match, comp) => `from '@/components/${comp}'` },
  ];

  patterns.forEach(({ regex, replacement }) => {
    const newContent = content.replace(regex, replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
      console.log(`Fixed in ${filePath}`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} files`);
