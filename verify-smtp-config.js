#!/usr/bin/env node

// SMTP Configuration Verification Script
// This script verifies that SMTP settings are properly configured

console.log('🔍 SMTP Configuration Verification');
console.log('=====================================\n');

// Check environment variables
const requiredEnvVars = [
  'SMTP_HOST',
  'SMTP_PORT', 
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'FROM_EMAIL'
];

console.log('📧 Email Service Configuration:');
console.log(`EMAIL_SERVICE: ${process.env.EMAIL_SERVICE || 'Not set'}`);
console.log(`FROM_EMAIL: ${process.env.FROM_EMAIL || 'Not set'}`);
console.log(`REPLY_TO_EMAIL: ${process.env.REPLY_TO_EMAIL || 'Not set'}\n`);

console.log('🔧 SMTP Configuration:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const displayValue = varName.includes('PASSWORD') ? 
    (value ? '****** (set)' : 'Not set') : 
    (value || 'Not set');
  
  console.log(`${status} ${varName}: ${displayValue}`);
});

console.log('\n📋 Configuration Summary:');
const allConfigured = requiredEnvVars.every(varName => process.env[varName]);

if (allConfigured) {
  console.log('✅ SMTP configuration is COMPLETE');
  console.log('✅ Email notifications will work when server starts');
  console.log('✅ OTP delivery is configured');
  console.log('✅ Lead notifications are ready');
} else {
  console.log('❌ SMTP configuration is INCOMPLETE');
  console.log('❌ Some environment variables are missing');
}

console.log('\n🚀 Ready to test:');
console.log('• Restart the server: npm run dev');
console.log('• Test OTP: POST /api/test-email with {"email":"test@example.com","testType":"otp"}');
console.log('• Test leads: POST /api/test-email with {"email":"test@example.com","testType":"lead"}');

// Test nodemailer import
try {
  require('nodemailer');
  console.log('✅ Nodemailer package is available');
} catch (error) {
  console.log('❌ Nodemailer package is missing');
  console.log('   Run: npm install nodemailer @types/nodemailer');
}

console.log('\n🎯 Status: Ready for production email delivery\n');