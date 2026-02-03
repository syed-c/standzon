"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from '@/components/ThemeProvider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Star,
  Globe,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  UserPlus,
  Activity,
  FileText,
  CreditCard,
  Settings,
  Shield,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Zap,
  Trash2,
  Upload,
  Edit,
  Plus,
  Save,
  ExternalLink,
  Database,
  HardDrive,
  UserCheck,
  Mail,
  Target,
  CheckSquare,
  User,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  EyeIcon,
  Pencil,
  Archive,
  Ban,
  Check,
  X,
  Flag,
  Package,
  Key,
  Lock,
  Verified,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Info,
  Play,
  Pause,
  Square,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  GitDiff,
  Code,
  Terminal,
  Command,
  PlayCircle,
  Stop,
  SkipBack,
  SkipForward,
  RotateCw,
  RefreshCw as RefreshCwIcon,
} from "lucide-react";

interface Deployment {
  id: string;
  projectId: string;
  projectName: string;
  builderName: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  commitHash: string;
  branch: string;
  environment: string;
  logs: string[];
  rollbackAvailable: boolean;
  domain: string;
  size: string;
  triggeredBy: string;
  triggerType: 'manual' | 'webhook' | 'schedule';
}

const DeploymentsPanel = () => {
  const { theme } = useTheme();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [filteredDeployments, setFilteredDeployments] = useState<Deployment[]>([]);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data for deployments
  useEffect(() => {
    const mockDeployments: Deployment[] = [
      {
        id: 'dep_1',
        projectId: 'proj_1',
        projectName: 'Acme Corp Website',
        builderName: 'Acme Corporation',
        status: 'succeeded',
        startTime: new Date(Date.now() - 1000 * 60 * 5),
        endTime: new Date(Date.now() - 1000 * 60 * 2),
        duration: 180,
        commitHash: 'a1b2c3d',
        branch: 'main',
        environment: 'production',
        logs: [
          'Starting deployment...',
          'Building assets...',
          'Optimizing images...',
          'Deploying to CDN...',
          'Deployment successful'
        ],
        rollbackAvailable: true,
        domain: 'acme.example.com',
        size: '2.4 MB',
        triggeredBy: 'John Doe',
        triggerType: 'manual'
      },
      {
        id: 'dep_2',
        projectId: 'proj_2',
        projectName: 'Beta Startup Landing',
        builderName: 'Beta Startup',
        status: 'failed',
        startTime: new Date(Date.now() - 1000 * 60 * 15),
        endTime: new Date(Date.now() - 1000 * 60 * 10),
        duration: 300,
        commitHash: 'e5f6g7h',
        branch: 'develop',
        environment: 'staging',
        logs: [
          'Starting deployment...',
          'Building assets...',
          'Error: Asset optimization failed',
          'Deployment failed'
        ],
        rollbackAvailable: true,
        domain: 'beta-staging.example.com',
        size: '1.8 MB',
        triggeredBy: 'Jane Smith',
        triggerType: 'webhook'
      },
      {
        id: 'dep_3',
        projectId: 'proj_3',
        projectName: 'Enterprise Portal',
        builderName: 'Enterprise Inc',
        status: 'running',
        startTime: new Date(Date.now() - 1000 * 60 * 3),
        duration: 120,
        commitHash: 'i9j0k1l',
        branch: 'feature/new-dashboard',
        environment: 'production',
        logs: [
          'Starting deployment...',
          'Building assets...',
          'Optimizing images...'
        ],
        rollbackAvailable: false,
        domain: 'enterprise.example.com',
        size: '3.1 MB',
        triggeredBy: 'Mike Johnson',
        triggerType: 'schedule'
      },
      {
        id: 'dep_4',
        projectId: 'proj_4',
        projectName: 'Demo Site',
        builderName: 'Demo Builder',
        status: 'queued',
        startTime: new Date(Date.now() + 1000 * 60 * 2),
        commitHash: 'm3n4o5p',
        branch: 'main',
        environment: 'production',
        logs: [],
        rollbackAvailable: true,
        domain: 'demo.example.com',
        size: '1.2 MB',
        triggeredBy: 'Sarah Williams',
        triggerType: 'manual'
      }
    ];
    
    setDeployments(mockDeployments);
    setFilteredDeployments(mockDeployments);
    setLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...deployments];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(deployment => deployment.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(deployment => 
        deployment.projectName.toLowerCase().includes(term) ||
        deployment.builderName.toLowerCase().includes(term) ||
        deployment.commitHash.includes(term) ||
        deployment.domain.toLowerCase().includes(term)
      );
    }
    
    setFilteredDeployments(result);
  }, [statusFilter, searchTerm, deployments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued':
        return 'bg-gray-500';
      case 'running':
        return 'bg-blue-500';
      case 'succeeded':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'queued':
        return 'Queued';
      case 'running':
        return 'Running';
      case 'succeeded':
        return 'Success';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  const handleViewDetails = (deployment: Deployment) => {
    setSelectedDeployment(deployment);
  };

  const handleRollback = (deployment: Deployment) => {
    console.log(`Rolling back deployment ${deployment.id}`);
    // Implementation for rollback would go here
  };

  const deploymentStats = {
    total: deployments.length,
    succeeded: deployments.filter(d => d.status === 'succeeded').length,
    failed: deployments.filter(d => d.status === 'failed').length,
    running: deployments.filter(d => d.status === 'running').length,
    queued: deployments.filter(d => d.status === 'queued').length,
  };

  const deploymentHistoryData = [
    { day: 'Mon', deployments: 12 },
    { day: 'Tue', deployments: 19 },
    { day: 'Wed', deployments: 8 },
    { day: 'Thu', deployments: 15 },
    { day: 'Fri', deployments: 22 },
    { day: 'Sat', deployments: 11 },
    { day: 'Sun', deployments: 17 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deployments Panel</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage all platform deployments in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Deployment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deployments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deploymentStats.total}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deploymentStats.succeeded}</div>
            <p className="text-xs text-muted-foreground">94.2% success rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deploymentStats.failed}</div>
            <p className="text-xs text-muted-foreground">5.8% failure rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deploymentStats.running + deploymentStats.queued}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Deployment History (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deploymentHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="deployments" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Deployment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Success', value: deploymentStats.succeeded },
                    { name: 'Failed', value: deploymentStats.failed },
                    { name: 'Running', value: deploymentStats.running },
                    { name: 'Queued', value: deploymentStats.queued },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {[
                    { name: 'Success', value: deploymentStats.succeeded, color: '#10B981' },
                    { name: 'Failed', value: deploymentStats.failed, color: '#EF4444' },
                    { name: 'Running', value: deploymentStats.running, color: '#3B82F6' },
                    { name: 'Queued', value: deploymentStats.queued, color: '#6B7280' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Controls and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Deployment Queue</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deployments..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="succeeded">Succeeded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Builder</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Triggered By</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeployments.map((deployment) => (
                    <TableRow key={deployment.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <GitBranch className="mr-2 h-4 w-4 text-muted-foreground" />
                          {deployment.projectName}
                        </div>
                      </TableCell>
                      <TableCell>{deployment.builderName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {deployment.domain}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(deployment.status)} text-white`}>
                          {getStatusText(deployment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {deployment.duration ? `${deployment.duration}s` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src="/placeholder-user.jpg" alt={deployment.triggeredBy} />
                            <AvatarFallback>{deployment.triggeredBy.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {deployment.triggeredBy}
                        </div>
                      </TableCell>
                      <TableCell>
                        {deployment.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(deployment)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {deployment.rollbackAvailable && (
                              <DropdownMenuItem onClick={() => handleRollback(deployment)}>
                                <RotateCw className="mr-2 h-4 w-4" />
                                Rollback
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download Logs
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deployment Details Modal */}
      {selectedDeployment && (
        <Dialog open={!!selectedDeployment} onOpenChange={() => setSelectedDeployment(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Deployment Details</DialogTitle>
              <DialogDescription>
                Detailed information about the deployment process
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Deployment Information</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project:</span>
                    <span>{selectedDeployment.projectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Builder:</span>
                    <span>{selectedDeployment.builderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domain:</span>
                    <span className="text-blue-500">{selectedDeployment.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment:</span>
                    <span>{selectedDeployment.environment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Branch:</span>
                    <span>{selectedDeployment.branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commit:</span>
                    <span className="font-mono">{selectedDeployment.commitHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{selectedDeployment.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trigger Type:</span>
                    <span>{selectedDeployment.triggerType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Triggered By:</span>
                    <span>{selectedDeployment.triggeredBy}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Status</h4>
                  <Badge className={`${getStatusColor(selectedDeployment.status)} text-white`}>
                    {getStatusText(selectedDeployment.status)}
                  </Badge>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm">Started: {selectedDeployment.startTime.toLocaleString()}</span>
                    </div>
                    {selectedDeployment.endTime && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm">Completed: {selectedDeployment.endTime.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedDeployment.duration && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        <span className="text-sm">Duration: {selectedDeployment.duration} seconds</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Deployment Logs</h3>
                
                <div className="border rounded-md p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-auto max-h-60">
                  {selectedDeployment.logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      [{new Date().toLocaleTimeString()}] {log}
                    </div>
                  ))}
                  {selectedDeployment.logs.length === 0 && (
                    <div>No logs available yet...</div>
                  )}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Actions</h4>
                  <div className="flex gap-2">
                    <Button disabled={!selectedDeployment.rollbackAvailable}>
                      <RotateCw className="mr-2 h-4 w-4" />
                      Rollback to Previous
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Live Site
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Progress</h4>
                  <Progress value={selectedDeployment.status === 'running' ? 65 : selectedDeployment.status === 'succeeded' ? 100 : selectedDeployment.status === 'failed' ? 30 : 10} className="w-full" />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DeploymentsPanel;