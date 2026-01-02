"use client";

import React, { useEffect, useState } from 'react';

interface RoleBoundaryProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'builder' | 'client' | 'super_admin')[];
  fallback?: React.ReactNode;
}

/**
 * RoleBoundary component for role-based access control within protected pages.
 * Unlike AuthBoundary, it doesn't necessarily redirect, but can show fallback UI.
 */
export default function RoleBoundary({ children, allowedRoles, fallback }: RoleBoundaryProps) {
  const [hasRole, setHasRole] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRole = () => {
      const currentUserStr = localStorage.getItem('currentUser');
      if (!currentUserStr) {
        setHasRole(false);
        return;
      }

      try {
        const currentUser = JSON.parse(currentUserStr);
        // Handle both 'admin' and 'super_admin' roles if needed
        const currentRole = currentUser.role;
        const isAllowed = allowedRoles.includes(currentRole);
        setHasRole(isAllowed);
      } catch (e) {
        console.error('RoleBoundary: Error parsing user session', e);
        setHasRole(false);
      }
    };

    checkRole();
  }, [allowedRoles]);

  // Show nothing or small loading state while checking
  if (hasRole === null) return null;

  // If role not allowed, show fallback
  if (!hasRole) {
    return fallback || (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
        <h3 className="font-bold">Access Denied</h3>
        <p>You don&apos;t have the required permissions to view this content.</p>
      </div>
    );
  }

  return <>{children}</>;
}
