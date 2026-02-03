import { NextRequest, NextResponse } from 'next/server';
import { activityLogAPI } from '@/lib/database/activityLogAPI';

export async function GET(request: NextRequest) {
  console.log('🔍 Activity logs requested at:', new Date().toISOString());
  
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const user = searchParams.get('user');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const includeSessions = searchParams.get('includeSessions') === 'true';
    const sessionId = searchParams.get('sessionId');
    
    if (action === 'stats') {
      // Get activity log statistics
      const stats = await activityLogAPI.getStats();
      
      return NextResponse.json({
        success: true,
        data: stats
      });
    }
    
    if (action === 'sessions') {
      // Get sessions data
      let sessions;
      if (user) {
        sessions = await activityLogAPI.getSessionsByUser(user);
      } else if (sessionId) {
        const session = await activityLogAPI.getSessionById(sessionId);
        sessions = session ? [session] : [];
      } else {
        sessions = await activityLogAPI.getActiveSessions();
      }
      
      return NextResponse.json({
        success: true,
        data: sessions
      });
    }
    
    // Get filtered logs
    let logs;
    if (user) {
      logs = await activityLogAPI.getLogsByUser(user);
    } else if (action) {
      logs = await activityLogAPI.getLogsByAction(action);
    } else if (startDate && endDate) {
      logs = await activityLogAPI.getLogsByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      // Get all logs
      logs = await activityLogAPI.getAllLogs();
    }
    
    // If includeSessions is true, also fetch session data
    if (includeSessions) {
      const sessions = await activityLogAPI.getActiveSessions();
      return NextResponse.json({
        success: true,
        data: {
          logs,
          sessions
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      data: logs
    });
    
  } catch (error) {
    console.error('❌ Failed to retrieve activity logs:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve activity logs'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('🔧 Activity log operation requested at:', new Date().toISOString());
  
  try {
    const { action, data } = await request.json();
    console.log('📝 Activity log action:', action);
    
    if (action === 'clear-logs') {
      console.log('🗑️ Clearing all activity logs...');
      
      const result = await activityLogAPI.clearLogs();
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: `Successfully cleared ${result.deletedCount} activity logs`,
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error || 'Failed to clear activity logs'
        }, { status: 500 });
      }
    }
    
    if (action === 'add-log') {
      console.log('➕ Adding new activity log...');
      
      const result = await activityLogAPI.addLog(data);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Activity log added successfully',
          data: result.data,
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error || 'Failed to add activity log'
        }, { status: 500 });
      }
    }
    
    if (action === 'create-session') {
      console.log('➕ Creating new user session...');
      
      const result = await activityLogAPI.createSession(data);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'User session created successfully',
          data: result.data,
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error || 'Failed to create user session'
        }, { status: 500 });
      }
    }
    
    if (action === 'update-session') {
      console.log('🔄 Updating user session...');
      
      const { sessionId, updates } = data;
      const result = await activityLogAPI.updateSession(sessionId, updates);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'User session updated successfully',
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error || 'Failed to update user session'
        }, { status: 500 });
      }
    }
    
    if (action === 'end-session') {
      console.log('🔚 Ending user session...');
      
      const { sessionId } = data;
      const result = await activityLogAPI.endSession(sessionId);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'User session ended successfully',
          duration: result.duration,
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error || 'Failed to end user session'
        }, { status: 500 });
      }
    }
    
    if (action === 'add-page-visit') {
      console.log('📄 Adding page visit to session...');
      
      const { sessionId, url } = data;
      const result = await activityLogAPI.addPageVisit(sessionId, url);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Page visit added successfully',
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error || 'Failed to add page visit'
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Unknown action'
    }, { status: 400 });
    
  } catch (error) {
    console.error('❌ Activity log operation failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}