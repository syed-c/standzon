import React from 'react';
import { Metadata } from 'next';
import siteMetadata from '@/app/metadata.json';
import MessagingSystem from '@/components/MessagingSystem';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = siteMetadata['/messaging'];

// Mock user session - In production, this would come from authentication
const mockUser = {
  id: 'user-123',
  type: 'client' as const, // Change to 'builder' to see builder perspective
  name: 'John Doe',
  email: 'john@techcorp.com'
};

export default function MessagingPage() {
  console.log('Messaging page loaded for user:', mockUser);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-2">
              Communicate with {mockUser.type === 'client' ? 'exhibition stand builders' : 'potential clients'} 
              and manage your conversations
            </p>
          </div>
          
          <MessagingSystem 
            userId={mockUser.id}
            userType={mockUser.type}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
