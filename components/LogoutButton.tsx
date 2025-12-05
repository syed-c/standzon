'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
  redirectTo?: string;
}

export default function LogoutButton({ 
  variant = 'outline',
  size = 'default',
  className,
  showIcon = true,
  showText = true,
  redirectTo = '/auth/login'
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      console.log('🔓 Logging out user...');

      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Logout successful');
        
        // Clear local storage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('auth-token');
        localStorage.removeItem('builderUserData');
        
        // Clear session storage
        sessionStorage.clear();

        // Redirect to login page
        router.push(redirectTo);
        
        // Force page refresh to clear any cached data
        setTimeout(() => {
          window.location.reload();
        }, 100);
        
      } else {
        console.error('❌ Logout failed:', data.error);
        // Still clear local data even if API fails
        localStorage.removeItem('currentUser');
        localStorage.removeItem('auth-token');
        localStorage.removeItem('builderUserData');
        router.push(redirectTo);
      }

    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Clear local data even on network error
      localStorage.removeItem('currentUser');
      localStorage.removeItem('auth-token');
      localStorage.removeItem('builderUserData');
      router.push(redirectTo);
      
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={cn(
        "transition-colors",
        variant === 'outline' && "text-gray-900 hover:text-red-600 hover:border-red-300",
        className
      )}
    >
      {isLoggingOut ? (
        <Loader2 className={cn("animate-spin", showText && "mr-2", "h-4 w-4")} />
      ) : (
        showIcon && <LogOut className={cn(showText && "mr-2", "h-4 w-4")} />
      )}
      {showText && (isLoggingOut ? 'Signing Out...' : 'Sign Out')}
    </Button>
  );
}