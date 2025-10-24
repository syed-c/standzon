#!/usr/bin/env node

// Test script to debug OTP verification
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testOTP() {
  console.log('🔍 Testing OTP verification...');
  
  // Test 1: Check if builder exists
  console.log('\n1. Checking if builder exists...');
  const { data: builder, error: builderError } = await supabase
    .from('builder_profiles')
    .select('*')
    .eq('primary_email', 'syedrayyan7117@gmail.com')
    .single();
  
  if (builderError) {
    console.error('❌ Builder not found:', builderError);
    return;
  }
  
  console.log('✅ Builder found:', builder.company_name);
  
  // Test 2: Test OTP generation
  console.log('\n2. Testing OTP generation...');
  const generateResponse = await fetch('http://localhost:3000/api/auth/otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'generate',
      email: 'syedrayyan7117@gmail.com',
      userType: 'builder'
    })
  });
  
  const generateData = await generateResponse.json();
  console.log('📧 OTP Generation Response:', generateData);
  
  if (generateData.success && generateData.data.demoOTP) {
    const otp = generateData.data.demoOTP;
    console.log('🔑 Generated OTP:', otp);
    
    // Test 3: Test OTP verification
    console.log('\n3. Testing OTP verification...');
    const verifyResponse = await fetch('http://localhost:3000/api/auth/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'verify',
        email: 'syedrayyan7117@gmail.com',
        otp: otp,
        userType: 'builder'
      })
    });
    
    const verifyData = await verifyResponse.json();
    console.log('🔐 OTP Verification Response:', verifyData);
    
    if (verifyData.success) {
      console.log('✅ OTP verification successful!');
    } else {
      console.log('❌ OTP verification failed:', verifyData.error);
    }
  } else {
    console.log('❌ OTP generation failed:', generateData.error);
  }
}

testOTP().catch(console.error);
