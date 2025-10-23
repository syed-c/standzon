#!/usr/bin/env node

// Simple script to get the current OTP for testing
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// This is a development helper - in production, OTPs should be sent via email/SMS
console.log('🔍 Current OTP for testing:');
console.log('📧 Email: sacramentokenneth8@gmail.com');
console.log('🔑 UserType: builder');
console.log('');
console.log('💡 To get the current OTP:');
console.log('1. Go to http://localhost:3000/auth/login');
console.log('2. Switch to "OTP Login" tab');
console.log('3. Enter your email and click "Send OTP"');
console.log('4. Check the server logs for the generated OTP');
console.log('5. Or check your email for the OTP');
console.log('');
console.log('⚠️  Note: OTPs expire in 10 minutes and are single-use');
