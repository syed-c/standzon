import { NextRequest, NextResponse } from 'next/server';
import { activityLogAPI } from '@/lib/database/activityLogAPI';

export async function GET() {
  try {
    console.log('Testing activity tracking...');
    
    // Test adding a log
    const result = await activityLogAPI.addLog({
      user: 'test@example.com',
      action: 'test',
      resource: 'test-resource',
      details: 'This is a test log entry',
      severity: 'info'
    });
    
    console.log('Add log result:', result);
    
    // Test getting all logs
    const logs = await activityLogAPI.getAllLogs();
    console.log('Total logs:', logs.length);
    console.log('Most recent log:', logs[0]);
    
    return NextResponse.json({
      success: true,
      message: 'Test completed successfully!',
      result,
      totalLogs: logs.length,
      mostRecentLog: logs[0]
    });
  } catch (error: any) {
    console.error('Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
}