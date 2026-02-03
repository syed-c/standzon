import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Enhanced settings API for persistent system configuration
export async function POST(request: NextRequest) {
  try {
    console.log('📧 Processing system settings save request...');
    
    const { type, config, adminId } = await request.json();
    
    if (!type || !config) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: type and config'
      }, { status: 400 });
    }

    console.log(`💾 Saving ${type} configuration for admin ${adminId}...`);

    // Convert config to environment variables format
    const envVars = convertConfigToEnvVars(type, config);
    
    // Save to .env.local file for persistence
    const envPath = path.join(process.cwd(), '.env.local');
    
    try {
      // Read existing .env.local file
      let existingEnv = '';
      if (fs.existsSync(envPath)) {
        existingEnv = fs.readFileSync(envPath, 'utf8');
      }

      // Update environment variables
      let updatedEnv = updateEnvVars(existingEnv, envVars);
      
      // Write back to .env.local
      fs.writeFileSync(envPath, updatedEnv, 'utf8');
      
      console.log(`✅ ${type.toUpperCase()} settings saved to .env.local`);
      
      // Also update process.env for immediate use
      Object.entries(envVars).forEach(([key, value]) => {
        process.env[key] = value;
      });

      return NextResponse.json({
        success: true,
        message: `${type.toUpperCase()} settings saved successfully`,
        data: {
          type,
          configKeys: Object.keys(envVars),
          savedAt: new Date().toISOString()
        }
      });

    } catch (fileError) {
      console.error('❌ File system error:', fileError);
      
      // Fallback: at least update process.env for current session
      Object.entries(envVars).forEach(([key, value]) => {
        process.env[key] = value;
      });
      
      return NextResponse.json({
        success: true,
        message: `${type.toUpperCase()} settings saved to session (restart may reset)`,
        warning: 'Could not save to .env.local file - settings may not persist across restarts',
        data: {
          type,
          configKeys: Object.keys(envVars),
          savedAt: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('❌ System settings save error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save system settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📖 Loading system settings...');
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (!type) {
      return NextResponse.json({
        success: false,
        error: 'Missing type parameter'
      }, { status: 400 });
    }

    // Load settings from environment variables
    const config = loadConfigFromEnvVars(type);
    
    return NextResponse.json({
      success: true,
      data: {
        type,
        config,
        loadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ System settings load error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to load system settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to convert config object to environment variables
function convertConfigToEnvVars(type: string, config: any): Record<string, string> {
  const envVars: Record<string, string> = {};
  
  switch (type) {
    case 'smtp':
      envVars.SMTP_ENABLED = config.enabled ? 'true' : 'false';
      envVars.EMAIL_SERVICE = config.service;
      envVars.SMTP_HOST = config.host || '';
      envVars.SMTP_PORT = config.port ? config.port.toString() : '587';
      envVars.SMTP_SECURE = config.secure ? 'true' : 'false';
      envVars.SMTP_USER = config.username || '';
      envVars.SMTP_PASSWORD = config.password || '';
      envVars.FROM_EMAIL = config.fromEmail || '';
      envVars.FROM_NAME = config.fromName || '';
      envVars.REPLY_TO_EMAIL = config.replyToEmail || '';
      if (config.apiKey) envVars.SENDGRID_API_KEY = config.apiKey;
      if (config.region) envVars.AWS_REGION = config.region;
      break;
      
    case 'sms':
      envVars.SMS_ENABLED = config.enabled ? 'true' : 'false';
      envVars.SMS_SERVICE = config.service;
      envVars.SMS_FROM_NUMBER = config.fromNumber || '';
      if (config.accountSid) envVars.TWILIO_ACCOUNT_SID = config.accountSid;
      if (config.authToken) envVars.TWILIO_AUTH_TOKEN = config.authToken;
      if (config.apiKey) envVars.SMS_API_KEY = config.apiKey;
      if (config.apiSecret) envVars.SMS_API_SECRET = config.apiSecret;
      if (config.region) envVars.SMS_REGION = config.region;
      break;
      
    case 'payment':
      envVars.STRIPE_ENABLED = config.stripeEnabled ? 'true' : 'false';
      envVars.STRIPE_PUBLISHABLE_KEY = config.stripePublishableKey || '';
      envVars.STRIPE_SECRET_KEY = config.stripeSecretKey || '';
      envVars.STRIPE_WEBHOOK_SECRET = config.stripeWebhookSecret || '';
      envVars.RAZORPAY_ENABLED = config.razorpayEnabled ? 'true' : 'false';
      envVars.RAZORPAY_KEY_ID = config.razorpayKeyId || '';
      envVars.PAYMENT_CURRENCY = config.currency || 'USD';
      envVars.PAYMENT_TEST_MODE = config.testMode ? 'true' : 'false';
      break;
  }
  
  return envVars;
}

// Helper function to load config from environment variables
function loadConfigFromEnvVars(type: string): any {
  switch (type) {
    case 'smtp':
      return {
        enabled: process.env.SMTP_ENABLED === 'true',
        service: process.env.EMAIL_SERVICE || 'smtp',
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        username: process.env.SMTP_USER || '',
        password: process.env.SMTP_PASSWORD || '',
        fromEmail: process.env.FROM_EMAIL || '',
        fromName: process.env.FROM_NAME || '',
        replyToEmail: process.env.REPLY_TO_EMAIL || '',
        apiKey: process.env.SENDGRID_API_KEY || '',
        region: process.env.AWS_REGION || 'us-east-1'
      };
      
    case 'sms':
      return {
        enabled: process.env.SMS_ENABLED === 'true',
        service: process.env.SMS_SERVICE || 'twilio',
        fromNumber: process.env.SMS_FROM_NUMBER || '',
        accountSid: process.env.TWILIO_ACCOUNT_SID || '',
        authToken: process.env.TWILIO_AUTH_TOKEN || '',
        apiKey: process.env.SMS_API_KEY || '',
        apiSecret: process.env.SMS_API_SECRET || '',
        region: process.env.SMS_REGION || 'us-east-1'
      };
      
    case 'payment':
      return {
        stripeEnabled: process.env.STRIPE_ENABLED === 'true',
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
        stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
        razorpayEnabled: process.env.RAZORPAY_ENABLED === 'true',
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
        currency: process.env.PAYMENT_CURRENCY || 'USD',
        testMode: process.env.PAYMENT_TEST_MODE === 'true'
      };
      
    default:
      return {};
  }
}

// Helper function to update environment variables in .env.local content
function updateEnvVars(existingEnv: string, newVars: Record<string, string>): string {
  let lines = existingEnv.split('\n');
  
  // Update existing variables and track which ones we've processed
  const processedVars = new Set<string>();
  
  lines = lines.map(line => {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) {
      return line;
    }
    
    const [key] = line.split('=');
    if (key && newVars.hasOwnProperty(key)) {
      processedVars.add(key);
      return `${key}=${newVars[key]}`;
    }
    
    return line;
  });
  
  // Add new variables that weren't in the existing file
  Object.entries(newVars).forEach(([key, value]) => {
    if (!processedVars.has(key)) {
      lines.push(`${key}=${value}`);
    }
  });
  
  // Remove any empty lines at the end and ensure file ends with newline
  while (lines.length > 0 && !lines[lines.length - 1].trim()) {
    lines.pop();
  }
  
  return lines.join('\n') + '\n';
}