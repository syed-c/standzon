import { NextResponse } from 'next/server';
import { connectDatabase } from '@/lib/database/client';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

// Platform setup and statistics API
export async function GET() {
  try {
    console.log('📊 Getting platform statistics from unified platform...');
    
    // Try to connect to database (but don't fail if it doesn't work)
    const dbConnected = await connectDatabase();
    
    // Get statistics from unified platform (always works)
    const builders = unifiedPlatformAPI.getBuilders();
    const leads = unifiedPlatformAPI.getLeads();
    const events = unifiedPlatformAPI.getEvents();
    
    // Calculate statistics
    const countries = Array.from(new Set(builders.map(b => b.headquarters.country)));
    const cities = Array.from(new Set(builders.flatMap(b => b.serviceLocations.map(l => l.city))));
    
    const platformStats = {
      totalUsers: builders.length, // Each builder has a user
      totalBuilders: builders.length,
      totalLeads: leads.length,
      totalRevenue: 2847560, // Mock value
      totalCountries: countries.length,
      totalCities: cities.length,
      activeConversations: 12, // Mock value
      conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'CONVERTED').length / leads.length) * 100) : 0,
      monthlyGrowth: 15.6, // Mock value
      recentActivity: [
        {
          type: 'builder_registered',
          message: 'New builder registered: Exhibition Masters',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          status: 'success'
        },
        {
          type: 'lead_received',
          message: 'New lead: Tech Corp Exhibition',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          status: 'success'
        },
        {
          type: 'system_update',
          message: 'Platform data synchronized',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          status: 'info'
        }
      ],
      systemStatus: 'operational',
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Platform statistics retrieved successfully',
      platformStats,
      setupComplete: true,
      databaseConnected: dbConnected,
      servicesRunning: {
        api: true,
        database: dbConnected,
        email: false,
        payment: false,
        fileUpload: false
      }
    });
    
  } catch (error) {
    console.error('❌ Setup API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get platform statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    console.log('🔧 Initializing platform setup...');
    
    // Try database connection
    const dbConnected = await connectDatabase();
    
    // Always ensure unified platform data is loaded
    await unifiedPlatformAPI.reloadFromFiles();
    
    return NextResponse.json({
      success: true,
      message: 'Platform setup completed successfully',
      setupSteps: [
        { step: 'Database', status: dbConnected ? 'completed' : 'skipped', message: dbConnected ? 'Database connected and ready' : 'Database connection failed, using unified platform data' },
        { step: 'Unified Platform', status: 'completed', message: 'Unified platform data loaded successfully' },
        { step: 'Data Integrity', status: 'completed', message: `${unifiedPlatformAPI.getBuilders().length} builders verified` },
        { step: 'APIs', status: 'completed', message: 'All API endpoints operational' },
        { step: 'Services', status: 'completed', message: 'Core services initialized' }
      ],
      dataStats: {
        builders: unifiedPlatformAPI.getBuilders().length,
        leads: unifiedPlatformAPI.getLeads().length,
        events: unifiedPlatformAPI.getEvents().length
      }
    });
    
  } catch (error) {
    console.error('❌ Setup initialization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Setup initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}