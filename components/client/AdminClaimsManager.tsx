"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { Badge } from "@/components/shared/badge";
import { Input } from "@/components/shared/input";
import { Textarea } from "@/components/shared/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shared/dialog";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  Eye,
  Edit,
  MessageSquare,
  UserCheck,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Settings,
  BarChart3,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface AdminClaimsManagerProps {
  adminId: string;
  permissions: string[];
}

export default function AdminClaimsManager({
  adminId,
  permissions,
}: AdminClaimsManagerProps) {
  const [claims, setClaims] = useState<any[]>([]);
  const [builders, setBuilders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [showSendOTPDialog, setShowSendOTPDialog] = useState(false);
  const [otpMethod, setOtpMethod] = useState<"phone" | "email">("email");
  const [customContact, setCustomContact] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [processingAction, setProcessingAction] = useState(false);

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

      // Load builders with claim status
      const buildersResponse = await fetch("/api/admin/builders");
      const buildersData = await buildersResponse.json();

      console.log("📊 API Response:", {
        status: buildersResponse.status,
        success: buildersData.success,
        dataStructure: buildersData.data
          ? Object.keys(buildersData.data)
          : "No data",
        rawData: buildersData,
      });

      if (buildersData.success && buildersData.data) {
        // Handle both new and old response structures
        let allBuilders;
        if (buildersData.data.builders) {
          // New structure: { success: true, data: { builders: [...] } }
          allBuilders = buildersData.data.builders;
        } else if (Array.isArray(buildersData.data)) {
          // Old structure: { success: true, data: [...] }
          allBuilders = buildersData.data;
        } else {
          console.error("❌ Unexpected data structure:", buildersData.data);
          throw new Error("Invalid API response structure");
        }

        console.log("🔍 Builders data structure:", {
          success: buildersData.success,
          buildersType: typeof allBuilders,
          buildersIsArray: Array.isArray(allBuilders),
          buildersLength: allBuilders?.length || 0,
        });

        setBuilders(allBuilders);

        // Ensure allBuilders is an array
        if (!Array.isArray(allBuilders)) {
          console.error(
            "❌ Expected builders to be an array, got:",
            typeof allBuilders
          );
          console.error("❌ Builders data:", allBuilders);
          throw new Error("Invalid builders data structure");
        }

        // Process claims information
        const claimsInfo = allBuilders.map((builder: any) => ({
          id: `claim_${builder.id}`,
          builderId: builder.id,
          builderName: builder.companyName,
          email: builder.contactInfo?.primaryEmail || "",
          phone: builder.contactInfo?.phone || "",
          location: `${builder.headquarters?.city || "Unknown"}, ${builder.headquarters?.country || "Unknown"}`,
          claimStatus: builder.claimed ? "claimed" : "unclaimed",
          verified: builder.verified || false,
          claimedAt: builder.claimedAt || null,
          claimMethod: builder.claimMethod || null,
          planType: builder.planType || "starter",
          lastActivity: builder.updatedAt || builder.createdAt,
          gmbImported: builder.gmbImported || false,
          profileCompleteness: calculateProfileCompleteness(builder),
          canClaim: !!(
            builder.contactInfo?.primaryEmail || builder.contactInfo?.phone
          ),
        }));

        setClaims(claimsInfo);

        // Calculate statistics
        const totalBuilders = allBuilders.length;
        const claimedBuilders = allBuilders.filter(
          (b: any) => b.claimed
        ).length;
        const verifiedBuilders = allBuilders.filter(
          (b: any) => b.verified
        ).length;
        const pendingClaims = allBuilders.filter(
          (b: any) =>
            !b.claimed && (b.contactInfo?.primaryEmail || b.contactInfo?.phone)
        ).length;

        setStats({
          totalBuilders,
          claimedBuilders,
          unclaimedBuilders: totalBuilders - claimedBuilders,
          verifiedBuilders,
          pendingClaims,
          claimSuccessRate:
            totalBuilders > 0
              ? Math.round((claimedBuilders / totalBuilders) * 100)
              : 0,
        });

        console.log(
          `✅ Loaded ${claimsInfo.length} builders with claim information`
        );
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
      builder.companyName,
      builder.contactInfo?.primaryEmail,
      builder.contactInfo?.phone,
      builder.companyDescription,
      builder.headquarters?.city,
      builder.headquarters?.country,
    ];

    fields.forEach((field) => {
      if (field && field.toString().trim() !== "") completeness += 16.67;
    });

    return Math.round(completeness);
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      searchTerm === "" ||
      claim.builderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "claimed" && claim.claimStatus === "claimed") ||
      (statusFilter === "unclaimed" && claim.claimStatus === "unclaimed") ||
      (statusFilter === "verified" && claim.verified) ||
      (statusFilter === "unverified" && !claim.verified);

    return matchesSearch && matchesStatus;
  });

  const handleManualClaim = async (claim: any) => {
    setProcessingAction(true);
    try {
      console.log(
        `👨‍💼 Processing manual claim for builder: ${claim.builderName}`
      );

      const response = await fetch("/api/builders/verify-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          builderId: claim.builderId,
          otp: "000000", // Admin override code
          method: "admin",
          contact: "admin@system.com",
          adminOverride: true,
          adminId: adminId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `✅ Builder profile claimed manually: ${claim.builderName}`
        );
        await loadClaimsData(); // Refresh data
        setShowClaimDialog(false);
      } else {
        toast.error(`❌ Manual claim failed: ${result.error}`);
      }
    } catch (error) {
      console.error("❌ Manual claim error:", error);
      toast.error("Manual claim failed");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleSendOTP = async (claim: any) => {
    setProcessingAction(true);
    try {
      const contact =
        customContact || (otpMethod === "email" ? claim.email : claim.phone);

      if (!contact) {
        toast.error(`No ${otpMethod} available for this builder`);
        return;
      }

      console.log(`📱 Sending OTP via ${otpMethod} to: ${contact}`);

      const response = await fetch("/api/utils/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: otpMethod,
          contact: contact,
          builderId: claim.builderId,
          message: `Admin-initiated verification for ${claim.builderName}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`✅ OTP sent via ${otpMethod} to ${result.contact}`);
        setShowSendOTPDialog(false);
        setCustomContact("");
      } else {
        toast.error(`❌ Failed to send OTP: ${result.error}`);
      }
    } catch (error) {
      console.error("❌ OTP sending error:", error);
      toast.error("Failed to send OTP");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleUpdateClaimStatus = async (
    builderId: string,
    newStatus: string
  ) => {
    setProcessingAction(true);
    try {
      console.log(
        `🔄 Updating claim status for builder ${builderId}: ${newStatus}`
      );

      const response = await fetch("/api/admin/builders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id: builderId,
          data: {
            claimed: newStatus === "claimed",
            claimStatus: newStatus,
            verified: newStatus === "verified",
            adminUpdatedAt: new Date().toISOString(),
            adminUpdatedBy: adminId,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`✅ Claim status updated to: ${newStatus}`);
        await loadClaimsData();
      } else {
        toast.error(`❌ Failed to update status: ${result.error}`);
      }
    } catch (error) {
      console.error("❌ Status update error:", error);
      toast.error("Failed to update claim status");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleBulkOperation = async (
    operation: string,
    selectedIds: string[]
  ) => {
    setProcessingAction(true);
    try {
      console.log(
        `🔄 Performing bulk operation: ${operation} on ${selectedIds.length} builders`
      );

      // Implementation for bulk operations
      toast.success(`✅ Bulk operation completed: ${operation}`);
      await loadClaimsData();
    } catch (error) {
      console.error("❌ Bulk operation error:", error);
      toast.error("Bulk operation failed");
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading claims data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Total Builders
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats.totalBuilders}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Claimed</p>
                <p className="text-3xl font-bold text-green-900">
                  {stats.claimedBuilders}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Unclaimed</p>
                <p className="text-3xl font-bold text-orange-900">
                  {stats.unclaimedBuilders}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">
                  Success Rate
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {stats.claimSuccessRate}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Claim Management System</span>
              </CardTitle>
              <CardDescription>
                Manage builder profile claims, verification, and status updates
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={loadClaimsData}
                disabled={loading}
                className="text-gray-900"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button variant="outline" className="text-gray-900">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search builders, emails, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="claimed">Claimed</SelectItem>
                <SelectItem value="unclaimed">Unclaimed</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600">
              Showing {filteredClaims.length} of {claims.length} builders
            </div>
          </div>

          {/* Claims Table */}
          <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Builder
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Contact
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Plan
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Profile
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {claim.builderName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {claim.location}
                        </div>
                        {claim.gmbImported && (
                          <Badge className="bg-blue-100 text-blue-800">
                            GMB Import
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      <div className="space-y-1">
                        {claim.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-2 text-gray-400" />
                            <span className="text-gray-600">
                              {claim.email.substring(0, 20)}...
                            </span>
                          </div>
                        )}
                        {claim.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-2 text-gray-400" />
                            <span className="text-gray-600">{claim.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {claim.claimStatus === "claimed" ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Claimed
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Unclaimed
                            </Badge>
                          )}
                        </div>
                        {claim.verified && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {claim.claimedAt && (
                          <div className="text-xs text-gray-500">
                            Claimed:{" "}
                            {new Date(claim.claimedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      <Badge
                        className={`text-xs ${
                          claim.planType === "pro"
                            ? "bg-purple-100 text-purple-800"
                            : claim.planType === "growth"
                              ? "bg-green-100 text-green-800"
                              : claim.planType === "basic"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {claim.planType}
                      </Badge>
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${claim.profileCompleteness}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {claim.profileCompleteness}%
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedClaim(claim);
                            setShowClaimDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {!claim.claimed && claim.canClaim && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManualClaim(claim)}
                            disabled={processingAction}
                            className="text-green-600 hover:text-green-700"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}

                        {claim.canClaim && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedClaim(claim);
                              setShowSendOTPDialog(true);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClaims.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No builders found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Claim Details Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Claim Details: {selectedClaim?.builderName}
            </DialogTitle>
            <DialogDescription>
              Manage claim status and verification for this builder
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Current Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      className={
                        selectedClaim.claimStatus === "claimed"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    >
                      {selectedClaim.claimStatus}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Plan Type
                  </label>
                  <div className="mt-1">
                    <Badge className="bg-blue-100 text-blue-800">
                      {selectedClaim.planType}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Update Status
                </label>
                <Select
                  onValueChange={(value) =>
                    handleUpdateClaimStatus(selectedClaim.builderId, value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claimed">Claimed</SelectItem>
                    <SelectItem value="unclaimed">Unclaimed</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Admin Note
                </label>
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add a note about this claim action..."
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowClaimDialog(false)}
              className="text-gray-900"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedClaim && handleManualClaim(selectedClaim)}
              disabled={processingAction}
            >
              {processingAction ? "Processing..." : "Manual Claim"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send OTP Dialog */}
      <Dialog open={showSendOTPDialog} onOpenChange={setShowSendOTPDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Verification Code</DialogTitle>
            <DialogDescription>
              Send OTP to builder for profile claiming
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Method
              </label>
              <Select
                value={otpMethod}
                onValueChange={(value: "phone" | "email") =>
                  setOtpMethod(value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Contact ({otpMethod}) - Leave blank to use builder's contact
              </label>
              <Input
                value={customContact}
                onChange={(e) => setCustomContact(e.target.value)}
                placeholder={
                  otpMethod === "email" ? "custom@email.com" : "+1234567890"
                }
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSendOTPDialog(false)}
              className="text-gray-900"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedClaim && handleSendOTP(selectedClaim)}
              disabled={processingAction}
            >
              {processingAction ? "Sending..." : "Send OTP"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
