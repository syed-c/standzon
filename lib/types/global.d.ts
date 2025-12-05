// Global type declarations for Node.js global object extensions

declare global {
  var otpStorage: Map<string, {
    otp: string;
    builderId: string;
    contact: string;
    method: 'phone' | 'email';
    generatedAt: string;
    expiresAt: string;
    attempts: number;
    verified: boolean;
    verifiedAt?: string;
  }> | undefined;

  var verificationLogs: Array<{
    builderId: string;
    method: 'phone' | 'email';
    contact: string;
    verifiedAt: string;
    attempts: number;
    ipAddress: string;
    userAgent: string;
  }> | undefined;

  var claimRecords: Array<{
    id: string;
    builderId: string;
    claimStatus: string;
    claimed: boolean;
    planType: string;
    claimedAt: string;
    verificationMethod?: string;
    contactVerified?: string;
    businessLocation?: string;
    ipAddress?: string;
    userAgent?: string;
    gmbImported?: boolean;
    verificationTimestamp?: string;
  }> | undefined;

  var cacheInvalidations: Array<{
    builderId: string;
    type: string;
    timestamp: string;
    affectedPages: string[];
  }> | undefined;

  var gmbImportedBuilders: string | undefined;
}

export {};