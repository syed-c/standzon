import React from 'react';
import { Metadata } from 'next';
import AuthPage from '@/components/AuthPage';

export const metadata: Metadata = {
  title: 'Register - ExhibitBay',
  description: 'Create your ExhibitBay account to connect with exhibition stand builders worldwide.',
};

interface RegisterPageProps {
  searchParams: Promise<{
    type?: 'builder' | 'client';
  }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const userType = params.type || 'client';
  
  console.log('Registration page loaded for user type:', userType);

  return (
    <AuthPage 
      mode="register" 
      userType={userType}
    />
  );
}