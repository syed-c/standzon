"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/shared/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/card";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import { Badge } from "@/components/shared/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shared/dialog";
import {
  Shield,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Verified,
  Lock,
  Star,
} from "lucide-react";

interface BuilderProfile {
  id: string;
  companyName: string;
  contactInfo: {
    primaryEmail: string;
    phone: string;
    website?: string;
  };
  headquarters: {
    city: string;
    country: string;
  };
  verified: boolean;
  claimed?: boolean;
  claimStatus?: "unclaimed" | "pending" | "verified" | "rejected";
  planType?: "free" | "basic" | "professional" | "enterprise";
}

interface ClaimSystemProps {
  builder: BuilderProfile;
  onClaimStatusChange?: (status: string) => void;
}

function maskEmail(email: string) {
  if (!email) return "";
  const [u, d] = email.split("@");
  if (!u || !d) return email;
  const hidden = u.length > 2 ? `${u[0]}***${u.slice(-1)}` : u;
  return `${hidden}@${d}`;
}

function maskPhone(phone: string) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 4) return phone;
  return `${cleaned.slice(0, 2)}****${cleaned.slice(-2)}`;
}

// OTP Verification Component
function OTPVerification({
  method,
  contact,
  builderId,
  onSuccess,
  onCancel,
  builder,
}: {
  method: "phone" | "email";
  contact: string;
  builderId: string;
  onSuccess: (v: any) => void;
  onCancel: () => void;
  builder: BuilderProfile;
}) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(true);

  useEffect(() => {
    if (timeLeft > 0 && otpSent) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, otpSent]);

  const sendOTP = async (customEmail?: string) => {
    try {
      setIsResending(true);
      const target = customEmail || contact;
      if (!target) {
        toast.error("No contact info provided.");
        setIsResending(false);
        return;
      }
      
      // For testing purposes, temporarily disable domain validation
      // Comment out domain validation to allow any email for testing
      /*
      // Check if email domain matches website domain
      if (customEmail) {
        const websiteDomain = builder?.contactInfo?.website?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        const emailDomain = customEmail.split('@')[1];
        
        if (!websiteDomain || !emailDomain || emailDomain !== websiteDomain) {
          toast.error("Please use a business email that matches your website domain.");
          setIsResending(false);
          return;
        }
      }
      */

      const res = await fetch("/api/utils/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, contact: target, builderId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Verification code sent to ${maskEmail(target)}`);
        setOtpSent(true);
        setShowEmailInput(false);
        setTimeLeft(300);
      } else {
        toast.error("Failed to send verification code.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error sending OTP.");
    } finally {
      setIsResending(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter valid 6-digit OTP.");
      return;
    }
    
    // Ensure we have all required data
    if (!builderId) {
      toast.error("Missing builder information.");
      return;
    }
    
    // Use the correct contact (either original or email input)
    const contactToUse = showEmailInput ? emailInput : contact;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/builders/verify-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          builderId, 
          otp, 
          method: "email", 
          contact: contactToUse 
        }),
      });
      
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        toast.success("Profile verified successfully!");
        onSuccess({
          method: "email",
          contact: contactToUse,
          claimStatus: "verified",
        });
      } else {
        toast.error(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Verify via Email
        </h3>
        {!showEmailInput && (
          <p className="text-sm text-gray-600 mt-2">
            We’ve sent a code to <b>{maskEmail(contact)}</b>
          </p>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {showEmailInput ? (
              <>
                <Label htmlFor="email">Business Email</Label>
                <Input
                  id="email"
                  placeholder="name@yourdomain.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (!emailInput.includes("@")) {
                      return toast.error("Enter valid email");
                    }
                    sendOTP(emailInput);
                  }}
                  disabled={isResending || !emailInput.includes("@")}
                  className="w-full mt-3"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Code
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Label htmlFor="otp">Enter 6-digit Code</Label>
                <div className="relative">
                  <Input
                    id="otp"
                    type={showOtp ? "text" : "password"}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                    className="text-center text-xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowOtp(!showOtp)}
                  >
                    {showOtp ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>

                <div className="flex justify-between items-center mt-2 text-sm">
                  <span>
                    Expires in: {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, "0")}
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => sendOTP()}
                    disabled={timeLeft > 240}
                  >
                    Resend
                  </Button>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={verifyOTP}
                    disabled={isLoading || otp.length !== 6}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Simplified Claim System
export function ProfileClaimSystem({ builder }: ClaimSystemProps) {
  const [showOTP, setShowOTP] = useState(false);
  const [verified, setVerified] = useState(false);

  // Don't show claim button if builder is already verified or claimed
  if (builder.verified || builder.claimed || builder.claimStatus === 'verified') {
    return (
      <div className="p-4 bg-green-50 rounded border border-green-200">
        <p className="text-green-700 flex items-center gap-2">
          <Verified size={18} /> Business Verified
        </p>
      </div>
    );
  }

  if (verified)
    return (
      <div className="p-4 bg-green-50 rounded border border-green-200">
        <p className="text-green-700 flex items-center gap-2">
          <Verified size={18} /> Business Verified Successfully!
        </p>
      </div>
    );

  return (
    <div>
      {!showOTP ? (
        <Button
          className="w-full"
          onClick={() => setShowOTP(true)}
          variant="outline"
        >
          <Shield className="w-4 h-4 mr-2" />
          Claim Business
        </Button>
      ) : (
        <OTPVerification
          method="email"
          contact={builder.contactInfo.primaryEmail}
          builderId={builder.id}
          builder={builder}
          onSuccess={() => setVerified(true)}
          onCancel={() => setShowOTP(false)}
        />
      )}
    </div>
  );
}

export default ProfileClaimSystem;
