// Test script to verify data persistence is working
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing ExhibitBay Data Persistence...');

// Test data directory creation
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory');
} else {
  console.log('✅ Data directory exists');
}

// Test writing sample data
const testData = {
  builders: [
    {
      id: 'test_builder_1',
      companyName: 'Test Builder Co.',
      city: 'Test City',
      country: 'Test Country',
      verified: true,
      rating: 4.5,
      createdAt: new Date().toISOString()
    }
  ]
};

const testFilePath = path.join(dataDir, 'test_builders.json');

try {
  fs.writeFileSync(testFilePath, JSON.stringify(testData, null, 2));
  console.log('✅ Successfully wrote test data');
  
  // Test reading back the data
  const readData = JSON.parse(fs.readFileSync(testFilePath, 'utf8'));
  console.log('✅ Successfully read test data:', readData.builders[0].companyName);
  
  // Test backup creation
  const backupPath = testFilePath + '.backup';
  fs.copyFileSync(testFilePath, backupPath);
  console.log('✅ Successfully created backup');
  
  // List all files in data directory
  const files = fs.readdirSync(dataDir);
  console.log('📁 Files in data directory:', files);
  
  // Clean up test files
  fs.unlinkSync(testFilePath);
  fs.unlinkSync(backupPath);
  console.log('✅ Cleanup complete');
  
  console.log('🎉 Data persistence test PASSED!');
  
} catch (error) {
  console.error('❌ Data persistence test FAILED:', error);
  process.exit(1);
}

// Test Next.js environment
try {
  console.log('🔍 Checking Next.js environment...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Current directory:', process.cwd());
  
  // Check if package.json exists
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('📦 Package name:', packageJson.name);
    console.log('📦 Next.js version:', packageJson.dependencies.next);
  }
  
  // Check if .next directory exists
  if (fs.existsSync('.next')) {
    console.log('✅ .next directory exists');
  } else {
    console.log('⚠️ .next directory does not exist - build may be needed');
  }
  
} catch (error) {
  console.error('❌ Environment check failed:', error);
}

console.log('✅ All tests completed!');