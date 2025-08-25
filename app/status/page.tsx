'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SystemStatusPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage since status page is for admins only
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to admin dashboard...</p>
      </div>
    </div>
  );
}