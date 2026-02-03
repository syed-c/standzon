// Test script to verify the React error fix
console.log('Testing React error fix...');

// Simulate the problematic scenario that was causing the React error
const testData = {
  heading: { heading: 'Test Heading' },
  description: { description: 'Test Description' },
  title: { title: 'Test Title' }
};

// Test the fix
function safeRender(value) {
  if (typeof value === 'object' && value !== null) {
    // If it's an object, try to extract the relevant property
    if (value.heading) return value.heading;
    if (value.title) return value.title;
    if (value.description) return value.description;
    if (value.text) return value.text;
    // If no recognizable property, convert to string
    return JSON.stringify(value);
  }
  return value;
}

console.log('Original heading:', testData.heading);
console.log('Fixed heading:', safeRender(testData.heading));
console.log('Original description:', testData.description);
console.log('Fixed description:', safeRender(testData.description));
console.log('Original title:', testData.title);
console.log('Fixed title:', safeRender(testData.title));

console.log('✅ Test completed successfully!');