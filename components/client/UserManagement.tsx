'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { Badge } from '@/components/shared/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/tabs';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield, 
  CheckCircle, 
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Eye,
  UserPlus,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  Building,
  User,
  Crown,
  Zap,
  Clock
} from 'lucide-react';

interface UserManagementProps {
  adminId: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'builder' | 'admin';
  status: 'active' | 'pending' | 'suspended' | 'banned';
  verified: boolean;
  createdAt: string;
  lastActive?: string;
  subscriptionPlan?: string;
  totalSpent?: number;
  quotesSubmitted?: number;
  quotesReceived?: number;
  averageRating?: number;
  location: {
    country: string;
    city: string;
  };
  businessName?: string;
  avatar?: string;
}

export default function UserManagement({ adminId }: UserManagementProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock user data - In production, this would come from API calls
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const mockUsers: UserData[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@techcorp.com',
          phone: '+1 555 0123',
          role: 'client',
          status: 'active',
          verified: true,
          createdAt: '2024-12-15',
          lastActive: '2024-12-19',
          quotesSubmitted: 8,
          totalSpent: 45000,
          location: { country: 'United States', city: 'San Francisco' },
          avatar: '/images/users/sarah.jpg'
        },
        {
          id: '2',
          name: 'Klaus Mueller',
          email: 'klaus@expodesign.de',
          phone: '+49 30 123456',
          role: 'builder',
          status: 'active',
          verified: true,
          createdAt: '2024-11-20',
          lastActive: '2024-12-19',
          subscriptionPlan: 'professional',
          quotesReceived: 45,
          averageRating: 4.8,
          location: { country: 'Germany', city: 'Berlin' },
          businessName: 'Expo Design Germany'
        },
        {
          id: '3',
          name: 'Maria Rodriguez',
          email: 'maria@standspain.es',
          phone: '+34 91 234567',
          role: 'builder',
          status: 'pending',
          verified: false,
          createdAt: '2024-12-18',
          lastActive: '2024-12-18',
          quotesReceived: 0,
          location: { country: 'Spain', city: 'Madrid' },
          businessName: 'Premium Stands Spain'
        },
        {
          id: '4',
          name: 'Ahmed Hassan',
          email: 'ahmed@dubaiexpo.ae',
          phone: '+971 4 123456',
          role: 'builder',
          status: 'active',
          verified: true,
          createdAt: '2024-10-05',
          lastActive: '2024-12-17',
          subscriptionPlan: 'enterprise',
          quotesReceived: 67,
          averageRating: 4.9,
          location: { country: 'UAE', city: 'Dubai' },
          businessName: 'Dubai Exhibition Solutions'
        },
        {
          id: '5',
          name: 'John Smith',
          email: 'john@innovation.com',
          role: 'client',
          status: 'active',
          verified: true,
          createdAt: '2024-12-10',
          lastActive: '2024-12-18',
          quotesSubmitted: 3,
          totalSpent: 12000,
          location: { country: 'United Kingdom', city: 'London' }
        },
        {
          id: '6',
          name: 'Lisa Chen',
          email: 'lisa@asiastands.com',
          role: 'builder',
          status: 'suspended',
          verified: true,
          createdAt: '2024-09-15',
          lastActive: '2024-12-10',
          subscriptionPlan: 'professional',
          quotesReceived: 23,
          averageRating: 3.2,
          location: { country: 'Singapore', city: 'Singapore' },
          businessName: 'Asia Exhibition Stands'
        }
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    };

    loadUsers();
  }, []);

  const handleUserAction = async (userId: string, action: 'approve' | 'suspend' | 'ban' | 'delete' | 'verify') => {
    console.log(`Admin ${adminId} performing action ${action} on user ${userId}`);
    
    // Update user status in the local state
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'approve':
            return { ...user, status: 'active' as const };
          case 'suspend':
            return { ...user, status: 'suspended' as const };
          case 'ban':
            return { ...user, status: 'banned' as const };
          case 'verify':
            return { ...user, verified: true };
          default:
            return user;
        }
      }
      return user;
    }));
    
    // In production, this would be an API call
    alert(`User ${action} action completed successfully`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.businessName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'builders' && user.role === 'builder') ||
      (activeTab === 'clients' && user.role === 'client') ||
      (activeTab === 'pending' && user.status === 'pending') ||
      (activeTab === 'suspended' && (user.status === 'suspended' || user.status === 'banned'));
    
    return matchesSearch && matchesTab;
  });

  const getUserStats = () => {
    const total = users.length;
    const builders = users.filter(u => u.role === 'builder').length;
    const clients = users.filter(u => u.role === 'client').length;
    const pending = users.filter(u => u.status === 'pending').length;
    const suspended = users.filter(u => u.status === 'suspended' || u.status === 'banned').length;
    
    return { total, builders, clients, pending, suspended };
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage platform users, builders, and administrators</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Builders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.builders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.clients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Suspended</p>
                <p className="text-2xl font-bold text-gray-900">{stats.suspended}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* User Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Users ({stats.total})</TabsTrigger>
          <TabsTrigger value="builders">Builders ({stats.builders})</TabsTrigger>
          <TabsTrigger value="clients">Clients ({stats.clients})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="suspended">Suspended ({stats.suspended})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        <input 
                          type="checkbox" 
                          className="rounded"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(filteredUsers.map(u => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Activity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Performance</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <input 
                            type="checkbox" 
                            className="rounded"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(prev => [...prev, user.id]);
                              } else {
                                setSelectedUsers(prev => prev.filter(id => id !== user.id));
                              }
                            }}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-gray-900">{user.name}</p>
                                {user.verified && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              {user.businessName && (
                                <p className="text-xs text-blue-600">{user.businessName}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline"
                              className={
                                user.role === 'builder' ? 'border-blue-200 text-blue-800' :
                                user.role === 'client' ? 'border-green-200 text-green-800' :
                                'border-purple-200 text-purple-800'
                              }
                            >
                              {user.role === 'builder' ? <Building className="h-3 w-3 mr-1" /> :
                               user.role === 'client' ? <User className="h-3 w-3 mr-1" /> :
                               <Crown className="h-3 w-3 mr-1" />}
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                            {user.subscriptionPlan && (
                              <Badge 
                                className={
                                  user.subscriptionPlan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                                  user.subscriptionPlan === 'professional' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {user.subscriptionPlan === 'enterprise' && <Crown className="h-3 w-3 mr-1" />}
                                {user.subscriptionPlan === 'professional' && <Zap className="h-3 w-3 mr-1" />}
                                {user.subscriptionPlan.charAt(0).toUpperCase() + user.subscriptionPlan.slice(1)}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            className={
                              user.status === 'active' ? 'bg-green-100 text-green-800' :
                              user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{user.location.city}, {user.location.country}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="text-gray-900">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                            {user.lastActive && (
                              <p className="text-gray-500">
                                Last active {new Date(user.lastActive).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            {user.role === 'builder' ? (
                              <>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-400" />
                                  <span>{user.averageRating || 'N/A'}</span>
                                </div>
                                <p className="text-gray-500">{user.quotesReceived || 0} quotes</p>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-3 w-3 text-green-500" />
                                  <span>${user.totalSpent?.toLocaleString() || '0'}</span>
                                </div>
                                <p className="text-gray-500">{user.quotesSubmitted || 0} quotes</p>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            {/* Action buttons based on status */}
                            {user.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleUserAction(user.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                            )}
                            
                            {user.status === 'active' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Suspend
                              </Button>
                            )}
                            
                            {user.status === 'suspended' && (
                              <Button 
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Reactivate
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg border p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
            </span>
            <Button variant="outline" size="sm">
              Approve All
            </Button>
            <Button variant="outline" size="sm">
              Suspend All
            </Button>
            <Button variant="outline" size="sm">
              Export Selected
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedUsers([])}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}