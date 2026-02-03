'use client';

import { useEffect } from 'react';

/**
 * Non-critical scripts that should be loaded after initial render
 * This helps improve FCP and LCP by deferring non-essential scripts
 */
export default function NonCriticalScripts() {
  useEffect(() => {
    // Load non-critical scripts after the page has loaded
    const loadScripts = () => {
      // Example: analytics, chat widgets, social media embeds
      // Add your non-critical scripts here
      
      // Using setTimeout to ensure it runs after initial render
      setTimeout(() => {
        // Load external scripts dynamically if needed
        // For example:
        // const script = document.createElement('script');
        // script.src = 'https://analytics-provider.com/script.js';
        // document.head.appendChild(script);
      }, 3000); // Load after 3 seconds to ensure good initial metrics
    };

    // Wait for the page to be fully loaded
    if (document.readyState === 'complete') {
      loadScripts();
    } else {
      window.addEventListener('load', loadScripts);
      return () => window.removeEventListener('load', loadScripts);
    }
  }, []);

  return null; // This component doesn't render anything
}