// Comprehensive SSR error handling utilities
// Goal: Never throw in SSR - always return safe fallbacks

interface SSRGuardOptions<T> {
  fallbackComponent?: T;
  fallbackMetadata?: any;
  componentName?: string;
}

// Universal error handler for SSR operations
export async function handleSSRError<T>(
  operation: () => Promise<T>,
  context: string = 'SSR operation',
  fallbackValue?: T
): Promise<T | null> {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    console.error(`❌ ${context} failed:`, error);
    
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Add your error tracking service integration here
      // Example: Sentry.captureException(error, { context });
    }
    
    return fallbackValue || null;
  }
}

// Higher-order component for SSR protection
export function withSSRGuard<T>(
  Component: React.ComponentType<T>,
  options: SSRGuardOptions<T> = {}
) {
  return async function SSRGuardedComponent(props: T) {
    try {
      return <Component {...props} />;
    } catch (error) {
      console.error('❌ SSR Component error:', error);
      
      if (options.fallbackComponent) {
        return options.fallbackComponent;
      }
      
      // Return null to let error boundary handle it
      throw error;
    }
  };
}