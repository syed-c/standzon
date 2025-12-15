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

// Find missing URLs (in new but not in current)
const missingUrls = newUrls.filter(url => !currentUrls.includes(url));

console.log(`\nMissing URLs (${missingUrls.length}):`);
missingUrls.forEach(url => {
  console.log(`  - ${url}`);
});

// Find extra URLs (in current but not in new)
const extraUrls = currentUrls.filter(url => !newUrls.includes(url));

console.log(`\nExtra URLs in current sitemap (${extraUrls.length}):`);
extraUrls.forEach(url => {
  console.log(`  - ${url}`);
});