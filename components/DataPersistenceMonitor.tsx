"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Database,
  Clock,
  HardDrive,
  Activity,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  Server,
  FileText,
  BarChart3,
  Zap,
  Settings,
  Eye,
  Loader2,
  Heart,
  Archive,
  Cpu,
  MemoryStick,
} from "lucide-react";
import { toast } from "sonner";

interface PersistenceStatus {
  timestamp: string;
  health: {
    healthy: boolean;
    lastCheck: string;
    storage?: any;
    builders?: any;
    leads?: any;
  };
  backup: {
    totalBackups: number;
    latestBackup: string | null;
    backupSize: string;
    autoBackupEnabled: boolean;
  };
  data: {
    builders: {
      totalBuilders: number;
      verifiedBuilders: number;
      gmbImported: number;
      lastSyncTime?: string;
    };
    leads: number;
  };
  system: {
    uptime: number;
    memory: any;
    nodeVersion: string;
    platform: string;
  };
}

export default function DataPersistenceMonitor() {
  const [status, setStatus] = useState<PersistenceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState<string | null>(null);
  const visibilityRef = useRef(true);

  const loadPersistenceStatus = async () => {
    if (!visibilityRef.current) return;
    try {
      const response = await fetch("/api/admin/data-persistence");
      const result = await response.json();
      if (result.success) {
        setStatus(result.data);
      } else {
        toast.error("Failed to load persistence status");
      }
    } catch (error) {
      console.error("Error loading persistence status:", error);
      toast.error("Failed to load persistence status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleVisibility = () => {
      visibilityRef.current = !document.hidden;
      if (visibilityRef.current) {
        loadPersistenceStatus();
      }
    };

    loadPersistenceStatus();
    document.addEventListener("visibilitychange", handleVisibility);
    const interval = setInterval(loadPersistenceStatus, 60000);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, []);

  const performOperation = async (action: string, message: string) => {
    setOperationLoading(action);

    try {
      toast.info(`${message}...`);

      const response = await fetch("/api/admin/data-persistence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || `${message} completed successfully`);
        await loadPersistenceStatus();
      } else {
        toast.error(result.error || `${message} failed`);
      }
    } catch (error) {
      console.error(`${action} error:`, error);
      toast.error(`${message} failed`);
    } finally {
      setOperationLoading(null);
    }
  };

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatMemory = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2">Loading persistence status...</span>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load Status
          </h3>
          <p className="text-gray-600 mb-4">
            Failed to retrieve data persistence status
          </p>
          <Button
            onClick={loadPersistenceStatus}
            variant="outline"
            className="text-gray-900"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1
                  className="text-2xl font-bold text-gray-900"
                  data-macaly="persistence-title"
                >
                  🛡️ Data Persistence & Recovery Monitor
                </h1>
                <p
                  className="text-gray-600"
                  data-macaly="persistence-description"
                >
                  Monitor system health, manage backups, and ensure data
                  integrity with hourly automated backups and instant recovery.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                className={
                  status.health.healthy
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {status.health.healthy ? "Healthy" : "Issues Detected"}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                Auto-Backup: {status.backup.autoBackupEnabled ? "ON" : "OFF"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Builders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {status.data.builders.totalBuilders}
                </p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Backups</p>
                <p className="text-2xl font-bold text-gray-900">
                  {status.backup.totalBackups}
                </p>
              </div>
              <Archive className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatUptime(status.system.uptime)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Backup Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {status.backup.backupSize}
                </p>
              </div>
              <HardDrive className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Health
          </TabsTrigger>
          <TabsTrigger value="backups" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Backups
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Operations
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Status</span>
                  <div className="flex items-center gap-2">
                    {status.health.healthy ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${status.health.healthy ? "text-green-600" : "text-red-600"}`}
                    >
                      {status.health.healthy ? "Healthy" : "Issues Detected"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Last Health Check
                  </span>
                  <span className="text-sm text-gray-900">
                    {new Date(status.health.lastCheck).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Data Persistence
                  </span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Data Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Data Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Builders</span>
                  <span className="text-sm font-medium text-gray-900">
                    {status.data.builders.totalBuilders}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Verified Builders
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {status.data.builders.verifiedBuilders}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">GMB Imported</span>
                  <span className="text-sm font-medium text-gray-900">
                    {status.data.builders.gmbImported}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Leads</span>
                  <span className="text-sm font-medium text-gray-900">
                    {status.data.leads}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-600" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Platform</p>
                  <p className="font-medium text-gray-900">
                    {status.system.platform}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Node.js Version</p>
                  <p className="font-medium text-gray-900">
                    {status.system.nodeVersion}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Memory Usage</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>RSS:</span>
                      <span>{formatMemory(status.system.memory.rss)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Heap Used:</span>
                      <span>{formatMemory(status.system.memory.heapUsed)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                System Health Monitoring
              </CardTitle>
              <CardDescription>
                Real-time monitoring of data integrity, backup status, and
                system performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {status.health.storage && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Storage Health
                  </h4>
                  {status.health.storage.healthy ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Storage system is healthy</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">Storage issues detected</span>
                      </div>
                      {status.health.storage.issues && (
                        <ul className="list-disc list-inside text-sm text-red-600 ml-6">
                          {status.health.storage.issues.map(
                            (issue: string, index: number) => (
                              <li key={index}>{issue}</li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    performOperation("health-check", "Running health check")
                  }
                  disabled={operationLoading === "health-check"}
                  variant="outline"
                  className="text-gray-900"
                >
                  {operationLoading === "health-check" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Activity className="w-4 h-4 mr-2" />
                  )}
                  Run Health Check
                </Button>

                <Button
                  onClick={() =>
                    performOperation(
                      "verify-integrity",
                      "Verifying data integrity"
                    )
                  }
                  disabled={operationLoading === "verify-integrity"}
                  variant="outline"
                  className="text-gray-900"
                >
                  {operationLoading === "verify-integrity" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  Verify Integrity
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Backup Management
              </CardTitle>
              <CardDescription>
                Automated hourly backups with manual backup and recovery options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Backup Status
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Backups:</span>
                      <span className="font-medium">
                        {status.backup.totalBackups}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latest Backup:</span>
                      <span className="font-medium">
                        {status.backup.latestBackup
                          ? new Date(
                              status.backup.latestBackup
                                .replace(/backup_/, "")
                                .replace(/-/g, ":")
                            ).toLocaleString()
                          : "None"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Size:</span>
                      <span className="font-medium">
                        {status.backup.backupSize}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Auto-Backup:</span>
                      <Badge
                        className={
                          status.backup.autoBackupEnabled
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {status.backup.autoBackupEnabled
                          ? "Enabled"
                          : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Backup Schedule
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Automated every hour</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Clock className="w-4 h-4" />
                      <span>Keeps last 24 backups</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Shield className="w-4 h-4" />
                      <span>Data integrity checks</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-600">
                      <Zap className="w-4 h-4" />
                      <span>Instant recovery available</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    performOperation("force-backup", "Creating manual backup")
                  }
                  disabled={operationLoading === "force-backup"}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {operationLoading === "force-backup" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Force Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                System Operations
              </CardTitle>
              <CardDescription>
                Advanced operations for data recovery, system maintenance, and
                troubleshooting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recovery Operations */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-green-600" />
                    Recovery Operations
                  </h4>
                  <div className="space-y-3">
                    <Button
                      onClick={() =>
                        performOperation(
                          "system-recovery",
                          "Performing system recovery"
                        )
                      }
                      disabled={operationLoading === "system-recovery"}
                      variant="outline"
                      className="w-full text-gray-900"
                    >
                      {operationLoading === "system-recovery" ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Full System Recovery
                    </Button>

                    <Button
                      onClick={() =>
                        performOperation("reload-data", "Reloading data")
                      }
                      disabled={operationLoading === "reload-data"}
                      variant="outline"
                      className="w-full text-gray-900"
                    >
                      {operationLoading === "reload-data" ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Database className="w-4 h-4 mr-2" />
                      )}
                      Reload from Storage
                    </Button>
                  </div>
                </div>

                {/* Maintenance Operations */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-600" />
                    Maintenance
                  </h4>
                  <div className="space-y-3">
                    <Button
                      onClick={loadPersistenceStatus}
                      variant="outline"
                      className="w-full text-gray-900"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Status
                    </Button>
                  </div>
                </div>
              </div>

              {/* Warning Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">
                      Important Notice
                    </h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      Recovery operations may temporarily affect system
                      performance. System recovery will restore data from the
                      latest backup and reload all data structures.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
