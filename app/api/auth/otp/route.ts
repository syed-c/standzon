import { NextRequest, NextResponse } from "next/server";
import { UserManager } from "@/lib/auth/config";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";
import { claimNotificationService } from "@/lib/email/emailService";
import { v4 as uuidv4 } from 'uuid';
import { logActivity } from '@/lib/database/activityLogAPI';

// Add global type declaration
declare global {
  var otpStorage: Map<
    string,
    { code: string; epoch: number; userType: string; userId?: string }
  >;
}

// OTP storage with expiry
// In production, use a database or Redis
if (!global.otpStorage) {
  global.otpStorage = new Map<
    string,
    { code: string; epoch: number; userType: string; userId?: string }
  >();
}
const otpStorage = global.otpStorage;

// Generate OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    console.log("📧 OTP API received:", body);

    // Handle both old format (action) and new format (direct email/userType)
    const action = body.action;
    const email = body.email;
    const userType = body.userType;
    const otp = body.otp;

    if (action === "generate" || (!action && email && userType && !otp)) {
      // Generate OTP
      console.log("📧 Generating OTP for:", email, "userType:", userType);

      if (!email || !userType) {
        return NextResponse.json(
          {
            success: false,
            error: "Email and user type are required",
          },
          { status: 400 }
        );
      }

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Generated OTP:", otpCode);
      const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes (increased from 5)

      // Store OTP
      otpStorage.set(email, { code: otpCode, epoch: expiry, userType });

      console.log(
        `🔐 Generated OTP ${otpCode} for ${email} (expires: ${new Date(expiry).toISOString()}) userType: ${userType}`
      );

      // ✅ DEMO MODE: Return OTP in response for testing
      const isDemoMode =
        process.env.NODE_ENV === "development" ||
        process.env.DEMO_MODE === "true" ||
        !process.env.SMTP_HOST; // No SMTP configured = demo mode

      // Send OTP via email
      try {
        // Safely extract username from email
        const username = email && email.includes("@") ? email.split("@")[0] : email;
        
        await claimNotificationService.sendClaimNotification(
          "otp_verification",
          { email, name: username },
          {
            otpCode: otpCode,
            contactPerson: username,
            expiryTime: "5 minutes",
          },
          ["email"]
        );

        console.log("✅ OTP sent successfully to:", email);
      } catch (emailError) {
        console.error("❌ Failed to send OTP email:", emailError);

        if (isDemoMode) {
          console.log(
            "📧 [DEMO] Email sending failed, but continuing in demo mode"
          );
          console.log(
            "📧 [DEMO] Error details:",
            emailError instanceof Error ? emailError.message : emailError
          );
        } else {
          // In production with email configured, we should fail if email can't be sent
          return NextResponse.json(
            {
              success: false,
              error: "Failed to send verification email. Please try again.",
              details:
                emailError instanceof Error
                  ? emailError.message
                  : "Email service error",
            },
            { status: 500 }
          );
        }
      }

      // Log the login attempt
      await logActivity(
        email,
        'login_attempt',
        'Authentication',
        `OTP generated for ${userType} user`,
        request
      );

      return NextResponse.json({
        success: true,
        message: isDemoMode
          ? "OTP generated successfully. Check the response for your verification code."
          : "OTP sent successfully to your email",
        data: {
          expiresAt: new Date(expiry).toISOString(),
          email,
          // ✅ DEMO: Always include OTP in development mode for testing
          ...(isDemoMode && {
            demoOTP: otpCode,
            note: "Development mode: Use the OTP code above to verify your email. In production, this would be sent via email only.",
          }),
        },
      });
    } else if (action === "verify" || (!action && email && userType && otp)) {
      // Verify OTP
      console.log("🔍 Verifying OTP for:", email, "with code:", otp);

      if (!email || !otp || !userType) {
        return NextResponse.json(
          {
            success: false,
            error: "Email, OTP, and user type are required",
          },
          { status: 400 }
        );
      }

      const storedData = otpStorage.get(email);
      
      console.log("🔍 OTP Storage Debug:");
      console.log("- Email:", email);
      console.log("- Stored data:", storedData);
      console.log("- All stored OTPs:", Array.from(otpStorage.entries()));

      if (!storedData) {
        console.log("❌ No OTP found for email:", email);
        
        // Log failed login attempt
        await logActivity(
          email,
          'failed_login',
          'Authentication',
          'No OTP found for email',
          request
        );
        
        return NextResponse.json(
          {
            success: false,
            error: "Invalid or expired OTP",
          },
          { status: 400 }
        );
      }

      if (Date.now() > storedData.epoch) {
        console.log("❌ OTP expired for email:", email);
        otpStorage.delete(email);
        
        // Log failed login attempt
        await logActivity(
          email,
          'failed_login',
          'Authentication',
          'OTP expired',
          request
        );
        
        return NextResponse.json(
          {
            success: false,
            error: "OTP has expired. Please request a new one.",
            debug: process.env.NODE_ENV === "development" ? {
              expiredAt: new Date(storedData.epoch).toISOString(),
              currentTime: new Date().toISOString()
            } : undefined
          },
          { status: 400 }
        );
      }

      // More lenient OTP verification - allow case-insensitive comparison and trim whitespace
      const normalizedStoredOTP = storedData.code ? storedData.code.trim() : '';
      const normalizedInputOTP = otp ? otp.trim() : '';
      
      console.log("🔍 OTP Verification Debug:");
      console.log("- Email:", email);
      console.log("- Stored OTP:", normalizedStoredOTP);
      console.log("- Input OTP:", normalizedInputOTP);
      console.log("- Stored userType:", storedData.userType);
      console.log("- Input userType:", userType);
      console.log("- OTP Match:", normalizedStoredOTP === normalizedInputOTP);
      console.log("- UserType Match:", storedData.userType === userType);
      
      if (normalizedStoredOTP !== normalizedInputOTP || storedData.userType !== userType) {
        console.log("❌ Invalid OTP or user type for email:", email);
        console.log("Expected OTP:", normalizedStoredOTP, "Received OTP:", normalizedInputOTP);
        console.log(
          "Expected userType:",
          storedData.userType,
          "Received:",
          userType
        );
        
        // Log failed login attempt
        await logActivity(
          email,
          'failed_login',
          'Authentication',
          'Invalid OTP or user type',
          request
        );
        
        // For debugging purposes, log the full stored data
        console.log("Stored OTP data:", {
          code: storedData.code,
          expiry: new Date(storedData.epoch).toISOString(),
          userType: storedData.userType,
        });

        return NextResponse.json(
          {
            success: false,
            error: "Invalid OTP or user type",
            debug: process.env.NODE_ENV === "development" ? {
              expectedOTP: storedData.code,
              receivedOTP: otp,
              expectedUserType: storedData.userType,
              receivedUserType: userType,
            } : undefined
          },
          { status: 400 }
        );
      }

      // Successful verification
      console.log("✅ OTP verified successfully for:", email);
      otpStorage.delete(email); // Remove used OTP

      // Create user object
      let user;
      if (userType === "admin") {
        // For admin users, create a simplified user object
        user = {
          id: `admin-${email.replace(/[^a-zA-Z0-9]/g, '-')}`,
          email: email,
          role: email === "sadiqzaidi123456@gmail.com" ? "super_admin" : "admin",
          name: email.split("@")[0],
        };
      } else {
        // For builder users, get from unified data system
        const builders = unifiedPlatformAPI.getBuilders();
        const builder = builders.find(
          (b: any) => b.contactInfo?.primaryEmail?.toLowerCase() === email.toLowerCase()
        );
        
        if (builder) {
          user = {
            id: builder.id,
            email: email,
            role: "builder",
            name: builder.companyName || email.split("@")[0],
            builderId: builder.id,
          };
        } else {
          // Create a basic user if not found
          user = {
            id: `user-${email.replace(/[^a-zA-Z0-9]/g, '-')}`,
            email: email,
            role: "user",
            name: email.split("@")[0],
          };
        }
      }

      // Log successful login
      await logActivity(
        email,
        'login',
        'Authentication',
        `Successful ${userType} login`,
        request
      );

      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
        data: {
          user: user,
          token: "temp-token", // In a real app, this would be a JWT
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("❌ OTP API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
