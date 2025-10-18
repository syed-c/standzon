import { NextRequest, NextResponse } from "next/server";
import { UserManager } from "@/lib/auth/config";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";
import { claimNotificationService } from "@/lib/email/emailService";

// Add global type declaration
declare global {
  var otpStorage: Map<
    string,
    { code: string; expiry: Date; userType: string; userId?: string }
  >;
}

// OTP storage with expiry
// In production, use a database or Redis
if (!global.otpStorage) {
  global.otpStorage = new Map<
    string,
    { code: string; expiry: Date; userType: string; userId?: string }
  >();
}
const otpStorage = global.otpStorage;

// Generate OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
      const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Store OTP
      otpStorage.set(email, { code: otpCode, expiry, userType });

      console.log(
        `🔐 Generated OTP ${otpCode} for ${email} (expires: ${expiry.toISOString()})`
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

      return NextResponse.json({
        success: true,
        message: isDemoMode
          ? "OTP generated successfully. Check the response for your verification code."
          : "OTP sent successfully to your email",
        data: {
          expiresAt: expiry.toISOString(),
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

      if (!storedData) {
        console.log("❌ No OTP found for email:", email);
        return NextResponse.json(
          {
            success: false,
            error: "Invalid or expired OTP",
          },
          { status: 400 }
        );
      }

      if (new Date() > storedData.expiry) {
        console.log("❌ OTP expired for email:", email);
        otpStorage.delete(email);
        return NextResponse.json(
          {
            success: false,
            error: "OTP has expired",
          },
          { status: 400 }
        );
      }

      // More lenient OTP verification - allow case-insensitive comparison and trim whitespace
      const normalizedStoredOTP = storedData.code ? storedData.code.trim() : '';
      const normalizedInputOTP = otp ? otp.trim() : '';
      
      if (normalizedStoredOTP !== normalizedInputOTP || storedData.userType !== userType) {
        console.log("❌ Invalid OTP or user type for email:", email);
        console.log("Expected OTP:", normalizedStoredOTP, "Received OTP:", normalizedInputOTP);
        console.log(
          "Expected userType:",
          storedData.userType,
          "Received:",
          userType
        );
        
        // For debugging purposes, log the full stored data
        console.log("Stored OTP data:", {
          ...storedData,
          code: "REDACTED" // Don't log the actual code in production
        });
        
        return NextResponse.json(
          {
            success: false,
            error: "Invalid OTP",
            debug: process.env.NODE_ENV === "development" ? {
              expectedLength: normalizedStoredOTP.length,
              receivedLength: normalizedInputOTP.length,
              match: normalizedStoredOTP === normalizedInputOTP
            } : undefined
          },
          { status: 400 }
        );
      }

      // OTP is valid - find user and authenticate
      let user = null;

      try {
        if (userType === "admin") {
          if (email === process.env.ADMIN_EMAIL) {
            user = {
              id: "admin_001",
              email: email,
              name: "System Administrator",
              role: "admin",
              verified: true,
            };
          }
        } else if (userType === "builder") {
          const builders = unifiedPlatformAPI.getBuilders();
          const builder = builders?.find(
            (b) =>
              b?.contactInfo?.primaryEmail?.toLowerCase() === email.toLowerCase()
          );

          if (builder) {
            user = {
              id: builder.id,
              email: builder.contactInfo.primaryEmail,
              name: builder.contactInfo.contactPerson || builder.companyName,
              role: "builder",
              companyName: builder.companyName,
              verified: builder.verified || false,
            };
          } else {
            // Provisional user for newly registering builders
            try {
              const safeEmail = email || '';
              const username = safeEmail.includes("@") ? safeEmail.split("@")[0] : safeEmail;
              const encodedId = Buffer.from(safeEmail).toString("base64").replace(/=/g, "");
              
              user = {
                id: `builder_${encodedId}`,
                email: safeEmail,
                name: username,
                role: "builder",
                verified: true,
              };
            } catch (encodeError) {
              console.error("❌ Error creating provisional user ID:", encodeError);
              user = {
                id: `builder_${Date.now()}`,
                email: email || '',
                name: "New Builder",
                role: "builder",
                verified: true,
              };
            }
          }
        }
      } catch (userError) {
        console.error("❌ Error finding user:", userError);
        return NextResponse.json(
          {
            success: false,
            error: "Error processing user information",
          },
          { status: 500 }
        );
      }

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found or invalid user type",
          },
          { status: 404 }
        );
      }

      // Clean up OTP
      otpStorage.delete(email);
      console.log("✅ OTP verified successfully for:", email);

      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
        data: {
          user,
          userType,
          email,
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
  } catch (error) {
    console.error("❌ Error in OTP API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process OTP request",
      },
      { status: 500 }
    );
  }
}
