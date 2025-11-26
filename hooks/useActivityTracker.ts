import { useEffect } from 'react';

// Utility hook to track admin activities
export function useActivityTracker(
  user: string,
  action: string,
  resource: string,
  details?: string
) {
  useEffect(() => {
    // In a real implementation, this would send data to the activity log API
    // For now, we'll just log to the console
    console.log('Activity tracked:', { user, action, resource, details });
    
    // In a real implementation, you would call:
    // logActivity(user, action, resource, details);
  }, [user, action, resource, details]);
}

// Function to log activity to the backend
export async function logActivity(
  user: string,
  action: string,
  resource: string,
  details?: string
) {
  try {
    // Send activity to the backend API
    await fetch('/api/admin/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add-log',
        data: {
          user,
          action,
          resource,
          details,
          severity: getSeverityForAction(action),
        },
      }),
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

// Helper function to determine severity based on action
function getSeverityForAction(action: string): 'info' | 'warning' | 'error' | 'success' {
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
    default:
      return 'info';
  }
}