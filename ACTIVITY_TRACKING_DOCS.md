# Activity Tracking System Documentation

## Overview
The enhanced activity tracking system now captures:
1. All administrative activities (login, logout, create, update, delete, etc.)
2. Database changes (CREATE, READ, UPDATE, DELETE operations)
3. User sessions with duration tracking
4. Page visit tracking for admin users

## Features Implemented

### 1. Database Change Tracking
All file-based database operations are now tracked automatically:
- When data is written to any JSON file via the persistence API
- Operation type is automatically determined (CREATE, UPDATE, DELETE)
- Changes are logged with timestamps and user information

### 2. Session Tracking
- User sessions are created on login
- Page visits are tracked throughout the admin session
- Session duration is calculated on logout
- Active sessions can be viewed in real-time

### 3. Enhanced Activity Logs
- All activities are stored persistently
- Logs include detailed information about operations
- Filtering by action type, user, and date range
- Export functionality for compliance and auditing

## API Endpoints

### Activity Logs
- `GET /api/admin/activities` - Retrieve all activity logs
- `GET /api/admin/activities?action=sessions` - Retrieve session data
- `POST /api/admin/activities` - Add new logs or manage sessions

### Test Endpoint
- `POST /api/admin/test-db-change` - Test database change tracking

## How to Use

### 1. Viewing Activities
Navigate to `/admin/activities` to view:
- All administrative activities
- Database changes with operation details
- Active user sessions with duration tracking

### 2. Testing the System
1. Go to `/admin/test-activity`
2. Fill in the test form with sample data
3. Submit to create a test database change log
4. Check `/admin/activities` to see the logged change

### 3. Session Tracking
1. Login to the admin panel
2. Navigate to different admin pages
3. Check session data in the Activities page
4. Logout to end the session and calculate duration

## Implementation Details

### Automatic Tracking
- Database changes are automatically tracked when using `enhancedStorage.writeData()`
- Session tracking is handled through login/logout APIs
- Page visits are tracked using the `useAdminActivityTracker` hook

### Manual Tracking
For custom tracking, use the `activityLogAPI`:
```typescript
import { activityLogAPI } from '@/lib/database/activityLogAPI';

// Log a custom activity
await activityLogAPI.addLog({
  user: 'admin@example.com',
  action: 'custom_action',
  resource: 'custom_resource',
  details: 'Custom activity details',
  severity: 'info'
});

// Log a database change manually
await activityLogAPI.logDatabaseChange(
  'admin@example.com',
  'builders',
  'UPDATE',
  'builder-123',
  { name: 'New Builder Name' },
  'Updated builder information'
);
```

## Data Structure

### ActivityLog
```typescript
interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details?: string;
  ip?: string;
  userAgent?: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  sessionId?: string;
  duration?: number;
  dbChange?: {
    table: string;
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
    recordId?: string;
    changes?: Record<string, any>;
  };
}
```

### UserSession
```typescript
interface UserSession {
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
```

## Future Enhancements
1. Real-time activity streaming
2. Email notifications for critical activities
3. Integration with external logging services
4. Advanced analytics and reporting