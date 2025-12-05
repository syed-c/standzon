import { NextResponse } from 'next/server';

// ✅ LIGHTWEIGHT: Simple health check without heavy data loading
export async function GET() {
  console.log('🩺 Health check endpoint called');

  try {
    // Basic server health check - no heavy operations
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: 'running',
      database: 'file_system',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      environment: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json({
      success: true,
      ...healthStatus
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    return NextResponse.json({
      success: false,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}