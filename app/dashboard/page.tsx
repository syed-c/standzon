import React from 'react';
import { Metadata } from 'next';
import UserDashboard from '@/components/UserDashboard';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Dashboard - ExhibitBay',
  description: 'Manage your exhibition stand projects, quotes, and account settings.',
};

// Mock user session - In production, this would come from authentication
const mockUser = {
  id: 'user-123',
  type: 'client' as const, // Change to 'builder' to see builder dashboard
  name: 'John Doe',
  email: 'john@techcorp.com',
  avatar: '/images/avatars/john-doe.jpg'
};

export default function DashboardPage() {
  console.log('Dashboard page loaded for user:', mockUser);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 lg:pt-24">
        <UserDashboard 
          userType={mockUser.type}
          userId={mockUser.id}
        />
      </main>
      
      <Footer />
    </div>
  );
}