// Mock database client - replaces Prisma for this project
// This project uses Convex for actual database operations

interface MockDatabase {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
}

interface MockTable {
  findMany(): Promise<any[]>;
  findUnique(args: any): Promise<any>;
  create(args: any): Promise<any>;
  update(args: any): Promise<any>;
  delete(args: any): Promise<any>;
  deleteMany(args?: any): Promise<any>;
  upsert(args: any): Promise<any>;
  count(): Promise<number>;
}

class MockDatabaseClient implements MockDatabase {
  // Mock database tables for compatibility
  user: MockTable;
  builderProfile: MockTable;
  tradeShow: MockTable;
  session: MockTable;
  account: MockTable;
  subscription: MockTable;
  builderLocation: MockTable;
  builderService: MockTable;
  portfolioItem: MockTable;
  lead: MockTable;
  quote: MockTable;
  review: MockTable;
  notification: MockTable;
  quoteItem: MockTable;
  leadNote: MockTable;
  leadAssignment: MockTable;

  constructor() {
    // Initialize mock tables
    const mockTable: MockTable = {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
      deleteMany: async () => ({ count: 0 }),
      upsert: async () => ({}),
      count: async () => 0
    };

    this.user = mockTable;
    this.builderProfile = mockTable;
    this.tradeShow = mockTable;
    this.session = mockTable;
    this.account = mockTable;
    this.subscription = mockTable;
    this.builderLocation = mockTable;
    this.builderService = mockTable;
    this.portfolioItem = mockTable;
    this.lead = mockTable;
    this.quote = mockTable;
    this.review = mockTable;
    this.notification = mockTable;
    this.quoteItem = mockTable;
    this.leadNote = mockTable;
    this.leadAssignment = mockTable;
  }

  async $connect(): Promise<void> {
    console.log('Mock database connected');
  }

  async $disconnect(): Promise<void> {
    console.log('Mock database disconnected');
  }
}

const globalForMockDb = globalThis as unknown as {
  mockDb: MockDatabaseClient | undefined
}

export const mockDb = globalForMockDb.mockDb ?? new MockDatabaseClient()

if (process.env.NODE_ENV !== 'production') globalForMockDb.mockDb = mockDb

// Export as prisma for compatibility with existing code
export const prisma = mockDb

// Database connection helper
export async function connectDatabase(): Promise<boolean> {
  try {
    await mockDb.$connect()
    console.log('✅ Mock database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Mock database connection failed:', error)
    return false
  }
}

// Simple initialization without seeding to avoid circular dependency
export async function ensureDatabaseSetup(): Promise<boolean> {
  try {
    // Just connect, don't seed here to avoid circular dependency
    await mockDb.$connect()
    console.log('✅ Mock database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Mock database setup failed:', error)
    return false
  }
}

export default mockDb

