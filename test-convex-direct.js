const { ConvexHttpClient } = require("convex/browser");

async function testConvexConnection() {
  try {
    console.log('🔄 Testing direct Convex connection...');
    
    const convex = new ConvexHttpClient("https://tame-labrador-80.convex.cloud");
    
    // Test the debug queries
    console.log('📊 Running countBuilders...');
    const count = await convex.query("debug:countBuilders");
    console.log('✅ Builder count:', count);
    
    console.log('📊 Running getAllBuildersDebug...');
    const debugData = await convex.query("debug:getAllBuildersDebug");
    console.log('✅ Debug data:', JSON.stringify(debugData, null, 2));
    
    console.log('📊 Running getGMBImportedBuilders...');
    const gmbBuilders = await convex.query("debug:getGMBImportedBuilders");
    console.log('✅ GMB builders:', gmbBuilders.length);
    
    console.log('📊 Running getAllBuilders...');
    const allBuilders = await convex.query("builders:getAllBuilders", { limit: 10, offset: 0 });
    console.log('✅ All builders response:', JSON.stringify(allBuilders, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing Convex:', error);
  }
}

testConvexConnection();