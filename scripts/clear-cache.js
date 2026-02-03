// Script to clear the cache and refresh CMS data
const fetch = require('node-fetch');

async function clearCache() {
  try {
    console.log('Clearing cache to refresh Italy cities data...');
    
    // Call the cache clear API endpoint
    const response = await fetch('http://localhost:3000/api/admin/clear-cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ force: true }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Success:', result.message);
    } else {
      console.error('❌ Error:', result.message);
    }
  } catch (error) {
    console.error('❌ Failed to clear cache:', error.message);
  }
}

// Execute the cache clear function
clearCache();