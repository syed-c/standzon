// User Management System for Phase 4 - ExhibitBay Platform

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'builder' | 'admin';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  verified: boolean;
  profile: UserProfile;
  preferences: UserPreferences;
  subscription?: SubscriptionInfo;
}

export interface UserProfile {
  companyName?: string;
  industry?: string;
  website?: string;
  phone?: string;
  address: Address;
  timezone: string;
  language: string;
  bio?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface Address {
  street?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  preferredCurrency: string;
  preferredLanguage: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface SubscriptionInfo {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'trial';
  startDate: string;
  endDate?: string;
  features: string[];
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
}

// Client-specific interfaces
export interface ClientUser extends User {
  role: 'client';
  quoteRequests: QuoteRequestSummary[];
  favoriteBuilders: string[]; // Builder IDs
  eventHistory: EventHistory[];
  reviewsGiven: ReviewSummary[];
  totalSpent: number;
  currency: string;
}

export interface QuoteRequestSummary {
  id: string;
  tradeShow: string;
  createdAt: string;
  status: 'pending' | 'responded' | 'accepted' | 'completed' | 'cancelled';
  responsesCount: number;
  estimatedBudget: number;
  currency: string;
}

export interface EventHistory {
  id: string;
  tradeShow: string;
  year: number;
  city: string;
  country: string;
  builder?: string;
  standSize: number;
  totalCost?: number;
  currency?: string;
  rating?: number;
  photos?: string[];
}

export interface ReviewSummary {
  id: string;
  builderId: string;
  builderName: string;
  tradeShow: string;
  rating: number;
  createdAt: string;
}

// Builder-specific interfaces
export interface BuilderUser extends User {
  role: 'builder';
  companyInfo: BuilderCompanyInfo;
  leadStats: LeadStats;
  subscription: BuilderSubscription;
  analytics: BuilderAnalytics;
  reputation: ReputationScore;
}

export interface BuilderCompanyInfo {
  businessName: string;
  businessLicense: string;
  taxId: string;
  establishedYear: number;
  employeeCount: number;
  serviceAreas: string[]; // City/Country combinations
  specializations: string[];
  certifications: string[];
  insurance: {
    provider: string;
    coverage: number;
    validUntil: string;
  };
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    verified: boolean;
  };
}

export interface LeadStats {
  totalLeads: number;
  monthlyLeads: number;
  responseRate: number; // percentage
  conversionRate: number; // percentage
  averageResponseTime: number; // hours
  totalQuotesSubmitted: number;
  acceptedQuotes: number;
  averageProjectValue: number;
  topTradeShows: string[];
}

export interface BuilderSubscription extends SubscriptionInfo {
  leadCredits: number;
  profileViews: number;
  prioritySupport: boolean;
  customBranding: boolean;
  analyticsAccess: boolean;
  multiLanguageSupport: boolean;
}

export interface BuilderAnalytics {
  profileViews: number;
  monthlyViews: number;
  leadGenerated: number;
  quoteRequests: number;
  conversionRate: number;
  topKeywords: string[];
  geographicReach: {
    country: string;
    leads: number;
  }[];
  industryBreakdown: {
    industry: string;
    percentage: number;
  }[];
}

export interface ReputationScore {
  overall: number; // 0-100
  reliability: number;
  quality: number;
  communication: number;
  timeline: number;
  value: number;
  totalReviews: number;
  badges: string[];
  verificationLevel: 'basic' | 'verified' | 'premium';
}

// Message system interfaces
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'client' | 'builder' | 'admin';
  recipientId: string;
  recipientType: 'client' | 'builder' | 'admin';
  content: string;
  messageType: 'text' | 'file' | 'quote' | 'system';
  timestamp: string;
  read: boolean;
  attachments?: MessageAttachment[];
  quoteData?: QuoteMessageData;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface QuoteMessageData {
  quoteId: string;
  estimatedCost: number;
  currency: string;
  timeline: string;
  validUntil: string;
  inclusions: string[];
  terms: string;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  status: 'active' | 'archived' | 'blocked';
  tradeShowContext?: string;
  quoteRequestId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  userId: string;
  userType: 'client' | 'builder' | 'admin';
  name: string;
  avatar?: string;
  lastSeen?: string;
  role: string;
}

// Review and Rating system
export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerType: 'client' | 'builder';
  targetId: string; // Builder ID or Client ID
  targetType: 'builder' | 'client';
  tradeShow: string;
  tradeShowYear: number;
  projectId?: string;
  rating: ReviewRating;
  comment: string;
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
  anonymous: boolean;
  createdAt: string;
  updatedAt?: string;
  helpful: number;
  reported: boolean;
  verified: boolean;
  photos?: string[];
  response?: ReviewResponse;
}

export interface ReviewRating {
  overall: number; // 1-5
  quality: number;
  communication: number;
  timeline: number;
  value: number;
  professionalism: number;
}

export interface ReviewResponse {
  id: string;
  responderId: string;
  content: string;
  createdAt: string;
}

// Payment and Transaction system
export interface Transaction {
  id: string;
  userId: string;
  type: 'subscription' | 'lead_credit' | 'featured_listing' | 'premium_upgrade';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  stripePaymentId?: string;
  paypalTransactionId?: string;
  description: string;
  metadata: Record<string, any>;
  createdAt: string;
  completedAt?: string;
  refundedAt?: string;
  invoice?: InvoiceInfo;
}

export interface InvoiceInfo {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  pdfUrl: string;
  billingAddress: Address;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Analytics and Reporting
export interface PlatformAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalQuoteRequests: number;
  matchingSuccessRate: number;
  averageResponseTime: number;
  topTradeShows: {
    name: string;
    quoteRequests: number;
    conversionRate: number;
  }[];
  topCountries: {
    country: string;
    users: number;
    quoteRequests: number;
  }[];
  revenue: {
    total: number;
    monthly: number;
    currency: string;
  };
  userGrowth: {
    month: string;
    clients: number;
    builders: number;
  }[];
}

// Notification system
export interface Notification {
  id: string;
  userId: string;
  type: 'quote_received' | 'message_received' | 'review_received' | 'payment_completed' | 'system_update';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

// Multi-language support
export interface LanguageSupport {
  code: string; // 'en', 'es', 'fr', etc.
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  supported: boolean;
  translationProgress: number; // percentage
}

export interface TranslationKey {
  key: string;
  category: 'ui' | 'content' | 'email' | 'sms';
  translations: {
    [languageCode: string]: string;
  };
  context?: string;
  placeholders?: string[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types for user interfaces
export interface UserRegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: 'client' | 'builder';
  companyName?: string;
  phone?: string;
  country: string;
  agreeToTerms: boolean;
  marketingEmails: boolean;
}

export interface UserLoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ProfileUpdateForm {
  name: string;
  companyName?: string;
  website?: string;
  phone?: string;
  bio?: string;
  address: Partial<Address>;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

console.log('User type definitions loaded for Phase 4');