'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users,
  Shield,
  Settings,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Globe,
  Building,
  Calendar,
  BarChart3,
  Upload,
  Download,
  MapPin,
  Filter,
  FileText,
  Zap,
  Search,
  Plus,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'sonner';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  permissions: string[];
  lastLogin: string;
  createdAt: string;
  avatar?: string;
}

interface AdminManagementSystemProps {
  adminId: string;
  permissions: string[];
}

export default function AdminManagementSystem({ adminId, permissions }: AdminManagementSystemProps) {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: '',
    permissions: [] as string[]
  });

  // Available permissions grouped by category
  const availablePermissions: Permission[] = [
    // Location Management
    { id: 'countries-cities', name: 'Countries & Cities', description: 'Manage countries and cities', category: 'Location Management', icon: Globe },
    { id: 'venues-locations', name: 'Venues & Locations', description: 'Manage exhibition venues', category: 'Location Management', icon: MapPin },
    { id: 'global-locations', name: 'Global Location Manager', description: 'Global exhibition database', category: 'Location Management', icon: Globe },
    { id: 'global-pages', name: 'Global Pages Manager', description: 'Manage exhibition stand pages', category: 'Location Management', icon: FileText },

    // Vendor Management
    { id: 'builder-intelligence', name: 'Builder Intelligence', description: 'AI-powered builder insights', category: 'Vendor Management', icon: Zap },
    { id: 'smart-builders', name: 'Smart Builders', description: 'Manage exhibition builders', category: 'Vendor Management', icon: Building },
    { id: 'event-planners', name: 'Event Planners', description: 'Manage event planners', category: 'Vendor Management', icon: Calendar },
    { id: 'builder-analytics', name: 'Builder Analytics', description: 'Analytics and performance metrics', category: 'Vendor Management', icon: BarChart3 },
    { id: 'claims-management', name: 'Claims & Builder Status', description: 'Manage profile claims', category: 'Vendor Management', icon: Shield },
    { id: 'pending-approvals', name: 'Pending Approvals', description: 'Review builder registrations', category: 'Vendor Management', icon: CheckCircle },

    // Exhibition Management
    { id: 'exhibitions', name: 'Exhibitions', description: 'Manage exhibitions and events', category: 'Exhibition Management', icon: Calendar },
    { id: 'event-categories', name: 'Event Categories', description: 'Organize events by categories', category: 'Exhibition Management', icon: Filter },

    // Data Tools
    { id: 'gmb-fetch', name: 'GMB Fetch Tool', description: 'Google My Business integration', category: 'Data Tools', icon: Download },
    { id: 'bulk-operations', name: 'Bulk Operations', description: 'Mass import/export operations', category: 'Data Tools', icon: Upload },
    { id: 'advanced-analytics', name: 'Advanced Analytics', description: 'Platform analytics', category: 'Data Tools', icon: BarChart3 },

    // Platform Intelligence
    { id: 'platform-intelligence', name: 'Platform Intelligence', description: 'Advanced platform analytics', category: 'Platform Intelligence', icon: Globe },
    { id: 'ai-insights', name: 'AI Insights', description: 'Machine learning insights', category: 'Platform Intelligence', icon: Zap },
    { id: 'revenue-intelligence', name: 'Revenue Intelligence', description: 'Revenue analytics', category: 'Platform Intelligence', icon: BarChart3 },
    { id: 'event-intelligence', name: 'Event Intelligence', description: 'Event tracking and forecasting', category: 'Platform Intelligence', icon: Calendar },

    // System Administration
    { id: 'settings', name: 'System Settings', description: 'Platform configuration', category: 'System Administration', icon: Settings },
    { id: 'admin-management', name: 'Admin Management', description: 'Manage admin users', category: 'System Administration', icon: Users }
  ];

  // Sample admin users data
  useEffect(() => {
    const loadAdminUsers = () => {
      const sampleAdmins: AdminUser[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@standsbay.com',
          role: 'Platform Manager',
          status: 'active',
          permissions: ['countries-cities', 'venues-locations', 'smart-builders', 'event-planners'],
          lastLogin: '2 hours ago',
          createdAt: '2024-01-15'
        },
        {
          id: '2', 
          name: 'Michael Chen',
          email: 'michael@standsbay.com',
          role: 'Data Manager',
          status: 'active',
          permissions: ['gmb-fetch', 'bulk-operations', 'builder-analytics', 'advanced-analytics'],
          lastLogin: '1 day ago',
          createdAt: '2024-02-03'
        },
        {
          id: '3',
          name: 'Emma Williams',
          email: 'emma@standsbay.com', 
          role: 'Content Manager',
          status: 'active',
          permissions: ['exhibitions', 'event-categories', 'global-pages'],
          lastLogin: '3 days ago',
          createdAt: '2024-01-28'
        },
        {
          id: '4',
          name: 'David Rodriguez',
          email: 'david@standsbay.com',
          role: 'Junior Admin',
          status: 'pending',
          permissions: ['smart-builders', 'pending-approvals'],
          lastLogin: 'Never',
          createdAt: '2024-03-10'
        }
      ];
      setAdminUsers(sampleAdmins);
    };

    loadAdminUsers();
  }, []);

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    const admin: AdminUser = {
      id: Date.now().toString(),
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      status: 'pending',
      permissions: newAdmin.permissions,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAdminUsers(prev => [...prev, admin]);
    setNewAdmin({ name: '', email: '', role: '', permissions: [] });
    setShowAddAdmin(false);
    toast.success(`Admin "${admin.name}" added successfully!`);
  };

  const handleEditAdmin = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setNewAdmin({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    });
    setShowAddAdmin(true);
  };

  const handleUpdateAdmin = () => {
    if (!editingAdmin) return;

    setAdminUsers(prev => prev.map(admin => 
      admin.id === editingAdmin.id 
        ? { ...admin, ...newAdmin }
        : admin
    ));
    
    setEditingAdmin(null);
    setNewAdmin({ name: '', email: '', role: '', permissions: [] });
    setShowAddAdmin(false);
    toast.success('Admin updated successfully!');
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    
    setAdminUsers(prev => prev.filter(admin => admin.id !== adminId));
    toast.success('Admin deleted successfully!');
  };

  const handleToggleStatus = (adminId: string) => {
    setAdminUsers(prev => prev.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: admin.status === 'active' ? 'suspended' : 'active' }
        : admin
    ));
    toast.success('Admin status updated!');
  };

  const filteredAdmins = adminUsers.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || filterRole === 'all' || admin.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const permissionsByCategory = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-red-100 text-red-800';
      case 'Platform Manager': return 'bg-blue-100 text-blue-800';
      case 'Data Manager': return 'bg-green-100 text-green-800';
      case 'Content Manager': return 'bg-purple-100 text-purple-800';
      case 'Junior Admin': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Admins</p>
                <p className="text-3xl font-bold text-blue-900">{adminUsers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active Admins</p>
                <p className="text-3xl font-bold text-green-900">
                  {adminUsers.filter(a => a.status === 'active').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-900">
                  {adminUsers.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Permission Areas</p>
                <p className="text-3xl font-bold text-purple-900">{availablePermissions.length}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Admin Management</span>
              </CardTitle>
              <CardDescription>Manage admin users and assign role-based permissions</CardDescription>
            </div>
            <Button 
              onClick={() => {
                setShowAddAdmin(true);
                setEditingAdmin(null);
                setNewAdmin({ name: '', email: '', role: '', permissions: [] });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search admins by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Platform Manager">Platform Manager</SelectItem>
                <SelectItem value="Data Manager">Data Manager</SelectItem>
                <SelectItem value="Content Manager">Content Manager</SelectItem>
                <SelectItem value="Junior Admin">Junior Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Admins Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {admin.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <Badge className={getRoleColor(admin.role)}>
                          {admin.role}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {admin.permissions.length} permission{admin.permissions.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(admin.status)}>
                        {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {admin.lastLogin}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAdmin(admin)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(admin.id)}
                        >
                          {admin.status === 'active' ? (
                            <Lock className="h-4 w-4 text-red-500" />
                          ) : (
                            <Unlock className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAdmin(admin.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Admin Modal */}
      {showAddAdmin && (
        <Card className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</span>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAddAdmin(false);
                    setEditingAdmin(null);
                  }}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Role *</Label>
                <Select 
                  value={newAdmin.role} 
                  onValueChange={(value) => setNewAdmin(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Platform Manager">Platform Manager</SelectItem>
                    <SelectItem value="Data Manager">Data Manager</SelectItem>
                    <SelectItem value="Content Manager">Content Manager</SelectItem>
                    <SelectItem value="Junior Admin">Junior Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Permissions */}
              <div>
                <Label>Permissions</Label>
                <p className="text-sm text-gray-500 mb-4">
                  Select which areas this admin can access and manage
                </p>
                
                <div className="space-y-6">
                  {Object.entries(permissionsByCategory).map(([category, perms]) => (
                    <div key={category} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {perms.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={permission.id}
                              checked={newAdmin.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewAdmin(prev => ({
                                    ...prev,
                                    permissions: [...prev.permissions, permission.id]
                                  }));
                                } else {
                                  setNewAdmin(prev => ({
                                    ...prev,
                                    permissions: prev.permissions.filter(p => p !== permission.id)
                                  }));
                                }
                              }}
                            />
                            <div className="flex-1">
                              <label 
                                htmlFor={permission.id}
                                className="text-sm font-medium text-gray-700 cursor-pointer flex items-center space-x-2"
                              >
                                <permission.icon className="h-4 w-4" />
                                <span>{permission.name}</span>
                              </label>
                              <p className="text-xs text-gray-500 mt-1">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddAdmin(false);
                    setEditingAdmin(null);
                  }}
                  className="text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingAdmin ? handleUpdateAdmin : handleAddAdmin}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editingAdmin ? 'Update Admin' : 'Add Admin'}
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      )}
    </div>
  );
}