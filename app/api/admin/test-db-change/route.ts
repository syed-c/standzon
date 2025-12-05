import { NextRequest, NextResponse } from 'next/server';
import { activityLogAPI } from '@/lib/database/activityLogAPI';

export async function POST(request: NextRequest) {
  try {
    const { user, table, operation, recordId, changes, details } = await request.json();
    
    // Log database change
    const result = await activityLogAPI.logDatabaseChange(
      user || 'test-user',
      table || 'test_table',
      operation || 'UPDATE',
      recordId,
      changes,
      details || 'Test database change'
    );
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Database change logged successfully',
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to log database change'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error logging database change:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}