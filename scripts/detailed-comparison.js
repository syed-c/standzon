const fs = require('fs');
const path = require('path');

// Read both sitemap files
const currentSitemap = fs.readFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), 'utf8');
const newSitemap = fs.readFileSync(path.join(__dirname, '..', 'public', 'new-sitemap.xml'), 'utf8');

// Extract URLs from sitemap content
function extractUrls(sitemapContent) {
  const urls = [];
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  
  while ((match = urlRegex.exec(sitemapContent)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
}

// Get URLs from both sitemaps
const currentUrls = extractUrls(currentSitemap);
const newUrls = extractUrls(newSitemap);

console.log(`Current sitemap has ${currentUrls.length} URLs`);
console.log(`New sitemap has ${newUrls.length} URLs`);

// Sort both arrays for easier comparison
const sortedCurrentUrls = [...currentUrls].sort();
const sortedNewUrls = [...newUrls].sort();

// Compare each URL
let differences = [];
for (let i = 0; i < Math.max(sortedCurrentUrls.length, sortedNewUrls.length); i++) {
  if (sortedCurrentUrls[i] !== sortedNewUrls[i]) {
    differences.push({
      index: i,
      current: sortedCurrentUrls[i],
      new: sortedNewUrls[i]
    });
  }
}

console.log(`\nFound ${differences.length} differences:`);
differences.slice(0, 20).forEach(diff => {
  console.log(`  Index ${diff.index}:`);
  console.log(`    Current: ${diff.current || 'MISSING'}`);
  console.log(`    New:     ${diff.new || 'MISSING'}`);
});

if (differences.length > 20) {
  console.log(`  ... and ${differences.length - 20} more differences`);
}

// Find URLs that are in current but not in new
const onlyInCurrent = currentUrls.filter(url => !newUrls.includes(url));
if (onlyInCurrent.length > 0) {
  console.log(`\nURLs only in current sitemap (${onlyInCurrent.length}):`);
  onlyInCurrent.slice(0, 10).forEach(url => console.log(`  - ${url}`));
  if (onlyInCurrent.length > 10) {
    console.log(`  ... and ${onlyInCurrent.length - 10} more`);
  }
}

// Find URLs that are in new but not in current
const onlyInNew = newUrls.filter(url => !currentUrls.includes(url));
if (onlyInNew.length > 0) {
  console.log(`\nURLs only in new sitemap (${onlyInNew.length}):`);
  onlyInNew.slice(0, 10).forEach(url => console.log(`  - ${url}`));
  if (onlyInNew.length > 10) {
    console.log(`  ... and ${onlyInNew.length - 10} more`);
  }
}