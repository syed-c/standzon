export interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'moderator';
  permissions: AdminPermission[];
  lastLogin: Date;
  ipAddress: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
}

export interface AdminPermission {
  module: string;
  actions: ('read' | 'write' | 'delete' | 'approve')[];
}

export interface PlatformStats {
  totalUsers: number;
  totalBuilders: number;
  totalQuotes: number;
  totalCountries: number;
  totalCities: number;
  totalTradeShows: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  pendingApprovals: number;
  todayVisits: number;
  todaySignups: number;
  todayQuotes: number;
}

export interface BuilderProfile {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  description: string;
  logo?: string;
  coverImage?: string;
  gallery: GalleryImage[];
  services: string[];
  locations: string[];
  specializations: string[];
  badges: BuilderBadge[];
  rating: number;
  reviewCount: number;
  quotesReceived: number;
  quotesResponded: number;
  responseRate: number;
  avgResponseTime: number; // in hours
  subscriptionPlan: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionExpiry?: Date;
  isVerified: boolean;
  isActive: boolean;
  isPremium: boolean;
  isFeatured: boolean;
  joinedAt: Date;
  lastActive: Date;
  totalViews: number;
  monthlyViews: number;
  conversionRate: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  projectName?: string;
  city?: string;
  year?: number;
  tags: string[];
}

export interface BuilderBadge {
  type: 'verified' | 'top_rated' | 'premium' | 'featured' | 'responsive' | 'expert';
  label: string;
  color: string;
  earnedAt: Date;
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  eventName: string;
  eventLocation: string;
  eventDate: Date;
  standSize: string;
  budget: string;
  requirements: string;
  status: 'new' | 'assigned' | 'responded' | 'won' | 'lost' | 'expired';
  assignedBuilders: string[];
  responses: QuoteResponse[];
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  source: 'website' | 'referral' | 'social' | 'direct';
  adminNotes?: string;
}

export interface QuoteResponse {
  builderId: string;
  builderName: string;
  respondedAt: Date;
  price: number;
  timeline: string;
  message: string;
  attachments: string[];
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ContentPage {
  id: string;
  type: 'country' | 'city' | 'tradeshow' | 'blog' | 'landing' | 'static';
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  isPublished: boolean;
  publishedAt?: Date;
  author: string;
  lastModified: Date;
  viewCount: number;
  seoScore: number;
  language: string;
  featuredImage?: string;
  relatedPages: string[];
}

export interface PaymentRecord {
  id: string;
  builderId: string;
  builderName: string;
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'paypal' | 'bank_transfer';
  transactionId: string;
  plan: string;
  billingPeriod: 'monthly' | 'quarterly' | 'yearly';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: Date;
  expiresAt?: Date;
  invoice?: string;
  notes?: string;
}

export interface AnalyticsData {
  pageViews: TimeSeriesData[];
  userSessions: TimeSeriesData[];
  quoteRequests: TimeSeriesData[];
  conversions: TimeSeriesData[];
  topCountries: CountryData[];
  topCities: CityData[];
  topBuilders: BuilderPerformance[];
  revenueData: RevenueData[];
  deviceStats: DeviceData[];
  trafficSources: TrafficSource[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface CountryData {
  country: string;
  visits: number;
  quotes: number;
  conversion: number;
}

export interface CityData {
  city: string;
  country: string;
  visits: number;
  quotes: number;
  builders: number;
}

export interface BuilderPerformance {
  builderId: string;
  builderName: string;
  quotesReceived: number;
  quotesWon: number;
  revenue: number;
  rating: number;
  responseTime: number;
}

export interface RevenueData {
  date: string;
  subscription: number;
  premium: number;
  featured: number;
  total: number;
}

export interface DeviceData {
  device: string;
  percentage: number;
  sessions: number;
}

export interface TrafficSource {
  source: string;
  sessions: number;
  percentage: number;
  conversion: number;
}

export interface AdminActivity {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'user' | 'builder' | 'quote' | 'content' | 'payment' | 'system';
  targetId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ReviewModeration {
  id: string;
  reviewId: string;
  builderId: string;
  clientName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  flagReason?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  createdAt: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  trigger: string;
  subject: string;
  content: string;
  variables: string[];
  isActive: boolean;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  category: 'general' | 'payment' | 'email' | 'seo' | 'features';
  isPublic: boolean;
  updatedBy: string;
  updatedAt: Date;
}