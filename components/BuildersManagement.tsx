"use client";

import React, { useState, useEffect } from "react";
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

interface Builder {
  id: string;
  company_name: string;
  slug: string;
  logo: string | null;
  primary_email: string;
  phone: string;
  website: string | null;
  contact_person: string;
  position: string | null;
  headquarters_city: string;
  headquarters_country: string;
  headquarters_country_code: string;
  headquarters_address: string;
  established_year: number | null;
  team_size: string | null;
  projects_completed: number | null;
  rating: number | null;
  review_count: number;
  response_time: string | null;
  languages: string | null;
  verified: boolean;
  premium_member: boolean;
  claimed: boolean;
  claim_status: string;
  claimed_at: string | null;
  claimed_by: string | null;
  company_description: string | null;
  business_license: string | null;
  average_project: string | null;
  currency: string | null;
  gmb_imported: boolean;
  imported_from_gmb: boolean;
  gmb_place_id: string | null;
  source: string | null;
  imported_at: string | null;
  last_updated: string | null;
  created_at: string;
  updated_at: string;
}

interface BuildersManagementProps {
  adminId: string;
  permissions: string[];
}

export default function BuildersManagement({
  adminId,
  permissions,
}: BuildersManagementProps) {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [selectedBuilder, setSelectedBuilder] = useState<Builder | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchBuilders = async () => {
    try {
      const res = await fetch('/api/admin/builders');
      const data = await res.json();
      
      if (data.success && data.data.builders) {
        setBuilders(data.data.builders);
      }
    } catch (err) {
      console.error('Error fetching builders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBuilders();
  }, []);

  // Filter builders based on search and filters
  const filteredBuilders = builders.filter(builder => {
    const matchesSearch = 
      (builder.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      builder.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      builder.primary_email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || builder.claim_status === statusFilter;
    const matchesPlan = planFilter === "all" || (builder.premium_member ? planFilter === 'PREMIUM' || planFilter === 'ENTERPRISE' || planFilter === 'PROFESSIONAL' : planFilter === 'FREE');
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Stats calculations
  const totalBuilders = builders.length;
  const verifiedBuilders = builders.filter(b => b.verified).length;
  const premiumBuilders = builders.filter(b => b.premium_member).length;
  const avgRating = builders.length > 0 
    ? (builders.reduce((sum, b) => sum + (b.rating || 0), 0) / builders.length).toFixed(1) 
    : '0.0';

  // Pagination
  const totalPages = Math.ceil(filteredBuilders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBuilders = filteredBuilders.slice(startIndex, startIndex + itemsPerPage);

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'suspended':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">Suspended</Badge>;
      case 'verified':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">Verified</Badge>;
      case 'unverified':
        return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30">Unverified</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Plan badge component
  const getPlanBadge = (isPremium: boolean) => {
    if (isPremium) {
      return <Badge variant="secondary" className="bg-purple-500/20 text-purple-600 border-purple-500/30">Premium</Badge>;
    }
    return <Badge variant="secondary" className="bg-slate-200 text-slate-600 border-slate-300">Free</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading builders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Builders Management</h1>
          <p className="text-slate-500">Manage platform builders and their accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <span className="material-symbols-outlined mr-2">download</span>
            Export
          </Button>
          <Button className="bg-[#1e3886] hover:bg-[#1e3886]/90">
            <span className="material-symbols-outlined mr-2">add_business</span>
            Add Builder
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">search</span>
                <Input
                  placeholder="Search builders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] border-slate-300">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-[180px] border-slate-300">
                  <SelectValue placeholder="Filter by plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Builders', value: totalBuilders, icon: 'groups', color: 'bg-blue-100 text-blue-600' },
          { title: 'Verified', value: verifiedBuilders, icon: 'verified', color: 'bg-green-100 text-green-600' },
          { title: 'Premium Members', value: premiumBuilders, icon: 'workspace_premium', color: 'bg-purple-100 text-purple-600' },
          { title: 'Avg. Rating', value: avgRating, icon: 'star', color: 'bg-amber-100 text-amber-600' },
        ].map((stat, index) => (
          <Card 
            key={index} 
            className="border-slate-200 hover:shadow-lg transition-shadow"
          >
            <CardHeader className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Builders Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Builder Directory</CardTitle>
          <CardDescription className="text-slate-500">
            {filteredBuilders.length} builders found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-600">Company</TableHead>
                  <TableHead className="text-slate-600">Location</TableHead>
                  <TableHead className="text-slate-600">Status</TableHead>
                  <TableHead className="text-slate-600">Plan</TableHead>
                  <TableHead className="text-slate-600">Rating</TableHead>
                  <TableHead className="text-slate-600">Joined</TableHead>
                  <TableHead className="text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBuilders.map((builder) => (
                  <TableRow key={builder.id} className="border-slate-100 hover:bg-slate-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {builder.logo ? (
                            <AvatarImage src={builder.logo} alt={builder.company_name} />
                          ) : (
                            <AvatarFallback className="bg-[#1e3886]/10 text-[#1e3886]">
                              {builder.company_name?.charAt(0) || 'B'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900">{builder.company_name || 'N/A'}</div>
                          <div className="text-slate-500 text-xs">
                            {builder.primary_email && !builder.primary_email.includes('no-email+') 
                              ? builder.primary_email 
                              : 'No email'}
                            {builder.phone ? ` • ${builder.phone}` : ' • No number'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{builder.headquarters_city ? `${builder.headquarters_city}, ` : ''}{builder.headquarters_country || ''}</TableCell>
                    <TableCell>
                      {getStatusBadge(builder.claim_status)}
                    </TableCell>
                    <TableCell>
                      {getPlanBadge(builder.premium_member)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="material-symbols-outlined text-sm">star</span>
                        <span className="text-slate-900">{builder.rating || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {builder.created_at ? new Date(builder.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                            <span className="material-symbols-outlined">more_vert</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem 
                            onClick={() => setSelectedBuilder(builder)}
                            className="cursor-pointer"
                          >
                            <span className="material-symbols-outlined mr-2">visibility</span>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <span className="material-symbols-outlined mr-2">edit</span>
                            Edit Builder
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <span className="material-symbols-outlined mr-2">email</span>
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-red-600">
                            <span className="material-symbols-outlined mr-2">block</span>
                            Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-slate-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBuilders.length)} of {filteredBuilders.length} builders
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={
                        currentPage === pageNum 
                          ? "bg-[#1e3886] border-[#1e3886] text-white" 
                          : "border-slate-300 text-slate-600 hover:bg-slate-50"
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Builder Detail Modal */}
      {selectedBuilder && (
        <Dialog open={!!selectedBuilder} onOpenChange={() => setSelectedBuilder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-900">Builder Details</DialogTitle>
              <DialogDescription className="text-slate-500">
                Comprehensive view of {selectedBuilder.company_name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedBuilder && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                  <TabsTrigger value="overview" className="text-slate-600 data-[state=active]:bg-[#1e3886]">Overview</TabsTrigger>
                  <TabsTrigger value="activity" className="text-slate-600 data-[state=active]:bg-[#1e3886]">Activity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-slate-900">Company Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Company Name</span>
                          <span className="text-slate-900 font-medium">{selectedBuilder.company_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Slug</span>
                          <span className="text-slate-900 font-medium text-sm">{selectedBuilder.slug || 'N/A'}</span>
                        </div>
                        {selectedBuilder.contact_person && selectedBuilder.contact_person !== 'Contact Person' && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Contact Person</span>
                            <span className="text-slate-900 font-medium">{selectedBuilder.contact_person}</span>
                          </div>
                        )}
                        {selectedBuilder.position && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Position</span>
                            <span className="text-slate-900 font-medium">{selectedBuilder.position}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-500">Email</span>
                          <span className="text-slate-900 font-medium text-sm">{selectedBuilder.primary_email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Phone</span>
                          <span className="text-slate-900 font-medium">{selectedBuilder.phone || 'N/A'}</span>
                        </div>
                        {selectedBuilder.website && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Website</span>
                            <a href={selectedBuilder.website} target="_blank" rel="noopener noreferrer" className="text-[#1e3886] hover:underline text-sm">
                              {selectedBuilder.website}
                            </a>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-500">Location</span>
                          <span className="text-slate-900 font-medium text-right">
                            {selectedBuilder.headquarters_city && `${selectedBuilder.headquarters_city}, `}
                            {selectedBuilder.headquarters_country || ''}
                            {selectedBuilder.headquarters_country_code && ` (${selectedBuilder.headquarters_country_code})`}
                          </span>
                        </div>
                        {selectedBuilder.headquarters_address && (
                          <div className="flex flex-col">
                            <span className="text-slate-500 text-sm">Address</span>
                            <span className="text-slate-900 font-medium text-sm">{selectedBuilder.headquarters_address}</span>
                          </div>
                        )}
                        {selectedBuilder.established_year && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Established</span>
                            <span className="text-slate-900 font-medium">{selectedBuilder.established_year}</span>
                          </div>
                        )}
                        {selectedBuilder.team_size && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Team Size</span>
                            <span className="text-slate-900 font-medium">{selectedBuilder.team_size}</span>
                          </div>
                        )}
                        {selectedBuilder.languages && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Languages</span>
                            <span className="text-slate-900 font-medium">{selectedBuilder.languages}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-500">Created</span>
                          <span className="text-slate-900 font-medium">{selectedBuilder.created_at ? new Date(selectedBuilder.created_at).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Last Updated</span>
                          <span className="text-slate-900 font-medium">{selectedBuilder.updated_at ? new Date(selectedBuilder.updated_at).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-slate-900">Business Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Claim Status</span>
                          {getStatusBadge(selectedBuilder.claim_status)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Verified</span>
                          <span className="text-slate-900 font-medium">{selectedBuilder.verified ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Premium Member</span>
                          <span className="text-slate-900 font-medium">{selectedBuilder.premium_member ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Claimed</span>
                          <span className="text-slate-900 font-medium">{selectedBuilder.claimed ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Projects Completed</span>
                          <span className="text-slate-900 font-medium">{selectedBuilder.projects_completed ?? 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Rating</span>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                            <span className="text-slate-900 font-medium">{selectedBuilder.rating ?? 'N/A'}</span>
                            {selectedBuilder.review_count !== undefined && selectedBuilder.review_count > 0 && (
                              <span className="text-slate-500 text-sm">({selectedBuilder.review_count} reviews)</span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Source</span>
                          <span className="text-slate-900 font-medium">{selectedBuilder.source || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Imported from GMB</span>
                          <span className="text-slate-900 font-medium">{selectedBuilder.gmb_imported ? 'Yes' : 'No'}</span>
                        </div>
                        {selectedBuilder.gmb_place_id && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">GMB Place ID</span>
                            <span className="text-slate-900 font-medium text-xs">{selectedBuilder.gmb_place_id}</span>
                          </div>
                        )}
                        {selectedBuilder.currency && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Currency</span>
                            <span className="text-slate-900 font-medium">{selectedBuilder.currency}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  {selectedBuilder.company_description && (
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-slate-900">Company Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 text-sm">{selectedBuilder.company_description}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="activity" className="mt-4">
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-slate-900">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-500">Activity logs for this builder would appear here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}