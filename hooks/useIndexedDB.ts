import { useEffect, useState } from 'react';

// Types for IndexedDB data
interface CachedPage {
  url: string;
  content: string;
  timestamp: number;
}

interface UserPreference {
  key: string;
  value: any;
  timestamp: number;
}

interface RecentlyVisited {
  url: string;
  title: string;
  timestamp: number;
}

// Hook to interact with IndexedDB cache
export const useIndexedDB = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if IndexedDB is supported
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      setIsSupported(true);
    }
    setIsLoading(false);
  }, []);

  // Save a page to cache
  const savePage = async (url: string, content: string): Promise<void> => {
    if (!isSupported) return;
    
    try {
      const db: any = (window as any).indexedDBCache;
      if (db && typeof db.savePage === 'function') {
        await db.savePage(url, content);
      }
    } catch (error) {
      console.warn('Failed to save page to cache:', error);
    }
  };

  // Get a page from cache
  const getPage = async (url: string): Promise<string | null> => {
    if (!isSupported) return null;
    
    try {
      const db: any = (window as any).indexedDBCache;
      if (db && typeof db.getPage === 'function') {
        return await db.getPage(url);
      }
      return null;
    } catch (error) {
      console.warn('Failed to get page from cache:', error);
      return null;
    }
  };

  // Save user preference
  const saveUserPreference = async (key: string, value: any): Promise<void> => {
    if (!isSupported) return;
    
    try {
      const db: any = (window as any).indexedDBCache;
      if (db && typeof db.saveUserPreference === 'function') {
        await db.saveUserPreference(key, value);
      }
    } catch (error) {
      console.warn('Failed to save user preference:', error);
    }
  };

  // Get user preference
  const getUserPreference = async (key: string): Promise<any> => {
    if (!isSupported) return null;
    
    try {
      const db: any = (window as any).indexedDBCache;
      if (db && typeof db.getUserPreference === 'function') {
        return await db.getUserPreference(key);
      }
      return null;
    } catch (error) {
      console.warn('Failed to get user preference:', error);
      return null;
    }
  };

  // Add recently visited page
  const addRecentlyVisited = async (url: string, title: string): Promise<void> => {
    if (!isSupported) return;
    
    try {
      const db: any = (window as any).indexedDBCache;
      if (db && typeof db.addRecentlyVisited === 'function') {
        await db.addRecentlyVisited(url, title);
      }
    } catch (error) {
      console.warn('Failed to add recently visited page:', error);
    }
  };

  // Get recently visited pages
  const getRecentlyVisited = async (limit: number = 10): Promise<RecentlyVisited[]> => {
    if (!isSupported) return [];
    
    try {
      const db: any = (window as any).indexedDBCache;
      if (db && typeof db.getRecentlyVisited === 'function') {
        return await db.getRecentlyVisited(limit);
      }
      return [];
    } catch (error) {
      console.warn('Failed to get recently visited pages:', error);
      return [];
    }
  };

  return {
    isSupported,
    isLoading,
    savePage,
    getPage,
    saveUserPreference,
    getUserPreference,
    addRecentlyVisited,
    getRecentlyVisited
  };
};

export default useIndexedDB;