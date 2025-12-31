"use client";

import { useState } from "react";

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginOptions {
  userType: "admin" | "builder" | "client";
}

interface LoginResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    data: LoginData,
    options: LoginOptions
  ): Promise<LoginResult> => {
    const { userType } = options;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("Please enter a valid email address");
      return { success: false, error: "Please enter a valid email address" };
    }

    // Validate password
    if (!data.password) {
      setError("Password is required");
      return { success: false, error: "Password is required" };
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔑 Logging in:", data.email, "Type:", userType);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          userType,
          rememberMe: data.rememberMe,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("✅ Login successful");
        return {
          success: true,
          data: result.data,
        };
      } else {
        const errorMsg = result.error || "Login failed. Please check your credentials.";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
      const errorMsg = "Network error. Please check your connection and try again.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
