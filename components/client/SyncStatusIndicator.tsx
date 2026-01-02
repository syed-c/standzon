"use client";

import React from "react";
import { Badge } from "@/components/shared/badge";
import { Card, CardContent } from "@/components/shared/card";
import { useRealTimeSync } from "@/lib/utils/realTimeSync";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  Clock,
  Database,
  Zap,
} from "lucide-react";

export default function SyncStatusIndicator() {
  const { syncStatus } = useRealTimeSync();
  const [lastUpdate, setLastUpdate] = React.useState<string>(
    new Date().toLocaleTimeString()
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isConnected =
    syncStatus.isInitialized && syncStatus.activeListeners > 0;

  return (
    <Card className="bg-theme-50 border-theme-200">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <Badge
                className={
                  isConnected
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {isConnected ? "Live Sync Active" : "Disconnected"}
              </Badge>
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Database className="h-3 w-3" />
              <span>{syncStatus.activeListeners} listeners</span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Clock className="h-3 w-3" />
              <span>Updated: {lastUpdate}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Real-time API
            </Badge>
            <div className="animate-pulse">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
