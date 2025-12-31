'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthPage from '@/components/shared/AuthPage';

interface LoginPageProps {
  searchParams: Promise<{
    type?: 'admin' | 'builder' | 'client';
    redirect?: string;
  }>;
}

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  
  // Get userType from search params, default to 'builder' so /auth/login works for builders
  const userType = ((searchParams?.get?.('type') as 'admin' | 'builder' | 'client') || 'builder');

  useEffect(() => {
    // Pre-fill email if coming from claim process
    const prefilledEmail = searchParams?.get?.('email');
    const claimed = searchParams?.get?.('claimed');
    
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }
    
    if (claimed === 'true') {
      // Show success message for newly claimed accounts
      setTimeout(() => {
        alert('🎉 Profile claimed successfully! Please login with your new credentials.');
      }, 500);
    }
  }, [searchParams]);

  return (
    <AuthPage 
      mode="login" 
      userType={userType}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
