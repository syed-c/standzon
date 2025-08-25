import {
  claimNotificationTemplates,
  replaceTemplateVariables,
  getSMSContent,
  type NotificationTemplate,
} from "./claimNotificationTemplates";

// Enhanced Email Service with Claim Notification Support
export interface EmailConfig {
  from: string;
  replyTo?: string;
  service: "sendgrid" | "ses" | "smtp" | "demo";
  apiKey?: string;
  region?: string;
  // SMTP Configuration
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  password?: string;
}

export interface SMSConfig {
  service: "twilio" | "aws-sns" | "demo";
  accountSid?: string;
  authToken?: string;
  fromNumber?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  channel: "email" | "sms";
  recipient: string;
}

export class ClaimNotificationService {
  private emailConfig: EmailConfig;
  private smsConfig: SMSConfig;

  constructor(emailConfig: EmailConfig, smsConfig: SMSConfig) {
    this.emailConfig = emailConfig;
    this.smsConfig = smsConfig;
  }

  // Send claim notification using template
  async sendClaimNotification(
    templateId: string,
    recipient: { email?: string; phone?: string; name: string },
    variables: Record<string, string>,
    channels: ("email" | "sms")[] = ["email"]
  ): Promise<NotificationResult[]> {
    const template = claimNotificationTemplates.find(
      (t) => t.id === templateId
    );
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const results: NotificationResult[] = [];

    // Send email if requested and email available
    if (
      channels.includes("email") &&
      recipient.email &&
      template.channels.includes("email")
    ) {
      try {
        const emailResult = await this.sendTemplateEmail(
          template,
          recipient.email,
          recipient.name,
          variables
        );
        results.push(emailResult);
      } catch (error) {
        results.push({
          success: false,
          error:
            error instanceof Error ? error.message : "Email sending failed",
          channel: "email",
          recipient: recipient.email,
        });
      }
    }

    // Send SMS if requested and phone available
    if (
      channels.includes("sms") &&
      recipient.phone &&
      template.channels.includes("sms")
    ) {
      try {
        const smsResult = await this.sendTemplateSMS(
          template,
          recipient.phone,
          variables
        );
        results.push(smsResult);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : "SMS sending failed",
          channel: "sms",
          recipient: recipient.phone,
        });
      }
    }

    return results;
  }

  // Send bulk notifications to multiple recipients
  async sendBulkClaimNotifications(
    templateId: string,
    recipients: Array<{
      email?: string;
      phone?: string;
      name: string;
      variables?: Record<string, string>;
    }>,
    globalVariables: Record<string, string> = {},
    channels: ("email" | "sms")[] = ["email"]
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    for (const recipient of recipients) {
      const combinedVariables = { ...globalVariables, ...recipient.variables };
      const recipientResults = await this.sendClaimNotification(
        templateId,
        recipient,
        combinedVariables,
        channels
      );
      results.push(...recipientResults);
    }

    return results;
  }

  // Send email using template
  private async sendTemplateEmail(
    template: NotificationTemplate,
    recipientEmail: string,
    recipientName: string,
    variables: Record<string, string>
  ): Promise<NotificationResult> {
    console.log(
      `📧 Sending email template "${template.name}" to ${recipientEmail}`
    );

    // Replace variables in template
    const subject = replaceTemplateVariables(template.subject, variables);
    const htmlContent = replaceTemplateVariables(
      template.htmlContent,
      variables
    );
    const textContent = replaceTemplateVariables(
      template.textContent,
      variables
    );

    // Add recipient name to variables
    const enhancedVariables = { ...variables, recipientName };

    switch (this.emailConfig.service) {
      case "sendgrid":
        return await this.sendEmailViaSendGrid(
          recipientEmail,
          subject,
          htmlContent,
          textContent
        );

      case "ses":
        return await this.sendEmailViaSES(
          recipientEmail,
          subject,
          htmlContent,
          textContent
        );

      case "smtp":
        return await this.sendEmailViaSMTP(
          recipientEmail,
          subject,
          htmlContent,
          textContent
        );

      default:
        // Demo mode - simulate sending
        return await this.simulateEmailSending(
          recipientEmail,
          subject,
          template.name
        );
    }
  }

  // Send SMS using template
  private async sendTemplateSMS(
    template: NotificationTemplate,
    recipientPhone: string,
    variables: Record<string, string>
  ): Promise<NotificationResult> {
    console.log(
      `📱 Sending SMS template "${template.name}" to ${recipientPhone}`
    );

    const smsContent = getSMSContent(template, variables);

    switch (this.smsConfig.service) {
      case "twilio":
        return await this.sendSMSViaTwilio(recipientPhone, smsContent);

      case "aws-sns":
        return await this.sendSMSViaAWSSNS(recipientPhone, smsContent);

      default:
        // Demo mode - simulate sending
        return await this.simulateSMSSending(recipientPhone, smsContent);
    }
  }

  // SendGrid email implementation
  private async sendEmailViaSendGrid(
    to: string,
    subject: string,
    htmlContent: string,
    textContent: string
  ): Promise<NotificationResult> {
    try {
      // In production, use @sendgrid/mail
      /*
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(this.emailConfig.apiKey);

      const msg = {
        to,
        from: this.emailConfig.from,
        replyTo: this.emailConfig.replyTo,
        subject,
        text: textContent,
        html: htmlContent,
      };

      const [response] = await sgMail.send(msg);
      */

      // Simulate for demo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        messageId: `sg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        channel: "email",
        recipient: to,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "SendGrid sending failed",
        channel: "email",
        recipient: to,
      };
    }
  }

  // AWS SES email implementation
  private async sendEmailViaSES(
    to: string,
    subject: string,
    htmlContent: string,
    textContent: string
  ): Promise<NotificationResult> {
    try {
      // In production, use AWS SDK
      /*
      const AWS = require('aws-sdk');
      const ses = new AWS.SES({ region: this.emailConfig.region });

      const params = {
        Source: this.emailConfig.from,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject },
          Body: {
            Text: { Data: textContent },
            Html: { Data: htmlContent }
          }
        }
      };

      const result = await ses.sendEmail(params).promise();
      */

      // Simulate for demo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        messageId: `ses_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        channel: "email",
        recipient: to,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "SES sending failed",
        channel: "email",
        recipient: to,
      };
    }
  }

  // SMTP email implementation
  private async sendEmailViaSMTP(
    to: string,
    subject: string,
    htmlContent: string,
    textContent: string
  ): Promise<NotificationResult> {
    try {
      // Use SMTP configuration from environment via this.emailConfig
      const smtpConfig = {
        host: this.emailConfig.host || process.env.SMTP_HOST,
        port:
          typeof this.emailConfig.port === "number"
            ? this.emailConfig.port
            : parseInt(process.env.SMTP_PORT || "587"),
        secure:
          typeof this.emailConfig.secure === "boolean"
            ? this.emailConfig.secure
            : process.env.SMTP_SECURE === "true",
        auth: {
          user: this.emailConfig.user || process.env.SMTP_USER,
          pass: this.emailConfig.password || process.env.SMTP_PASSWORD,
        },
      };

      if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
        throw new Error(
          "SMTP configuration incomplete: ensure SMTP_HOST, SMTP_USER, and SMTP_PASSWORD are set"
        );
      }

      console.log("📧 Using SMTP configuration for email sending...");

      // Check if nodemailer is available
      let nodemailer;
      try {
        nodemailer = require("nodemailer");
      } catch (requireError) {
        console.log("📧 [DEV] Nodemailer not installed, simulating email send");
        return this.simulateEmailSending(to, subject, "SMTP (simulated)");
      }

      const transporter = nodemailer.createTransport(smtpConfig);

      console.log("📧 SMTP Transporter configured with:", {
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        user: smtpConfig.auth.user,
      });

      // Test connection first
      try {
        await transporter.verify();
        console.log("✅ SMTP connection verified successfully");
      } catch (verifyError) {
        console.error("❌ SMTP verification failed:", verifyError);
        // Fall back to simulation in development
        if (process.env.NODE_ENV === "development") {
          console.log("📧 [DEV] Falling back to email simulation");
          return this.simulateEmailSending(to, subject, "SMTP (fallback)");
        }
        throw verifyError;
      }

      const info = await transporter.sendMail({
        from: this.emailConfig.from || process.env.FROM_EMAIL,
        replyTo: this.emailConfig.replyTo || process.env.REPLY_TO_EMAIL,
        to,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log("✅ Email sent successfully via SMTP:", info.messageId);

      return {
        success: true,
        messageId: info.messageId,
        channel: "email",
        recipient: to,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : String(error) || "Unknown SMTP error";
      console.error("❌ SMTP Email sending failed:", errorMessage);

      // In development, fall back to simulation
      if (process.env.NODE_ENV === "development") {
        console.log("📧 [DEV] SMTP failed, falling back to simulation");
        return this.simulateEmailSending(to, subject, "SMTP (error fallback)");
      }

      return {
        success: false,
        error: errorMessage,
        channel: "email",
        recipient: to,
      };
    }
  }

  // Twilio SMS implementation
  private async sendSMSViaTwilio(
    phone: string,
    content: string
  ): Promise<NotificationResult> {
    try {
      // In production, use twilio SDK
      /*
      const twilio = require('twilio');
      const client = twilio(this.smsConfig.accountSid, this.smsConfig.authToken);

      const message = await client.messages.create({
        body: content,
        from: this.smsConfig.fromNumber,
        to: phone
      });
      */

      // Simulate for demo
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        success: true,
        messageId: `tw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        channel: "sms",
        recipient: phone,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Twilio sending failed",
        channel: "sms",
        recipient: phone,
      };
    }
  }

  // AWS SNS SMS implementation
  private async sendSMSViaAWSSNS(
    phone: string,
    content: string
  ): Promise<NotificationResult> {
    try {
      // In production, use AWS SDK
      /*
      const AWS = require('aws-sdk');
      const sns = new AWS.SNS({ region: this.smsConfig.region });

      const params = {
        Message: content,
        PhoneNumber: phone
      };

      const result = await sns.publish(params).promise();
      */

      // Simulate for demo
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        success: true,
        messageId: `sns_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        channel: "sms",
        recipient: phone,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "AWS SNS sending failed",
        channel: "sms",
        recipient: phone,
      };
    }
  }

  // Demo email simulation
  private async simulateEmailSending(
    to: string,
    subject: string,
    templateName: string
  ): Promise<NotificationResult> {
    try {
      console.log(`📧 [SIMULATED] Sending email "${templateName}" to ${to}`);
      console.log(`📧 [SIMULATED] Subject: ${subject}`);

      // Simulate network delay
      await new Promise((resolve) =>
        setTimeout(resolve, 500 + Math.random() * 1000)
      );

      return {
        success: true,
        messageId: `sim_email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        channel: "email",
        recipient: to,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : String(error) || "Simulation error";
      console.error("❌ Email simulation failed:", errorMessage);
      return {
        success: false,
        error: errorMessage,
        channel: "email",
        recipient: to,
      };
    }
  }

  // Demo SMS simulation
  private async simulateSMSSending(
    phone: string,
    content: string
  ): Promise<NotificationResult> {
    console.log(`📱 [DEMO] Sending SMS to ${phone}`);
    console.log(`📱 [DEMO] Content: ${content.substring(0, 50)}...`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      success: true,
      messageId: `demo_sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      channel: "sms",
      recipient: phone,
    };
  }
}

// Factory function to create notification service
export function createClaimNotificationService(): ClaimNotificationService {
  try {
    // Auto-detect SMTP service if configured
    const smtpConfigured =
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD;
    const emailService = smtpConfigured
      ? "smtp"
      : (process.env.EMAIL_SERVICE as any) || "demo";

    console.log("📧 Email service configuration:", {
      service: emailService,
      smtpConfigured: smtpConfigured,
      host: process.env.SMTP_HOST || "Not configured",
      user: process.env.SMTP_USER ? "✅ Set" : "❌ Missing",
      password: process.env.SMTP_PASSWORD ? "✅ Set" : "❌ Missing",
    });

    const emailConfig: EmailConfig = {
      from:
        process.env.FROM_EMAIL ||
        process.env.SMTP_USER ||
        "noreply@standszone.com",
      replyTo:
        process.env.REPLY_TO_EMAIL ||
        process.env.SMTP_USER ||
        "contact@syedrayyan.com",
      service: emailService,
      apiKey: process.env.SENDGRID_API_KEY || process.env.AWS_ACCESS_KEY_ID,
      region: process.env.AWS_REGION || "us-east-1",
      // SMTP Configuration
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
    };

    const smsConfig: SMSConfig = {
      service: (process.env.SMS_SERVICE as any) || "demo",
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_PHONE_NUMBER,
    };

    return new ClaimNotificationService(emailConfig, smsConfig);
  } catch (error) {
    console.error(
      "❌ Failed to create email service, using fallback configuration:",
      error
    );

    // Fallback configuration that will use simulation mode
    const fallbackEmailConfig: EmailConfig = {
      from: "noreply@standszone.com",
      replyTo: "support@standszone.com",
      service: "demo",
    };

    const fallbackSmsConfig: SMSConfig = {
      service: "demo",
    };

    return new ClaimNotificationService(fallbackEmailConfig, fallbackSmsConfig);
  }
}

// Export singleton instance
export const claimNotificationService = createClaimNotificationService();
