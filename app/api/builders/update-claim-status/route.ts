import { NextRequest, NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

// Builder claim status update API
export async function POST(request: NextRequest) {
  try {
    const { 
      builderId, 
      claimed, 
      claimStatus, 
      verificationData, 
      claimedAt, 
      planType 
    } = await request.json();
    
    if (!builderId) {
      return NextResponse.json({
        success: false,
        error: 'builderId is required'
      }, { status: 400 });
    }

    console.log(`📝 Updating claim status for builder ${builderId}:`, {
      claimed,
      claimStatus,
      planType
    });
    
    // Update in unified platform data
    const updateResult = unifiedPlatformAPI.updateBuilder(builderId, {
      claimed: claimed,
      claimStatus: claimStatus,
      verified: claimStatus === 'verified',
      claimedAt: claimedAt,
      planType: planType || 'free',
      verificationData: verificationData
    });
    
    if (!updateResult.success) {
      console.error(`❌ Failed to update builder in unified platform:`, updateResult.error);
      return NextResponse.json({
        success: false,
        error: updateResult.error || 'Failed to update builder'
      }, { status: 404 });
    }
    
    // Update in persistent JSON file for GMB imported builders
    if (builderId.startsWith('gmb_')) {
      await updateGMBBuilderFile(builderId, {
        claimed,
        claimStatus,
        verified: claimStatus === 'verified',
        claimedAt,
        planType,
        verificationData
      });
    }
    
    // Create claim record for audit trail
    const claimRecord = {
      id: `claim_${builderId}_${Date.now()}`,
      builderId,
      claimStatus,
      claimed,
      planType,
      claimedAt,
      verificationMethod: verificationData?.method,
      contactVerified: verificationData?.contactVerified,
      businessLocation: verificationData?.businessLocation,
      ipAddress: verificationData?.ipAddress || 'hidden',
      userAgent: verificationData?.userAgent,
      gmbImported: verificationData?.gmbImported || false,
      verificationTimestamp: verificationData?.verificationTimestamp
    };
    
    // Store claim record
    if (typeof global !== 'undefined') {
      if (!global.claimRecords) {
        global.claimRecords = [];
      }
      (global.claimRecords as any[]).push(claimRecord);
      console.log(`📋 Claim record created: ${claimRecord.id}`);
    }
    
    // Trigger real-time updates across the platform
    await triggerPlatformUpdates(builderId, {
      claimed,
      claimStatus,
      verified: claimStatus === 'verified',
      planType
    });
    
    console.log(`✅ Builder ${builderId} claim status updated successfully`);
    
    return NextResponse.json({
      success: true,
      message: 'Builder claim status updated successfully',
      data: {
        builderId,
        claimed,
        claimStatus,
        verified: claimStatus === 'verified',
        planType,
        claimedAt,
        claimRecordId: claimRecord.id
      }
    });

  } catch (error) {
    console.error('❌ Claim status update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update claim status'
    }, { status: 500 });
  }
}

// Update GMB builder in persistent JSON file
async function updateGMBBuilderFile(builderId: string, updates: any) {
  try {
    const fs = require('fs');
    const path = require('path');
    const jsonFilePath = path.join(process.cwd(), 'lib/data/gmbImportedBuilders.json');
    
    // Read existing data
    let builders = [];
    try {
      const existingData = fs.readFileSync(jsonFilePath, 'utf8');
      builders = JSON.parse(existingData);
    } catch (readError) {
      console.log('⚠️ Could not read GMB builders file:', readError);
      return;
    }
    
    // Find and update the builder
    const builderIndex = builders.findIndex((b: any) => b.id === builderId);
    
    if (builderIndex !== -1) {
      builders[builderIndex] = Object.assign({}, builders[builderIndex], updates, {
        lastUpdated: new Date().toISOString()
      });
      
      // Save updated data
      fs.writeFileSync(jsonFilePath, JSON.stringify(builders, null, 2));
      console.log(`💾 Updated GMB builder ${builderId} in persistent file`);
    } else {
      console.log(`⚠️ GMB builder ${builderId} not found in persistent file`);
    }
  } catch (error) {
    console.error('❌ Failed to update GMB builder file:', error);
  }
}

// Trigger updates across the platform
async function triggerPlatformUpdates(builderId: string, updates: any) {
  try {
    console.log(`🔄 Triggering platform-wide updates for builder ${builderId}`);
    
    // In a real application, you would:
    // 1. Update database records
    // 2. Invalidate caches
    // 3. Trigger real-time updates via WebSocket/SSE
    // 4. Update search indices
    // 5. Regenerate static pages if needed
    
    // Simulate cache invalidation
    if (typeof global !== 'undefined') {
      if (!global.cacheInvalidations) {
        global.cacheInvalidations = [];
      }
      
      global.cacheInvalidations.push({
        builderId,
        type: 'claim_status_update',
        timestamp: new Date().toISOString(),
        affectedPages: [
          `/builders/${builderId}`,
          `/builders`,
          `/exhibition-stands/*`,
          `/admin/dashboard`,
          `/admin/profile-claims`
        ]
      });
    }
    
    console.log(`✅ Platform updates triggered for builder ${builderId}`);
  } catch (error) {
    console.error('⚠️ Failed to trigger platform updates:', error);
  }
}

// GET endpoint for claim status and records
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const builderId = searchParams.get('builderId');
  
  if (action === 'status' && builderId) {
    // Get current claim status for a builder
    const builder = unifiedPlatformAPI.getBuilderById(builderId);
    
    if (!builder) {
      return NextResponse.json({
        success: false,
        error: 'Builder not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        builderId: builder.id,
        companyName: builder.companyName,
        claimed: builder.claimed || false,
        claimStatus: builder.claimStatus || 'unclaimed',
        verified: builder.verified || false,
        planType: builder.planType || 'free',
        claimedAt: builder.claimedAt,
        lastUpdated: builder.lastUpdated
      }
    });
  }
  
  if (action === 'records' && typeof global !== 'undefined' && global.claimRecords) {
    const records = builderId 
      ? global.claimRecords.filter((record: any) => record.builderId === builderId)
      : global.claimRecords.slice(-100); // Last 100 records
    
    return NextResponse.json({
      success: true,
      data: {
        records,
        total: global.claimRecords.length,
        filtered: builderId ? records.length : false
      }
    });
  }
  
  if (action === 'stats' && typeof global !== 'undefined') {
    const allBuilders = unifiedPlatformAPI.getBuilders();
    const claimedCount = allBuilders.filter(b => b.claimed).length;
    const verifiedCount = allBuilders.filter(b => b.claimStatus === 'verified').length;
    const pendingCount = allBuilders.filter(b => b.claimStatus === 'pending').length;
    
    return NextResponse.json({
      success: true,
      data: {
        total: allBuilders.length,
        claimed: claimedCount,
        verified: verifiedCount,
        pending: pendingCount,
        unclaimed: allBuilders.length - claimedCount,
        claimRate: ((claimedCount / allBuilders.length) * 100).toFixed(1) + '%',
        verificationRate: ((verifiedCount / Math.max(claimedCount, 1)) * 100).toFixed(1) + '%'
      }
    });
  }
  
  return NextResponse.json({
    message: 'Builder Claim Status Update API',
    endpoints: {
      'POST /': 'Update builder claim status',
      'GET /?action=status&builderId=X': 'Get claim status for builder',
      'GET /?action=records': 'Get claim records (admin)',
      'GET /?action=stats': 'Get claiming statistics'
    },
    features: [
      'Updates unified platform data',
      'Maintains persistent storage for GMB builders',
      'Creates audit trail records',
      'Triggers platform-wide cache invalidation',
      'Real-time status propagation'
    ]
  });
}