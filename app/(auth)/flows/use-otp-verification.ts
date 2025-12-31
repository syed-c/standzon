"use client";

import { useState } from "react";

interface OTPVerificationOptions {
  email: string;
  otp: string;
  userType: "admin" | "builder" | "client";
  purpose?: "login" | "register" | "claim" | "onboarding";
}

interface OTPVerificationResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function useOTPVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyOTP = async (
    options: OTPVerificationOptions
  ): Promise<OTPVerificationResult> => {
    const { email, otp, userType, purpose = "login" } = options;

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return { success: false, error: "OTP must be 6 digits" };
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔐 Verifying OTP for:", email, "Type:", userType);

      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "verify",
          email,
          otp,
          userType,
          purpose,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ OTP verified successfully");
        return {
          success: true,
          data: data.data,
        };
      } else {
        const errorMsg = data.error || "Invalid OTP. Please try again.";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("❌ OTP verification failed:", error);
      const errorMsg = "Network error. Please check your connection and try again.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyOTP, isLoading, error };
}
