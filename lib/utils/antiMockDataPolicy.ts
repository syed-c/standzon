// SYSTEM ANTI-MOCK-DATA POLICY
// ⚠️ CRITICAL: NO MOCK/DUMMY/DEMO DATA ALLOWED ANYWHERE IN THE SYSTEM
// This file enforces the strict policy that ONLY real data is permitted

export const ANTI_MOCK_DATA_POLICY = {
  ENABLED: true,
  STRICT_MODE: true,
  POLICY_VERSION: '1.0.0',
  LAST_UPDATED: '2024-12-07'
};

// Validation patterns for detecting mock data
const MOCK_DATA_PATTERNS = {
  COMPANY_NAMES: [
    'mock', 'demo', 'test', 'sample', 'example', 'dummy', 'fake', 'temp',
    'prototype', 'placeholder', 'trial', 'beta', 'alpha', 'debug'
  ],
  EMAIL_DOMAINS: [
    'example.com', 'test.com', 'demo.com', 'fake.com', 'dummy.com',
    'placeholder.com', 'mockdata.com', 'testmail.com'
  ],
  PHONE_PATTERNS: [
    '555-0', '123-456', '000-000', '111-111', '222-222', '999-999'
  ],
  GENERIC_NAMES: [
    'john doe', 'jane doe', 'test user', 'demo user', 'sample user',
    'mock person', 'example person', 'business manager', 'test manager'
  ]
};

/**
 * Validates data against mock data patterns
 * @param data - Data to validate
 * @returns ValidationResult with success status and error message
 */
export function validateRealData(data: any): { success: boolean; error?: string } {
  if (!ANTI_MOCK_DATA_POLICY.ENABLED) {
    return { success: true };
  }

  // Check company name
  if (data.companyName) {
    const companyLower = data.companyName.toLowerCase();
    for (const pattern of MOCK_DATA_PATTERNS.COMPANY_NAMES) {
      if (companyLower.includes(pattern)) {
        return {
          success: false,
          error: `Mock company name detected: "${data.companyName}". Only real company names allowed.`
        };
      }
    }
  }

  // Check email domain
  if (data.email || data.primaryEmail) {
    const email = (data.email || data.primaryEmail).toLowerCase();
    for (const domain of MOCK_DATA_PATTERNS.EMAIL_DOMAINS) {
      if (email.includes(domain)) {
        return {
          success: false,
          error: `Mock email detected: "${email}". Only real business emails allowed.`
        };
      }
    }
  }

  // Check phone patterns
  if (data.phone) {
    for (const pattern of MOCK_DATA_PATTERNS.PHONE_PATTERNS) {
      if (data.phone.includes(pattern)) {
        return {
          success: false,
          error: `Mock phone number detected: "${data.phone}". Only real phone numbers allowed.`
        };
      }
    }
  }

  // Check contact person names
  if (data.contactPerson) {
    const nameLower = data.contactPerson.toLowerCase();
    for (const pattern of MOCK_DATA_PATTERNS.GENERIC_NAMES) {
      if (nameLower.includes(pattern)) {
        return {
          success: false,
          error: `Generic name detected: "${data.contactPerson}". Only real contact person names allowed.`
        };
      }
    }
  }

  return { success: true };
}

/**
 * Prevents mock data generation functions from running
 * @param functionName - Name of the function attempting to generate mock data
 */
export function preventMockDataGeneration(functionName: string): never {
  const error = `🚫 SYSTEM POLICY VIOLATION: Mock data generation function "${functionName}" is permanently disabled. Only real data from GMB imports, admin entries, or user registrations is allowed.`;
  
  console.error(error);
  throw new Error(error);
}

/**
 * Logs system policy enforcement
 * @param action - Action being taken
 * @param details - Additional details
 */
export function logPolicyEnforcement(action: string, details?: string): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ANTI-MOCK-DATA POLICY: ${action}${details ? ` - ${details}` : ''}`;
  
  console.log(logMessage);
}

/**
 * Validates bulk import data
 * @param builders - Array of builder data to validate
 * @returns Validation results
 */
export function validateBulkImportData(builders: any[]): {
  valid: any[];
  invalid: Array<{ data: any; error: string }>;
} {
  const valid: any[] = [];
  const invalid: Array<{ data: any; error: string }> = [];

  for (const builder of builders) {
    const validation = validateRealData(builder);
    if (validation.success) {
      valid.push(builder);
    } else {
      invalid.push({
        data: builder,
        error: validation.error || 'Unknown validation error'
      });
    }
  }

  logPolicyEnforcement('BULK_IMPORT_VALIDATION', `${valid.length} valid, ${invalid.length} invalid entries`);

  return { valid, invalid };
}

// Export policy constants
export const REAL_DATA_SOURCES = [
  'GMB_IMPORT',      // Google My Business API imports
  'ADMIN_ENTRY',     // Manual entry by super admin
  'USER_REGISTRATION', // Self-registration by builders
  'CSV_IMPORT'       // Real CSV imports (validated)
] as const;

export type RealDataSource = typeof REAL_DATA_SOURCES[number];

/**
 * Marks data with its source for tracking
 * @param data - Data to mark
 * @param source - Source of the data
 * @returns Data with source metadata
 */
export function markDataSource<T>(data: T, source: RealDataSource): T & { _dataSource: RealDataSource; _timestamp: string } {
  return {
    ...data,
    _dataSource: source,
    _timestamp: new Date().toISOString()
  };
}

// System startup policy enforcement
logPolicyEnforcement('SYSTEM_STARTUP', 'Anti-mock-data policy activated');

console.log('🚫 ANTI-MOCK-DATA POLICY ACTIVE');
console.log('✅ Only real data allowed: GMB imports, admin entries, user registrations');
console.log('🔒 Mock data generation permanently disabled');