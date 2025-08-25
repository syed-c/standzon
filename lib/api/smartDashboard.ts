// Smart Dashboard API - Real-time platform intelligence system

export interface SmartAnalytics {
  totalBuilders: number;
  activeBuilders: number;
  totalLeads: number;
  convertedLeads: number;
  totalEvents: number;
  platformRevenue: number;
  conversionRate: number;
  avgResponseTime: number;
  topCountries: Array<{country: string; builders: number; leads: number}>;
  topCities: Array<{city: string; country: string; leads: number}>;
  recentActivity: Array<{
    type: 'builder_signup' | 'lead_received' | 'lead_converted' | 'plan_upgrade';
    message: string;
    timestamp: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface BuilderPerformance {
  id: string;
  companyName: string;
  performanceScore: number;
  responseTime: number;
  acceptanceRate: number;
  conversionRate: number;
  leadsReceived: number;
  leadsAccepted: number;
  leadsConverted: number;
  lastLogin: string;
  planStatus: 'free' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  flags: Array<{
    type: 'slow_response' | 'low_acceptance' | 'inactive' | 'high_performer';
    message: string;
    severity: 'critical' | 'warning' | 'info';
  }>;
}

export interface LeadIntelligence {
  id: string;
  clientName: string;
  eventName: string;
  city: string;
  country: string;
  standSize: string;
  budget: string;
  aiScore: number;
  priority: 'high' | 'medium' | 'low';
  matchedBuilders: number;
  responseCount: number;
  status: 'new' | 'responded' | 'converted' | 'expired';
  submittedAt: string;
  estimatedValue: number;
  responseDeadline: string;
}

export interface EventIntelligence {
  id: string;
  name: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  industry: string;
  leadsGenerated: number;
  builderParticipation: number;
  avgStandSize: string;
  totalValue: number;
  trend: 'growing' | 'stable' | 'declining';
  aiInsights: string[];
}

export interface PlatformIntelligence {
  totalUsers: number;
  activeUsers: number;
  userGrowthRate: number;
  engagementRate: number;
  planConversionRate: number;
  bounceRateByLocation: Array<{location: string; rate: number}>;
  revenueMetrics: {
    monthly: number;
    quarterly: number;
    yearly: number;
    growth: number;
  };
  performanceMetrics: {
    avgLoadTime: number;
    uptime: number;
    errorRate: number;
  };
}

export interface AIInsight {
  id: string;
  type: 'performance' | 'opportunity' | 'warning' | 'trend';
  title: string;
  description: string;
  actionRequired: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  data: any;
  generatedAt: string;
  acknowledged: boolean;
}

class SmartDashboardAPI {
  private data = {
    analytics: null as SmartAnalytics | null,
    builderPerformance: [] as BuilderPerformance[],
    leadIntelligence: [] as LeadIntelligence[],
    eventIntelligence: [] as EventIntelligence[],
    platformIntelligence: null as PlatformIntelligence | null,
    aiInsights: [] as AIInsight[]
  };

  constructor() {
    this.initializeData();
    this.startRealTimeUpdates();
  }

  private initializeData() {
    console.log('Initializing Smart Dashboard data...');
    
    // Generate smart analytics
    this.data.analytics = this.generateSmartAnalytics();
    
    // Generate builder performance data
    this.data.builderPerformance = this.generateBuilderPerformance();
    
    // Generate lead intelligence
    this.data.leadIntelligence = this.generateLeadIntelligence();
    
    // Generate event intelligence
    this.data.eventIntelligence = this.generateEventIntelligence();
    
    // Generate platform intelligence
    this.data.platformIntelligence = this.generatePlatformIntelligence();
    
    // Generate AI insights
    this.data.aiInsights = this.generateAIInsights();
  }

  private generateSmartAnalytics(): SmartAnalytics {
    const totalBuilders = 245 + Math.floor(Math.random() * 50);
    const activeBuilders = Math.floor(totalBuilders * 0.75);
    const totalLeads = 1543 + Math.floor(Math.random() * 100);
    const convertedLeads = Math.floor(totalLeads * 0.23);
    
    return {
      totalBuilders,
      activeBuilders,
      totalLeads,
      convertedLeads,
      totalEvents: 156,
      platformRevenue: 89340 + Math.floor(Math.random() * 10000),
      conversionRate: Math.round((convertedLeads / totalLeads) * 100 * 100) / 100,
      avgResponseTime: 4.2 + Math.random() * 2,
      topCountries: [
        {country: 'Germany', builders: 45, leads: 234},
        {country: 'United States', builders: 38, leads: 189},
        {country: 'United Kingdom', builders: 32, leads: 156},
        {country: 'France', builders: 28, leads: 143},
        {country: 'UAE', builders: 24, leads: 98}
      ],
      topCities: [
        {city: 'Berlin', country: 'Germany', leads: 89},
        {city: 'Las Vegas', country: 'United States', leads: 76},
        {city: 'London', country: 'United Kingdom', leads: 67},
        {city: 'Paris', country: 'France', leads: 54},
        {city: 'Dubai', country: 'UAE', leads: 43}
      ],
      recentActivity: [
        {
          type: 'builder_signup',
          message: 'New premium builder registered: Premium Displays Ltd (London)',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          priority: 'medium'
        },
        {
          type: 'lead_converted',
          message: 'High-value lead converted: $45,000 CES 2025 booth',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          priority: 'high'
        },
        {
          type: 'plan_upgrade',
          message: 'Expo Design Germany upgraded to Enterprise plan',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          priority: 'medium'
        }
      ]
    };
  }

  private generateBuilderPerformance(): BuilderPerformance[] {
    const builders = [
      'Expo Design Germany', 'Premier Exhibits USA', 'Milano Stands Italy',
      'Dubai Expo Builders', 'London Display Co', 'Paris Exhibition Pro',
      'Berlin Stand Masters', 'Vegas Booth Builders', 'Tokyo Display Tech'
    ];

    return builders.map((name, index) => {
      const leadsReceived = 15 + Math.floor(Math.random() * 30);
      const leadsAccepted = Math.floor(leadsReceived * (0.6 + Math.random() * 0.3));
      const leadsConverted = Math.floor(leadsAccepted * (0.15 + Math.random() * 0.25));
      const responseTime = 2 + Math.random() * 8;
      const acceptanceRate = (leadsAccepted / leadsReceived) * 100;
      const conversionRate = (leadsConverted / leadsAccepted) * 100;
      
      // Calculate performance score based on multiple factors
      const performanceScore = Math.min(100, Math.round(
        (acceptanceRate * 0.4) + 
        (conversionRate * 0.3) + 
        ((10 - responseTime) * 5 * 0.2) + 
        (Math.min(leadsReceived, 20) * 0.1)
      ));

      const flags: Array<{
        type: 'slow_response' | 'low_acceptance' | 'inactive' | 'high_performer';
        message: string;
        severity: 'critical' | 'warning' | 'info';
      }> = [];
      if (responseTime > 6) flags.push({type: 'slow_response', message: 'Response time above 6 hours', severity: 'warning'});
      if (acceptanceRate < 50) flags.push({type: 'low_acceptance', message: 'Low lead acceptance rate', severity: 'critical'});
      if (performanceScore >= 85) flags.push({type: 'high_performer', message: 'Top performing builder', severity: 'info'});

      return {
        id: `builder_${index + 1}`,
        companyName: name,
        performanceScore,
        responseTime: Math.round(responseTime * 10) / 10,
        acceptanceRate: Math.round(acceptanceRate * 10) / 10,
        conversionRate: Math.round(conversionRate * 10) / 10,
        leadsReceived,
        leadsAccepted,
        leadsConverted,
        lastLogin: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        planStatus: ['free', 'professional', 'enterprise'][Math.floor(Math.random() * 3)] as any,
        status: Math.random() > 0.1 ? 'active' as const : 'inactive' as const,
        flags
      };
    });
  }

  private generateLeadIntelligence(): LeadIntelligence[] {
    const events = ['CES 2025', 'Hannover Messe', 'SIAL Paris', 'Arab Health', 'Automechanika'];
    const cities = ['Las Vegas', 'Hannover', 'Paris', 'Dubai', 'Frankfurt'];
    const countries = ['United States', 'Germany', 'France', 'UAE', 'Germany'];

    return Array.from({length: 25}, (_, index) => {
      const eventIndex = Math.floor(Math.random() * events.length);
      const standSize = ['100 sqm', '200 sqm', '300 sqm', '400 sqm', '500 sqm'][Math.floor(Math.random() * 5)];
      const budget = ['$10,000-$20,000', '$20,000-$35,000', '$35,000-$50,000', '$50,000+'][Math.floor(Math.random() * 4)];
      const matchedBuilders = 3 + Math.floor(Math.random() * 8);
      const responseCount = Math.floor(matchedBuilders * Math.random());
      
      // AI scoring based on budget, event, and response likelihood
      const budgetScore = budget.includes('50,000') ? 90 : budget.includes('35,000') ? 75 : budget.includes('20,000') ? 60 : 40;
      const eventScore = events[eventIndex] === 'CES 2025' ? 95 : 70 + Math.random() * 20;
      const aiScore = Math.round((budgetScore * 0.4 + eventScore * 0.6) + Math.random() * 10);

      return {
        id: `lead_${index + 1}`,
        clientName: `Client ${index + 1}`,
        eventName: events[eventIndex],
        city: cities[eventIndex],
        country: countries[eventIndex],
        standSize,
        budget,
        aiScore: Math.min(100, Math.max(0, aiScore)),
        priority: aiScore >= 80 ? 'high' as const : aiScore >= 60 ? 'medium' as const : 'low' as const,
        matchedBuilders,
        responseCount,
        status: ['new', 'responded', 'converted'][Math.floor(Math.random() * 3)] as any,
        submittedAt: new Date(Date.now() - Math.random() * 86400000 * 14).toISOString(),
        estimatedValue: 15000 + Math.random() * 85000,
        responseDeadline: new Date(Date.now() + 86400000 * (2 + Math.random() * 5)).toISOString()
      };
    });
  }

  private generateEventIntelligence(): EventIntelligence[] {
    return [
      {
        id: 'event_1',
        name: 'CES 2025',
        city: 'Las Vegas',
        country: 'United States',
        startDate: '2025-01-07',
        endDate: '2025-01-10',
        industry: 'Technology',
        leadsGenerated: 89,
        builderParticipation: 23,
        avgStandSize: '350 sqm',
        totalValue: 2340000,
        trend: 'growing',
        aiInsights: [
          'Lead demand increased 34% vs last year',
          'Premium booth sizes (500+ sqm) in high demand',
          'Tech displays and LED integration trending'
        ]
      },
      {
        id: 'event_2',
        name: 'Hannover Messe',
        city: 'Hannover',
        country: 'Germany',
        startDate: '2025-04-07',
        endDate: '2025-04-11',
        industry: 'Industrial',
        leadsGenerated: 67,
        builderParticipation: 18,
        avgStandSize: '280 sqm',
        totalValue: 1890000,
        trend: 'stable',
        aiInsights: [
          'Consistent demand year over year',
          'Automation and robotics displays popular',
          'German builders have 95% response rate'
        ]
      }
    ];
  }

  private generatePlatformIntelligence(): PlatformIntelligence {
    return {
      totalUsers: 1847,
      activeUsers: 1234,
      userGrowthRate: 12.4,
      engagementRate: 76.8,
      planConversionRate: 23.1,
      bounceRateByLocation: [
        {location: 'Germany', rate: 23.4},
        {location: 'United States', rate: 28.1},
        {location: 'France', rate: 31.7}
      ],
      revenueMetrics: {
        monthly: 89340,
        quarterly: 267890,
        yearly: 1089234,
        growth: 15.7
      },
      performanceMetrics: {
        avgLoadTime: 1.2,
        uptime: 99.8,
        errorRate: 0.02
      }
    };
  }

  private generateAIInsights(): AIInsight[] {
    return [
      {
        id: 'insight_1',
        type: 'opportunity',
        title: 'High Demand in Chicago Market',
        description: 'Lead requests from Chicago increased 45% this month, but only 3 active builders serve this market. Consider targeted recruitment.',
        actionRequired: true,
        priority: 'high',
        data: {location: 'Chicago', demandIncrease: 45, activeBuilders: 3},
        generatedAt: new Date().toISOString(),
        acknowledged: false
      },
      {
        id: 'insight_2',
        type: 'performance',
        title: 'Builder Response Time Optimization',
        description: 'Builders with <2hr response times have 73% higher conversion rates. Consider implementing response time incentives.',
        actionRequired: false,
        priority: 'medium',
        data: {optimalResponseTime: 2, conversionImpact: 73},
        generatedAt: new Date().toISOString(),
        acknowledged: false
      },
      {
        id: 'insight_3',
        type: 'warning',
        title: 'Premium Plan Adoption Slowdown',
        description: 'Premium plan signups decreased 12% this month. Review pricing strategy and feature positioning.',
        actionRequired: true,
        priority: 'high',
        data: {planType: 'premium', decrease: 12},
        generatedAt: new Date().toISOString(),
        acknowledged: false
      }
    ];
  }

  private startRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
      this.updateAnalytics();
      this.updateBuilderPerformance();
      this.notifySubscribers();
    }, 30000);
  }

  private updateAnalytics() {
    if (this.data.analytics) {
      // Simulate real-time changes
      this.data.analytics.totalLeads += Math.floor(Math.random() * 3);
      this.data.analytics.platformRevenue += Math.floor(Math.random() * 500);
      
      // Add new activity
      if (Math.random() > 0.7) {
        this.data.analytics.recentActivity.unshift({
          type: 'lead_received',
          message: `New lead: ${['CES 2025', 'Hannover Messe', 'SIAL Paris'][Math.floor(Math.random() * 3)]} booth request`,
          timestamp: new Date().toISOString(),
          priority: 'medium'
        });
        this.data.analytics.recentActivity = this.data.analytics.recentActivity.slice(0, 10);
      }
    }
  }

  private updateBuilderPerformance() {
    this.data.builderPerformance.forEach(builder => {
      // Simulate performance changes
      if (Math.random() > 0.8) {
        builder.leadsReceived += 1;
        builder.lastLogin = new Date().toISOString();
      }
    });
  }

  private subscribers: Array<(event: string, data: any) => void> = [];

  private notifySubscribers() {
    this.subscribers.forEach(callback => {
      callback('data_updated', {
        timestamp: new Date().toISOString(),
        analytics: this.data.analytics
      });
    });
  }

  // Public API methods
  async getSmartAnalytics(): Promise<SmartAnalytics> {
    console.log('Fetching smart analytics...');
    return this.data.analytics!;
  }

  async getBuilderPerformance(): Promise<BuilderPerformance[]> {
    console.log('Fetching builder performance data...');
    return this.data.builderPerformance;
  }

  async getLeadIntelligence(): Promise<LeadIntelligence[]> {
    console.log('Fetching lead intelligence...');
    return this.data.leadIntelligence;
  }

  async getEventIntelligence(): Promise<EventIntelligence[]> {
    console.log('Fetching event intelligence...');
    return this.data.eventIntelligence;
  }

  async getPlatformIntelligence(): Promise<PlatformIntelligence> {
    console.log('Fetching platform intelligence...');
    return this.data.platformIntelligence!;
  }

  async getAIInsights(): Promise<AIInsight[]> {
    console.log('Fetching AI insights...');
    return this.data.aiInsights;
  }

  subscribe(callback: (event: string, data: any) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) this.subscribers.splice(index, 1);
    };
  }

  async acknowledgeInsight(insightId: string): Promise<void> {
    const insight = this.data.aiInsights.find(i => i.id === insightId);
    if (insight) {
      insight.acknowledged = true;
      console.log(`Insight ${insightId} acknowledged`);
    }
  }

  async updateBuilderStatus(builderId: string, status: 'active' | 'inactive' | 'suspended'): Promise<void> {
    const builder = this.data.builderPerformance.find(b => b.id === builderId);
    if (builder) {
      builder.status = status;
      console.log(`Builder ${builderId} status updated to ${status}`);
    }
  }

  async bulkUpdateBuilders(builderIds: string[], action: string, value: 'active' | 'inactive' | 'suspended'): Promise<void> {
    console.log(`Bulk updating ${builderIds.length} builders: ${action} = ${value}`);
    builderIds.forEach(id => {
      const builder = this.data.builderPerformance.find(b => b.id === id);
      if (builder && action === 'status') {
        builder.status = value;
      }
    });
  }
}

// Export singleton instance
export const smartDashboardAPI = new SmartDashboardAPI();
export default smartDashboardAPI;