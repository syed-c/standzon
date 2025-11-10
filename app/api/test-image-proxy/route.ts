import { NextResponse } from 'next/server';
import { convertToProxyUrl, convertImageUrlsToProxy } from '@/lib/utils/imageProxyUtils';

export async function GET() {
  try {
    // Test cases
    const testCases = [
      {
        name: 'Supabase storage URL (new format with bucket)',
        input: 'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/1762765141975-7zbl5ivme0o.jpg',
        expected: '/api/media/gallery/countries/germany/2025-11-10/1762765141975-7zbl5ivme0o.jpg'
      },
      {
        name: 'Supabase storage URL (old format without bucket)',
        input: 'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/countries/germany/2025-11-10/1762763411941-s2djz45rr6e.png',
        expected: '/api/media/gallery/countries/germany/2025-11-10/1762763411941-s2djz45rr6e.png'
      },
      {
        name: 'Portfolio images bucket',
        input: 'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/portfolio-images/logos/company-logo.png',
        expected: '/api/media/portfolio-images/logos/company-logo.png'
      },
      {
        name: 'Non-Supabase URL',
        input: 'https://example.com/image.jpg',
        expected: 'https://example.com/image.jpg'
      },
      {
        name: 'Empty string',
        input: '',
        expected: ''
      }
    ];

    const results = testCases.map(testCase => {
      const result = convertToProxyUrl(testCase.input);
      return {
        name: testCase.name,
        input: testCase.input,
        expected: testCase.expected,
        result: result,
        pass: result === testCase.expected
      };
    });

    // Test array conversion
    const arrayTestInput = [
      'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/image1.jpg',
      'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/portfolio-images/image2.png',
      'https://example.com/external.jpg'
    ];
    
    const arrayTestExpected = [
      '/api/media/gallery/image1.jpg',
      '/api/media/portfolio-images/image2.png',
      'https://example.com/external.jpg'
    ];
    
    const arrayTestResult = convertImageUrlsToProxy(arrayTestInput);
    const arrayTestPass = JSON.stringify(arrayTestResult) === JSON.stringify(arrayTestExpected);
    
    const arrayTest = {
      name: 'Array conversion',
      input: arrayTestInput,
      expected: arrayTestExpected,
      result: arrayTestResult,
      pass: arrayTestPass
    };

    // Test absolute URL conversion
    const absoluteUrlTest = {
      name: 'Absolute URL conversion',
      input: 'https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/test-image.jpg',
      expected: 'https://example.com/api/media/gallery/test-image.jpg',
      result: convertToProxyUrl('https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/test-image.jpg', 'https://example.com'),
      pass: convertToProxyUrl('https://elipizumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/test-image.jpg', 'https://example.com') === 'https://example.com/api/media/gallery/test-image.jpg'
    };

    const allTestsPass = results.every(r => r.pass) && arrayTest.pass && absoluteUrlTest.pass;

    return NextResponse.json({
      success: allTestsPass,
      message: allTestsPass ? 'All tests passed' : 'Some tests failed',
      tests: [...results, arrayTest, absoluteUrlTest],
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Test error:', err);
    return new NextResponse('Test failed: ' + (err as Error).message, { status: 500 });
  }
}