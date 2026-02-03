#!/usr/bin/env node

// Complete OTP flow test
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCompleteOTPFlow() {
  console.log('🔍 Testing complete OTP flow...');
  
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
      
      // Test 3: Simulate localStorage data that should be stored
      console.log('\n3. Simulating localStorage data...');
      const expectedUserData = {
        ...verifyData.data.user,
        isLoggedIn: true,
        loginMethod: "otp",
      };
      console.log('💾 Expected localStorage data:', JSON.stringify(expectedUserData, null, 2));
      
      // Test 4: Check dashboard access
      console.log('\n4. Testing dashboard access...');
      const dashboardResponse = await fetch('http://localhost:3000/builder/dashboard');
      console.log('📊 Dashboard Status:', dashboardResponse.status);
      
      if (dashboardResponse.status === 200) {
        console.log('✅ Dashboard is accessible');
        console.log('📄 Dashboard Content Length:', dashboardResponse.headers.get('content-length'));
      } else {
        console.log('❌ Dashboard access failed');
      }
      
      // Test 5: Check if the issue is with authentication
      console.log('\n5. Testing authentication flow...');
      console.log('🔍 User ID:', verifyData.data.user.id);
      console.log('🔍 User Role:', verifyData.data.user.role);
      console.log('🔍 Company Name:', verifyData.data.user.companyName);
      console.log('🔍 Email:', verifyData.data.user.email);
      
    } else {
      console.log('❌ OTP verification failed:', verifyData.error);
    }
  } else {
    console.log('❌ OTP generation failed:', generateData.error);
  }
}

testCompleteOTPFlow().catch(console.error);
