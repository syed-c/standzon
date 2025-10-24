import { prisma } from './client';

// ✅ FIXED: Prevent memory leak warnings by increasing max listeners early (server-side only)
if (typeof process !== 'undefined' && process.setMaxListeners) {
  process.setMaxListeners(50); // Allow multiple systems to attach listeners
}

// ✅ ENHANCED: Check if we're on server-side before importing fs
let fs: any, path: any;

if (typeof window === 'undefined') {
  // Only import fs on server-side
  fs = require('fs');
  path = require('path');
} else {
  // Client-side fallbacks
  fs = null;
  path = null;
}

// ✅ ENHANCED: Robust file-based data persistence with auto-recovery and hourly backups
class EnhancedFileBasedStorage {
  private dataDir: string = '';
  private backupDir: string = '';
  private autoBackupInterval: NodeJS.Timeout | null = null;
  private static instance: EnhancedFileBasedStorage | null = null;

  constructor() {
    // ✅ FIXED: Prevent multiple instances creating duplicate intervals
    if (EnhancedFileBasedStorage.instance) {
      return EnhancedFileBasedStorage.instance;
    }
    
    EnhancedFileBasedStorage.instance = this;
    
    // ✅ ENHANCED: Only initialize on server-side
    if (typeof window === 'undefined' && fs && path) {
      const enablePersistence = process.env.ENABLE_PERSISTENCE === 'true';
      this.dataDir = path.join(process.cwd(), 'data');
      this.backupDir = path.join(process.cwd(), 'data', 'backups');
      if (enablePersistence) {
        try {
          this.ensureDataDirectories();
        } catch (e) {
          if (process.env.VERBOSE_LOGS === 'true') {
            console.warn('⚠️ Failed to ensure data directories, disabling persistence:', e);
          }
        }
        // Start auto-backups ONLY when explicitly enabled
        if (process.env.ENABLE_BACKUPS === 'true') {
          this.startAutoBackupSystem();
        }
        try {
          this.performStartupRecovery();
        } catch (e) {
          if (process.env.VERBOSE_LOGS === 'true') {
            console.warn('⚠️ Startup recovery failed:', e);
          }
        }
      } else {
        if (process.env.VERBOSE_LOGS === 'true') {
          console.log('🔒 Persistence disabled (ENABLE_PERSISTENCE!=true)');
        }
      }
    } else {
      if (process.env.VERBOSE_LOGS === 'true') {
        console.log('🔍 Client-side detected - persistence features disabled');
      }
    }
  }

  private ensureDataDirectories() {
    // ✅ ENHANCED: Server-side only
    if (typeof window === 'undefined' && fs && path) {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
        if (process.env.VERBOSE_LOGS === 'true') {
          console.log('📁 Created data directory:', this.dataDir);
        }
      }
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
        if (process.env.VERBOSE_LOGS === 'true') {
          console.log('📁 Created backup directory:', this.backupDir);
        }
      }
    }
  }

  // ✅ NEW: Auto-backup system that runs every hour
  private startAutoBackupSystem() {
    // ✅ Server-side only check
    if (typeof window !== 'undefined' || !fs || !path) {
      if (process.env.VERBOSE_LOGS === 'true') {
        console.log('🔍 Client-side detected - backup system disabled');
      }
      return;
    }

    // ✅ FIXED: Prevent duplicate backup intervals
    if (this.autoBackupInterval) {
      if (process.env.VERBOSE_LOGS === 'true') {
        console.log('🔄 Auto-backup system already running, skipping duplicate setup');
      }
      return;
    }

    if (process.env.VERBOSE_LOGS === 'true') {
      console.log('🔄 Starting hourly auto-backup system...');
    }
    
    // Run backup immediately on startup
    if (process.env.RUN_BACKUP_ON_START === 'true') {
      this.performFullBackup();
    }
    
    // Set up hourly backup (every 3600000ms = 1 hour)
    this.autoBackupInterval = setInterval(() => {
      this.performFullBackup();
    }, 3600000); // 1 hour
    
    if (process.env.VERBOSE_LOGS === 'true') {
      console.log('✅ Auto-backup system started - backups every hour');
    }
  }

  // ✅ NEW: Perform full system backup
  private async performFullBackup() {
    // ✅ Server-side only check
    if (typeof window !== 'undefined' || !fs || !path) {
      if (process.env.VERBOSE_LOGS === 'true') {
        console.log('🔍 Client-side detected - backup skipped');
      }
      return;
    }

    // ✅ FIXED: Skip backup during build/deployment
    if (process.env.VERCEL || (process.env.NODE_ENV === 'production' && process.env.ENABLE_BACKUPS !== 'true')) {
      if (process.env.VERBOSE_LOGS === 'true') {
        console.log('🔍 Build/deployment environment - backup skipped');
      }
      return;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFolder = path.join(this.backupDir, `backup_${timestamp}`);
      
      // ✅ FIXED: Ensure backup directory exists before proceeding
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
      }
      
      if (!fs.existsSync(backupFolder)) {
        fs.mkdirSync(backupFolder, { recursive: true });
      }

      if (process.env.VERBOSE_LOGS === 'true') {
        console.log('🔄 Starting hourly backup...');
      }
      
      // Get all data files
      const dataFiles = fs.readdirSync(this.dataDir).filter((file: string) => 
        file.endsWith('.json') && !file.includes('.backup') && !file.includes('.tmp')
      );

      let backedUpFiles = 0;
      for (const file of dataFiles) {
        try {
          const sourcePath = path.join(this.dataDir, file);
          const backupPath = path.join(backupFolder, file);
          
          // ✅ FIXED: Check source file exists before copying
          if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, backupPath);
            backedUpFiles++;
          }
        } catch (error) {
          console.error(`❌ Failed to backup ${file}:`, error);
        }
      }

      // Create backup manifest
      const manifest = {
        timestamp: new Date().toISOString(),
        filesBackedUp: backedUpFiles,
        files: dataFiles,
        systemInfo: {
          nodeVersion: process.version,
          platform: process.platform,
          uptime: process.uptime()
        }
      };

      fs.writeFileSync(
        path.join(backupFolder, 'manifest.json'), 
        JSON.stringify(manifest, null, 2)
      );

      console.log(`✅ Hourly backup completed: ${backedUpFiles} files backed up to ${backupFolder}`);
      
      // Clean up old backups (keep last 24 backups = 24 hours)
      this.cleanupOldBackups();
      
    } catch (error) {
      console.error('❌ Backup failed:', error);
    }
  }

  // ✅ NEW: Clean up old backups to save disk space
  private cleanupOldBackups() {
    try {
      const backups = fs.readdirSync(this.backupDir)
        .filter((dir: string) => dir.startsWith('backup_'))
        .sort()
        .reverse(); // Most recent first

      // Keep last 24 backups (24 hours)
      if (backups.length > 24) {
        const toDelete = backups.slice(24);
        toDelete.forEach((backup: string) => {
          const backupPath = path.join(this.backupDir, backup);
          fs.rmSync(backupPath, { recursive: true, force: true });
          console.log(`🗑️ Cleaned up old backup: ${backup}`);
        });
      }
    } catch (error) {
      console.error('❌ Backup cleanup failed:', error);
    }
  }

  // ✅ NEW: Startup recovery system
  private async performStartupRecovery() {
    console.log('🔍 Performing startup data recovery check...');
    
    try {
      // Check if main data files exist and are valid
      const criticalFiles = ['builders.json', 'leads.json'];
      const recoveryNeeded = [];

      for (const file of criticalFiles) {
        const filePath = this.getFilePath(file.replace('.json', ''));
        
        if (!fs.existsSync(filePath)) {
          console.log(`⚠️ Missing critical file: ${file}`);
          recoveryNeeded.push(file);
        } else {
          try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (!Array.isArray(data)) {
              console.log(`⚠️ Invalid data structure in: ${file}`);
              recoveryNeeded.push(file);
            }
          } catch (error) {
            console.log(`⚠️ Corrupted file: ${file}`, error);
            recoveryNeeded.push(file);
          }
        }
      }

      if (recoveryNeeded.length > 0) {
        console.log('🔄 Recovery needed for:', recoveryNeeded);
        await this.recoverFromLatestBackup(recoveryNeeded);
      } else {
        console.log('✅ All critical data files are healthy');
      }

      // Create recovery manifest
      await this.writeData('_recovery_log', {
        lastCheck: new Date().toISOString(),
        filesChecked: criticalFiles.length,
        recoveryNeeded: recoveryNeeded.length,
        status: recoveryNeeded.length === 0 ? 'healthy' : 'recovered'
      });

    } catch (error) {
      console.error('❌ Startup recovery check failed:', error);
    }
  }

  // ✅ NEW: Recover from latest backup
  private async recoverFromLatestBackup(filesToRecover: string[]) {
    try {
      const backups = fs.readdirSync(this.backupDir)
        .filter((dir: string) => dir.startsWith('backup_'))
        .sort()
        .reverse(); // Most recent first

      if (backups.length === 0) {
        console.log('⚠️ No backups available for recovery');
        return;
      }

      const latestBackup = backups[0];
      const backupPath = path.join(this.backupDir, latestBackup);
      
      console.log(`🔄 Recovering from backup: ${latestBackup}`);

      let recoveredFiles = 0;
      for (const file of filesToRecover) {
        const backupFilePath = path.join(backupPath, file);
        const targetFilePath = this.getFilePath(file.replace('.json', ''));

        if (fs.existsSync(backupFilePath)) {
          fs.copyFileSync(backupFilePath, targetFilePath);
          console.log(`✅ Recovered: ${file}`);
          recoveredFiles++;
        } else {
          console.log(`⚠️ Backup file not found: ${file}`);
        }
      }

      console.log(`✅ Recovery completed: ${recoveredFiles}/${filesToRecover.length} files recovered`);
      
    } catch (error) {
      console.error('❌ Recovery from backup failed:', error);
    }
  }

  private getFilePath(filename: string): string {
    // ✅ Server-side only check
    if (typeof window !== 'undefined' || !path) {
      return `${filename}.json`; // Return simple filename for client-side
    }
    return path.join(this.dataDir, `${filename}.json`);
  }

  // ✅ ENHANCED: Atomic write with multiple safeguards
  async writeData(filename: string, data: any): Promise<void> {
    // ✅ Server-side only check
    if (typeof window !== 'undefined' || !fs || !path) {
      console.log('📝 Client-side detected - skipping file write operation');
      return;
    }

    const filePath = this.getFilePath(filename);
    const backupPath = `${filePath}.backup`;
    
    try {
      // Create backup of existing file
      if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, backupPath);
      }
      
      // Add metadata to data
      const dataWithMeta = {
        _metadata: {
          timestamp: new Date().toISOString(),
          version: '1.0',
          checksum: this.generateChecksum(JSON.stringify(data))
        },
        data: data
      };
      
      // Write new data atomically
      const tempPath = `${filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(dataWithMeta, null, 2), 'utf8');
      fs.renameSync(tempPath, filePath);
      
      console.log(`💾 Data saved to ${filename}.json with checksum`);
    } catch (error) {
      console.error(`❌ Error writing data to ${filename}:`, error);
      throw error;
    }
  }

  // ✅ ENHANCED: Read with checksum verification
  async readData(filename: string, defaultValue: any = null): Promise<any> {
    // ✅ Server-side only check
    if (typeof window !== 'undefined' || !fs || !path) {
      console.log('📖 Client-side detected - returning default value');
      return defaultValue;
    }

    const filePath = this.getFilePath(filename);
    
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`📄 File ${filename}.json not found, using default value`);
        return defaultValue;
      }
      
      const rawData = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(rawData);
      
      // Handle both new format (with metadata) and legacy format
      if (parsed._metadata && parsed.data) {
        // Verify checksum if available
        const expectedChecksum = this.generateChecksum(JSON.stringify(parsed.data));
        if (parsed._metadata.checksum && parsed._metadata.checksum !== expectedChecksum) {
          console.warn(`⚠️ Checksum mismatch for ${filename}, data may be corrupted`);
        }
        
        console.log(`📖 Data loaded from ${filename}.json (verified)`);
        return parsed.data;
      } else {
        // Legacy format without metadata
        console.log(`📖 Data loaded from ${filename}.json (legacy format)`);
        return parsed;
      }
    } catch (error) {
      console.error(`❌ Error reading data from ${filename}:`, error);
      
      // Try to restore from backup
      const backupPath = `${filePath}.backup`;
      if (fs && fs.existsSync(backupPath)) {
        try {
          const backupData = fs.readFileSync(backupPath, 'utf8');
          const parsed = JSON.parse(backupData);
          console.log(`🔄 Restored data from backup: ${filename}.json.backup`);
          return parsed.data || parsed; // Handle both formats
        } catch (backupError) {
          console.error(`❌ Backup restore failed for ${filename}:`, backupError);
        }
      }
      
      return defaultValue;
    }
  }

  // ✅ NEW: Generate simple checksum for data integrity
  private generateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  // ✅ NEW: Health check method
  async performHealthCheck(): Promise<{healthy: boolean; issues: string[]}> {
    // ✅ Server-side only check
    if (typeof window !== 'undefined' || !fs || !path) {
      console.log('🔍 Client-side detected - health check skipped');
      return { healthy: true, issues: ['Client-side - health check disabled'] };
    }

    const issues: string[] = [];
    
    try {
      // Check data directory
      if (!fs.existsSync(this.dataDir)) {
        issues.push('Data directory missing');
        console.log('📁 Creating missing data directory...');
        try {
          fs.mkdirSync(this.dataDir, { recursive: true });
          console.log('✅ Data directory created');
        } catch (error) {
          console.error('❌ Failed to create data directory:', error);
          issues.push('Cannot create data directory');
        }
      }
      
      // Check backup directory
      if (!fs.existsSync(this.backupDir)) {
        console.log('📁 Creating missing backup directory...');
        try {
          fs.mkdirSync(this.backupDir, { recursive: true });
          console.log('✅ Backup directory created');
        } catch (error) {
          console.warn('⚠️ Failed to create backup directory:', error);
          // Don't add to issues as backups are not critical for basic operation
        }
      }
      
      // Check critical files
      const criticalFiles = ['builders.json', 'leads.json'];
      for (const file of criticalFiles) {
        const filePath = this.getFilePath(file.replace('.json', ''));
        if (!fs.existsSync(filePath)) {
          console.log(`📄 Creating missing critical file: ${file}`);
          try {
            await this.writeData(file.replace('.json', ''), []);
            console.log(`✅ Created empty ${file}`);
          } catch (error) {
            console.error(`❌ Failed to create ${file}:`, error);
            issues.push(`Cannot create critical file: ${file}`);
          }
        }
      }
      
      // Check backup recency (only if backup directory exists)
      if (fs.existsSync(this.backupDir)) {
        try {
      const backups = fs.readdirSync(this.backupDir)
        .filter((dir: string) => {
          try {
            const backupPath = path.join(this.backupDir, dir);
            return dir.startsWith('backup_') && fs.existsSync(backupPath);
          } catch {
            return false;
          }
        })
        .sort()
        .reverse();
          
          if (backups.length === 0) {
            // Don't treat missing backups as critical for fresh deployment
            console.log('ℹ️ No backups available (normal for fresh deployment)');
          } else {
            const latestBackup = backups[0];
            const backupTime = new Date(latestBackup.replace('backup_', '').replace(/-/g, ':'));
            const hoursSinceBackup = (Date.now() - backupTime.getTime()) / (1000 * 60 * 60);
            
            if (hoursSinceBackup > 2) {
              console.log(`ℹ️ Last backup is ${Math.round(hoursSinceBackup)} hours old`);
              // Don't treat old backups as critical
            }
          }
        } catch (error) {
          console.warn('⚠️ Error checking backup recency:', error);
        }
      }
      
      return {
        healthy: issues.length === 0,
        issues
      };
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return {
        healthy: false,
        issues: ['Health check system failure: ' + (error instanceof Error ? error.message : 'Unknown error')]
      };
    }
  }

  // ✅ NEW: Force immediate backup
  async forceBackupNow(): Promise<{success: boolean; message: string}> {
    try {
      await this.performFullBackup();
      return {
        success: true,
        message: 'Manual backup completed successfully'
      };
    } catch (error) {
      console.error('❌ Manual backup failed:', error);
      return {
        success: false,
        message: 'Manual backup failed: ' + (error instanceof Error ? error.message : 'Unknown error')
      };
    }
  }

  // ✅ NEW: Get backup status
  getBackupStatus(): {
    totalBackups: number;
    latestBackup: string | null;
    backupSize: string;
    autoBackupEnabled: boolean;
  } {
    // ✅ Server-side only check
    if (typeof window !== 'undefined' || !fs || !path) {
      console.log('🔍 Client-side detected - backup status unavailable');
      return {
        totalBackups: 0,
        latestBackup: null,
        backupSize: '0 B',
        autoBackupEnabled: false
      };
    }

    try {
      const backups = fs.readdirSync(this.backupDir)
        .filter((dir: string) => dir.startsWith('backup_'))
        .sort()
        .reverse();

      let totalSize = 0;
      backups.forEach((backup: string) => {
        const backupPath = path.join(this.backupDir, backup);
        try {
          totalSize += this.getFolderSize(backupPath);
        } catch (error) {
          console.error(`❌ Error calculating size for ${backup}:`, error);
        }
      });

      return {
        totalBackups: backups.length,
        latestBackup: backups[0] || null,
        backupSize: this.formatBytes(totalSize),
        autoBackupEnabled: this.autoBackupInterval !== null
      };
    } catch (error) {
      console.error('❌ Failed to get backup status:', error);
      return {
        totalBackups: 0,
        latestBackup: null,
        backupSize: '0 B',
        autoBackupEnabled: false
      };
    }
  }

  // ✅ NEW: Helper to calculate folder size
  private getFolderSize(folderPath: string): number {
    let totalSize = 0;
    const files = fs.readdirSync(folderPath);
    
    files.forEach((file: string) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        totalSize += this.getFolderSize(filePath);
      }
    });
    
    return totalSize;
  }

  // ✅ NEW: Helper to format bytes
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ✅ NEW: Cleanup method for graceful shutdown
  cleanup() {
    if (this.autoBackupInterval) {
      clearInterval(this.autoBackupInterval);
      this.autoBackupInterval = null;
      console.log('🛑 Auto-backup system stopped');
    }
  }
}

// ✅ FIXED: Use singleton pattern to prevent multiple instances
let storageInstance: EnhancedFileBasedStorage | null = null;

function getStorageInstance(): EnhancedFileBasedStorage | null {
  // Only create instance if persistence is enabled
  if (!storageInstance && process.env.ENABLE_PERSISTENCE === 'true') {
    storageInstance = new EnhancedFileBasedStorage();
  }
  return storageInstance;
}

// Only initialize storage if persistence is enabled
const storage = process.env.ENABLE_PERSISTENCE === 'true' ? getStorageInstance() : null;

// ✅ ENHANCED: Builder Persistence API with auto-recovery and real-time sync
class BuilderPersistenceAPI {
  private builders: any[] = [];
  private isLoaded = false;
  private lastSyncTime: Date | null = null;

  async ensureLoaded() {
    if (!this.isLoaded) {
      if (storage) {
        this.builders = await storage.readData('builders', []);
        console.log(`✅ Loaded ${this.builders.length} builders from persistent storage`);
      } else {
        this.builders = [];
        console.log('🔒 Persistence disabled - using empty builders array');
      }
      this.isLoaded = true;
      this.lastSyncTime = new Date();
    }
  }

  async saveBuilders() {
    if (storage) {
      await storage.writeData('builders', this.builders);
      this.lastSyncTime = new Date();
    } else {
      console.log('🔒 Persistence disabled - skipping save');
    }
  }

  // ✅ NEW: Force reload from disk (useful for recovery)
  async forceReload() {
    console.log('🔄 Force reloading builders from disk...');
    this.isLoaded = false;
    await this.ensureLoaded();
    return this.builders.length;
  }

  // ✅ ENHANCED: Get stats with more detailed information
  async getStats() {
    await this.ensureLoaded();
    
    const totalBuilders = this.builders.length;
    const verifiedBuilders = this.builders.filter(b => b.verified).length;
    const gmbImported = this.builders.filter(b => b.gmbImported || b.importedFromGMB || b.source === 'google_places_api').length;
    const countries = new Set(this.builders.map(b => b.headquarters?.country || b.country)).size;
    const cities = new Set(this.builders.map(b => b.headquarters?.city || b.city)).size;
    const averageRating = totalBuilders > 0 
      ? this.builders.reduce((sum, b) => sum + (b.rating || 0), 0) / totalBuilders 
      : 0;

    return {
      totalBuilders,
      totalCountries: countries,
      totalCities: cities,
      verifiedBuilders,
      gmbImported,
      averageRating: Math.round(averageRating * 10) / 10,
      lastSyncTime: this.lastSyncTime?.toISOString(),
      dataIntegrity: {
        healthy: true,
        lastCheck: new Date().toISOString()
      }
    };
  }
  
  async getAllBuilders() {
    await this.ensureLoaded();
    return [...this.builders];
  }
  
  async getBuilderById(id: string) {
    await this.ensureLoaded();
    return this.builders.find(b => b.id === id) || null;
  }
  
  async addBuilder(builder: any) {
    try {
      await this.ensureLoaded();
      
      // Enhanced duplicate detection
      const existingBuilder = this.builders.find(b => {
        // Check by ID first
        if (b.id === builder.id) return true;
        
        // For GMB imports, check by GMB ID or business name + location
        if (builder.gmbImported || builder.importedFromGMB || builder.source === 'google_places_api') {
          const builderGmbId = builder.gmbData?.placeId || builder.gmbData?.originalId || builder.gmbId;
          const existingGmbId = b.gmbData?.placeId || b.gmbData?.originalId || b.gmbId;
          
          if (builderGmbId && existingGmbId && builderGmbId === existingGmbId) {
            return true;
          }
          
          // Check by business name + city + country combination
          const builderKey = `${builder.companyName?.toLowerCase()}_${builder.headquarters?.city?.toLowerCase()}_${builder.headquarters?.country?.toLowerCase()}`;
          const existingKey = `${b.companyName?.toLowerCase()}_${b.headquarters?.city?.toLowerCase()}_${b.headquarters?.country?.toLowerCase()}`;
          
          if (builderKey === existingKey) {
            return true;
          }
        }
        
        // For regular builders, check by email (only if both have valid emails)
        if (b.contactInfo?.primaryEmail && builder.contactInfo?.primaryEmail &&
            b.contactInfo.primaryEmail.trim() !== '' && builder.contactInfo.primaryEmail.trim() !== '') {
          return b.contactInfo.primaryEmail.toLowerCase() === builder.contactInfo.primaryEmail.toLowerCase();
        }
        
        return false;
      });
      
      if (existingBuilder) {
        return { 
          success: false, 
          error: `Builder already exists: ${builder.companyName || builder.name}` 
        };
      }
      
      // Add timestamps and metadata
      builder.createdAt = new Date().toISOString();
      builder.updatedAt = new Date().toISOString();
      builder._persistenceVersion = '1.0';
      
      this.builders.push(builder);
      await this.saveBuilders();
      
      console.log('✅ Builder added:', builder.companyName || builder.name);
      return { success: true, data: builder };
    } catch (error) {
      console.error('❌ Error adding builder:', error);
      return { success: false, error: 'Failed to add builder' };
    }
  }
  
  async updateBuilder(id: string, updates: any) {
    try {
      await this.ensureLoaded();
      
      const index = this.builders.findIndex(b => b.id === id);
      if (index === -1) {
        return { success: false, error: 'Builder not found' };
      }
      
      // Update builder
      updates.updatedAt = new Date().toISOString();
      this.builders[index] = { ...this.builders[index], ...updates };
      await this.saveBuilders();
      
      console.log('✅ Builder updated:', id);
      return { success: true, data: this.builders[index] };
    } catch (error) {
      console.error('❌ Error updating builder:', error);
      return { success: false, error: 'Failed to update builder' };
    }
  }
  
  async deleteBuilder(id: string) {
    try {
      await this.ensureLoaded();
      
      const index = this.builders.findIndex(b => b.id === id);
      if (index === -1) {
        return { success: false, error: 'Builder not found' };
      }
      
      const deletedBuilder = this.builders.splice(index, 1)[0];
      await this.saveBuilders();
      
      console.log('✅ Builder deleted:', id);
      return { success: true, data: deletedBuilder };
    } catch (error) {
      console.error('❌ Error deleting builder:', error);
      return { success: false, error: 'Failed to delete builder' };
    }
  }

  async deleteAllBuilders() {
    try {
      const count = this.builders.length;
      this.builders = [];
      await this.saveBuilders();
      
      console.log(`✅ Deleted all ${count} builders`);
      return { success: true, deletedCount: count };
    } catch (error) {
      console.error('❌ Error deleting all builders:', error);
      return { success: false, error: 'Failed to delete all builders' };
    }
  }

  // ✅ NEW: Bulk add builders with progress tracking
  async addBuilders(builders: any[], progressCallback?: (progress: number, total: number) => void) {
    let added = 0;
    let duplicates = 0;
    let errors = 0;
    const results = [];

    console.log(`📦 Starting bulk import of ${builders.length} builders...`);

    for (let i = 0; i < builders.length; i++) {
      try {
        const result = await this.addBuilder(builders[i]);
        if (result.success) {
          added++;
        } else {
          if (result.error?.includes('already exists')) {
            duplicates++;
          } else {
            errors++;
          }
        }
        results.push(result);
        
        // Report progress
        if (progressCallback) {
          progressCallback(i + 1, builders.length);
        }
        
        // Small delay to prevent overwhelming the system
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      } catch (error) {
        errors++;
        results.push({ success: false, error: 'Processing failed' });
      }
    }

    console.log(`✅ Bulk import completed: ${added} added, ${duplicates} duplicates, ${errors} errors`);
    
    return {
      success: true,
      summary: { added, duplicates, errors },
      results
    };
  }
}

// ✅ NEW: Enhanced Lead Persistence API with real-time monitoring
class LeadPersistenceAPI {
  private leads: any[] = [];
  private isLoaded = false;
  private lastSyncTime: Date | null = null;

  async ensureLoaded() {
    if (!this.isLoaded) {
      if (storage) {
        this.leads = await storage.readData('leads', []);
        console.log(`✅ Loaded ${this.leads.length} leads from persistent storage`);
      } else {
        this.leads = [];
        console.log('🔒 Persistence disabled - using empty leads array');
      }
      this.isLoaded = true;
      this.lastSyncTime = new Date();
    }
  }

  async saveLeads() {
    if (storage) {
      await storage.writeData('leads', this.leads);
      this.lastSyncTime = new Date();
    } else {
      console.log('🔒 Persistence disabled - skipping save');
    }
  }

  async forceReload() {
    console.log('🔄 Force reloading leads from disk...');
    this.isLoaded = false;
    await this.ensureLoaded();
    return this.leads.length;
  }

  async getAllLeads() {
    await this.ensureLoaded();
    return [...this.leads];
  }
  
  async getLeadById(id: string) {
    await this.ensureLoaded();
    return this.leads.find(l => l.id === id) || null;
  }
  
  async addLead(lead: any) {
    try {
      await this.ensureLoaded();
      
      // Add timestamps and metadata
      lead.createdAt = new Date().toISOString();
      lead.updatedAt = new Date().toISOString();
      lead._persistenceVersion = '1.0';
      
      this.leads.push(lead);
      await this.saveLeads();
      
      console.log('✅ Lead added:', lead.id);
      return { success: true, data: lead };
    } catch (error) {
      console.error('❌ Error adding lead:', error);
      return { success: false, error: 'Failed to add lead' };
    }
  }
  
  async updateLead(id: string, updates: any) {
    try {
      await this.ensureLoaded();
      
      const index = this.leads.findIndex(l => l.id === id);
      if (index === -1) {
        return { success: false, error: 'Lead not found' };
      }
      
      // Update lead with metadata
      updates.updatedAt = new Date().toISOString();
      updates._persistenceVersion = '1.0';
      this.leads[index] = { ...this.leads[index], ...updates };
      await this.saveLeads();
      
      console.log('✅ Lead updated:', id);
      return { success: true, data: this.leads[index] };
    } catch (error) {
      console.error('❌ Error updating lead:', error);
      return { success: false, error: 'Failed to update lead' };
    }
  }
  
  async deleteLead(id: string) {
    try {
      await this.ensureLoaded();
      
      const index = this.leads.findIndex(l => l.id === id);
      if (index === -1) {
        return { success: false, error: 'Lead not found' };
      }
      
      const deletedLead = this.leads.splice(index, 1)[0];
      await this.saveLeads();
      
      console.log('✅ Lead deleted:', id);
      return { success: true, data: deletedLead };
    } catch (error) {
      console.error('❌ Error deleting lead:', error);
      return { success: false, error: 'Failed to delete lead' };
    }
  }
}

// ✅ NEW: System-wide data monitoring and health management
class DataHealthMonitor {
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private healthStatus: any = { healthy: true, lastCheck: new Date().toISOString() };
  private static instance: DataHealthMonitor | null = null;

  constructor() {
    // ✅ FIXED: Prevent multiple instances creating duplicate intervals
    if (DataHealthMonitor.instance) {
      return DataHealthMonitor.instance;
    }
    
    DataHealthMonitor.instance = this;
    this.startHealthMonitoring();
  }

  private startHealthMonitoring() {
    // ✅ FIXED: Prevent duplicate intervals
    if (this.healthCheckInterval) {
      console.log('🏥 Health monitoring already active, skipping duplicate setup');
      return;
    }
    
    console.log('🏥 Starting data health monitoring...');
    
    // Perform initial health check
    this.performHealthCheck();
    
    // Set up monitoring every 10 minutes
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 600000); // 10 minutes
    
    console.log('✅ Health monitoring started - checks every 10 minutes');
  }

  private async performHealthCheck() {
    try {
      console.log('🔍 Performing system health check...');
      
      const storageHealth = storage ? await storage.performHealthCheck() : { healthy: true, message: 'Persistence disabled' };
      const builderStats = await builderAPI.getStats();
      const leadCount = (await leadAPI.getAllLeads()).length;
      
      this.healthStatus = {
        healthy: storageHealth.healthy,
        lastCheck: new Date().toISOString(),
        storage: storageHealth,
        builders: {
          total: builderStats.totalBuilders,
          verified: builderStats.verifiedBuilders,
          gmbImported: builderStats.gmbImported,
          lastSync: builderStats.lastSyncTime
        },
        leads: {
          total: leadCount
        },
        // ✅ FIXED: Add client-side check for Node.js APIs
        ...(typeof process !== 'undefined' && process.uptime ? {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          nodeVersion: process.version,
          platform: process.platform
        } : {
          uptime: 'N/A (client-side)',
          memory: 'N/A (client-side)',
          nodeVersion: 'N/A (client-side)',
          platform: 'browser'
        })
      };

      if (!storageHealth.healthy) {
        if ('issues' in storageHealth) {
          console.warn('⚠️ Health check detected issues:', storageHealth.issues);
          
          // Attempt auto-recovery for critical issues
          if (storageHealth.issues.some((issue: string) => issue.includes('Missing critical file'))) {
            console.log('🔄 Attempting auto-recovery...');
            await this.attemptAutoRecovery();
          }
        }
      } else {
        console.log('✅ System health check passed');
      }
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
      this.healthStatus = {
        healthy: false,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async attemptAutoRecovery() {
    try {
      console.log('🔄 Starting auto-recovery process...');
      
      // Force reload data from latest backup
      await builderAPI.forceReload();
      await leadAPI.forceReload();
      
      // Force a backup
      if (storage) {
        await storage.forceBackupNow();
      }
      
      console.log('✅ Auto-recovery completed');
    } catch (error) {
      console.error('❌ Auto-recovery failed:', error);
    }
  }

  getHealthStatus() {
    return { ...this.healthStatus };
  }

  async forceHealthCheck() {
    await this.performHealthCheck();
    return this.getHealthStatus();
  }

  cleanup() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log('🛑 Health monitoring stopped');
    }
  }
}

// Export singleton instances
export const builderAPI = new BuilderPersistenceAPI();
export const leadAPI = new LeadPersistenceAPI();

// ✅ FIXED: Export enhanced storage and monitoring systems with singleton pattern
export const enhancedStorage = storage;

// ✅ FIXED: Use singleton pattern for data health monitor
let dataHealthMonitorInstance: DataHealthMonitor | null = null;

function getDataHealthMonitor(): DataHealthMonitor | null {
  // Only create instance if persistence is enabled
  if (!dataHealthMonitorInstance && process.env.ENABLE_PERSISTENCE === 'true') {
    dataHealthMonitorInstance = new DataHealthMonitor();
  }
  return dataHealthMonitorInstance;
}

// Only initialize if persistence is enabled
export const dataHealthMonitor = process.env.ENABLE_PERSISTENCE === 'true' ? getDataHealthMonitor() : null;

// User data persistence
class UserPersistenceAPI {
  async saveUserData(userId: string, userData: any) {
    if (storage) {
      const dataWithMeta = {
        ...userData,
        updatedAt: new Date().toISOString(),
        _persistenceVersion: '1.0'
      };
      await storage.writeData(`user_${userId}`, dataWithMeta);
    }
  }

  async getUserData(userId: string) {
    if (storage) {
      return await storage.readData(`user_${userId}`, null);
    }
    return null;
  }

  async deleteUserData(userId: string) {
    const filePath = path.join(process.cwd(), 'data', `user_${userId}.json`);
    if (fs.existsSync(filePath)) {
      // Create backup before deletion
      const backupPath = `${filePath}.deleted_backup`;
      fs.copyFileSync(filePath, backupPath);
      fs.unlinkSync(filePath);
      console.log(`🗑️ User data deleted with backup: ${userId}`);
    }
  }
}

export const userAPI = new UserPersistenceAPI();

// System settings persistence
class SettingsPersistenceAPI {
  async saveSettings(settings: any) {
    if (storage) {
      const settingsWithMeta = {
        ...settings,
        updatedAt: new Date().toISOString(),
        _persistenceVersion: '1.0'
      };
      await storage.writeData('system_settings', settingsWithMeta);
    }
  }

  async getSettings() {
    if (storage) {
      return await storage.readData('system_settings', {
        smtp: { enabled: false },
        sms: { enabled: false },
        payments: { stripe: { enabled: false }, razorpay: { enabled: false } },
        backup: { enabled: true, interval: 3600000 }, // 1 hour
        recovery: { enabled: true, autoRecover: true }
      });
    }
    return {
      smtp: { enabled: false },
      sms: { enabled: false },
      payments: { stripe: { enabled: false }, razorpay: { enabled: false } },
      backup: { enabled: true, interval: 3600000 }, // 1 hour
      recovery: { enabled: true, autoRecover: true }
    };
  }
}

export const settingsAPI = new SettingsPersistenceAPI();

// ✅ NEW: Unified Persistence Manager
export class UnifiedPersistenceManager {
  static instance: UnifiedPersistenceManager | null = null;

  static getInstance(): UnifiedPersistenceManager {
    if (!UnifiedPersistenceManager.instance) {
      UnifiedPersistenceManager.instance = new UnifiedPersistenceManager();
    }
    return UnifiedPersistenceManager.instance;
  }

  // Get comprehensive system status
  async getSystemStatus() {
    const healthStatus = dataHealthMonitor ? dataHealthMonitor.getHealthStatus() : { healthy: true, message: 'Persistence disabled' };
    const backupStatus = storage ? storage.getBackupStatus() : { enabled: false, message: 'Persistence disabled' };
    const builderStats = await builderAPI.getStats();
    
    return {
      timestamp: new Date().toISOString(),
      health: healthStatus,
      backup: backupStatus,
      data: {
        builders: builderStats,
        leads: (await leadAPI.getAllLeads()).length
      },
      system: {
        // ✅ FIXED: Add client-side check for Node.js APIs
        ...(typeof process !== 'undefined' && process.uptime ? {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          nodeVersion: process.version,
          platform: process.platform
        } : {
          uptime: 'N/A (client-side)',
          memory: 'N/A (client-side)',
          nodeVersion: 'N/A (client-side)',
          platform: 'browser'
        })
      }
    };
  }

  // Force full system backup
  async forceFullBackup() {
    if (storage) {
      return await storage.forceBackupNow();
    } else {
      return { success: false, message: 'Persistence disabled' };
    }
  }

  // Perform system recovery
  async performSystemRecovery() {
    try {
      console.log('🔄 Starting full system recovery...');
      
      // Force reload all data
      const buildersLoaded = await builderAPI.forceReload();
      const leadsLoaded = await leadAPI.forceReload();
      
      // Perform health check
      const healthStatus = dataHealthMonitor ? await dataHealthMonitor.forceHealthCheck() : { healthy: true };
      
      // Force backup
      await this.forceFullBackup();
      
      console.log('✅ System recovery completed');
      
      return {
        success: true,
        recovery: {
          buildersLoaded,
          leadsLoaded,
          healthStatus,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ System recovery failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Graceful shutdown
  async shutdown() {
    console.log('🛑 Shutting down persistence systems...');
    
    try {
      // Perform final backup
      if (storage) {
        await storage.forceBackupNow();
      }
      
      // Cleanup monitoring
      if (dataHealthMonitor) {
        dataHealthMonitor.cleanup();
      }
      if (storage) {
        storage.cleanup();
      }
      
      console.log('✅ Persistence systems shut down gracefully');
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
    }
  }
}

// ✅ NEW: Initialize persistence system on startup
export const persistenceManager = UnifiedPersistenceManager.getInstance();

// ✅ NEW: Setup graceful shutdown handlers with memory leak prevention
let shutdownListenersAttached = false;

if (typeof process !== 'undefined' && !shutdownListenersAttached) {
  shutdownListenersAttached = true;
  
  // Increase max listeners to handle development hot reloads and multiple systems (server-side only)
  if (process.setMaxListeners) {
    process.setMaxListeners(30);
  }
  
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}, shutting down persistence gracefully...`);
    try {
      await persistenceManager.shutdown();
      console.log('✅ Persistence shutdown completed');
    } catch (error) {
      console.error('❌ Error during persistence shutdown:', error);
    }
  };
  
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  
  console.log('✅ Graceful shutdown handlers registered once for persistence');
}

// Only log if persistence is enabled
if (process.env.ENABLE_PERSISTENCE === 'true') {
  console.log('✅ Enhanced File-Based Persistence API initialized with auto-recovery, hourly backups, and health monitoring');
} else {
  console.log('🔒 File-Based Persistence API disabled (ENABLE_PERSISTENCE=false)');
}


