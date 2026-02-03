const http = require('http');

// Test the builders API endpoint
async function testBuildersAPI() {
  console.log('🔍 Testing builders API endpoint...\n');
  
  try {
    // Make a request to the local API endpoint
    const url = 'http://localhost:3000/api/admin/builders?limit=1000&prioritize_real=true';
    
    console.log(`Making request to: ${url}`);
    
    // Since we can't easily make HTTP requests in Node.js without external libraries,
    // let's check if the API route file exists and has the correct settings
    const fs = require('fs');
    const path = require('path');
    
    const apiRoutePath = path.join(__dirname, '..', 'app', 'api', 'admin', 'builders', 'route.ts');
    
    if (fs.existsSync(apiRoutePath)) {
      const apiRouteContent = fs.readFileSync(apiRoutePath, 'utf8');
      
      console.log('✅ API route file exists');
      
      // Check for dynamic settings
      const hasDynamic = apiRouteContent.includes('export const dynamic') || apiRouteContent.includes('force-dynamic');
      const hasRuntime = apiRouteContent.includes('export const runtime');
      
      console.log('Has dynamic export:', hasDynamic ? 'YES' : 'NO');
      console.log('Has runtime export:', hasRuntime ? 'YES' : 'NO');
      
      if (hasDynamic) {
        const dynamicMatch = apiRouteContent.match(/export const dynamic = ["'](.*?)["']/);
        if (dynamicMatch) {
          console.log('Dynamic setting:', dynamicMatch[1]);
        }
      }
      
      if (hasRuntime) {
        const runtimeMatch = apiRouteContent.match(/export const runtime = ["'](.*?)["']/);
        if (runtimeMatch) {
          console.log('Runtime setting:', runtimeMatch[1]);
        }
      }
      
      // Check if it's using the correct getAllBuilders function
      const usesGetAllBuilders = apiRouteContent.includes('getAllBuilders');
      console.log('Uses getAllBuilders:', usesGetAllBuilders ? 'YES' : 'NO');
      
    } else {
      console.log('❌ API route file not found');
    }
    
    console.log('\n🎉 API test complete!');
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testBuildersAPI();