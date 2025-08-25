'use client';

import React, { useEffect, useState } from 'react';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Wifi, WifiOff, RefreshCw, CheckCircle, AlertTriangle, Info, 
  Activity, Database, Globe, Users, Building, Calendar 
} from 'lucide-react';

interface SyncStatus {
  isConnected: boolean;
  lastSync: string;
  dataHealth: {
    builders: number;
    events: number;
    leads: number;
    errors: number;
  };
  recentUpdates: Array<{
    type: string;
    message: string;
    timestamp: string;
    source: string;
  }>;
}

export function RealTimeSyncIndicator({ compact = false }: { compact?: boolean }) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: true,
    lastSync: new Date().toISOString(),
    dataHealth: { builders: 0, events: 0, leads: 0, errors: 0 },
    recentUpdates: []
  });
  const { toast } = useToast();

  useEffect(() => {
    // Initial data load
    updateSyncStatus();

    // Subscribe to real-time updates
    const unsubscribe = unifiedPlatformAPI.subscribe((event) => {
      console.log('🔔 Real-time sync update:', event);
      
      // Update recent activities
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date().toISOString(),
        recentUpdates: [
          {
            type: event.type,
            message: event.data.message || `${event.type.replace('_', ' ')} event`,
            timestamp: event.timestamp,
            source: event.source
          },
          ...prev.recentUpdates.slice(0, 9) // Keep last 10 updates
        ]
      }));

      // Show toast for important updates
      if (['builder_added', 'lead_received', 'plan_upgraded'].includes(event.type)) {
        toast({
          title: "Real-time Update",
          description: event.data.message || `${event.type.replace('_', ' ')} detected`,
          duration: 3000,
        });
      }

      // Update data health
      updateSyncStatus();
    });

    // Periodic health check
    const healthCheck = setInterval(() => {
      updateSyncStatus();
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(healthCheck);
    };
  }, [toast]);

  const updateSyncStatus = () => {
    const stats = unifiedPlatformAPI.getStats();
    const builders = unifiedPlatformAPI.getBuilders();
    const events = unifiedPlatformAPI.getEvents();
    const leads = unifiedPlatformAPI.getLeads();

    setSyncStatus(prev => ({
      ...prev,
      dataHealth: {
        builders: builders.length,
        events: events.length,
        leads: leads.length,
        errors: 0 // Could implement error tracking
      }
    }));
  };

  const forceSyncRefresh = () => {
    console.log('🔄 Force refreshing sync status...');
    updateSyncStatus();
    setSyncStatus(prev => ({
      ...prev,
      lastSync: new Date().toISOString()
    }));
    
    toast({
      title: "Sync Refreshed",
      description: "Real-time data synchronization refreshed",
      duration: 2000,
    });
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${syncStatus.isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
        <span className="text-xs text-gray-500">
          {syncStatus.isConnected ? 'Live' : 'Disconnected'}
        </span>
        <Badge className="bg-blue-100 text-blue-800 text-xs">
          {syncStatus.dataHealth.builders + syncStatus.dataHealth.events + syncStatus.dataHealth.leads} records
        </Badge>
      </div>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {syncStatus.isConnected ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            <span>Real-Time Sync Status</span>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={forceSyncRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>
          Platform-wide data synchronization between admin and website
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Connection Status */}
        <Alert className={`mb-4 ${syncStatus.isConnected ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            <strong>Status:</strong> {syncStatus.isConnected ? 'Connected' : 'Disconnected'} | 
            <strong> Last Sync:</strong> {new Date(syncStatus.lastSync).toLocaleTimeString()}
          </AlertDescription>
        </Alert>

        {/* Data Health Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Building className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{syncStatus.dataHealth.builders}</div>
            <div className="text-xs text-gray-600">Builders</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{syncStatus.dataHealth.events}</div>
            <div className="text-xs text-gray-600">Events</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{syncStatus.dataHealth.leads}</div>
            <div className="text-xs text-gray-600">Leads</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Database className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">{syncStatus.dataHealth.errors}</div>
            <div className="text-xs text-gray-600">Errors</div>
          </div>
        </div>

        {/* Recent Updates */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Recent Updates
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {syncStatus.recentUpdates.length > 0 ? (
              syncStatus.recentUpdates.map((update, index) => (
                <div 
                  key={index} 
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start space-x-2">
                    {update.type.includes('error') ? (
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    ) : update.type.includes('success') ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    ) : (
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    )}
                    <div>
                      <div className="text-sm font-medium">{update.message}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(update.timestamp).toLocaleTimeString()} • from {update.source}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    className={`text-xs ${
                      update.type.includes('added') ? 'bg-green-100 text-green-800' :
                      update.type.includes('updated') ? 'bg-blue-100 text-blue-800' :
                      update.type.includes('deleted') ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {update.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Globe className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RealTimeSyncIndicator;