// Simple test script to verify the project structure
console.log('=== Simple Test Script ===');
console.log('Current working directory:', process.cwd());
console.log('Node.js version:', process.version);

// List files in lib/data directory
const fs = require('fs');
const path = require('path');

try {
  const dataDir = path.join(process.cwd(), 'lib', 'data');
  console.log('Files in lib/data:');
  const files = fs.readdirSync(dataDir);
  files.forEach(file => {
    console.log('  -', file);
  });
} catch (error) {
  console.error('Error reading lib/data directory:', error.message);
}

console.log('=== Test completed ===');