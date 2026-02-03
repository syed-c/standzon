import React from 'react';
import { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import PaymentProcessor from '@/components/PaymentProcessor';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = siteMetadata['/subscription'];

// Mock user session - In production, this would come from authentication
const mockUser = {
  id: 'user-123',
  type: 'builder' as const, // Change to 'client' to see client subscription options
  name: 'Klaus Mueller',
  email: 'klaus@expodesigngermany.com',
  company: 'Expo Design Germany'
};

export default function SubscriptionPage() {
  console.log('Subscription page loaded for user:', mockUser);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        <PaymentProcessor 
          userType={mockUser.type}
          userId={mockUser.id}
        />
      </main>
      
      <Footer />
    </div>
  );
}
