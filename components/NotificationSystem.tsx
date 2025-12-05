'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Users,
  Building,
  Mail,
  Calendar,
  TrendingUp,
  Settings,
  Zap,
  Clock,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'new_lead' | 'builder_approval' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'leads' | 'builders' | 'system' | 'revenue' | 'analytics' | 'events';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: any;
}

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
  adminId?: string;
}

export default function NotificationSystem({ isOpen, onClose, adminId }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock notifications for demonstration
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'new_lead',
      title: 'New Lead Submission',
      message: 'A new quote request has been submitted for exhibitions in Frankfurt, Germany.',
      timestamp: '2 minutes ago',
      isRead: false,
      priority: 'high',
      category: 'leads',
      actionUrl: '/admin/leads',
      actionLabel: 'View Lead',
      metadata: { leadId: 'L001', location: 'Frankfurt, Germany' }
    },
    {
      id: '2',
      type: 'builder_approval',
      title: 'Builder Approval Required',
      message: 'ExpoDesign Solutions has submitted documents for verification.',
      timestamp: '15 minutes ago',
      isRead: false,
      priority: 'medium',
      category: 'builders',
      actionUrl: '/admin/pending-approvals',
      actionLabel: 'Review Builder',
      metadata: { builderId: 'B001', companyName: 'ExpoDesign Solutions' }
    },
    {
      id: '3',
      type: 'success',
      title: 'GMB Import Completed',
      message: '23 new builders successfully imported from Germany region.',
      timestamp: '1 hour ago',
      isRead: false,
      priority: 'medium',
      category: 'builders',
      actionUrl: '/admin/gmb-integration',
      actionLabel: 'View Results',
      metadata: { imported: 23, region: 'Germany' }
    },
    {
      id: '4',
      type: 'warning',
      title: 'API Quota Warning',
      message: 'Google Places API usage is at 85% of monthly quota.',
      timestamp: '2 hours ago',
      isRead: true,
      priority: 'medium',
      category: 'system',
      actionUrl: '/admin/settings',
      actionLabel: 'Manage APIs',
      metadata: { usage: 85, service: 'Google Places API' }
    },
    {
      id: '5',
      type: 'info',
      title: 'Analytics Report Ready',
      message: 'Weekly performance report for exhibition builders is now available.',
      timestamp: '4 hours ago',
      isRead: true,
      priority: 'low',
      category: 'analytics',
      actionUrl: '/admin/analytics',
      actionLabel: 'View Report',
      metadata: { reportType: 'weekly', period: 'Oct 21-28' }
    },
    {
      id: '6',
      type: 'new_lead',
      title: 'High-Value Lead Alert',
      message: 'Large exhibition request (500+ sqm) submitted for Dubai World Trade Centre.',
      timestamp: '6 hours ago',
      isRead: true,
      priority: 'urgent',
      category: 'leads',
      actionUrl: '/admin/leads',
      actionLabel: 'Priority Review',
      metadata: { leadValue: 'high', size: '500+ sqm', venue: 'Dubai World Trade Centre' }
    }
  ];

  // Initialize notifications
  useEffect(() => {
    console.log('🔔 Notification system initialized');
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  // Simulate real-time notifications
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      // Simulate new notification
      if (Math.random() < 0.3) { // 30% chance every 5 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? 'new_lead' : 'builder_approval',
          title: Math.random() > 0.5 ? 'New Lead Submission' : 'Builder Verification Request',
          message: Math.random() > 0.5 
            ? 'A new quote request has been submitted.' 
            : 'A builder has submitted verification documents.',
          timestamp: 'Just now',
          isRead: false,
          priority: 'medium',
          category: Math.random() > 0.5 ? 'leads' : 'builders',
          actionUrl: Math.random() > 0.5 ? '/admin/leads' : '/admin/pending-approvals',
          actionLabel: Math.random() > 0.5 ? 'View Lead' : 'Review Builder'
        };

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show toast notification
        toast.success(newNotification.title, {
          description: newNotification.message,
          action: {
            label: "View",
            onClick: () => console.log("Navigate to notification")
          }
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_lead': return <Mail className="h-4 w-4" />;
      case 'builder_approval': return <Users className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <X className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'urgent') return 'text-red-600 bg-red-50';
    
    switch (type) {
      case 'new_lead': return 'text-blue-600 bg-blue-50';
      case 'builder_approval': return 'text-purple-600 bg-purple-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'system': return 'text-gray-600 bg-gray-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={`text-xs ${colors[priority]}`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, [notifications]);

  const getFilteredNotifications = (category: string) => {
    if (category === 'all') return notifications;
    if (category === 'unread') return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.category === category);
  };

  const getTabBadge = (category: string) => {
    const count = getFilteredNotifications(category).length;
    const unreadInCategory = getFilteredNotifications(category).filter(n => !n.isRead).length;
    
    return unreadInCategory > 0 ? (
      <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
        {unreadInCategory}
      </Badge>
    ) : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end p-4">
      <Card className="w-full max-w-md h-[90vh] overflow-hidden animate-in slide-in-from-right duration-300" data-macaly="notification-panel">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-blue-600"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid grid-cols-4 w-full m-4 mb-0">
              <TabsTrigger value="all" className="text-xs">
                All{getTabBadge('all')}
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread{getTabBadge('unread')}
              </TabsTrigger>
              <TabsTrigger value="leads" className="text-xs">
                Leads{getTabBadge('leads')}
              </TabsTrigger>
              <TabsTrigger value="builders" className="text-xs">
                Builders{getTabBadge('builders')}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              {['all', 'unread', 'leads', 'builders', 'system', 'analytics'].map(category => (
                <TabsContent key={category} value={category} className="mt-0 h-full">
                  <div className="space-y-2 p-4">
                    {getFilteredNotifications(category).length > 0 ? (
                      getFilteredNotifications(category).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer ${
                            !notification.isRead 
                              ? 'border-blue-200 bg-blue-50' 
                              : 'border-gray-200 bg-white'
                          }`}
                          onClick={() => !notification.isRead && markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getNotificationColor(notification.type, notification.priority)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h4>
                                <div className="flex items-center gap-1">
                                  {getPriorityBadge(notification.priority)}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                    className="p-1 h-6 w-6"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {notification.timestamp}
                                </div>
                                
                                {notification.actionUrl && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log('Navigate to:', notification.actionUrl);
                                      // Navigation logic here
                                    }}
                                    className="text-xs h-7"
                                  >
                                    {notification.actionLabel}
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p className="text-sm">No notifications in this category</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>

        {/* Real-time status indicator */}
        <div className="border-t px-4 py-2 bg-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Real-time notifications active</span>
            <Zap className="h-3 w-3 ml-auto" />
          </div>
        </div>
      </Card>
    </div>
  );
}