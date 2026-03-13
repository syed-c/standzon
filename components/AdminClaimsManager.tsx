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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface AdminClaimsManagerProps {
  adminId: string;
  permissions: string[];
}

interface ClaimData {
  id: string;
  builderId: string;
  builderName: string;
  email: string;
  phone: string;
  location: string;
  claimStatus: 'pending' | 'claimed' | 'unclaimed' | 'verified';
  verified: boolean;
  claimedAt: string | null;
  claimMethod: string | null;
  planType: string;
  lastActivity: string;
  gmbImported: boolean;
  profileCompleteness: number;
  canClaim: boolean;
}

export default function AdminClaimsManager({
  adminId,
  permissions,
}: AdminClaimsManagerProps) {
  const [claims, setClaims] = useState<ClaimData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState<ClaimData | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Statistics
  const [stats, setStats] = useState({
    totalBuilders: 0,
    claimedBuilders: 0,
    unclaimedBuilders: 0,
    verifiedBuilders: 0,
    pendingClaims: 0,
    claimSuccessRate: 0,
  });

  useEffect(() => {
    loadClaimsData();
  }, []);

  const loadClaimsData = async () => {
    setLoading(true);
    try {
      console.log("🔍 Loading claims data for admin dashboard...");

      const buildersResponse = await fetch("/api/admin/builders");
      const buildersData = await buildersResponse.json();

      if (buildersData.success && buildersData.data) {
        const allBuilders = buildersData.data.builders || [];

        // Filter only builders who have claimed their profile (claimed = true)
        const claimedBuilders = allBuilders.filter((builder: any) => builder.claimed === true);

        // Map database fields to claim data
        // Show as "Unclaimed" until verified, then show as "Verified"
        const claimsInfo: ClaimData[] = claimedBuilders.map((builder: any) => ({
          id: `claim_${builder.id}`,
          builderId: builder.id,
          builderName: builder.company_name || 'Unknown',
          email: builder.primary_email || '',
          phone: builder.phone || '',
          location: `${builder.headquarters_city || 'Unknown'}, ${builder.headquarters_country || 'Unknown'}`,
          // If verified = true, show "verified", otherwise show "unclaimed" (pending admin verification)
          claimStatus: builder.verified ? 'verified' : 'unclaimed',
          verified: builder.verified || false,
          claimedAt: builder.claimed_at || null,
          claimMethod: builder.claim_method || null,
          planType: builder.premium_member ? 'premium' : 'free',
          lastActivity: builder.updated_at || builder.created_at,
          gmbImported: builder.gmb_imported || false,
          profileCompleteness: calculateProfileCompleteness(builder),
          canClaim: !!(builder.primary_email || builder.phone),
        }));

        setClaims(claimsInfo);

        // Calculate statistics
        const totalBuilders = claimedBuilders.length;
        const verifiedBuilders = claimedBuilders.filter((b: any) => b.verified).length;
        const unverifiedBuilders = claimedBuilders.filter((b: any) => !b.verified).length;

        setStats({
          totalBuilders,
          claimedBuilders: totalBuilders,
          unclaimedBuilders: unverifiedBuilders,
          verifiedBuilders,
          pendingClaims: unverifiedBuilders,
          claimSuccessRate: totalBuilders > 0 ? Math.round((verifiedBuilders / totalBuilders) * 100) : 0,
        });

        console.log(`✅ Loaded ${claimsInfo.length} builders with claim information`);
      }
    } catch (error) {
      console.error("❌ Error loading claims data:", error);
      toast.error("Failed to load claims data");
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompleteness = (builder: any): number => {
    let completeness = 0;
    const fields = [
      builder.company_name,
      builder.primary_email,
      builder.phone,
      builder.company_description,
      builder.headquarters_city,
      builder.headquarters_country,
    ];

    fields.forEach((field) => {
      if (field && field.toString().trim() !== "") completeness += 16.67;
    });

    return Math.round(completeness);
  };

  // Filter claims
  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      searchTerm === "" ||
      claim.builderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unclaimed" && claim.claimStatus === "unclaimed") ||
      (statusFilter === "verified" && claim.claimStatus === "verified");

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClaims = filteredClaims.slice(startIndex, startIndex + itemsPerPage);

  const handleVerifyBuilder = async (builderId: string) => {
    setProcessingAction(true);
    try {
      const response = await fetch(`/api/admin/builders?id=${builderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: true }),
      });
      
      if (response.ok) {
        toast.success("Builder verified successfully");
        loadClaimsData();
      } else {
        throw new Error('Failed to verify builder');
      }
    } catch (error) {
      console.error('Error verifying builder:', error);
      toast.error("Failed to verify builder");
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusBadge = (status: string, verified: boolean) => {
    if (status === 'verified') {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <span className="material-symbols-outlined text-xs mr-1">verified</span>
          Verified
        </Badge>
      );
    }
    if (status === 'unclaimed') {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          <span className="material-symbols-outlined text-xs mr-1">pending</span>
          Pending Verification
        </Badge>
      );
    }
    return (
      <Badge className="bg-slate-100 text-slate-600 border-slate-200">
        <span className="material-symbols-outlined text-xs mr-1">cancel</span>
        Unclaimed
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3886] mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading profile claims...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Profiles', value: stats.totalBuilders, icon: 'groups', color: 'bg-blue-100 text-blue-600' },
          { title: 'Verified Claims', value: stats.verifiedBuilders, icon: 'verified', color: 'bg-green-100 text-green-600' },
          { title: 'Pending Verification', value: stats.pendingClaims, icon: 'pending', color: 'bg-yellow-100 text-yellow-600' },
          { title: 'Claim Rate', value: `${stats.claimSuccessRate}%`, icon: 'trending_up', color: 'bg-purple-100 text-purple-600' },
        ].map((stat, index) => (
          <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow">
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

      {/* Filters */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Filters & Search</CardTitle>
          <CardDescription className="text-slate-500">
            {filteredClaims.length} profiles found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-slate-600">Search</Label>
              <div className="relative mt-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">search</span>
                <Input
                  placeholder="Search by name, email, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-slate-600">Claim Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1 border-slate-300">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="unclaimed">Pending Verification</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={loadClaimsData} 
                variant="outline" 
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <span className="material-symbols-outlined mr-2">refresh</span>
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Profile Claims Directory</CardTitle>
          <CardDescription className="text-slate-500">
            Manage builder profile claims and verification status
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
                  <TableHead className="text-slate-600">Profile</TableHead>
                  <TableHead className="text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClaims.map((claim) => (
                  <TableRow key={claim.id} className="border-slate-100 hover:bg-slate-50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium text-slate-900">{claim.builderName}</div>
                        <div className="text-slate-500 text-xs">
                          {claim.email && !claim.email.includes('no-email+') 
                            ? claim.email 
                            : 'No email'}
                          {claim.phone ? ` • ${claim.phone}` : ''}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {claim.location}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(claim.claimStatus, claim.verified)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-[#1e3886] h-2 rounded-full" 
                            style={{ width: `${claim.profileCompleteness}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{claim.profileCompleteness}%</span>
                      </div>
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
                            onClick={() => {
                              setSelectedClaim(claim);
                              setShowClaimDialog(true);
                            }}
                            className="cursor-pointer"
                          >
                            <span className="material-symbols-outlined mr-2">visibility</span>
                            View Details
                          </DropdownMenuItem>
                          {!claim.verified && (
                            <DropdownMenuItem 
                              onClick={() => handleVerifyBuilder(claim.builderId)}
                              className="cursor-pointer"
                            >
                              <span className="material-symbols-outlined mr-2">verified</span>
                              Mark as Verified
                            </DropdownMenuItem>
                          )}
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClaims.length)} of {filteredClaims.length} profiles
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

      {/* Claim Detail Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Profile Claim Details</DialogTitle>
            <DialogDescription className="text-slate-500">
              Detailed information about this builder profile
            </DialogDescription>
          </DialogHeader>
          {selectedClaim && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label className="text-slate-500">Company Name</Label>
                <p className="font-medium text-slate-900">{selectedClaim.builderName}</p>
              </div>
              <div>
                <Label className="text-slate-500">Email</Label>
                <p className="font-medium text-slate-900">{selectedClaim.email || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-slate-500">Phone</Label>
                <p className="font-medium text-slate-900">{selectedClaim.phone || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-slate-500">Location</Label>
                <p className="font-medium text-slate-900">{selectedClaim.location}</p>
              </div>
              <div>
                <Label className="text-slate-500">Claim Status</Label>
                <p className="font-medium text-slate-900 capitalize">{selectedClaim.claimStatus}</p>
              </div>
              <div>
                <Label className="text-slate-500">Verified</Label>
                <p className="font-medium text-slate-900">{selectedClaim.verified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <Label className="text-slate-500">Plan Type</Label>
                <p className="font-medium text-slate-900 capitalize">{selectedClaim.planType}</p>
              </div>
              <div>
                <Label className="text-slate-500">Profile Completeness</Label>
                <p className="font-medium text-slate-900">{selectedClaim.profileCompleteness}%</p>
              </div>
              <div>
                <Label className="text-slate-500">GMB Imported</Label>
                <p className="font-medium text-slate-900">{selectedClaim.gmbImported ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <Label className="text-slate-500">Last Activity</Label>
                <p className="font-medium text-slate-900">
                  {selectedClaim.lastActivity ? new Date(selectedClaim.lastActivity).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
