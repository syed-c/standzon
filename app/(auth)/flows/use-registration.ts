"use client";

import { useState } from "react";

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  phone: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

interface RegistrationOptions {
  userType: "admin" | "builder" | "client";
}

interface RegistrationResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function useRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    data: RegistrationData,
    options: RegistrationOptions
  ): Promise<RegistrationResult> => {
    const { userType } = options;

    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return { success: false, error: "Passwords do not match" };
    }

    // Validate password strength
    if (data.password.length < 8) {
      setError("Password must be at least 8 characters");
      return { success: false, error: "Password must be at least 8 characters" };
    }

    // Validate required fields
    if (!data.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return { success: false, error: "You must agree to the terms and conditions" };
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("📝 Registering new user:", data.email, "Type:", userType);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userType,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("✅ Registration successful");
        return {
          success: true,
          data: result.data,
        };
      } else {
        const errorMsg = result.error || "Registration failed. Please try again.";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("❌ Registration failed:", error);
      const errorMsg = "Network error. Please check your connection and try again.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
