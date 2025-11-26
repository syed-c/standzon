import { v4 as uuidv4 } from 'uuid';

// Activity Log API for tracking admin activities
// This system integrates with the existing persistence system

import { enhancedStorage } from './persistenceAPI';

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details?: string;
  ip?: string;
  userAgent?: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  // New fields for enhanced tracking
  sessionId?: string;
  duration?: number; // Duration in seconds for session tracking
  dbChange?: {
    table: string;
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
    recordId?: string;
    changes?: Record<string, any>;
  };
}

// Session tracking interface
export interface UserSession {
  id: string;
  userId: string;
  user: string;
  loginTime: string;
  logoutTime?: string;
  lastActivityTime: string;
  ip?: string;
  userAgent?: string;
  isActive: boolean;
  pagesVisited: Array<{
    url: string;
    timestamp: string;
    duration?: number;
  }>;
}

class ActivityLogAPI {
  private logs: ActivityLog[] = [];
  private sessions: UserSession[] = [];
  private isLoaded = false;
  private lastSyncTime: Date | null = null;

  async ensureLoaded() {
    if (!this.isLoaded) {
      if (enhancedStorage) {
        this.logs = await enhancedStorage.readData('activity_logs', []);
        this.sessions = await enhancedStorage.readData('user_sessions', []);
        console.log(`✅ Loaded ${this.logs.length} activity logs and ${this.sessions.length} sessions from persistent storage`);
      } else {
        this.logs = [];
        this.sessions = [];
        console.log('🔒 Persistence disabled - using empty activity logs and sessions arrays');
      }
      this.isLoaded = true;
      this.lastSyncTime = new Date();
    }
  }

  async saveLogs() {
    if (enhancedStorage) {
      await enhancedStorage.writeData('activity_logs', this.logs);
      await enhancedStorage.writeData('user_sessions', this.sessions);
      this.lastSyncTime = new Date();
    } else {
      console.log('🔒 Persistence disabled - skipping activity logs and sessions save');
    }
  }

  async getAllLogs(): Promise<ActivityLog[]> {
    await this.ensureLoaded();
    return [...this.logs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getLogsByUser(user: string): Promise<ActivityLog[]> {
    await this.ensureLoaded();
    return this.logs
      .filter(log => log.user === user)
      .sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  async getLogsByAction(action: string): Promise<ActivityLog[]> {
    await this.ensureLoaded();
    return this.logs
      .filter(log => log.action === action)
      .sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  async getLogsByDateRange(startDate: Date, endDate: Date): Promise<ActivityLog[]> {
    await this.ensureLoaded();
    return this.logs
      .filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      })
      .sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  async addLog(logData: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<{ success: boolean; data?: ActivityLog; error?: string }> {
    try {
      await this.ensureLoaded();
      
      const newLog: ActivityLog = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        ...logData
      };
      
      this.logs.push(newLog);
      
      // Keep only the last 2000 logs to prevent file from growing too large
      if (this.logs.length > 2000) {
        this.logs = this.logs.slice(-2000);
      }
      
      await this.saveLogs();
      
      console.log('✅ Activity log added:', newLog.action, newLog.resource);
      return { success: true, data: newLog };
    } catch (error) {
      console.error('❌ Error adding activity log:', error);
      return { success: false, error: 'Failed to add activity log' };
    }
  }

  async deleteLog(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureLoaded();
      
      const index = this.logs.findIndex(log => log.id === id);
      if (index === -1) {
        return { success: false, error: 'Activity log not found' };
      }
      
      this.logs.splice(index, 1);
      await this.saveLogs();
      
      console.log('✅ Activity log deleted:', id);
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting activity log:', error);
      return { success: false, error: 'Failed to delete activity log' };
    }
  }

  async clearLogs(): Promise<{ success: boolean; deletedCount?: number; error?: string }> {
    try {
      const count = this.logs.length;
      this.logs = [];
      await this.saveLogs();
      
      console.log(`✅ Cleared all ${count} activity logs`);
      return { success: true, deletedCount: count };
    } catch (error) {
      console.error('❌ Error clearing activity logs:', error);
      return { success: false, error: 'Failed to clear activity logs' };
    }
  }

  // Session tracking methods
  async createSession(sessionData: Omit<UserSession, 'id' | 'loginTime' | 'lastActivityTime' | 'isActive' | 'pagesVisited'>): Promise<{ success: boolean; data?: UserSession; error?: string }> {
    try {
      await this.ensureLoaded();
      
      const newSession: UserSession = {
        id: uuidv4(),
        loginTime: new Date().toISOString(),
        lastActivityTime: new Date().toISOString(),
        isActive: true,
        pagesVisited: [],
        ...sessionData
      };
      
      this.sessions.push(newSession);
      await this.saveLogs();
      
      console.log('✅ User session created:', newSession.id);
      return { success: true, data: newSession };
    } catch (error) {
      console.error('❌ Error creating user session:', error);
      return { success: false, error: 'Failed to create user session' };
    }
  }

  async updateSession(sessionId: string, updates: Partial<Omit<UserSession, 'id' | 'userId' | 'loginTime'>>): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureLoaded();
      
      const session = this.sessions.find(s => s.id === sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }
      
      Object.assign(session, updates);
      session.lastActivityTime = new Date().toISOString();
      await this.saveLogs();
      
      console.log('✅ User session updated:', sessionId);
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating user session:', error);
      return { success: false, error: 'Failed to update user session' };
    }
  }

  async endSession(sessionId: string): Promise<{ success: boolean; duration?: number; error?: string }> {
    try {
      await this.ensureLoaded();
      
      const session = this.sessions.find(s => s.id === sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }
      
      const loginTime = new Date(session.loginTime);
      const logoutTime = new Date();
      const duration = (logoutTime.getTime() - loginTime.getTime()) / 1000; // in seconds
      
      session.logoutTime = logoutTime.toISOString();
      session.isActive = false;
      session.lastActivityTime = logoutTime.toISOString();
      
      await this.saveLogs();
      
      console.log('✅ User session ended:', sessionId);
      return { success: true, duration };
    } catch (error) {
      console.error('❌ Error ending user session:', error);
      return { success: false, error: 'Failed to end user session' };
    }
  }

  async addPageVisit(sessionId: string, url: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureLoaded();
      
      const session = this.sessions.find(s => s.id === sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }
      
      // Update last activity time
      session.lastActivityTime = new Date().toISOString();
      
      // Add page visit
      session.pagesVisited.push({
        url,
        timestamp: new Date().toISOString()
      });
      
      await this.saveLogs();
      
      console.log('✅ Page visit added to session:', sessionId, url);
      return { success: true };
    } catch (error) {
      console.error('❌ Error adding page visit:', error);
      return { success: false, error: 'Failed to add page visit' };
    }
  }

  async getSessionById(sessionId: string): Promise<UserSession | null> {
    await this.ensureLoaded();
    return this.sessions.find(s => s.id === sessionId) || null;
  }

  async getActiveSessions(): Promise<UserSession[]> {
    await this.ensureLoaded();
    return this.sessions.filter(s => s.isActive);
  }

  async getSessionsByUser(userId: string): Promise<UserSession[]> {
    await this.ensureLoaded();
    return this.sessions.filter(s => s.userId === userId);
  }

  // Database change tracking methods
  async logDatabaseChange(
    user: string,
    table: string,
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
    recordId?: string,
    changes?: Record<string, any>,
    details?: string
  ): Promise<{ success: boolean; data?: ActivityLog; error?: string }> {
    try {
      const logData: Omit<ActivityLog, 'id' | 'timestamp'> = {
        user,
        action: 'db_change',
        resource: table,
        details: details || `${operation} operation on ${table}`,
        severity: operation === 'DELETE' ? 'warning' : operation === 'UPDATE' ? 'info' : 'success',
        dbChange: {
          table,
          operation,
          recordId,
          changes
        }
      };

      return await this.addLog(logData);
    } catch (error) {
      console.error('❌ Error logging database change:', error);
      return { success: false, error: 'Failed to log database change' };
    }
  }

  async getStats() {
    await this.ensureLoaded();
    
    const totalLogs = this.logs.length;
    const actions = [...new Set(this.logs.map(log => log.action))];
    const users = [...new Set(this.logs.map(log => log.user))];
    const severities = {
      info: this.logs.filter(log => log.severity === 'info').length,
      warning: this.logs.filter(log => log.severity === 'warning').length,
      error: this.logs.filter(log => log.severity === 'error').length,
      success: this.logs.filter(log => log.severity === 'success').length,
    };

    // Session statistics
    const totalSessions = this.sessions.length;
    const activeSessions = this.sessions.filter(s => s.isActive).length;
    const avgSessionDuration = this.sessions
      .filter(s => s.logoutTime)
      .reduce((acc, s) => {
        const duration = (new Date(s.logoutTime!).getTime() - new Date(s.loginTime).getTime()) / 1000;
        return acc + duration;
      }, 0) / Math.max(1, this.sessions.filter(s => s.logoutTime).length);

    return {
      totalLogs,
      uniqueActions: actions.length,
      uniqueUsers: users.length,
      severities,
      totalSessions,
      activeSessions,
      avgSessionDuration: Math.round(avgSessionDuration),
      lastSyncTime: this.lastSyncTime?.toISOString(),
    };
  }
}

// Export singleton instance
export const activityLogAPI = new ActivityLogAPI();

// Middleware function to log activities
export async function logActivity(
  user: string,
  action: string,
  resource: string,
  details?: string,
  req?: any
) {
  try {
    const logData: Omit<ActivityLog, 'id' | 'timestamp'> = {
      user,
      action,
      resource,
      details,
      severity: getSeverityForAction(action),
    };

    // Add IP and user agent if request object is provided
    if (req) {
      logData.ip = req.headers?.get('x-forwarded-for') || req.connection?.remoteAddress || 'unknown';
      logData.userAgent = req.headers?.get('user-agent') || 'unknown';
    }

    await activityLogAPI.addLog(logData);
  } catch (error) {
    console.error('❌ Failed to log activity:', error);
  }
}

// Helper function to determine severity based on action
function getSeverityForAction(action: string): ActivityLog['severity'] {
  switch (action) {
    case 'login':
      return 'success';
    case 'failed_login':
      return 'error';
    case 'logout':
      return 'info';
    case 'create':
      return 'info';
    case 'update':
      return 'info';
    case 'delete':
      return 'warning';
    case 'db_change':
      return 'info';
    default:
      return 'info';
  }
}

// Helper function to log database changes
export async function logDatabaseChange(
  user: string,
  table: string,
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
  recordId?: string,
  changes?: Record<string, any>,
  details?: string
) {
  try {
    await activityLogAPI.logDatabaseChange(user, table, operation, recordId, changes, details);
  } catch (error) {
    console.error('❌ Failed to log database change:', error);
  }
}