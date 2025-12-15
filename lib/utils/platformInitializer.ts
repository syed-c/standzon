import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

let initializationPromise: Promise<void> | null = null;
let isInitializing = false;

/**
 * Ensures the unified platform is properly initialized
 * This is especially important in production environments where initialization might fail
 */
export async function ensurePlatformInitialized(): Promise<void> {
  // If already initialized, return immediately
  if (unifiedPlatformAPI.isInitialized()) {
    console.log('✅ Platform already initialized');
    return;
  }
  
  // If already initializing, wait for the existing promise
  if (isInitializing && initializationPromise) {
    console.log('⏳ Waiting for existing initialization to complete...');
    await initializationPromise;
    return;
  }
  
  // Start initialization
  isInitializing = true;
  console.log('🔄 Starting platform initialization...');
  
  try {
    // We don't care about the result, just that initialization happened
    await unifiedPlatformAPI.getBuildersAsync();
    console.log('✅ Platform initialization completed successfully');
  } catch (error) {
    console.error('❌ Error during platform initialization:', error);
    // Reset state so initialization can be retried
    isInitializing = false;
    initializationPromise = null;
    throw error;
  }
  
  // Reset state
  isInitializing = false;
  initializationPromise = null;
}

/**
 * Forces platform initialization with retries
 */
export async function forcePlatformInitialization(maxRetries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Force initialization attempt ${attempt}/${maxRetries}`);
      await ensurePlatformInitialized();
      
      if (unifiedPlatformAPI.isInitialized()) {
        console.log('✅ Platform successfully initialized');
        return true;
      }
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    } catch (error) {
      console.error(`❌ Initialization attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        console.error('❌ All initialization attempts failed');
        return false;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
  
  return false;
}