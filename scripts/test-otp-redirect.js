#!/usr/bin/env node

// Test script to verify OTP verification and redirect
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testOTPRedirect() {
  console.log('🔍 Testing OTP verification and redirect...');
  
  // Test 1: Generate OTP
  console.log('\n1. Generating OTP...');
  const generateResponse = await fetch('http://localhost:3000/api/auth/otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'generate',
      email: 'contact@syedrayyan.com',
      userType: 'builder'
    })
  });
  
  const generateData = await generateResponse.json();
  console.log('📧 OTP Generation Response:', generateData);
  
  if (generateData.success && generateData.data.demoOTP) {
    const otp = generateData.data.demoOTP;
    console.log('🔑 Generated OTP:', otp);
    
    // Test 2: Verify OTP
    console.log('\n2. Verifying OTP...');
    const verifyResponse = await fetch('http://localhost:3000/api/auth/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'verify',
        email: 'contact@syedrayyan.com',
        otp: otp,
        userType: 'builder'
      })
    });
    
    const verifyData = await verifyResponse.json();
    console.log('🔐 OTP Verification Response:', verifyData);
    
    if (verifyData.success) {
      console.log('✅ OTP verification successful!');
      console.log('👤 User data:', verifyData.data.user);
      console.log('🏢 Company:', verifyData.data.user.companyName);
      console.log('📧 Email:', verifyData.data.user.email);
      console.log('🆔 ID:', verifyData.data.user.id);
      
      // Test 3: Check if dashboard is accessible
      console.log('\n3. Testing dashboard access...');
      const dashboardResponse = await fetch('http://localhost:3000/builder/dashboard');
      console.log('📊 Dashboard Status:', dashboardResponse.status);
      
      if (dashboardResponse.status === 200) {
        console.log('✅ Dashboard is accessible');
      } else {
        console.log('❌ Dashboard access failed');
      }
    } else {
      console.log('❌ OTP verification failed:', verifyData.error);
    }
  } else {
    console.log('❌ OTP generation failed:', generateData.error);
  }
}

testOTPRedirect().catch(console.error);
