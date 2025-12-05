const http = require('http');

// Make a request to the pages editor API
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/pages-editor?action=list',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log(`Total pages: ${jsonData.data.length}`);
      
      // Filter UAE pages
      const uaePages = jsonData.data.filter(page => page.path.includes('united-arab-emirates'));
      console.log(`UAE pages: ${uaePages.length}`);
      
      // Display UAE pages
      uaePages.forEach(page => {
        console.log(`  - ${page.path} (${page.title})`);
      });
      
      // Check for specific UAE pages
      const expectedPages = [
        '/exhibition-stands/united-arab-emirates',
        '/exhibition-stands/united-arab-emirates/dubai',
        '/exhibition-stands/united-arab-emirates/abu-dhabi',
        '/exhibition-stands/united-arab-emirates/sharjah'
      ];
      
      console.log('\nChecking for specific UAE pages:');
      expectedPages.forEach(expectedPath => {
        const found = jsonData.data.some(page => page.path === expectedPath);
        console.log(`  ${expectedPath}: ${found ? '✅ Found' : '❌ Missing'}`);
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error);
});

req.end();