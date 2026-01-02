'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Badge } from '@/components/shared/badge';
import { Progress } from '@/components/shared/progress';
import { 
  Activity, 
  Zap, 
  Users, 
  Building, 
  Globe,
  TrendingUp,
  Clock,
  Wifi,
  RefreshCw,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Database,
  Server,
  Radio,
  Signal,
  Eye,
  Pause,
  Play
} from 'lucide-react';
import { toast } from 'sonner';

interface RealTimeEvent {
  id: string;
  type: 'lead' | 'builder' | 'operation' | 'system' | 'analytics';
  title: string;
  description: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  data?: any;
}

interface SystemMetrics {
  activeConnections: number;
  dataSync: number;
  apiCalls: number;
  responseTime: number;
  uptime: number;
  eventsPerSecond: number;
}

export default function RealTimeSyncDemo() {
  const [isConnected, setIsConnected] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeConnections: 1247,
    dataSync: 98.5,
    apiCalls: 15240,
    responseTime: 45,
    uptime: 99.8,
    eventsPerSecond: 24
  });
  const [connectionHistory, setConnectionHistory] = useState<Array<{ timestamp: string; connected: boolean }>>([]);

  // Generate mock real-time events
  const generateEvent = useCallback((): RealTimeEvent => {
    const eventTypes = [
      {
        type: 'lead' as const,
        titles: ['New Lead Submission', 'Lead Updated', 'High-Value Lead Alert'],
        descriptions: [
          'Quote request submitted for exhibition in Berlin',
          'Lead status changed to qualified',
          'Premium exhibition request received'
        ],
        sources: ['Quote Form', 'Contact Page', 'Direct Inquiry'],
        priorities: ['medium', 'high'] as const
      },
      {
        type: 'builder' as const,
        titles: ['Builder Registration', 'Profile Update', 'Verification Complete'],
        descriptions: [
          'New builder registered from Dubai',
          'Builder updated portfolio and pricing',
          'Builder verification process completed'
        ],
        sources: ['Registration Form', 'Admin Panel', 'Verification System'],
        priorities: ['medium', 'low'] as const
      },
      {
        type: 'operation' as const,
        titles: ['Bulk Operation Complete', 'Data Import Finished', 'System Backup'],
        descriptions: [
          'Bulk approval operation processed 45 items',
          'GMB import completed with 89% success rate',
          'Daily system backup completed successfully'
        ],
        sources: ['Bulk Operations', 'GMB Integration', 'System Scheduler'],
        priorities: ['low', 'medium'] as const
      },
      {
        type: 'system' as const,
        titles: ['Performance Alert', 'System Update', 'Security Scan'],
        descriptions: [
          'API response time increased by 15%',
          'System security update applied successfully',
          'Automated security scan completed'
        ],
        sources: ['Monitoring System', 'Update Manager', 'Security Scanner'],
        priorities: ['high', 'critical'] as const
      },
      {
        type: 'analytics' as const,
        titles: ['Report Generated', 'Metric Threshold', 'Data Insight'],
        descriptions: [
          'Weekly analytics report generated',
          'Conversion rate exceeded target by 12%',
          'AI detected optimization opportunity'
        ],
        sources: ['Analytics Engine', 'Metrics Monitor', 'AI Insights'],
        priorities: ['low', 'medium'] as const
      }
    ];

    const selectedType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const titleIndex = Math.floor(Math.random() * selectedType.titles.length);
    
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: selectedType.type,
      title: selectedType.titles[titleIndex],
      description: selectedType.descriptions[titleIndex],
      timestamp: new Date().toISOString(),
      priority: selectedType.priorities[Math.floor(Math.random() * selectedType.priorities.length)],
      source: selectedType.sources[titleIndex],
      data: {
        userId: Math.floor(Math.random() * 1000),
        location: ['Berlin', 'Dubai', 'London', 'Paris', 'Barcelona'][Math.floor(Math.random() * 5)]
      }
    };
  }, []);

  // Simulate real-time events
  useEffect(() => {
    if (!isConnected || isPaused) return;

    const interval = setInterval(() => {
      // Generate new event (30% chance every 2 seconds)
      if (Math.random() < 0.3) {
        const newEvent = generateEvent();
        setEvents(prev => [newEvent, ...prev.slice(0, 19)]); // Keep last 20 events
        
        // Show toast for high priority events
        if (newEvent.priority === 'high' || newEvent.priority === 'critical') {
          toast.success(newEvent.title, {
            description: newEvent.description,
            duration: 3000
          });
        }
      }

      // Update metrics
      setMetrics(prev => ({
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 20 - 10),
        dataSync: Math.min(100, Math.max(90, prev.dataSync + (Math.random() - 0.5) * 2)),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 50),
        responseTime: Math.max(20, prev.responseTime + Math.floor(Math.random() * 20 - 10)),
        uptime: Math.min(100, prev.uptime + 0.001),
        eventsPerSecond: Math.max(0, prev.eventsPerSecond + Math.floor(Math.random() * 10 - 5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected, isPaused, generateEvent]);

  // Connection status tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionHistory(prev => [
        {
          timestamp: new Date().toISOString(),
          connected: isConnected
        },
        ...prev.slice(0, 29) // Keep last 30 status points
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      toast.success('Real-time sync reconnected');
    } else {
      toast.error('Real-time sync disconnected');
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Real-time events resumed' : 'Real-time events paused');
  };

  const getEventIcon = (type: string, priority: string) => {
    const iconMap = {
      lead: Users,
      builder: Building,
      operation: RefreshCw,
      system: Server,
      analytics: TrendingUp
    };
    
    const IconComponent = iconMap[type as keyof typeof iconMap] || Info;
    
    const colorMap = {
      critical: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-blue-600',
      low: 'text-gray-600'
    };
    
    return <IconComponent className={`h-4 w-4 ${colorMap[priority as keyof typeof colorMap]}`} />;
  };

  const getPriorityBadge = (priority: string) => {
    const colorMap = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={`text-xs ${colorMap[priority as keyof typeof colorMap]}`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="w-full space-y-6" data-macaly="real-time-sync-demo">
      {/* Connection Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Real-Time Sync System</span>
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePause}
                className="flex items-center gap-2"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                variant={isConnected ? "destructive" : "default"}
                size="sm"
                onClick={toggleConnection}
                className="flex items-center gap-2"
              >
                {isConnected ? <Wifi className="h-4 w-4" /> : <Radio className="h-4 w-4" />}
                {isConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{metrics.activeConnections.toLocaleString()}</p>
              <p className="text-xs text-blue-600">Active Connections</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{metrics.dataSync.toFixed(1)}%</p>
              <p className="text-xs text-green-600">Data Sync</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{metrics.apiCalls.toLocaleString()}</p>
              <p className="text-xs text-purple-600">API Calls</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{metrics.responseTime}ms</p>
              <p className="text-xs text-orange-600">Response Time</p>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{metrics.uptime.toFixed(2)}%</p>
              <p className="text-xs text-indigo-600">Uptime</p>
            </div>
            <div className="text-center p-3 bg-pink-50 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">{metrics.eventsPerSecond}</p>
              <p className="text-xs text-pink-600">Events/sec</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-Time Events Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <span>Live Events Feed</span>
              <Badge className="bg-green-100 text-green-800">
                {events.length} events
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {isConnected && !isPaused ? (
                events.length > 0 ? (
                  events.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-0.5">
                        {getEventIcon(event.type, event.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <div className="flex items-center gap-1">
                            {getPriorityBadge(event.priority)}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {event.source}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-30 animate-pulse" />
                    <p className="text-sm">Waiting for real-time events...</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Radio className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">
                    {!isConnected ? 'Real-time sync disconnected' : 'Events paused'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              <span>System Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Performance Metrics */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Data Synchronization</span>
                  <span className="font-medium">{metrics.dataSync.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.dataSync} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>API Response Time</span>
                  <span className="font-medium">{metrics.responseTime}ms</span>
                </div>
                <Progress 
                  value={Math.max(0, 100 - (metrics.responseTime / 2))} 
                  className="h-2" 
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>System Uptime</span>
                  <span className="font-medium">{metrics.uptime.toFixed(2)}%</span>
                </div>
                <Progress value={metrics.uptime} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Event Processing Rate</span>
                  <span className="font-medium">{metrics.eventsPerSecond}/sec</span>
                </div>
                <Progress 
                  value={Math.min(100, (metrics.eventsPerSecond / 50) * 100)} 
                  className="h-2" 
                />
              </div>
            </div>

            {/* System Status Indicators */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">System Components</h4>
              <div className="space-y-2">
                {[
                  { name: 'WebSocket Server', status: isConnected ? 'online' : 'offline' },
                  { name: 'Database Sync', status: 'online' },
                  { name: 'Message Queue', status: 'online' },
                  { name: 'Event Processor', status: isPaused ? 'paused' : 'online' },
                  { name: 'Notification Service', status: 'online' }
                ].map((component) => (
                  <div key={component.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{component.name}</span>
                    <div className="flex items-center gap-2">
                      {component.status === 'online' && (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <Badge className="bg-green-100 text-green-800 text-xs">Online</Badge>
                        </>
                      )}
                      {component.status === 'offline' && (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <Badge className="bg-red-100 text-red-800 text-xs">Offline</Badge>
                        </>
                      )}
                      {component.status === 'paused' && (
                        <>
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Paused</Badge>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Capabilities Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Real-Time Platform Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <Bell className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-800">Instant Notifications</h4>
              <p className="text-sm text-blue-700 mt-1">Real-time alerts for leads, approvals, and system events</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-800">Live Data Sync</h4>
              <p className="text-sm text-green-700 mt-1">Synchronized data across all platform components</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-800">Live Monitoring</h4>
              <p className="text-sm text-purple-700 mt-1">Real-time system performance and health monitoring</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <Signal className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold text-orange-800">Auto-Recovery</h4>
              <p className="text-sm text-orange-700 mt-1">Automatic reconnection and error recovery</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}