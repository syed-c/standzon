import { convertToProxyUrl, convertImageUrlsToProxy } from './imageProxyUtils';

// Simple test function to verify the utility functions
function runTests() {
  console.log('Running imageProxyUtils tests...');
  
  // Test 1: Convert Supabase storage URLs to proxied URLs
  const supabaseUrl = 'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/image.jpg';
  const expected1 = '/api/media/gallery/image.jpg';
  const result1 = convertToProxyUrl(supabaseUrl);
  console.log('Test 1:', result1 === expected1 ? 'PASS' : 'FAIL', result1);
  
  // Test 2: Handle Supabase URLs with complex paths
  const complexUrl = 'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/countries/germany/2025-11-10/1762763411941-s2djz45rr6e.png';
  const expected2 = '/api/media/countries/germany/2025-11-10/1762763411941-s2djz45rr6e.png';
  const result2 = convertToProxyUrl(complexUrl);
  console.log('Test 2:', result2 === expected2 ? 'PASS' : 'FAIL', result2);
  
  // Test 3: Return the original URL for non-Supabase URLs
  const externalUrl = 'https://example.com/image.jpg';
  const result3 = convertToProxyUrl(externalUrl);
  console.log('Test 3:', result3 === externalUrl ? 'PASS' : 'FAIL', result3);
  
  // Test 4: Handle invalid inputs gracefully
  const result4 = convertToProxyUrl('');
  console.log('Test 4:', result4 === '' ? 'PASS' : 'FAIL', `"${result4}"`);
  
  // Test 5: Convert an array of Supabase URLs
  const urls = [
    'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/image1.jpg',
    'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/image2.png',
    'https://example.com/external.jpg'
  ];
  
  const expected5 = [
    '/api/media/gallery/image1.jpg',
    '/api/media/gallery/image2.png',
    'https://example.com/external.jpg'
  ];
  
  const result5 = convertImageUrlsToProxy(urls);
  const test5Pass = JSON.stringify(result5) === JSON.stringify(expected5);
  console.log('Test 5:', test5Pass ? 'PASS' : 'FAIL', result5);
  
  console.log('All tests completed.');
}

// Run the tests
runTests();

export { runTests };