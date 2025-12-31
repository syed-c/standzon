"use client";

import { useState } from "react";

interface OTPGenerationOptions {
  email: string;
  userType: "admin" | "builder" | "client";
}

interface OTPGenerationResult {
  success: boolean;
  data?: {
    expiresAt: string;
    demoOTP?: string;
  };
  error?: string;
}

export function useOTPGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateOTP = async (
    options: OTPGenerationOptions
  ): Promise<OTPGenerationResult> => {
    const { email, userType } = options;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return { success: false, error: "Please enter a valid email address" };
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("📧 Requesting OTP for:", email, "Type:", userType);

      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "generate",
          email,
          userType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ OTP sent successfully");
        return {
          success: true,
          data: {
            expiresAt: data.data.expiresAt,
            demoOTP: data.data.demoOTP,
          },
        };
      } else {
        const errorMsg = data.error || "Failed to send OTP. Please try again.";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("❌ OTP generation failed:", error);
      const errorMsg = "Network error. Please check your connection and try again.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return { generateOTP, isLoading, error };
}
