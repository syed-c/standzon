"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Mail,
  AlertTriangle,
  CheckCircle,
  Send,
  Code,
  Copy,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@exhibitbay.com"); // Updated to match .env.local
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("otp");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOTP = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("🔐 Requesting OTP for admin:", email);

      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "generate",
          email: email,
          userType: "admin",
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ OTP sent successfully");
        setStep("verify");

        setSuccess(`OTP sent to ${email}. Please check your email.`);
      } else {
        setError(data.error || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("❌ OTP request failed:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("🔐 Verifying OTP for admin:", email);

      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "verify",
          email: email,
          otp: otp,
          userType: "admin",
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Admin OTP verification successful:", data.data.user);

        // Store admin session
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            ...data.data.user,
            isLoggedIn: true,
            loginMethod: "otp",
          })
        );

        // Set HTTP-only-ish cookie substitute (client-side set via document.cookie)
        try {
          document.cookie = `admin_auth=1; path=/; max-age=${60*60*8}`;
        } catch {}

        // Redirect to admin dashboard
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("❌ Admin OTP verification failed:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const allowedEmail = "sadiqzaidi123456@gmail.com";
      const allowedPassword = "aDMIN@8899";
      if (email.trim().toLowerCase() === allowedEmail && password === allowedPassword) {
        const user = { id: "super-admin", email: allowedEmail, role: "super_admin" } as const;
        localStorage.setItem("currentUser", JSON.stringify({ ...user, isLoggedIn: true, loginMethod: "password" }));
        try { document.cookie = `admin_auth=1; path=/; max-age=${60*60*8}`; } catch {}
        router.push("/admin/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">StandsZone</h1>
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border bg-red-50 border-red-200">
            <Shield className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-600">Super Admin Portal</span>
          </div>
          <p className="text-gray-600 mt-2">
            Secure access to platform management
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              {loginMethod === "otp" ? (step === "email" ? "Admin Login" : "Enter OTP Code") : "Admin Password Login"}
            </CardTitle>
            <CardDescription>
              {loginMethod === "otp"
                ? (step === "email" ? "Enter your admin email to receive a secure OTP" : `We sent a 6-digit code to ${email}`)
                : "Sign in with admin email and password"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Method Switcher */}
            <div className="flex justify-center gap-2">
              <Button variant={loginMethod === "otp" ? "default" : "outline"} size="sm" onClick={() => setLoginMethod("otp")}>OTP Login</Button>
              <Button variant={loginMethod === "password" ? "default" : "outline"} size="sm" onClick={() => setLoginMethod("password")}>Password</Button>
            </div>

            {loginMethod === "otp" && step === "email" ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@exhibitbay.com"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-800">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleSendOTP} disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700">
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                  {!isLoading && <Send className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            ) : loginMethod === "otp" ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp-code">6-Digit OTP Code</Label>
                  <Input
                    id="otp-code"
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest"
                    disabled={isLoading}
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Code expires in 5 minutes
                  </p>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                      setError("");
                    }}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isLoading ? "Verifying..." : "Login"}
                  </Button>
                </div>

                <Button
                  variant="link"
                  className="w-full text-sm"
                  onClick={handleSendOTP}
                  disabled={isLoading}
                >
                  Resend OTP
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sadiqzaidi123456@gmail.com"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={handlePasswordLogin} disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700">
                  {isLoading ? "Signing in..." : "Login"}
                </Button>
              </div>
            )}

            {/* Security Notice */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  Secure Access
                </span>
              </div>
              <p className="text-xs text-gray-600 text-center">
                This is a secure admin portal. All access attempts are logged
                and monitored.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Info */}
        <div className="mt-6 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="font-medium text-gray-900 mb-2">
              Quick Access Credentials
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Email:</strong> admin@exhibitbay.com
              </p>
              <p>
                <strong>Method:</strong> OTP via Email
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Use the OTP sent to your email to access the admin dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
