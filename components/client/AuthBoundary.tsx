"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthBoundaryProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'builder' | 'client';
  fallback?: React.ReactNode;
}

/**
 * AuthBoundary component for protecting content that requires authentication.
 * Used inside pages, not in layout files.
 */
export default function AuthBoundary({ children, requiredRole, fallback }: AuthBoundaryProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // In a real application, this might check a session via an API call or a context
      // For this implementation, we're checking localStorage for the current user
      const currentUserStr = localStorage.getItem('currentUser');
      
      if (!currentUserStr) {
        setIsAuthorized(false);
        // Redirect to login if no user is found
        const redirectPath = window.location.pathname;
        const loginUrl = `/auth/login?type=${requiredRole || 'builder'}&redirect=${encodeURIComponent(redirectPath)}`;
        router.push(loginUrl);
        return;
      }

      try {
        const currentUser = JSON.parse(currentUserStr);
        
        // If a specific role is required, check it
        if (requiredRole && currentUser.role !== requiredRole) {
          console.warn(`AuthBoundary: Role mismatch. Required: ${requiredRole}, Found: ${currentUser.role}`);
          setIsAuthorized(false);
          // Redirect to a safe place if role doesn't match
          router.push('/');
          return;
        }
        
        setIsAuthorized(true);
      } catch (e) {
        console.error('AuthBoundary: Error parsing user session', e);
        setIsAuthorized(false);
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [requiredRole, router]);

  // Show loading state while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authorized, return fallback or nothing (redirect handled in useEffect)
  if (!isAuthorized) {
    return fallback || null;
  }

  // If authorized, render children
  return <>{children}</>;
}
