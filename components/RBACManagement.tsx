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
  TrendingDown,
  ShoppingCart,
  Receipt,
  Wallet,
  PiggyBank,
  Coins,
  Gem,
  Scale,
  Truck,
  Ship,
  Plane,
  Train,
  Car,
  Bike,
  Fuel,
  GasStation,
  ChargingStation,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  BatteryWarning,
  BatteryCritical,
  Power,
  Zap as ZapIcon,
  LightningBolt,
  Sun as SunIcon,
  Moon as MoonIcon,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudHaze,
  CloudSun,
  CloudMoon,
  Cloudy,
  SunDim,
  SunMedium,
  SunBright,
  MoonStar,
  Stars,
  Sparkles,
  Wind,
  Tornado,
  Hurricane,
  Snowflake,
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake,
  Droplets,
  Umbrella,
  UmbrellaClosed,
  Rainbow,
  Flower,
  Leaf,
  Sprout,
  Seedling,
  TreeDeciduous,
  TreePine,
  Waves as WavesIcon,
  Anchor as AnchorIcon,
  Sailboat,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CalendarArrowUp,
  CalendarArrowDown,
  Settings2,
  Server,
  Network,
  Router,
  Cpu,
  MemoryStick,
  Database as DatabaseIcon,
  HardDrive as HardDriveIcon,
  Monitor,
  Printer,
  Camera,
  Video,
  Speaker,
  Headphones,
  Gamepad2,
  Watch,
  Battery,
  BatteryCharging,
  Wifi,
  Bluetooth,
  Signal,
  Globe as GlobeIcon,
  Link,
  Unlock,
  Lock as LockIcon,
  ShieldCheck as ShieldCheckIcon,
  ShieldAlert as ShieldAlertIcon,
  Shield as ShieldIcon,
  Key as KeyIcon,
  Eye as EyeIconHidden,
  EyeOff,
  Copy,
  Share2,
  Archive as ArchiveIcon,
  Unarchive,
  Ban as BanIcon,
  Flag as FlagIcon,
  ArchiveRestore,
  RotateCcw,
  RefreshCcw,
  UploadCloud,
  DownloadCloud,
  Cloud,
  CloudUpload,
  CloudDownload,
  HardDriveUpload,
  HardDriveDownload,
  UserRound,
  UserRoundPlus,
  UserRoundCheck,
  UserRoundX,
  UserRoundMinus,
  UserRoundCog,
  UserRoundSearch,
  UserRoundKey,
  UserRoundShield,
  UserRoundLock,
  UserRoundUnlock,
  UserRoundBan,
  UserRoundFlag,
  UserRoundArchive,
  UserRoundUnarchive,
  UserRoundSettings,
  UserRoundGear,
  UserRoundCog2,
  UserRoundCog3,
  UserRoundCog4,
  UserRoundCog5,
  UserRoundCog6,
  UserRoundCog7,
  UserRoundCog8,
  UserRoundCog9,
  UserRoundCog10,
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  usersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: Date;
}

interface UserRoleAssignment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  roleId: string;
  roleName: string;
  assignedAt: Date;
  assignedBy: string;
}

const RBACManagement = () => {
  const { theme } = useTheme();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRoles, setUserRoles] = useState<UserRoleAssignment[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [filteredUserRoles, setFilteredUserRoles] = useState<UserRoleAssignment[]>([]);
  const [activeTab, setActiveTab] = useState('roles');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUserRole, setSelectedUserRole] = useState<UserRoleAssignment | null>(null);
  const [newRole, setNewRole] = useState<Omit<Role, 'id' | 'usersCount' | 'createdAt' | 'updatedAt'>>({ 
    name: '', 
    description: '', 
    permissions: [] 
  });
  const [newPermission, setNewPermission] = useState<Omit<Permission, 'id' | 'createdAt'>>({ 
    name: '', 
    description: '', 
    category: '' 
  });
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isCreatingPermission, setIsCreatingPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockRoles: Role[] = [
      {
        id: 'role_1',
        name: 'Super Admin',
        description: 'Full platform access with all privileges',
        permissions: ['admin:all', 'billing:manage', 'users:manage', 'settings:manage'],
        usersCount: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        updatedAt: new Date()
      },
      {
        id: 'role_2',
        name: 'Platform Admin',
        description: 'Manage platform operations and settings',
        permissions: ['users:manage', 'settings:manage', 'reports:view'],
        usersCount: 12,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
        updatedAt: new Date()
      },
      {
        id: 'role_3',
        name: 'Billing Admin',
        description: 'Manage billing and financial settings',
        permissions: ['billing:manage', 'invoices:view', 'subscriptions:manage'],
        usersCount: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
        updatedAt: new Date()
      },
      {
        id: 'role_4',
        name: 'Builder Admin',
        description: 'Manage builder accounts and settings',
        permissions: ['builders:manage', 'users:manage', 'projects:manage'],
        usersCount: 8,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
        updatedAt: new Date()
      },
      {
        id: 'role_5',
        name: 'Support Agent',
        description: 'Handle customer support and assistance',
        permissions: ['tickets:view', 'users:read', 'leads:read'],
        usersCount: 15,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        updatedAt: new Date()
      }
    ];

    const mockPermissions: Permission[] = [
      {
        id: 'perm_1',
        name: 'admin:all',
        description: 'Full administrative access to all resources',
        category: 'Administration',
        createdAt: new Date()
      },
      {
        id: 'perm_2',
        name: 'users:manage',
        description: 'Create, update, delete users',
        category: 'User Management',
        createdAt: new Date()
      },
      {
        id: 'perm_3',
        name: 'users:read',
        description: 'Read user information',
        category: 'User Management',
        createdAt: new Date()
      },
      {
        id: 'perm_4',
        name: 'billing:manage',
        description: 'Manage billing and payment settings',
        category: 'Billing',
        createdAt: new Date()
      },
      {
        id: 'perm_5',
        name: 'settings:manage',
        description: 'Manage system settings',
        category: 'System',
        createdAt: new Date()
      },
      {
        id: 'perm_6',
        name: 'reports:view',
        description: 'View system reports and analytics',
        category: 'Analytics',
        createdAt: new Date()
      },
      {
        id: 'perm_7',
        name: 'builders:manage',
        description: 'Manage builder accounts',
        category: 'Builder Management',
        createdAt: new Date()
      },
      {
        id: 'perm_8',
        name: 'projects:manage',
        description: 'Manage projects and deployments',
        category: 'Project Management',
        createdAt: new Date()
      },
      {
        id: 'perm_9',
        name: 'leads:read',
        description: 'Read lead information',
        category: 'Lead Management',
        createdAt: new Date()
      },
      {
        id: 'perm_10',
        name: 'invoices:view',
        description: 'View invoices and billing history',
        category: 'Billing',
        createdAt: new Date()
      }
    ];

    const mockUserRoles: UserRoleAssignment[] = [
      {
        id: 'ur_1',
        userId: 'user_1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        roleId: 'role_1',
        roleName: 'Super Admin',
        assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        assignedBy: 'System'
      },
      {
        id: 'ur_2',
        userId: 'user_2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        roleId: 'role_1',
        roleName: 'Super Admin',
        assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
        assignedBy: 'System'
      },
      {
        id: 'ur_3',
        userId: 'user_3',
        userName: 'Mike Johnson',
        userEmail: 'mike@example.com',
        roleId: 'role_2',
        roleName: 'Platform Admin',
        assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
        assignedBy: 'John Doe'
      },
      {
        id: 'ur_4',
        userId: 'user_4',
        userName: 'Sarah Williams',
        userEmail: 'sarah@example.com',
        roleId: 'role_3',
        roleName: 'Billing Admin',
        assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
        assignedBy: 'Jane Smith'
      },
      {
        id: 'ur_5',
        userId: 'user_5',
        userName: 'David Brown',
        userEmail: 'david@example.com',
        roleId: 'role_4',
        roleName: 'Builder Admin',
        assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        assignedBy: 'Mike Johnson'
      }
    ];

    setRoles(mockRoles);
    setPermissions(mockPermissions);
    setUserRoles(mockUserRoles);
    setFilteredRoles(mockRoles);
    setFilteredUserRoles(mockUserRoles);
    setLoading(false);
  }, []);

  // Apply search filter
  useEffect(() => {
    if (activeTab === 'roles') {
      const term = searchTerm.toLowerCase();
      const filtered = roles.filter(role => 
        role.name.toLowerCase().includes(term) ||
        role.description.toLowerCase().includes(term) ||
        role.permissions.some(perm => perm.toLowerCase().includes(term))
      );
      setFilteredRoles(filtered);
    } else if (activeTab === 'user-roles') {
      const term = searchTerm.toLowerCase();
      const filtered = userRoles.filter(assignment => 
        assignment.userName.toLowerCase().includes(term) ||
        assignment.userEmail.toLowerCase().includes(term) ||
        assignment.roleName.toLowerCase().includes(term)
      );
      setFilteredUserRoles(filtered);
    }
  }, [searchTerm, roles, userRoles, activeTab]);

  const handleCreateRole = () => {
    if (!newRole.name || !newRole.description) return;
    
    const role: Role = {
      id: `role_${roles.length + 1}`,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      usersCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setRoles([...roles, role]);
    setFilteredRoles([...roles, role]);
    setNewRole({ name: '', description: '', permissions: [] });
    setIsCreatingRole(false);
  };

  const handleCreatePermission = () => {
    if (!newPermission.name || !newPermission.description || !newPermission.category) return;
    
    const permission: Permission = {
      id: `perm_${permissions.length + 1}`,
      name: newPermission.name,
      description: newPermission.description,
      category: newPermission.category,
      createdAt: new Date()
    };
    
    setPermissions([...permissions, permission]);
    setNewPermission({ name: '', description: '', category: '' });
    setIsCreatingPermission(false);
  };

  const handleAssignRole = (userId: string, roleId: string) => {
    // In a real implementation, this would assign a role to a user
    console.log(`Assigning role ${roleId} to user ${userId}`);
  };

  const handleRemoveRole = (assignmentId: string) => {
    // In a real implementation, this would remove a role assignment
    console.log(`Removing role assignment ${assignmentId}`);
  };

  const handleDeleteRole = (roleId: string) => {
    // In a real implementation, this would delete a role
    console.log(`Deleting role ${roleId}`);
  };

  const handleDeletePermission = (permissionId: string) => {
    // In a real implementation, this would delete a permission
    console.log(`Deleting permission ${permissionId}`);
  };

  const permissionCategories = [
    'Administration',
    'User Management',
    'Billing',
    'System',
    'Analytics',
    'Builder Management',
    'Project Management',
    'Lead Management'
  ];

  const allPermissionNames = permissions.map(p => p.name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role-Based Access Control</h1>
          <p className="text-muted-foreground mt-1">
            Manage roles, permissions, and user assignments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">Role definitions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
            <p className="text-xs text-muted-foreground">Permission definitions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <UserRoundCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRoles.length}</div>
            <p className="text-xs text-muted-foreground">User-role assignments</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="user-roles">User Assignments</TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Role Management</CardTitle>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search roles..."
                      className="pl-8 w-full sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Dialog open={isCreatingRole} onOpenChange={setIsCreatingRole}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Role</DialogTitle>
                        <DialogDescription>
                          Define a new role with specific permissions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="role-name" className="block text-sm font-medium mb-1">
                            Role Name
                          </label>
                          <Input
                            id="role-name"
                            value={newRole.name}
                            onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                            placeholder="e.g., Content Manager"
                          />
                        </div>
                        <div>
                          <label htmlFor="role-description" className="block text-sm font-medium mb-1">
                            Description
                          </label>
                          <Textarea
                            id="role-description"
                            value={newRole.description}
                            onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                            placeholder="Describe what this role can do..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Permissions
                          </label>
                          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                            {permissions.map(permission => (
                              <div key={permission.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`perm-${permission.id}`}
                                  checked={newRole.permissions.includes(permission.name)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNewRole({
                                        ...newRole,
                                        permissions: [...newRole.permissions, permission.name]
                                      });
                                    } else {
                                      setNewRole({
                                        ...newRole,
                                        permissions: newRole.permissions.filter(p => p !== permission.name)
                                      });
                                    }
                                  }}
                                  className="h-4 w-4 mr-2"
                                />
                                <label htmlFor={`perm-${permission.id}`} className="text-sm">
                                  {permission.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setIsCreatingRole(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateRole}>
                            Create Role
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                        <TableHead>Role</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                              {role.name}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {role.description}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.slice(0, 3).map((perm, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                              {role.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{role.permissions.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{role.usersCount}</Badge>
                          </TableCell>
                          <TableCell>
                            {role.createdAt.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedRole(role)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => handleDeleteRole(role.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Role
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
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Permission Management</CardTitle>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search permissions..."
                      className="pl-8 w-full sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Dialog open={isCreatingPermission} onOpenChange={setIsCreatingPermission}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Permission
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create New Permission</DialogTitle>
                        <DialogDescription>
                          Define a new permission for the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="perm-name" className="block text-sm font-medium mb-1">
                            Permission Name
                          </label>
                          <Input
                            id="perm-name"
                            value={newPermission.name}
                            onChange={(e) => setNewPermission({...newPermission, name: e.target.value})}
                            placeholder="e.g., users:manage"
                          />
                        </div>
                        <div>
                          <label htmlFor="perm-description" className="block text-sm font-medium mb-1">
                            Description
                          </label>
                          <Textarea
                            id="perm-description"
                            value={newPermission.description}
                            onChange={(e) => setNewPermission({...newPermission, description: e.target.value})}
                            placeholder="Describe what this permission allows..."
                            rows={2}
                          />
                        </div>
                        <div>
                          <label htmlFor="perm-category" className="block text-sm font-medium mb-1">
                            Category
                          </label>
                          <Select 
                            value={newPermission.category} 
                            onValueChange={(value) => setNewPermission({...newPermission, category: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {permissionCategories.map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setIsCreatingPermission(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreatePermission}>
                            Create Permission
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                        <TableHead>Permission</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell className="font-mono">
                            <div className="flex items-center">
                              <Key className="mr-2 h-4 w-4 text-muted-foreground" />
                              {permission.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{permission.description}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{permission.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {permission.createdAt.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Permission
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => handleDeletePermission(permission.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
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
        </TabsContent>

        {/* User Assignments Tab */}
        <TabsContent value="user-roles">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>User-Role Assignments</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assignments..."
                    className="pl-8 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Assigned By</TableHead>
                        <TableHead>Assigned At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUserRoles.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={`/avatars/${assignment.userId}.jpg`} alt={assignment.userName} />
                                <AvatarFallback>{assignment.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{assignment.userName}</p>
                                <p className="text-sm text-muted-foreground">{assignment.userEmail}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{assignment.roleName}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4 text-muted-foreground" />
                              {assignment.assignedBy}
                            </div>
                          </TableCell>
                          <TableCell>
                            {assignment.assignedAt.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedUserRole(assignment)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <UserRoundMinus className="mr-2 h-4 w-4" />
                                  Remove Assignment
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
        </TabsContent>
      </Tabs>

      {/* Role Details Modal */}
      {selectedRole && (
        <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Role Details: {selectedRole.name}</DialogTitle>
              <DialogDescription>
                Detailed information about this role and its permissions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Role Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedRole.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Users Assigned</p>
                    <p className="font-medium">{selectedRole.usersCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{selectedRole.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{selectedRole.updatedAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-sm">{selectedRole.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Permissions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRole.permissions.map((perm, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* User Role Assignment Modal */}
      {selectedUserRole && (
        <Dialog open={!!selectedUserRole} onOpenChange={() => setSelectedUserRole(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assignment Details</DialogTitle>
              <DialogDescription>
                Information about this user-role assignment
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={`/avatars/${selectedUserRole.userId}.jpg`} alt={selectedUserRole.userName} />
                  <AvatarFallback>{selectedUserRole.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUserRole.userName}</p>
                  <p className="text-sm text-muted-foreground">{selectedUserRole.userEmail}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{selectedUserRole.roleName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned By</p>
                  <p className="font-medium">{selectedUserRole.assignedBy}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Assigned At</p>
                <p className="font-medium">{selectedUserRole.assignedAt.toLocaleString()}</p>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" className="flex-1">
                  <UserRoundMinus className="mr-2 h-4 w-4" />
                  Remove Assignment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RBACManagement;