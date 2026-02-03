'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Filter,
  Search,
  User,
  Key,
  Database,
  FileText,
  Settings,
  LogIn,
  LogOut,
  Edit3,
  Plus,
  Trash2,
  Download,
  Eye,
  RefreshCw,
  Loader2,
  Clock,
  Globe,
  Server,
} from "lucide-react";
import { format } from 'date-fns';

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details?: string;
  ip?: string;
  userAgent?: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  sessionId?: string;
  duration?: number;
  dbChange?: {
    table: string;
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
    recordId?: string;
    changes?: Record<string, any>;
  };
}

interface UserSession {
  id: string;
  userId: string;
  user: string;
  loginTime: string;
  logoutTime?: string;
  lastActivityTime: string;
  ip?: string;
  userAgent?: string;
  isActive: boolean;
  pagesVisited: Array<{
    url: string;
    timestamp: string;
    duration?: number;
  }>;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'activities' | 'sessions'>('activities');

  // Fetch activities from API
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/activities?includeSessions=true');
      const result = await response.json();
      
      if (result.success) {
        if (result.data.logs && result.data.sessions) {
          setActivities(result.data.logs);
          setSessions(result.data.sessions);
          setFilteredActivities(result.data.logs);
        } else {
          setActivities(result.data);
          setFilteredActivities(result.data);
        }
      } else {
        console.error('Failed to fetch activities:', result.error);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Filter activities based on search term, activity type, and date
  useEffect(() => {
    if (viewMode === 'activities') {
      let result = [...activities];

      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(activity => 
          activity.user.toLowerCase().includes(term) ||
          activity.action.toLowerCase().includes(term) ||
          activity.resource.toLowerCase().includes(term) ||
          (activity.details && activity.details.toLowerCase().includes(term))
        );
      }

      // Apply activity type filter
      if (activityFilter !== 'all') {
        result = result.filter(activity => activity.action === activityFilter);
      }

      // Apply date filter
      if (dateFilter !== 'all') {
        const now = new Date();
        result = result.filter(activity => {
          const activityDate = new Date(activity.timestamp);
          switch (dateFilter) {
            case 'today':
              return activityDate.toDateString() === now.toDateString();
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return activityDate >= weekAgo;
            case 'month':
              const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              return activityDate >= monthAgo;
            default:
              return true;
          }
        });
      }

      setFilteredActivities(result);
    }
  }, [searchTerm, activityFilter, dateFilter, activities, viewMode]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <LogIn className="w-4 h-4" />;
      case 'logout': return <LogOut className="w-4 h-4" />;
      case 'failed_login': return <Key className="w-4 h-4" />;
      case 'create': return <Plus className="w-4 h-4" />;
      case 'update': return <Edit3 className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      case 'view': return <Eye className="w-4 h-4" />;
      case 'db_change': return <Database className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const exportLogs = () => {
    // Create CSV content
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP', 'Severity', 'Duration'],
      ...filteredActivities.map(activity => [
        activity.timestamp,
        activity.user,
        activity.action,
        activity.resource,
        activity.details || '',
        activity.ip || '',
        activity.severity,
        activity.duration ? formatDuration(activity.duration) : ''
      ])
    ].map(row => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto p-6">
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2">Loading activity logs...</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout sidebar={<Sidebar />} topbar={<Topbar />}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <ActivityLog className="w-6 h-6 text-blue-600" />
                    Admin Activity Log
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Track all administrative activities, database changes, and user sessions
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={viewMode === 'activities' ? 'default' : 'outline'}
                    onClick={() => setViewMode('activities')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Activities
                  </Button>
                  <Button 
                    variant={viewMode === 'sessions' ? 'default' : 'outline'}
                    onClick={() => setViewMode('sessions')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sessions
                  </Button>
                  <Button onClick={exportLogs} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                    <SelectItem value="failed_login">Failed Login</SelectItem>
                    <SelectItem value="logout">Logout</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="view">View</SelectItem>
                    <SelectItem value="db_change">DB Changes</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setActivityFilter('all');
                  setDateFilter('all');
                }}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log Table */}
          {viewMode === 'activities' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ActivityLog className="w-5 h-5 text-blue-600" />
                  Recent Activities
                </CardTitle>
                <CardDescription>
                  Showing {filteredActivities.length} of {activities.length} activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <ActivityLog className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No activities found</h3>
                    <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="w-[100px]">Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="text-sm text-gray-500">
                            {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{activity.user}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getActionIcon(activity.action)}
                              <span className="capitalize">
                                {activity.action === 'db_change' && activity.dbChange 
                                  ? `${activity.dbChange.operation} ${activity.dbChange.table}` 
                                  : activity.action.replace('_', ' ')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {activity.resource}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 max-w-xs">
                            {activity.dbChange ? (
                              <div className="space-y-1">
                                <div className="font-medium">{activity.details}</div>
                                {activity.dbChange.recordId && (
                                  <div className="text-xs">Record ID: {activity.dbChange.recordId}</div>
                                )}
                                {activity.dbChange.changes && (
                                  <div className="text-xs">
                                    Changes: {Object.keys(activity.dbChange.changes).join(', ')}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="truncate">{activity.details}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(activity.severity)}>
                              {activity.severity}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ) : (
            // Sessions View
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Active User Sessions
                </CardTitle>
                <CardDescription>
                  Showing {sessions.length} active sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No active sessions</h3>
                    <p className="text-gray-500">There are currently no active user sessions.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Login Time</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Pages Visited</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{session.user}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {format(new Date(session.loginTime), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {format(new Date(session.lastActivityTime), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>
                                {formatDuration(
                                  (new Date().getTime() - new Date(session.loginTime).getTime()) / 1000
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {session.pagesVisited.length} pages
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Globe className="w-4 h-4 text-gray-500" />
                              {session.ip || 'Unknown'}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

// Placeholder for the ActivityLog icon since it's not available in lucide-react
function ActivityLog(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M12 20c-5.523 0 -10 -2.239 -10 -5v-8c0 -2.761 4.477 -5 10 -5s10 2.239 10 5v8c0 2.761 -4.477 5 -10 5z" />
    </svg>
  );
}