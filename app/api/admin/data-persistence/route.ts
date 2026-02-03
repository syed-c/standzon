import { NextRequest, NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';
import { persistenceManager, builderAPI, leadAPI, dataHealthMonitor } from '@/lib/database/persistenceAPI';

export async function GET(request: NextRequest) {
  console.log('🔍 Data persistence status check requested at:', new Date().toISOString());
  
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'health') {
      // Get comprehensive health status
      const systemHealth = await unifiedPlatformAPI.getSystemHealth();
      
      return NextResponse.json({
        success: true,
        data: systemHealth
      });
    }
    
    if (action === 'backup-status') {
      // Get backup status
      const systemStatus = await persistenceManager.getSystemStatus();
      
      return NextResponse.json({
        success: true,
        data: {
          backup: systemStatus.backup,
          lastCheck: systemStatus.timestamp
        }
      });
    }
    
    if (action === 'stats') {
      // Get quick stats
      const stats = await builderAPI.getStats();
      const leadsCount = (await leadAPI.getAllLeads()).length;
      
      return NextResponse.json({
        success: true,
        data: {
          builders: stats,
          leads: { total: leadsCount },
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Default: Return comprehensive status
    const systemStatus = await persistenceManager.getSystemStatus();
    
    return NextResponse.json({
      success: true,
      data: systemStatus
    });
    
  } catch (error) {
    console.error('❌ Data persistence status check failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get persistence status'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('🔧 Data persistence operation requested at:', new Date().toISOString());
  
  try {
    const { action } = await request.json();
    console.log('📝 Persistence action:', action);
    
    if (action === 'force-backup') {
      console.log('💾 Forcing immediate backup...');
      
      const backupResult = await unifiedPlatformAPI.forceFullBackup();
      
      return NextResponse.json({
        success: backupResult.success,
        message: backupResult.message,
        timestamp: new Date().toISOString()
      });
    }
    
    if (action === 'system-recovery') {
      console.log('🔄 Starting system recovery...');
      
      const recoveryResult = await unifiedPlatformAPI.performSystemRecovery();
      
      if (recoveryResult.success) {
        return NextResponse.json({
          success: true,
          message: 'System recovery completed successfully',
          data: recoveryResult.recovery,
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json({
          success: false,
          error: recoveryResult.error || 'System recovery failed'
        }, { status: 500 });
      }
    }
    
    if (action === 'health-check') {
      console.log('🏥 Performing forced health check...');
      
      const healthStatus = await dataHealthMonitor.forceHealthCheck();
      
      return NextResponse.json({
        success: true,
        message: 'Health check completed',
        data: healthStatus,
        timestamp: new Date().toISOString()
      });
    }
    
    if (action === 'reload-data') {
      console.log('🔄 Reloading all data from persistent storage...');
      
      try {
        // Force reload from files and persistent storage
        await unifiedPlatformAPI.reloadFromFiles();
        
        // Get updated stats
        const systemHealth = await unifiedPlatformAPI.getSystemHealth();
        
        return NextResponse.json({
          success: true,
          message: 'Data reloaded successfully from persistent storage',
          data: systemHealth,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ Data reload failed:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to reload data: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
      }
    }
    
    if (action === 'verify-integrity') {
      console.log('🔍 Verifying data integrity...');
      
      try {
        const builders = await builderAPI.getAllBuilders();
        const leads = await leadAPI.getAllLeads();
        const healthStatus = dataHealthMonitor.getHealthStatus();
        
        const integrity = {
          buildersCount: builders.length,
          leadsCount: leads.length,
          buildersWithIds: builders.filter(b => b.id).length,
          buildersWithCompanyNames: builders.filter(b => b.companyName).length,
          gmbImported: builders.filter(b => b.gmbImported || b.importedFromGMB || b.source === 'google_places_api').length,
          dataConsistency: builders.length === builders.filter(b => b.id).length ? 'healthy' : 'issues_detected',
          systemHealth: healthStatus.healthy ? 'healthy' : 'issues_detected'
        };
        
        return NextResponse.json({
          success: true,
          message: 'Data integrity check completed',
          data: integrity,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ Data integrity check failed:', error);
        return NextResponse.json({
          success: false,
          error: 'Data integrity check failed: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Unknown action'
    }, { status: 400 });
    
  } catch (error) {
    console.error('❌ Data persistence operation failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}