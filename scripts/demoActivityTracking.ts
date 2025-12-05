#!/usr/bin/env node

/**
 * Demo Script for Activity Tracking System
 * 
 * This script demonstrates how the enhanced activity tracking system works
 * by simulating various operations that would be tracked.
 */

import { activityLogAPI } from '../lib/database/activityLogAPI';

async function demoActivityTracking() {
  console.log('🚀 Starting Activity Tracking Demo...\n');

  // 1. Simulate a user login
  console.log('1. Logging user login...');
  await activityLogAPI.addLog({
    user: 'admin@example.com',
    action: 'login',
    resource: 'system',
    details: 'Admin user logged in successfully',
    severity: 'success',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
  });

  // 2. Simulate creating a new builder
  console.log('2. Logging database CREATE operation...');
  await activityLogAPI.logDatabaseChange(
    'admin@example.com',
    'builders',
    'CREATE',
    'builder-new-001',
    {
      companyName: 'Demo Builder Co.',
      location: 'New York, NY',
      specialties: ['Trade Shows', 'Conferences']
    },
    'Created new builder profile'
  );

  // 3. Simulate updating a builder
  console.log('3. Logging database UPDATE operation...');
  await activityLogAPI.logDatabaseChange(
    'admin@example.com',
    'builders',
    'UPDATE',
    'builder-new-001',
    {
      website: 'https://demobuilder.com',
      contactEmail: 'contact@demobuilder.com'
    },
    'Updated builder contact information'
  );

  // 4. Simulate creating a session
  console.log('4. Creating user session...');
  const sessionResult = await activityLogAPI.createSession({
    userId: 'admin-001',
    user: 'admin@example.com',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
  });

  if (sessionResult.success && sessionResult.data) {
    const sessionId = sessionResult.data.id;
    
    // 5. Simulate page visits
    console.log('5. Adding page visits to session...');
    await activityLogAPI.addPageVisit(sessionId, '/admin/dashboard');
    await activityLogAPI.addPageVisit(sessionId, '/admin/builders');
    await activityLogAPI.addPageVisit(sessionId, '/admin/activities');
    
    // 6. Simulate updating session (user activity)
    console.log('6. Updating session with user activity...');
    await activityLogAPI.updateSession(sessionId, {
      lastActivityTime: new Date().toISOString()
    });
    
    // 7. Simulate ending session (logout)
    console.log('7. Ending user session...');
    const endResult = await activityLogAPI.endSession(sessionId);
    if (endResult.success) {
      console.log(`   Session duration: ${endResult.duration} seconds`);
    }
  }

  // 8. Simulate a user logout
  console.log('8. Logging user logout...');
  await activityLogAPI.addLog({
    user: 'admin@example.com',
    action: 'logout',
    resource: 'system',
    details: 'Admin user logged out',
    severity: 'info',
    ip: '192.168.1.100'
  });

  // 9. Display recent activities
  console.log('\n📊 Recent Activities:');
  const recentActivities = await activityLogAPI.getAllLogs();
  const lastFiveActivities = recentActivities.slice(0, 5);
  
  lastFiveActivities.forEach((activity, index) => {
    console.log(`   ${index + 1}. ${activity.action} on ${activity.resource} by ${activity.user} at ${new Date(activity.timestamp).toLocaleString()}`);
    if (activity.dbChange) {
      console.log(`      └─ DB Change: ${activity.dbChange.operation} ${activity.dbChange.table}`);
    }
  });

  // 10. Display session statistics
  console.log('\n📈 Session Statistics:');
  const stats = await activityLogAPI.getStats();
  console.log(`   Total Sessions: ${stats.totalSessions}`);
  console.log(`   Active Sessions: ${stats.activeSessions}`);
  console.log(`   Average Session Duration: ${stats.avgSessionDuration} seconds`);

  console.log('\n✅ Activity Tracking Demo Completed!');
  console.log('🔍 Visit /admin/activities in your browser to see all tracked activities.');
}

// Run the demo
demoActivityTracking().catch(console.error);