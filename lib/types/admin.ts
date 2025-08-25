import { User } from './user';

export interface AdminUser extends Omit<User, 'role'> {
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: AdminPermission[];
  lastLogin: string;
  loginCount: number;
  ipAddress?: string;
  sessionId?: string;
}

export interface AdminPermission {
  id: string;
  name: string;
  module: 'users' | 'content' | 'payments' | 'analytics' | 'settings';
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
}

export interface PlatformKPI {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  totalBuilders: number;
  verifiedBuilders: number;
  pendingBuilders: number;
  totalQuoteRequests: number;
  newQuotesToday: number;
  activeConversations: number;
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageResponseTime: number;
  platformRating: number;
}

export interface UserManagement {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'builder' | 'admin';
  status: 'active' | 'pending' | 'suspended' | 'banned';
  verified: boolean;
  createdAt: string;
  lastActive?: string;
  subscriptionPlan?: string;
  totalSpent?: number;
  quotesSubmitted?: number;
  quotesReceived?: number;
  averageRating?: number;
  location: {
    country: string;
    city: string;
  };
}

export interface ContentManagement {
  countries: CountryData[];
  cities: CityData[];
  tradeShows: TradeShowData[];
  blogPosts: BlogPost[];
  pages: PageContent[];
}

export interface CountryData {
  id: string;
  name: string;
  code: string;
  flag: string;
  active: boolean;
  builderCount: number;
  cityCount: number;
  tradeShowCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CityData {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  active: boolean;
  builderCount: number;
  tradeShowCount: number;
  averageRating: number;
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeShowData {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  venue: string;
  startDate: string;
  endDate: string;
  industry: string[];
  description: string;
  website?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  featured: boolean;
  builderCount: number;
  quoteRequests: number;
  seoTitle?: string;
  seoDescription?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageContent {
  id: string;
  page: 'homepage' | 'about' | 'contact' | 'pricing' | 'privacy' | 'terms';
  sections: PageSection[];
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface PageSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'cta' | 'text' | 'image' | 'video';
  content: any;
  order: number;
  visible: boolean;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  type: 'subscription' | 'one_time' | 'refund';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'paypal' | 'bank_transfer';
  subscriptionPlan?: string;
  description: string;
  stripePaymentId?: string;
  paypalTransactionId?: string;
  createdAt: string;
  processedAt?: string;
}

export interface QuoteRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  tradeShow: string;
  country: string;
  city: string;
  standSize: number;
  budget: string;
  timeline: string;
  description: string;
  requirements: string[];
  status: 'pending' | 'matched' | 'in_progress' | 'completed' | 'cancelled';
  matchedBuilders: string[];
  responseCount: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  overview: {
    totalVisits: number;
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: number;
    averageSessionDuration: number;
    conversionRate: number;
  };
  traffic: {
    daily: TrafficData[];
    weekly: TrafficData[];
    monthly: TrafficData[];
  };
  geographic: {
    country: string;
    visitors: number;
    conversions: number;
  }[];
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  sources: {
    organic: number;
    direct: number;
    social: number;
    referral: number;
    email: number;
  };
}

export interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  conversions: number;
}

export interface BuilderProfile {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  logo?: string;
  description: string;
  services: string[];
  locations: {
    country: string;
    cities: string[];
  }[];
  portfolio: PortfolioItem[];
  certifications: string[];
  experience: number;
  teamSize: string;
  languages: string[];
  availability: 'available' | 'busy' | 'unavailable';
  responseTime: string;
  subscriptionPlan: 'free' | 'professional' | 'enterprise';
  subscriptionExpiry?: string;
  rating: {
    overall: number;
    quality: number;
    communication: number;
    timeline: number;
    value: number;
    totalReviews: number;
  };
  stats: {
    profileViews: number;
    quoteRequests: number;
    responseRate: number;
    completedProjects: number;
    repeatClients: number;
  };
  socialMedia: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  bankingInfo?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
    swift?: string;
  };
  documents: {
    businessLicense?: string;
    insurance?: string;
    taxCertificate?: string;
  };
  createdAt: string;
  updatedAt: string;
  lastActive: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  tradeShow: string;
  year: number;
  standSize: number;
  budget: string;
  images: string[];
  client?: string;
  featured: boolean;
  createdAt: string;
}

export interface NotificationData {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  recipients: 'all' | 'builders' | 'clients' | 'admins';
  targetUsers?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled?: string;
  sentAt?: string;
  readBy: string[];
  createdBy: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: 'technical' | 'billing' | 'account' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  responses: TicketResponse[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface TicketResponse {
  id: string;
  message: string;
  author: string;
  authorType: 'user' | 'admin';
  attachments?: string[];
  createdAt: string;
}

export interface SystemSettings {
  general: {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    supportEmail: string;
    phone: string;
    address: string;
    timezone: string;
    currency: string;
    language: string;
  };
  features: {
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
    adminApprovalRequired: boolean;
    builderSubscriptionRequired: boolean;
    reviewModerationEnabled: boolean;
    chatEnabled: boolean;
    paymentEnabled: boolean;
  };
  integrations: {
    stripe: {
      enabled: boolean;
      publicKey?: string;
      webhookSecret?: string;
    };
    paypal: {
      enabled: boolean;
      clientId?: string;
    };
    email: {
      provider: 'smtp' | 'sendgrid' | 'mailgun';
      configuration: any;
    };
    analytics: {
      googleAnalyticsId?: string;
      facebookPixelId?: string;
    };
  };
  limits: {
    maxFileSize: number;
    maxImages: number;
    quotesPerMonth: {
      free: number;
      professional: number;
      enterprise: number;
    };
    apiRateLimit: number;
  };
}