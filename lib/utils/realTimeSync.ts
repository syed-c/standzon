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
    

    
    // Check if we're in a client-side environment
    if (typeof window !== 'undefined') {
      try {
      } catch (error) {
      }
    } else {
      
    }
    
    this.isInitialized = true;
  }

  // Subscribe to sync events
  subscribe(callback: (event: SyncEvent) => void): () => void {
    const id = Math.random().toString(36).substr(2, 9);
    this.listeners.set(id, callback);
    

    
    return () => {
      this.listeners.delete(id);
    };
  }

  // Broadcast events to all listeners
  private broadcastEvent(event: SyncEvent) {
    
    this.listeners.forEach((callback, id) => {
      try {
        callback(event);
      } catch (error) {
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
    
    try {
      // Update the website's builder directory
      await this.syncToWebsite(builder, action);
      
      // Update admin dashboard data
      await this.syncToAdminDashboard(builder, action);
      
      // Update builder's own dashboard
      await this.syncToBuilderDashboard(builder, action);
      
      // Update real storage
      await this.syncToRealStorage(builder, action);
      
      
      // Trigger global refresh event
      this.triggerSync('builder_updated', {
        action,
        builder: builder.id,
        timestamp: new Date().toISOString(),
        platforms: ['website', 'admin', 'builder', 'storage']
      }, 'admin');
      
    } catch (error) {
      throw error;
    }
  }

  private async syncToWebsite(builder: ExhibitionBuilder, action: 'create' | 'update' | 'delete') {
    // In a real implementation, this would call website API endpoints
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        this.triggerSync(`builder_${action}d` as SyncEvent['type'], builder, 'website');
        resolve(true);
      }, 100);
    });
  }

  private async syncToAdminDashboard(builder: ExhibitionBuilder, action: 'create' | 'update' | 'delete') {
    
    // Update admin dashboard immediately through AdminAPI
    this.triggerSync(`builder_${action}d` as SyncEvent['type'], builder, 'admin');
  }

  private async syncToBuilderDashboard(builder: ExhibitionBuilder, action: 'create' | 'update' | 'delete') {
    
    // In a real implementation, this would notify the builder's dashboard
    this.triggerSync('builder_status_changed', {
      builderId: builder.id,
      status: builder.verified ? 'active' : 'inactive',
      plan: builder.premiumMember ? 'premium' : 'basic'
    }, 'builder');
  }

  private async syncToRealStorage(builder: ExhibitionBuilder, action: 'create' | 'update' | 'delete') {
    
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
      
    } catch (error) {

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
        
      }
      
    } catch (error) {
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
    
    try {
      const builderResponse = await adminAPI.getBuilder(builderId);
      if (builderResponse.success && builderResponse.data) {
        const updatedBuilder = { ...builderResponse.data, verified: isActive };
        await realTimeSyncService.syncBuilderData(updatedBuilder, 'update');
      } else {
        throw new Error('Builder not found or response failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Sync builder plan change (premium/basic)
  async syncBuilderPlan(builderId: string, isPremium: boolean) {
    
    try {
      const builderResponse = await adminAPI.getBuilder(builderId);
      if (builderResponse.success && builderResponse.data) {
        const updatedBuilder = { ...builderResponse.data, premiumMember: isPremium };
        await realTimeSyncService.syncBuilderData(updatedBuilder, 'update');
      } else {
        throw new Error('Builder not found or response failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Sync builder profile update
  async syncBuilderProfile(builder: ExhibitionBuilder) {
    try {
      await realTimeSyncService.syncBuilderData(builder, 'update');
    } catch (error) {
      throw error;
    }
  },

  // Sync builder deletion
  async syncBuilderDeletion(builderId: string) {
    
    try {
      const builderResponse = await adminAPI.getBuilder(builderId);
      if (builderResponse.success && builderResponse.data) {
        await realTimeSyncService.syncBuilderData(builderResponse.data, 'delete');
      } else {
        }
    } catch (error) {
      throw error;
    }
  }
};

export default realTimeSyncService;