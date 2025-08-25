import { NextRequest, NextResponse } from "next/server";
import { claimNotificationService } from "@/lib/email/emailService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📧 Welcome email API received:", body);

    const { email, name, companyName, userType } = body;

    if (!email || !name || !userType) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, name, and user type are required",
        },
        { status: 400 }
      );
    }

    // Generate verification token for email verification link
    const verificationToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    console.log(`📧 Sending welcome email to ${email} with verification link`);

    // Send welcome email with verification link
    try {
      await claimNotificationService.sendClaimNotification(
        "builder_welcome",
        { email, name },
        {
          contactPerson: name,
          companyName: companyName || name,
          verificationLink: verificationLink,
          dashboardLink: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/builder/dashboard`,
          supportEmail:
            process.env.REPLY_TO_EMAIL ||
            process.env.FROM_EMAIL ||
            "contact@syedrayyan.com",
        },
        ["email"]
      );

      console.log("✅ Welcome email sent successfully to:", email);

      return NextResponse.json({
        success: true,
        message: "Welcome email sent successfully",
        data: {
          email,
          verificationToken, // In production, store this in database
        },
      });
    } catch (emailError) {
      console.error("❌ Failed to send welcome email:", emailError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send welcome email",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Error in welcome email API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process welcome email request",
      },
      { status: 500 }
    );
  }
}
