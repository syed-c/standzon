// Authentication Configuration for ExhibitBay Phase 4
// Simple user management system - works with Convex auth

// Mock user database - In production, this would connect to your actual database
const users = new Map();

// User management functions
export class UserManager {
  static async createUser(userData: {
    email: string;
    password: string;
    name: string;
    role: 'client' | 'builder';
    companyName?: string;
    phone?: string;
    country: string;
  }) {
    const bcrypt = require('bcryptjs');
    const { v4: uuidv4 } = require('uuid');
    
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const userId = uuidv4();
    
    const user = {
      id: userId,
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role,
      companyName: userData.companyName,
      phone: userData.phone,
      country: userData.country,
      verified: false,
      createdAt: new Date().toISOString(),
      avatar: null,
      profile: {
        companyName: userData.companyName,
        address: {
          city: '',
          country: userData.country,
        },
        timezone: 'UTC',
        language: 'en',
      },
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        marketingEmails: true,
        weeklyDigest: true,
        preferredCurrency: 'USD',
        preferredLanguage: 'en',
        theme: 'light' as const,
      },
    };
    
    users.set(userData.email, user);
    console.log('User created:', { id: userId, email: userData.email, role: userData.role });
    
    return {
      id: userId,
      email: userData.email,
      name: userData.name,
      role: userData.role,
    };
  }
  
  static async getUserByEmail(email: string) {
    return users.get(email) || null;
  }
  
  static async updateUser(userId: string, updates: any) {
    for (const [email, user] of Array.from(users.entries())) {
      if (user.id === userId) {
        const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
        users.set(email, updatedUser);
        console.log('User updated:', { id: userId, updates });
        return updatedUser;
      }
    }
    return null;
  }
  
  static async deleteUser(userId: string) {
    for (const [email, user] of Array.from(users.entries())) {
      if (user.id === userId) {
        users.delete(email);
        console.log('User deleted:', { id: userId });
        return true;
      }
    }
    return false;
  }
  
  static getAllUsers() {
    return Array.from(users.values());
  }
  
  static getUserStats() {
    const allUsers = Array.from(users.values());
    return {
      total: allUsers.length,
      clients: allUsers.filter(user => user.role === 'client').length,
      builders: allUsers.filter(user => user.role === 'builder').length,
      verified: allUsers.filter(user => user.verified).length,
      unverified: allUsers.filter(user => !user.verified).length,
    };
  }
}

// Authentication utilities
export const getServerSession = async () => {
  // This would typically use Convex auth
  // For now, returning a mock session for development
  return null;
};

export const requireAuth = (role?: 'client' | 'builder' | 'admin') => {
  return async (req: any, res: any, next: any) => {
    const session = await getServerSession();
    
    if (!session) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }
    
    // Type assertion since we know the structure in our implementation
    const userSession = session as any;
    if (role && userSession.user?.role !== role) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }
    
    req.user = userSession.user;
    next();
  };
};

console.log('Authentication configuration loaded for ExhibitBay Phase 4');