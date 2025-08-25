// GMB Data Protection Service - Prevents loss of imported builder data
import { builderAPI } from './persistenceAPI';
import * as fs from 'fs';
import * as path from 'path';

export class GMBDataProtection {
  private static instance: GMBDataProtection;
  
  static getInstance(): GMBDataProtection {
    if (!GMBDataProtection.instance) {
      GMBDataProtection.instance = new GMBDataProtection();
    }
    return GMBDataProtection.instance;
  }

  /**
   * Create emergency backup of GMB imported builders before any system operations
   */
  async createEmergencyBackup(): Promise<{success: boolean; backupPath?: string; count?: number}> {
    try {
      const allBuilders = await builderAPI.getAllBuilders();
      const gmbBuilders = allBuilders.filter(builder => 
        builder.gmbImported || 
        builder.importedFromGMB || 
        builder.source === 'google_places_api' ||
        builder.preserveData === true
      );

      if (gmbBuilders.length === 0) {
        console.log('ℹ️ No GMB builders found to backup');
        return { success: true, count: 0 };
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(process.cwd(), 'data', 'gmb_emergency_backups');
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const backupPath = path.join(backupDir, `gmb_backup_${timestamp}.json`);
      
      const backupData = {
        timestamp: new Date().toISOString(),
        buildersCount: gmbBuilders.length,
        builders: gmbBuilders,
        metadata: {
          backupReason: 'Emergency protection before system operation',
          systemVersion: '1.0',
          platform: 'ExhibitBay'
        }
      };

      fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

      console.log(`✅ Emergency GMB backup created: ${gmbBuilders.length} builders saved to ${backupPath}`);
      
      return { 
        success: true, 
        backupPath, 
        count: gmbBuilders.length 
      };
      
    } catch (error) {
      console.error('❌ Failed to create emergency GMB backup:', error);
      return { success: false };
    }
  }

  /**
   * Restore GMB builders from the latest backup
   */
  async restoreFromLatestBackup(): Promise<{success: boolean; restored?: number; source?: string}> {
    try {
      const backupDir = path.join(process.cwd(), 'data', 'gmb_emergency_backups');
      
      if (!fs.existsSync(backupDir)) {
        console.log('⚠️ No GMB backup directory found');
        return { success: false };
      }

      const backups = fs.readdirSync(backupDir)
        .filter(file => file.startsWith('gmb_backup_') && file.endsWith('.json'))
        .sort()
        .reverse(); // Most recent first

      if (backups.length === 0) {
        console.log('⚠️ No GMB backups found');
        return { success: false };
      }

      const latestBackup = backups[0];
      const backupPath = path.join(backupDir, latestBackup);
      
      console.log(`🔄 Restoring GMB builders from: ${latestBackup}`);
      
      const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      const builders = backupData.builders || [];
      
      let restored = 0;
      for (const builder of builders) {
        try {
          const existing = await builderAPI.getBuilderById(builder.id);
          if (!existing) {
            const result = await builderAPI.addBuilder(builder);
            if (result.success) {
              restored++;
              console.log(`✅ Restored GMB builder: ${builder.companyName}`);
            }
          }
        } catch (error) {
          console.error(`❌ Error restoring builder ${builder.companyName}:`, error);
        }
      }

      console.log(`✅ GMB restoration complete: ${restored}/${builders.length} builders restored`);
      
      return { 
        success: true, 
        restored, 
        source: latestBackup 
      };
      
    } catch (error) {
      console.error('❌ Failed to restore GMB builders:', error);
      return { success: false };
    }
  }

  /**
   * Verify GMB data integrity and fix issues
   */
  async verifyAndFixGMBData(): Promise<{healthy: boolean; issues: string[]; fixed: number}> {
    const issues: string[] = [];
    let fixed = 0;

    try {
      const allBuilders = await builderAPI.getAllBuilders();
      const gmbBuilders = allBuilders.filter(builder => 
        builder.gmbImported || 
        builder.importedFromGMB || 
        builder.source === 'google_places_api'
      );

      console.log(`🔍 Verifying ${gmbBuilders.length} GMB builders...`);

      for (const builder of gmbBuilders) {
        let builderFixed = false;

        // Fix missing GMB flags
        if (!builder.gmbImported && !builder.importedFromGMB) {
          builder.gmbImported = true;
          builder.importedFromGMB = true;
          builderFixed = true;
        }

        // Fix missing source
        if (!builder.source) {
          builder.source = 'google_places_api';
          builderFixed = true;
        }

        // Add preservation flag
        if (!builder.preserveData) {
          builder.preserveData = true;
          builderFixed = true;
        }

        // Save fixes
        if (builderFixed) {
          await builderAPI.updateBuilder(builder.id, builder);
          fixed++;
          console.log(`🔧 Fixed GMB builder: ${builder.companyName}`);
        }
      }

      // Check for missing core data
      if (gmbBuilders.length === 0) {
        issues.push('No GMB builders found - possible data loss');
      }

      const healthy = issues.length === 0;
      
      if (healthy) {
        console.log(`✅ GMB data verification passed: ${gmbBuilders.length} builders healthy, ${fixed} fixed`);
      } else {
        console.warn(`⚠️ GMB data issues found:`, issues);
      }

      return { healthy, issues, fixed };
      
    } catch (error) {
      console.error('❌ GMB data verification failed:', error);
      return { healthy: false, issues: ['Verification system error'], fixed: 0 };
    }
  }

  /**
   * Get GMB data statistics
   */
  async getGMBStats(): Promise<any> {
    try {
      const allBuilders = await builderAPI.getAllBuilders();
      const gmbBuilders = allBuilders.filter(builder => 
        builder.gmbImported || 
        builder.importedFromGMB || 
        builder.source === 'google_places_api'
      );

      const countries = new Set(gmbBuilders.map(b => b.headquarters?.country || b.country));
      const cities = new Set(gmbBuilders.map(b => b.headquarters?.city || b.city));

      return {
        totalGMBBuilders: gmbBuilders.length,
        countries: countries.size,
        cities: cities.size,
        verified: gmbBuilders.filter(b => b.verified).length,
        withPreservationFlag: gmbBuilders.filter(b => b.preserveData).length,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error getting GMB stats:', error);
      return { error: 'Failed to get GMB statistics' };
    }
  }
}

export const gmbProtection = GMBDataProtection.getInstance();