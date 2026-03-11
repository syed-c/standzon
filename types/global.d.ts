/**
 * Global type declarations for StandZone
 * FIXED: Pattern 3 - Untyped global/window property access
 */

export {};

declare global {
  interface Window {
    // Add custom window properties here if needed
  }

  var notificationLogs: any[] | undefined;
  var gmbImportedBuilders: string | undefined;
}
