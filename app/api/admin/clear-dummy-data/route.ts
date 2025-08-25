import { NextRequest, NextResponse } from 'next/server';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Starting dummy data cleanup...');

    // Get all current builders
    const allBuilders = unifiedPlatformAPI.getBuilders();
    console.log(`📊 Total builders before cleanup: ${allBuilders.length}`);

    // Identify dummy/test builders to remove
    const dummyPatterns = [
      'test-vegas-builder',
      'test-berlin-builder', 
      'test-dubai-builder',
      'test_builder_',
      'gmb_1751861901234_test', // GMB test builders
      'Vegas Exhibition Experts',
      'Berlin Trade Solutions',
      'Dubai Exhibition Masters',
      'Elite Displays Las Vegas',
      'Berlin Exhibition Masters'
    ];

    const buildersToRemove = allBuilders.filter(builder => {
      const isDummy = dummyPatterns.some(pattern => 
        builder.id.includes(pattern) || 
        builder.companyName.includes(pattern) ||
        builder.companyName.includes('test') ||
        builder.companyName.includes('Test') ||
        builder.companyName.includes('demo') ||
        builder.companyName.includes('Demo')
      );
      
      // Also check for test email domains
      const hasTestEmail = builder.contactInfo?.primaryEmail?.includes('test') ||
                          builder.contactInfo?.primaryEmail?.includes('example.com') ||
                          builder.contactInfo?.primaryEmail?.includes('demo.com');
      
      return isDummy || hasTestEmail;
    });

    console.log(`🗑️ Found ${buildersToRemove.length} dummy builders to remove:`);
    buildersToRemove.forEach(builder => {
      console.log(`  - ${builder.companyName} (${builder.id})`);
    });

    // Remove each dummy builder
    let removedCount = 0;
    for (const builder of buildersToRemove) {
      const result = unifiedPlatformAPI.deleteBuilder(builder.id);
      if (result.success) {
        removedCount++;
        console.log(`✅ Removed: ${builder.companyName}`);
      } else {
        console.error(`❌ Failed to remove: ${builder.companyName}`, result.error);
      }
    }

    // Get updated counts
    const remainingBuilders = unifiedPlatformAPI.getBuilders();
    console.log(`📊 Total builders after cleanup: ${remainingBuilders.length}`);

    return NextResponse.json({
      success: true,
      message: 'Dummy data cleanup completed',
      summary: {
        totalBefore: allBuilders.length,
        totalAfter: remainingBuilders.length,
        removed: removedCount,
        buildersRemoved: buildersToRemove.map(b => ({
          id: b.id,
          companyName: b.companyName,
          email: b.contactInfo?.primaryEmail
        }))
      }
    });

  } catch (error) {
    console.error('❌ Error during dummy data cleanup:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to cleanup dummy data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}