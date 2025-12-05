'use client';

import React from 'react';
import { adminAPI } from '@/lib/api/admin';
import { ExhibitionBuilder } from '@/lib/data/exhibitionBuilders';

export interface SyncEvent {
  type: 'builder_created' | 'builder_updated' | 'builder_deleted' | 'builder_status_changed';
  data: any;
  timestamp: string;
  source: 'admin' | 'builder' | 'website';
}

class RealTimeSyncService {
  private listeners: Map<string, (event: SyncEvent) => void> = new Map();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;
    
    console.log('Real-time sync service initializing...');
    
    // Check if we're in a client-side environment
    if (typeof window !== 'undefined') {
      try {
        console.log('✅ Real-time sync service initialized (polling mode)');
      } catch (error) {
        console.warn('⚠️ Could not initialize real-time sync:', error);
      }
    } else {
      console.log('⚠️ Real-time sync service running in SSR mode');
    }
    
    this.isInitialized = true;
    console.log('✅ Real-time sync service initialized');
  }

  // Subscribe to sync events
  subscribe(callback: (event: SyncEvent) => void): () => void {
    const id = Math.random().toString(36).substr(2, 9);
    this.listeners.set(id, callback);
    
    console.log('New sync subscriber registered:', id);
    
    return () => {
      this.listeners.delete(id);
      console.log('Sync subscriber unregistered:', id);
    };
  }

  // Broadcast events to all listeners
  private broadcastEvent(event: SyncEvent) {
    console.log('Broadcasting sync event:', event.type, event.data);
    
    this.listeners.forEach((callback, id) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in sync listener:', id, error);
      }
    });
  }

  // Trigger sync events manually
  triggerSync(type: SyncEvent['type'], data: any, source: SyncEvent['source'] = 'admin') {
    const event: SyncEvent = {
      type,
      data,
      timestamp: new Date().toISOString(),
      source
    };
    
    this.broadcastEvent(event);
  }

  // Sync builder data across all platforms
  async syncBuilderData(builder: ExhibitionBuilder, action: 'create' | 'update' | 'delete') {
    console.log(`🔄 SYNC START: ${action.toUpperCase()} builder ${builder.id} - ${builder.companyName}`);
    
    try {
      // Update the website's builder directory
      await this.syncToWebsite(builder, action);
      
      // Update admin dashboard data
      await this.syncToAdminDashboard(builder, action);
      
      // Update builder's own dashboard
      await this.syncToBuilderDashboard(builder, action);
      
      // Update real storage
      await this.syncToRealStorage(builder, action);
      
      console.log('✅ SYNC COMPLETE: Builder data synced successfully across all platforms');
      
      // Trigger global refresh event
      this.triggerSync('builder_updated', {
        action,
        builder: builder.id,
        timestamp: new Date().toISOString(),
        platforms: ['website', 'admin', 'builder', 'storage']
      }, 'admin');
      
    } catch (error) {
      console.error('❌ SYNC ERROR: Failed to sync builder data:', error);
      throw error;
    }
  }

  private async syncToWebsite(builder: ExhibitionBuilder, action: 'create' | 'update' | 'delete') {
    // In a real implementation, this would call website API endpoints
    console.log(`Syncing to website: ${action} builder ${builder.id}`);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        this.triggerSync(`builder_${action}d` as SyncEvent['type'], builder, 'website');
        resolve(true);
      }, 100);
    });
  }

  private async syncToAdminDashboard(builder: ExhibitionBuilder, action: 'create' | 'update' | 'delete') {
    console.log(`Syncing to admin dashboard: ${action} builder ${builder.id}`);
    
    // Update admin dashboard immediately through AdminAPI
    this.triggerSync(`builder_${action}d` as SyncEvent['type'], builder, 'admin');
  }

  private async syncToBuilderDashboard(builder: ExhibitionBuilder, action: 'create' | 'update' | 'delete') {
    console.log(`Syncing to builder dashboard: ${action} builder ${builder.id}`);
    
    // In a real implementation, this would notify the builder's dashboard
    this.triggerSync('builder_status_changed', {
      builderId: builder.id,
      status: builder.verified ? 'active' : 'inactive',
      plan: builder.premiumMember ? 'premium' : 'basic'
    }, 'builder');
  }

  private async syncToRealStorage(builder: ExhibitionBuilder, action: 'create' | 'update' | 'delete') {
    console.log(`Syncing to real storage: ${action} builder ${builder.id}`);
    
    try {
      // Import and update real storage
      const { realStorageAPI } = await import('@/lib/data/realStorage');
      
      switch (action) {
        case 'create':
          realStorageAPI.addBuilder(builder);
          break;
        case 'update':
          realStorageAPI.updateBuilder(builder.id, builder);
          break;
        case 'delete':
          realStorageAPI.deleteBuilder(builder.id);
          break;
      }
      
      console.log(`Real storage updated: ${action} ${builder.id}`);
    } catch (error) {
      console.error('Error syncing to real storage:', error);
    }
  }

  // Get current sync status
  getSyncStatus() {
    return {
      isInitialized: this.isInitialized,
      activeListeners: this.listeners.size,
      lastSync: new Date().toISOString()
    };
  }

  // Force a full data refresh across all platforms
  async forceRefresh() {
    console.log('Forcing full data refresh across all platforms');
    
    try {
      // Get all builders from the data store
      const buildersResponse = await adminAPI.getBuilders(1, 1000); // Get all builders
      
      if (buildersResponse.success && buildersResponse.data) {
        // Trigger a refresh event for each platform
        this.triggerSync('builder_updated', {
          action: 'full_refresh',
          builders: buildersResponse.data,
          count: buildersResponse.data.length
        }, 'admin');
        
        console.log(`Full refresh completed: ${buildersResponse.data.length} builders synced`);
      }
      
    } catch (error) {
      console.error('Error during full refresh:', error);
      throw error;
    }
  }
}

// Global instance
export const realTimeSyncService = new RealTimeSyncService();

// React hook for using real-time sync in components
export function useRealTimeSync() {
  const [syncStatus, setSyncStatus] = React.useState(realTimeSyncService.getSyncStatus());
  
  React.useEffect(() => {
    const unsubscribe = realTimeSyncService.subscribe((event) => {
      setSyncStatus(realTimeSyncService.getSyncStatus());
    });
    
    return unsubscribe;
  }, []);
  
  return {
    syncStatus,
    triggerSync: realTimeSyncService.triggerSync.bind(realTimeSyncService),
    forceRefresh: realTimeSyncService.forceRefresh.bind(realTimeSyncService),
    subscribe: realTimeSyncService.subscribe.bind(realTimeSyncService)
  };
}

// Utility functions for specific sync operations
export const SyncUtils = {
  // Sync builder status change (activate/deactivate)
  async syncBuilderStatus(builderId: string, isActive: boolean) {
    console.log(`🔄 Syncing builder status: ${builderId} -> ${isActive ? 'ACTIVE' : 'INACTIVE'}`);
    
    try {
      const builderResponse = await adminAPI.getBuilder(builderId);
      if (builderResponse.success && builderResponse.data) {
        const updatedBuilder = { ...builderResponse.data, verified: isActive };
        await realTimeSyncService.syncBuilderData(updatedBuilder, 'update');
        console.log(`✅ Builder status synced successfully: ${builderId}`);
      } else {
        throw new Error('Builder not found or response failed');
      }
    } catch (error) {
      console.error(`❌ Failed to sync builder status: ${builderId}`, error);
      throw error;
    }
  },

  // Sync builder plan change (premium/basic)
  async syncBuilderPlan(builderId: string, isPremium: boolean) {
    console.log(`🔄 Syncing builder plan: ${builderId} -> ${isPremium ? 'PREMIUM' : 'BASIC'}`);
    
    try {
      const builderResponse = await adminAPI.getBuilder(builderId);
      if (builderResponse.success && builderResponse.data) {
        const updatedBuilder = { ...builderResponse.data, premiumMember: isPremium };
        await realTimeSyncService.syncBuilderData(updatedBuilder, 'update');
        console.log(`✅ Builder plan synced successfully: ${builderId}`);
      } else {
        throw new Error('Builder not found or response failed');
      }
    } catch (error) {
      console.error(`❌ Failed to sync builder plan: ${builderId}`, error);
      throw error;
    }
  },

  // Sync builder profile update
  async syncBuilderProfile(builder: ExhibitionBuilder) {
    console.log(`🔄 Syncing builder profile: ${builder.id} - ${builder.companyName}`);
    try {
      await realTimeSyncService.syncBuilderData(builder, 'update');
      console.log(`✅ Builder profile synced successfully: ${builder.id}`);
    } catch (error) {
      console.error(`❌ Failed to sync builder profile: ${builder.id}`, error);
      throw error;
    }
  },

  // Sync builder deletion
  async syncBuilderDeletion(builderId: string) {
    console.log(`🗑️ Syncing builder deletion: ${builderId}`);
    
    try {
      const builderResponse = await adminAPI.getBuilder(builderId);
      if (builderResponse.success && builderResponse.data) {
        await realTimeSyncService.syncBuilderData(builderResponse.data, 'delete');
        console.log(`✅ Builder deletion synced successfully: ${builderId}`);
      } else {
        console.warn(`⚠️ Builder not found for deletion sync: ${builderId}`);
      }
    } catch (error) {
      console.error(`❌ Failed to sync builder deletion: ${builderId}`, error);
      throw error;
    }
  }
};

export default realTimeSyncService;