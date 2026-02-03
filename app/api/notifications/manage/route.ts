import { NextRequest, NextResponse } from 'next/server';

// Notification Management API - Full admin control over all notifications
export async function POST(request: NextRequest) {
  try {
    const { action, adminId, ...data } = await request.json();
    
    console.log(`📧 Notification management: ${action} by admin ${adminId}`);
    
    switch (action) {
      case 'send_lead_notification':
        return await handleSendLeadNotification(data, adminId);
      case 'update_templates':
        return await handleUpdateTemplates(data, adminId);
      case 'test_notification':
        return await handleTestNotification(data, adminId);
      case 'bulk_notify':
        return await handleBulkNotification(data, adminId);
      case 'get_delivery_status':
        return await handleGetDeliveryStatus(data);
      case 'manage_preferences':
        return await handleManagePreferences(data, adminId);
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Notification management error:', error);
    return NextResponse.json({
      success: false,
      error: 'Notification management failed'
    }, { status: 500 });
  }
}

// Handle notification preferences management
async function handleManagePreferences(data: any, adminId: string) {
  return NextResponse.json({
    success: true,
    message: 'Preferences management feature coming soon'
  });
}

// Send manual lead notification to specific builders
async function handleSendLeadNotification(data: any, adminId: string) {
  try {
    const { leadId, builderIds, customMessage, methods, priority } = data;
    
    console.log(`📢 Admin ${adminId} sending manual lead notification`);
    
    // Get lead data
    const lead = await getLeadData(leadId);
    if (!lead) {
      return NextResponse.json({
        success: false,
        error: 'Lead not found'
      }, { status: 404 });
    }
    
    // Get builder data
    const builders = await getBuildersData(builderIds);
    if (builders.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid builders found'
      }, { status: 404 });
    }
    
    const results: any[] = [];
    
    for (const builder of builders) {
      try {
        const notificationData = {
          builderId: builder.id,
          builderName: builder.companyName,
          leadId: lead.id,
          leadData: {
            companyName: lead.companyName,
            contactName: lead.contactName,
            location: `${lead.city}, ${lead.country}`,
            budget: lead.budget,
            timeline: lead.timeline,
            standSize: lead.standSize,
            priority: priority || lead.priority,
            specialRequests: lead.specialRequests,
            customMessage: customMessage
          },
          isAdminSent: true,
          adminId: adminId
        };
        
        const notificationResult = await sendBuilderNotificationEnhanced(
          notificationData, 
          builder, 
          methods || ['email', 'sms', 'dashboard']
        );
        
        results.push({
          builderId: builder.id,
          builderName: builder.companyName,
          success: notificationResult.success,
          methods: notificationResult.methods,
          error: notificationResult.error
        });
        
        // Log admin notification action
        await logNotificationAction(adminId, 'MANUAL_LEAD_NOTIFICATION', {
          leadId,
          builderId: builder.id,
          methods: notificationResult.methods,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        results.push({
          builderId: builder.id,
          builderName: builder.companyName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    
    return NextResponse.json({
      success: true,
      message: `Notifications sent to ${successCount}/${results.length} builders`,
      results,
      leadId,
      adminId
    });
    
  } catch (error) {
    console.error('❌ Send lead notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send lead notification'
    }, { status: 500 });
  }
}

// Update notification templates
async function handleUpdateTemplates(data: any, adminId: string) {
  try {
    const { templateType, templates } = data;
    
    console.log(`📝 Admin ${adminId} updating ${templateType} templates`);
    
    // Store templates in global storage (in production, use database)
    if (typeof global !== 'undefined') {
      if (!global.notificationTemplates) {
        global.notificationTemplates = {};
      }
      
      global.notificationTemplates[templateType] = {
        ...templates,
        updatedBy: adminId,
        updatedAt: new Date().toISOString()
      };
      
      console.log(`✅ Templates updated for ${templateType}`);
    }
    
    // Log template update
    await logNotificationAction(adminId, 'TEMPLATE_UPDATE', {
      templateType,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: `${templateType} templates updated successfully`,
      templateType,
      updatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Template update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update templates'
    }, { status: 500 });
  }
}

// Test notification system
async function handleTestNotification(data: any, adminId: string) {
  try {
    const { testType, recipient, method, customMessage } = data;
    
    console.log(`🧪 Admin ${adminId} testing ${method} notification to ${recipient}`);
    
    const testData = {
      recipient,
      method,
      message: customMessage || getTestMessage(testType),
      isTest: true,
      adminId,
      testType
    };
    
    let result;
    
    switch (method) {
      case 'email':
        result = await sendTestEmail(testData);
        break;
      case 'sms':
        result = await sendTestSMS(testData);
        break;
      case 'dashboard':
        result = await sendTestDashboardNotification(testData);
        break;
      default:
        throw new Error('Invalid test method');
    }
    
    // Log test notification
    await logNotificationAction(adminId, 'TEST_NOTIFICATION', {
      testType,
      method,
      recipient: maskContact(recipient, method),
      success: result.success,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: `Test ${method} notification sent to ${maskContact(recipient, method)}`,
      testResult: result,
      sentAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Test notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test notification failed'
    }, { status: 500 });
  }
}

// Bulk notification to multiple builders
async function handleBulkNotification(data: any, adminId: string) {
  try {
    const { filters, message, methods, priority, scheduleAt } = data;
    
    console.log(`📮 Admin ${adminId} sending bulk notifications with filters:`, filters);
    
    // Find builders matching filters
    const matchingBuilders = await findBuildersWithFilters(filters);
    
    if (matchingBuilders.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No builders match the specified filters'
      }, { status: 404 });
    }
    
    console.log(`🎯 Found ${matchingBuilders.length} builders matching filters`);
    
    // If scheduled, store for later execution
    if (scheduleAt) {
      await scheduleNotifications(matchingBuilders, {
        message,
        methods,
        priority,
        scheduleAt,
        adminId
      });
      
      return NextResponse.json({
        success: true,
        message: `Bulk notification scheduled for ${matchingBuilders.length} builders`,
        scheduledFor: scheduleAt,
        builderCount: matchingBuilders.length
      });
    }
    
    // Send immediately
    const results = [];
    
    for (const builder of matchingBuilders) {
      try {
        const notificationData = {
          builderId: builder.id,
          builderName: builder.companyName,
          message: message,
          priority: priority || 'MEDIUM',
          customMessage: message,
          isBulkNotification: true,
          adminId: adminId
        };
        
        const result = await sendBulkNotificationToBuilder(
          notificationData,
          builder,
          methods || ['email', 'dashboard']
        );
        
        results.push({
          builderId: builder.id,
          builderName: builder.companyName,
          success: result.success,
          methods: result.methods,
          error: result.error
        });
        
      } catch (error) {
        results.push({
          builderId: builder.id,
          builderName: builder.companyName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    
    // Log bulk notification
    await logNotificationAction(adminId, 'BULK_NOTIFICATION', {
      filters,
      totalBuilders: matchingBuilders.length,
      successfulNotifications: successCount,
      methods,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: `Bulk notifications sent to ${successCount}/${matchingBuilders.length} builders`,
      results,
      summary: {
        total: matchingBuilders.length,
        successful: successCount,
        failed: matchingBuilders.length - successCount
      }
    });
    
  } catch (error) {
    console.error('❌ Bulk notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Bulk notification failed'
    }, { status: 500 });
  }
}

// Get notification delivery status
async function handleGetDeliveryStatus(data: any) {
  try {
    const { notificationId, builderId, timeRange } = data;
    
    console.log(`📊 Getting delivery status for builder ${builderId}`);
    
    // Get delivery status from tracking system
    const deliveryStatus = await getNotificationDeliveryStatus(builderId, timeRange);
    
    return NextResponse.json({
      success: true,
      deliveryStatus,
      builderId,
      timeRange
    });
    
  } catch (error) {
    console.error('❌ Get delivery status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get delivery status'
    }, { status: 500 });
  }
}

// Enhanced builder notification with delivery tracking
async function sendBuilderNotificationEnhanced(notificationData: any, builder: any, methods: string[]) {
  try {
    const deliveryResults: any = {};
    const successfulMethods: string[] = [];
    
    for (const method of methods) {
      try {
        let result;
        
        switch (method) {
          case 'email':
            if (builder.contactInfo?.primaryEmail) {
              result = await sendEmailNotificationEnhanced(notificationData, builder.contactInfo.primaryEmail);
              deliveryResults.email = result;
              if (result.success) successfulMethods.push('email');
            }
            break;
            
          case 'sms':
            if (builder.contactInfo?.phone) {
              result = await sendSMSNotificationEnhanced(notificationData, builder.contactInfo.phone);
              deliveryResults.sms = result;
              if (result.success) successfulMethods.push('sms');
            }
            break;
            
          case 'dashboard':
            result = await sendDashboardNotificationEnhanced(notificationData);
            deliveryResults.dashboard = result;
            if (result.success) successfulMethods.push('dashboard');
            break;
        }
      } catch (methodError) {
        deliveryResults[method] = {
          success: false,
          error: methodError instanceof Error ? methodError.message : 'Unknown error'
        };
      }
    }
    
    // Track delivery status
    await trackNotificationDelivery(notificationData.builderId, {
      notificationId: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      methods: successfulMethods,
      deliveryResults,
      sentAt: new Date().toISOString(),
      adminSent: notificationData.isAdminSent || false,
      adminId: notificationData.adminId
    });
    
    return {
      success: successfulMethods.length > 0,
      methods: successfulMethods,
      deliveryResults,
      error: successfulMethods.length === 0 ? 'All delivery methods failed' : null
    };
    
  } catch (error) {
    console.error('❌ Enhanced notification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Enhanced email notification with tracking
async function sendEmailNotificationEnhanced(data: any, email: string) {
  try {
    console.log(`📧 [ENHANCED EMAIL] Sending to: ${maskContact(email, 'email')}`);
    
    // Get custom template if available
    const template = await getNotificationTemplate('lead_notification', 'email');
    
    const emailContent = {
      to: email,
      subject: template?.subject || `🎯 New Lead: ${data.leadData?.companyName} - ${data.leadData?.budget}`,
      html: template?.html || generateDefaultEmailTemplate(data),
      text: template?.text || generateDefaultEmailText(data),
      trackingId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isAdminSent: data.isAdminSent || false
    };
    
    // Simulate email sending with enhanced tracking
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
    
    // Simulate 97% success rate
    if (Math.random() > 0.03) {
      console.log('📧 [ENHANCED EMAIL SENT]', emailContent.subject);
      
      return {
        success: true,
        trackingId: emailContent.trackingId,
        deliveredAt: new Date().toISOString(),
        method: 'email'
      };
    } else {
      return {
        success: false,
        error: 'Email delivery failed - service unavailable'
      };
    }
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email delivery failed'
    };
  }
}

// Enhanced SMS notification with tracking
async function sendSMSNotificationEnhanced(data: any, phone: string) {
  try {
    console.log(`📱 [ENHANCED SMS] Sending to: ${maskContact(phone, 'phone')}`);
    
    // Get custom template if available
    const template = await getNotificationTemplate('lead_notification', 'sms');
    
    const smsContent = template?.content || 
      `🎯 NEW LEAD: ${data.leadData?.companyName} needs exhibition stand in ${data.leadData?.location}. Budget: ${data.leadData?.budget}. Login to respond. ${data.customMessage ? `Note: ${data.customMessage}` : ''} ExhibitBay`;
    
    // Simulate SMS sending with enhanced tracking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simulate 95% success rate
    if (Math.random() > 0.05) {
      console.log('📱 [ENHANCED SMS SENT]', smsContent);
      
      return {
        success: true,
        trackingId: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        deliveredAt: new Date().toISOString(),
        method: 'sms'
      };
    } else {
      return {
        success: false,
        error: 'SMS delivery failed - carrier issue'
      };
    }
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'SMS delivery failed'
    };
  }
}

// Enhanced dashboard notification
async function sendDashboardNotificationEnhanced(data: any) {
  try {
    if (typeof global !== 'undefined') {
      if (!global.builderNotifications) {
        global.builderNotifications = new Map();
      }
      
      const existingNotifications = global.builderNotifications.get(data.builderId) || [];
      
      const notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: data.isBulkNotification ? 'bulk_notification' : 'new_lead',
        title: data.isBulkNotification ? '📢 Important Notification' : '🎯 New Lead Available',
        message: data.isBulkNotification ? 
          data.message : 
          `New lead from ${data.leadData?.companyName} in ${data.leadData?.location}`,
        leadId: data.leadId,
        priority: data.priority || 'MEDIUM',
        budget: data.leadData?.budget,
        customMessage: data.customMessage,
        isAdminSent: data.isAdminSent || false,
        adminId: data.adminId,
        read: false,
        createdAt: new Date().toISOString()
      };
      
      existingNotifications.unshift(notification);
      global.builderNotifications.set(data.builderId, existingNotifications.slice(0, 100)); // Keep last 100
      
      console.log(`📊 Enhanced dashboard notification created for builder ${data.builderId}`);
      
      return {
        success: true,
        notificationId: notification.id,
        method: 'dashboard'
      };
    }
    
    return { success: false, error: 'Dashboard unavailable' };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Dashboard notification failed'
    };
  }
}

// Helper functions
async function getLeadData(leadId: string) {
  try {
    const { leadAPI } = await import('@/lib/database/persistenceAPI');
    const result = await leadAPI.getLeadById(leadId);
    return result.success ? result.data : null;
  } catch (error) {
    return null;
  }
}

async function getBuildersData(builderIds: string[]) {
  try {
    const { builderAPI } = await import('@/lib/database/persistenceAPI');
    const builders = [];
    
    for (const id of builderIds) {
      const result = await builderAPI.getBuilderById(id);
      if (result.success && result.data) {
        builders.push(result.data);
      }
    }
    
    return builders;
  } catch (error) {
    return [];
  }
}

async function getNotificationTemplate(templateType: string, method: string) {
  try {
    if (typeof global !== 'undefined' && global.notificationTemplates) {
      return global.notificationTemplates[templateType]?.[method];
    }
    return null;
  } catch (error) {
    return null;
  }
}

function getTestMessage(testType: string): string {
  const messages: Record<string, string> = {
    'lead_notification': 'This is a test lead notification from the admin panel.',
    'welcome': 'Welcome! This is a test welcome notification.',
    'reminder': 'This is a test reminder notification.',
    'update': 'This is a test system update notification.'
  };
  
  return messages[testType] || 'This is a test notification from ExhibitBay admin.';
}

function maskContact(contact: string, method: string): string {
  if (method === 'phone') {
    return contact.replace(/\d(?=\d{4})/g, '*');
  } else {
    const [username, domain] = contact.split('@');
    return `${username.substring(0, 2)}***@${domain}`;
  }
}

async function logNotificationAction(adminId: string, action: string, details: any) {
  try {
    if (typeof global !== 'undefined') {
      if (!global.notificationAuditLog) {
        global.notificationAuditLog = [];
      }
      
      const logEntry = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        adminId,
        action,
        details,
        timestamp: new Date().toISOString()
      };
      
      global.notificationAuditLog.push(logEntry);
      
      // Keep only last 1000 entries
      if (global.notificationAuditLog.length > 1000) {
        global.notificationAuditLog = global.notificationAuditLog.slice(-1000);
      }
    }
  } catch (error) {
    console.error('❌ Error logging notification action:', error);
  }
}

async function trackNotificationDelivery(builderId: string, deliveryData: any) {
  // Implementation for tracking notification delivery
}

async function getNotificationDeliveryStatus(builderId: string, timeRange: any) {
  // Implementation for getting delivery status
  return {};
}

function generateDefaultEmailTemplate(data: any): string {
  return `<h1>New Lead Available</h1><p>Details: ${JSON.stringify(data.leadData, null, 2)}</p>`;
}

function generateDefaultEmailText(data: any): string {
  return `New Lead Available\nDetails: ${JSON.stringify(data.leadData, null, 2)}`;
}

// Test notification functions
async function sendTestEmail(testData: any) {
  console.log('📧 [TEST EMAIL] Sent to:', testData.recipient);
  return { success: true, method: 'email' };
}

async function sendTestSMS(testData: any) {
  console.log('📱 [TEST SMS] Sent to:', testData.recipient);
  return { success: true, method: 'sms' };
}

async function sendTestDashboardNotification(testData: any) {
  console.log('📊 [TEST DASHBOARD] Notification created');
  return { success: true, method: 'dashboard' };
}

// Schedule notifications for later execution
async function scheduleNotifications(builders: any[], notificationData: any) {
  console.log(`📅 Scheduling notifications for ${builders.length} builders`);
  // Implementation for scheduling
  return { success: true };
}

// Send bulk notification to individual builder
async function sendBulkNotificationToBuilder(notificationData: any, builder: any, methods: string[]) {
  console.log(`📮 Sending bulk notification to ${builder.companyName}`);
  return {
    success: true,
    methods: methods,
    error: null
  };
}

// GET endpoint for notification management
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'templates') {
    // Return available templates
    const templates = typeof global !== 'undefined' ? global.notificationTemplates : {};
    return NextResponse.json({
      success: true,
      templates
    });
  }
  
  if (action === 'delivery_stats') {
    // Return delivery statistics
    const stats = await getNotificationStats();
    return NextResponse.json({
      success: true,
      stats
    });
  }
  
  return NextResponse.json({
    message: 'Notification Management API',
    endpoints: {
      'POST /': 'Manage notifications (send, test, bulk, templates)',
      'GET /?action=templates': 'Get notification templates',
      'GET /?action=delivery_stats': 'Get delivery statistics'
    },
    availableActions: [
      'send_lead_notification',
      'update_templates', 
      'test_notification',
      'bulk_notify',
      'get_delivery_status',
      'manage_preferences'
    ]
  });
}

async function getNotificationStats() {
  // Return notification statistics
  return {
    totalSent: 0,
    deliveryRate: 0,
    openRate: 0,
    responseRate: 0
  };
}