import { NextRequest, NextResponse } from 'next/server';

// Lightweight demo endpoint to test GMB integration
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Running lightweight GMB integration DEMO...');
    
    // Simulate successful import without heavy operations
    const demoResults = {
      total: 3,
      imported: 3,
      skipped: 0,
      errors: 0,
      details: [
        {
          business: 'Vegas Premium Exhibits',
          status: 'imported',
          location: 'Las Vegas, United States',
          type: 'Exhibition Stand Builder'
        },
        {
          business: 'Berlin Creative Displays', 
          status: 'imported',
          location: 'Berlin, Germany',
          type: 'Booth Builder'
        },
        {
          business: 'Dubai Elite Events',
          status: 'imported', 
          location: 'Dubai, United Arab Emirates',
          type: 'Event Planning Service'
        }
      ]
    };

    console.log('✅ Demo completed successfully!');

    return NextResponse.json({
      success: true,
      demo: true,
      message: '🧪 Demo successful! This simulates importing 3 sample businesses from Google Places API.',
      results: demoResults,
      sampleBusinesses: [
        {
          name: 'Vegas Premium Exhibits',
          location: 'Las Vegas, United States',
          type: 'Exhibition Stand Builder',
          rating: 4.6,
          phone: '+1 702 555 0987',
          website: 'https://vegaspremiumexhibits.com'
        },
        {
          name: 'Berlin Creative Displays',
          location: 'Berlin, Germany', 
          type: 'Booth Builder',
          rating: 4.8,
          phone: '+49 30 1234 5678',
          website: 'https://berlincreative.de'
        },
        {
          name: 'Dubai Elite Events',
          location: 'Dubai, United Arab Emirates',
          type: 'Event Planning Service', 
          rating: 4.7,
          phone: '+971 4 555 1234',
          website: 'https://dubaieliteevents.ae'
        }
      ],
      platformStats: {
        before: 9,
        after: 12,
        added: 3
      },
      note: 'This is a demonstration of the GMB integration workflow. In production, businesses would be saved to the real platform database.'
    });

  } catch (error) {
    console.error('❌ Demo failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Demo failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}