import { NextRequest, NextResponse } from 'next/server';

// Plan Management API - Controls pricing, limits, and feature access
export async function POST(request: NextRequest) {
  try {
    const { action, builderId, planType, adminId, billingInfo } = await request.json();
    
    console.log(`💳 Plan management request: ${action} for builder ${builderId}`);
    
    switch (action) {
      case 'upgrade_plan':
        return await handlePlanUpgrade(builderId, planType, billingInfo);
      case 'downgrade_plan':
        return await handlePlanDowngrade(builderId, planType, adminId);
      case 'check_limits':
        return await checkPlanLimits(builderId);
      case 'admin_override':
        return await handleAdminPlanOverride(builderId, planType, adminId);
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Plan management error:', error);
    return NextResponse.json({
      success: false,
      error: 'Plan management failed'
    }, { status: 500 });
  }
}

// Handle plan downgrades
async function handlePlanDowngrade(builderId: string, planType: string, adminId: string) {
  try {
    console.log(`⬇️ Downgrading plan for builder ${builderId} to ${planType}`);
    
    // Same logic as upgrade but without payment processing
    const updateResult = await updateBuilderPlan(builderId, planType, {
      downgrade: true,
      downgradedBy: adminId,
      downgradeDate: new Date().toISOString()
    });
    
    if (updateResult.success) {
      const planConfig = getPlanConfiguration(planType);
      return NextResponse.json({
        success: true,
        message: `Plan downgraded to ${planConfig?.name}`,
        planDetails: planConfig
      });
    } else {
      return NextResponse.json({
        success: false,
        error: updateResult.error
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Plan downgrade error:', error);
    return NextResponse.json({
      success: false,
      error: 'Plan downgrade failed'
    }, { status: 500 });
  }
}

// Handle plan upgrades with payment processing
async function handlePlanUpgrade(builderId: string, planType: string, billingInfo: any) {
  try {
    const planConfig = getPlanConfiguration(planType);
    if (!planConfig) {
      return NextResponse.json({
        success: false,
        error: 'Invalid plan type'
      }, { status: 400 });
    }
    
    // Validate payment information
    if (planConfig.price > 0 && !billingInfo) {
      return NextResponse.json({
        success: false,
        error: 'Payment information required for paid plans'
      }, { status: 400 });
    }
    
    // Process payment (simulated - integrate with Stripe/Razorpay in production)
    const paymentResult = await processPayment(planConfig, billingInfo);
    
    if (!paymentResult.success) {
      return NextResponse.json({
        success: false,
        error: paymentResult.error || 'Payment processing failed'
      }, { status: 400 });
    }
    
    // Update builder plan
    const updateResult = await updateBuilderPlan(builderId, planType, {
      paymentId: paymentResult.paymentId,
      billingCycle: billingInfo?.billingCycle || 'monthly',
      upgradeDate: new Date().toISOString(),
      previousPlan: await getCurrentPlan(builderId)
    });
    
    if (updateResult.success) {
      // Initialize plan features
      await initializePlanFeatures(builderId, planConfig);
      
      console.log(`✅ Plan upgrade successful: ${builderId} -> ${planType}`);
      
      return NextResponse.json({
        success: true,
        message: `Successfully upgraded to ${planConfig.name} plan`,
        planDetails: {
          name: planConfig.name,
          leadQuota: planConfig.leadQuota,
          features: planConfig.features,
          price: planConfig.price,
          billingCycle: billingInfo?.billingCycle || 'monthly'
        },
        paymentId: paymentResult.paymentId
      });
    } else {
      return NextResponse.json({
        success: false,
        error: updateResult.error
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Plan upgrade error:', error);
    return NextResponse.json({
      success: false,
      error: 'Plan upgrade failed'
    }, { status: 500 });
  }
}

// Check plan limits and enforce restrictions
async function checkPlanLimits(builderId: string) {
  try {
    const { builderAPI } = await import('@/lib/database/persistenceAPI');
    
    // Get builder data
    const builderResult = await builderAPI.getBuilderById(builderId);
    if (!builderResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Builder not found'
      }, { status: 404 });
    }
    
    const builder = builderResult.data;
    const planConfig = getPlanConfiguration(builder.planType || 'starter');
    
    // Get current usage statistics
    const usage = await getBuilderUsageStats(builderId);
    
    const limits = {
      plan: planConfig.name,
      leadQuota: {
        limit: planConfig.leadQuota,
        used: usage.leadsReceived || 0,
        remaining: Math.max(0, planConfig.leadQuota - (usage.leadsReceived || 0)),
        unlimited: planConfig.leadQuota === -1
      },
      features: {
        profileVisibility: planConfig.features.includes('enhanced_visibility'),
        analytics: planConfig.features.includes('analytics'),
        premiumSupport: planConfig.features.includes('premium_support'),
        customBranding: planConfig.features.includes('custom_branding')
      },
      canReceiveLeads: planConfig.leadQuota === -1 || (usage.leadsReceived || 0) < planConfig.leadQuota,
      canUpgrade: planConfig.name !== 'Pro Plan'
    };
    
    return NextResponse.json({
      success: true,
      limits,
      usage,
      upgradeOptions: getAvailableUpgrades(builder.planType || 'starter')
    });
    
  } catch (error) {
    console.error('❌ Error checking plan limits:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check plan limits'
    }, { status: 500 });
  }
}

// Admin override for plan management
async function handleAdminPlanOverride(builderId: string, planType: string, adminId: string) {
  try {
    const planConfig = getPlanConfiguration(planType);
    if (!planConfig) {
      return NextResponse.json({
        success: false,
        error: 'Invalid plan type'
      }, { status: 400 });
    }
    
    // Update builder plan without payment - DEMO ASSIGNMENT
    const updateResult = await updateBuilderPlan(builderId, planType, {
      adminOverride: true,
      overrideBy: adminId,
      overrideDate: new Date().toISOString(),
      overrideReason: 'Admin demo assignment - No payment required',
      demoAccess: true,
      originalPrice: planConfig.price,
      discountAmount: planConfig.price, // 100% discount
      paidAmount: 0
    });
    
    if (updateResult.success) {
      // Log admin action with demo details
      await logAdminAction(adminId, 'DEMO_PLAN_ASSIGNMENT', {
        builderId,
        newPlan: planType,
        originalPrice: planConfig.price,
        demoDuration: 'unlimited',
        timestamp: new Date().toISOString()
      });
      
      // Initialize plan features with demo flag
      await initializePlanFeatures(builderId, planConfig);
      
      // Track demo assignment for analytics
      await trackDemoAssignment(builderId, planType, adminId);
      
      console.log(`🎯 DEMO ASSIGNMENT: ${builderId} -> ${planType} (${planConfig.price} value) by ${adminId}`);
      
      return NextResponse.json({
        success: true,
        message: `🎯 Demo access granted! ${planConfig.name} assigned for FREE`,
        planDetails: {
          ...planConfig,
          demoAccess: true,
          originalPrice: planConfig.price,
          paidAmount: 0,
          discount: '100%',
          assignedBy: adminId,
          assignedAt: new Date().toISOString()
        },
        demoFeatures: {
          leadQuota: planConfig.leadQuota,
          fullFeatureAccess: true,
          emailNotifications: true,
          smsNotifications: true,
          dashboardAccess: true,
          premiumSupport: planConfig.features.includes('premium_support'),
          analytics: planConfig.features.includes('analytics'),
          customBranding: planConfig.features.includes('custom_branding')
        },
        valueProvided: `$${planConfig.price} value provided at no cost`,
        adminOverride: true,
        nextSteps: [
          '✅ Builder can now receive leads immediately',
          '✅ All premium features are activated',
          '✅ Email/SMS notifications enabled',
          '✅ Dashboard access granted',
          '✅ Ready to start receiving qualified leads'
        ]
      });
    } else {
      return NextResponse.json({
        success: false,
        error: updateResult.error
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Admin plan override error:', error);
    return NextResponse.json({
      success: false,
      error: 'Demo assignment failed'
    }, { status: 500 });
  }
}

// Track demo assignments for analytics
async function trackDemoAssignment(builderId: string, planType: string, adminId: string) {
  try {
    if (typeof globalThis !== 'undefined') {
      const g = globalThis as any;
      if (!g.demoAssignments) {
        g.demoAssignments = [];
      }
      
      const demoRecord = {
        id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        builderId,
        planType,
        adminId,
        assignedAt: new Date().toISOString(),
        valueProvided: getPlanConfiguration(planType)?.price || 0,
        status: 'active'
      };
      
      g.demoAssignments.push(demoRecord);
      console.log(`📊 Demo assignment tracked: ${builderId} -> ${planType}`);
    }
  } catch (error) {
    console.error('❌ Error tracking demo assignment:', error);
  }
}

// Plan configurations with pricing and features
function getPlanConfiguration(planType: string) {
  const plans: Record<string, any> = {
    'starter': {
      name: 'Starter (Free)',
      planType: 'starter',
      price: 0,
      leadQuota: 0,
      features: ['basic_profile'],
      description: 'Profile editing only, no leads',
      billingCycles: []
    },
    'basic': {
      name: 'Basic Plan',
      planType: 'basic',
      price: 200,
      leadQuota: 10,
      features: ['basic_profile', 'lead_access', 'email_notifications'],
      description: '10 leads per month',
      billingCycles: ['monthly', 'annual']
    },
    'growth': {
      name: 'Growth Plan',
      planType: 'growth',
      price: 800,
      leadQuota: 50,
      features: ['basic_profile', 'lead_access', 'email_notifications', 'enhanced_visibility', 'analytics'],
      description: '50 leads per month + analytics',
      billingCycles: ['monthly', 'annual']
    },
    'pro': {
      name: 'Pro Plan',
      planType: 'pro',
      price: 1400,
      leadQuota: 100,
      features: ['basic_profile', 'lead_access', 'email_notifications', 'enhanced_visibility', 'analytics', 'premium_support', 'custom_branding'],
      description: '100 leads per month + premium features',
      billingCycles: ['monthly', 'annual']
    }
  };
  
  return plans[planType] || null;
}

// Process payment (simulated - integrate with actual payment processor)
async function processPayment(planConfig: any, billingInfo: any) {
  try {
    console.log(`💳 Processing payment for ${planConfig.name}: $${planConfig.price}`);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simulate 95% success rate
    if (Math.random() > 0.05) {
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`✅ Payment processed successfully: ${paymentId}`);
      
      return {
        success: true,
        paymentId,
        amount: planConfig.price,
        currency: 'USD',
        processedAt: new Date().toISOString()
      };
    } else {
      return {
        success: false,
        error: 'Payment processing failed. Please check your payment details.'
      };
    }
    
  } catch (error) {
    console.error('❌ Payment processing error:', error);
    return {
      success: false,
      error: 'Payment service temporarily unavailable'
    };
  }
}

// Update builder plan in persistent storage
async function updateBuilderPlan(builderId: string, planType: string, metadata: any) {
  try {
    const { builderAPI } = await import('@/lib/database/persistenceAPI');
    
    const planUpdates = {
      planType,
      planUpdatedAt: new Date().toISOString(),
      planMetadata: metadata,
      leadQuota: getPlanConfiguration(planType)?.leadQuota || 0,
      planHistory: [
        {
          action: 'plan_updated',
          planType,
          timestamp: new Date().toISOString(),
          metadata
        }
      ]
    };
    
    const result = await builderAPI.updateBuilder(builderId, planUpdates);
    
    if (result.success) {
      // Update global plan registry
      await updateGlobalPlanRegistry(builderId, planType, metadata);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Error updating builder plan:', error);
    return { success: false, error: 'Failed to update plan' };
  }
}

// Initialize plan features and access controls
async function initializePlanFeatures(builderId: string, planConfig: any) {
  try {
    if (typeof globalThis !== 'undefined') {
      const g = globalThis as any;
      if (!g.builderFeatureAccess) {
        g.builderFeatureAccess = new Map();
      }
      
      const featureAccess = {
        builderId,
        plan: planConfig.planType,
        features: planConfig.features,
        leadQuota: planConfig.leadQuota,
        quotaUsed: 0,
        accessGrantedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };
      
      g.builderFeatureAccess.set(builderId, featureAccess);
      console.log(`🔓 Features initialized for builder ${builderId}: ${planConfig.name}`);
    }
  } catch (error) {
    console.error('❌ Error initializing plan features:', error);
  }
}

// Get builder usage statistics
async function getBuilderUsageStats(builderId: string) {
  try {
    // Get from global tracking (in production, query from database)
    if (typeof globalThis !== 'undefined' && (globalThis as any).builderUsageStats) {
      const stats = (globalThis as any).builderUsageStats.get(builderId);
      return stats || {
        leadsReceived: 0,
        leadsAccepted: 0,
        profileViews: 0,
        quotesRequested: 0,
        lastActivityAt: null
      };
    }
    
    return {
      leadsReceived: 0,
      leadsAccepted: 0,
      profileViews: 0,
      quotesRequested: 0,
      lastActivityAt: null
    };
  } catch (error) {
    console.error('❌ Error getting usage stats:', error);
    return { leadsReceived: 0, leadsAccepted: 0, profileViews: 0, quotesRequested: 0 };
  }
}

// Get current plan for builder
async function getCurrentPlan(builderId: string) {
  try {
    const { builderAPI } = await import('@/lib/database/persistenceAPI');
    const result = await builderAPI.getBuilderById(builderId);
    return result.success ? result.data?.planType || 'starter' : 'starter';
  } catch (error) {
    return 'starter';
  }
}

// Get available upgrade options
function getAvailableUpgrades(currentPlan: string) {
  const upgradePath: Record<string, string[]> = {
    'starter': ['basic', 'growth', 'pro'],
    'basic': ['growth', 'pro'],
    'growth': ['pro'],
    'pro': []
  };
  
  return (upgradePath[currentPlan] || []).map((planType: string) => getPlanConfiguration(planType));
}

// Update global plan registry
async function updateGlobalPlanRegistry(builderId: string, planType: string, metadata: any) {
  try {
    if (typeof globalThis !== 'undefined') {
      const g = globalThis as any;
      if (!g.planRegistry) {
        g.planRegistry = new Map();
      }
      
      g.planRegistry.set(builderId, {
        planType,
        updatedAt: new Date().toISOString(),
        metadata
      });
    }
  } catch (error) {
    console.error('❌ Error updating plan registry:', error);
  }
}

// Log admin actions
async function logAdminAction(adminId: string, action: string, details: any) {
  try {
    if (typeof globalThis !== 'undefined') {
      const g = globalThis as any;
      if (!g.adminAuditLog) {
        g.adminAuditLog = [];
      }
      
      const logEntry = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        adminId,
        action,
        details,
        timestamp: new Date().toISOString()
      };
      
      g.adminAuditLog.push(logEntry);
    }
  } catch (error) {
    console.error('❌ Error logging admin action:', error);
  }
}

// GET endpoint for plan information
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const builderId = searchParams.get('builderId');
  
  if (action === 'plans') {
    // Return all available plans
    const plans = ['starter', 'basic', 'growth', 'pro'].map(getPlanConfiguration);
    return NextResponse.json({
      success: true,
      plans
    });
  }
  
  if (action === 'limits' && builderId) {
    // Check specific builder limits
    return await checkPlanLimits(builderId);
  }
  
  return NextResponse.json({
    message: 'Plan Management API',
    endpoints: {
      'POST /': 'Manage builder plans (upgrade, downgrade, check limits)',
      'GET /?action=plans': 'Get all available plans',
      'GET /?action=limits&builderId=X': 'Check builder plan limits'
    },
    availablePlans: ['starter', 'basic', 'growth', 'pro']
  });
}