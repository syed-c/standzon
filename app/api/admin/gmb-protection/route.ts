import { NextResponse } from 'next/server';
import { gmbProtection } from '@/lib/database/gmbDataProtection';
import { builderAPI } from '@/lib/database/persistenceAPI';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = await gmbProtection.getGMBStats();
        return NextResponse.json({
          success: true,
          data: stats
        });

      case 'backup':
        const backupResult = await gmbProtection.createEmergencyBackup();
        return NextResponse.json({
          success: backupResult.success,
          message: backupResult.success 
            ? `Emergency backup created: ${backupResult.count} GMB builders saved`
            : 'Failed to create emergency backup',
          data: backupResult
        });

      case 'restore':
        const restoreResult = await gmbProtection.restoreFromLatestBackup();
        return NextResponse.json({
          success: restoreResult.success,
          message: restoreResult.success 
            ? `Restored ${restoreResult.restored} GMB builders from ${restoreResult.source}`
            : 'No backup available to restore from',
          data: restoreResult
        });

      case 'verify':
        const verifyResult = await gmbProtection.verifyAndFixGMBData();
        return NextResponse.json({
          success: true,
          data: verifyResult,
          message: `Verification complete: ${verifyResult.healthy ? 'Healthy' : 'Issues found'} - ${verifyResult.fixed} fixes applied`
        });

      case 'protect':
        // Create backup and verify data integrity
        const protectBackup = await gmbProtection.createEmergencyBackup();
        const protectVerify = await gmbProtection.verifyAndFixGMBData();
        
        return NextResponse.json({
          success: true,
          data: {
            backup: protectBackup,
            verification: protectVerify
          },
          message: `GMB data protected: ${protectBackup.count} builders backed up, ${protectVerify.fixed} issues fixed`
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: ?action=stats|backup|restore|verify|protect'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ GMB Protection API error:', error);
    return NextResponse.json({
      success: false,
      error: 'GMB protection operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, builders } = body;

    switch (action) {
      case 'bulk_protect':
        if (!builders || !Array.isArray(builders)) {
          return NextResponse.json({
            success: false,
            error: 'Builders array is required for bulk protection'
          }, { status: 400 });
        }

        console.log(`🛡️ Bulk protecting ${builders.length} GMB builders...`);
        
        let protectedCount = 0;
        let errors = 0;
        
        for (const builder of builders) {
          try {
            // Mark as GMB imported and protected
            builder.gmbImported = true;
            builder.importedFromGMB = true;
            builder.source = 'google_places_api';
            builder.preserveData = true;
            
            const result = await builderAPI.addBuilder(builder);
            if (result.success) {
              protectedCount++;
              console.log(`✅ Protected: ${builder.companyName}`);
            } else {
              console.log(`ℹ️ Already exists: ${builder.companyName}`);
            }
          } catch (error) {
            errors++;
            console.error(`❌ Error protecting ${builder.companyName}:`, error);
          }
        }

        // Create emergency backup after bulk protection
        await gmbProtection.createEmergencyBackup();

        return NextResponse.json({
          success: true,
          data: {
            total: builders.length,
            protected: protectedCount,
            errors,
            backupCreated: true
          },
          message: `Bulk protection complete: ${protectedCount}/${builders.length} builders protected`
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: bulk_protect'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ GMB Protection POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'GMB protection operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}