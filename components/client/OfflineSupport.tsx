'use client';

import { useEffect, useState } from 'react';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { Button } from '@/components/shared/button';

export default function OfflineSupport() {
  const [isOnline, setIsOnline] = useState(true);
  const [recentlyVisited, setRecentlyVisited] = useState<any[]>([]);
  const { getRecentlyVisited, isLoading } = useIndexedDB();

  useEffect(() => {
    // Update online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status
    setIsOnline(navigator.onLine);
    
    // Load recently visited pages
    loadRecentlyVisited();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadRecentlyVisited = async () => {
    const pages = await getRecentlyVisited(5);
    setRecentlyVisited(pages);
  };

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-80 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Currently Offline</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>You can still access previously visited pages.</p>
            
            {recentlyVisited.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Recently visited:</p>
                <ul className="mt-1 space-y-1">
                  {recentlyVisited.map((page) => (
                    <li key={page.url}>
                      <a 
                        href={page.url} 
                        className="text-yellow-600 hover:text-yellow-500 underline"
                      >
                        {page.title || page.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="mt-3 flex">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}