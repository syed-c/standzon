import { builderAPI, leadAPI, userAPI, settingsAPI } from './persistenceAPI';
import { exhibitionBuilders } from '@/lib/data/exhibitionBuilders';
import * as fs from 'fs';
import * as path from 'path';

export class DataInitializer {
  private static instance: DataInitializer;
  private initialized = false;

  static getInstance(): DataInitializer {
    if (!DataInitializer.instance) {
      DataInitializer.instance = new DataInitializer();
    }
    return DataInitializer.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('✅ Data already initialized, skipping...');
      return;
    }

    console.log('🚀 Initializing ExhibitBay Platform Data...');

    try {
      // Ensure data directory exists
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log('📁 Created data directory');
      }

      // Initialize builders data
      await this.initializeBuilders();

      // Initialize leads data
      await this.initializeLeads();

      // Initialize settings
      await this.initializeSettings();

      // Migration from old data formats
      await this.migrateOldData();

      this.initialized = true;
      console.log('✅ Data initialization complete!');

    } catch (error) {
      console.error('❌ Data initialization failed:', error);
      throw error;
    }
  }

  private async initializeBuilders(): Promise<void> {
    console.log('🏗️ Initializing builders data...');
    
    try {
      // Load existing builders from persistent storage
      const existingBuilders = await builderAPI.getAllBuilders();
      console.log(`📊 Found ${existingBuilders.length} existing builders in persistent storage`);

      // Always try to load GMB imported builders first (CRITICAL FIX)
      await this.loadGMBBuilders();
      
      // Re-check after GMB loading
      const buildersAfterGMB = await builderAPI.getAllBuilders();
      console.log(`📊 After GMB loading: ${buildersAfterGMB.length} builders`);

      // Only migrate static demo data if NO builders exist after GMB loading
      if (buildersAfterGMB.length === 0) {
        console.log('📥 No existing builders found (including GMB), migrating MINIMAL static data...');
        
        // Only add 1-2 example builders, not full demo set
        const minimalBuilders = exhibitionBuilders.slice(0, 2);
        
        for (const builder of minimalBuilders) {
          try {
            const result = await builderAPI.addBuilder(builder);
            if (result.success) {
              console.log(`✅ Added minimal example builder: ${builder.companyName}`);
            } else {
              console.error(`❌ Failed to add example builder ${builder.companyName}:`, result.error);
            }
          } catch (error) {
            console.error(`❌ Error adding example builder ${builder.companyName}:`, error);
          }
        }
      } else {
        console.log(`✅ Preserved ${buildersAfterGMB.length} existing builders (including GMB imports)`);
      }

    } catch (error) {
      console.error('❌ Error initializing builders:', error);
    }
  }

  private async loadGMBBuilders(): Promise<void> {
    try {
      const gmbFilePath = path.join(process.cwd(), 'lib/data/gmbImportedBuilders.json');
      
      if (fs.existsSync(gmbFilePath)) {
        const gmbData = fs.readFileSync(gmbFilePath, 'utf8');
        const gmbBuilders = JSON.parse(gmbData);
        
        console.log(`📥 Found ${gmbBuilders.length} GMB imported builders`);
        
        for (const builder of gmbBuilders) {
          try {
            const existingBuilder = await builderAPI.getBuilderById(builder.id);
            if (!existingBuilder) {
              const result = await builderAPI.addBuilder(builder);
              if (result.success) {
                console.log(`✅ Loaded GMB builder: ${builder.companyName}`);
              }
            }
          } catch (error) {
            console.error(`❌ Error loading GMB builder ${builder.companyName}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error loading GMB builders:', error);
    }
  }

  private async initializeLeads(): Promise<void> {
    console.log('📋 Initializing leads data...');
    
    try {
      const existingLeads = await leadAPI.getAllLeads();
      console.log(`📊 Found ${existingLeads.length} existing leads in persistent storage`);

      // Create sample leads if none exist (for demonstration)
      if (existingLeads.length === 0) {
        console.log('📝 Creating sample leads for demonstration...');
        
        const sampleLeads = [
          {
            id: 'demo_lead_1',
            companyName: 'Tech Innovations Inc.',
            contactName: 'John Smith',
            contactEmail: 'john.smith@techinnovations.com',
            contactPhone: '+1-555-0123',
            tradeShowName: 'CES 2025',
            city: 'Las Vegas',
            country: 'United States',
            standSize: 400,
            budget: '$40,000 - $50,000',
            timeline: '3-4 months',
            estimatedValue: 45000,
            priority: 'HIGH',
            leadScore: 85,
            matchScore: 90,
            specialRequests: 'LED screens and interactive displays required',
            builderEmails: [],
            targetBuilders: [],
            accessGranted: false,
            isAcceptedLead: false,
            status: 'pending',
            source: 'website'
          }
        ];

        for (const lead of sampleLeads) {
          try {
            const result = await leadAPI.addLead(lead);
            if (result.success) {
              console.log(`✅ Created sample lead: ${lead.companyName}`);
            }
          } catch (error) {
            console.error(`❌ Error creating sample lead:`, error);
          }
        }
      }

    } catch (error) {
      console.error('❌ Error initializing leads:', error);
    }
  }

  private async initializeSettings(): Promise<void> {
    console.log('⚙️ Initializing system settings...');
    
    try {
      const existingSettings = await settingsAPI.getSettings();
      console.log('📊 Loaded system settings:', Object.keys(existingSettings));

      // Ensure all required settings exist
      const defaultSettings = {
        smtp: {
          enabled: false,
          host: '',
          port: 587,
          secure: false,
          username: '',
          password: ''
        },
        sms: {
          enabled: false,
          provider: 'twilio',
          apiKey: '',
          apiSecret: '',
          fromNumber: ''
        },
        payments: {
          stripe: {
            enabled: false,
            publicKey: '',
            secretKey: '',
            webhookSecret: ''
          },
          razorpay: {
            enabled: false,
            keyId: ''
          }
        },
        platform: {
          name: 'ExhibitBay',
          version: '1.0.0',
          environment: 'development',
          maintenanceMode: false
        }
      };

      // Merge with existing settings
      const mergedSettings = { ...defaultSettings, ...existingSettings };
      await settingsAPI.saveSettings(mergedSettings);
      
      console.log('✅ System settings initialized');

    } catch (error) {
      console.error('❌ Error initializing settings:', error);
    }
  }

  private async migrateOldData(): Promise<void> {
    console.log('🔄 Checking for data migration needs...');
    
    try {
      // Check for any old data formats and migrate them
      // This is where we would handle migrations from previous versions
      
      console.log('✅ Data migration check complete');
      
    } catch (error) {
      console.error('❌ Error during data migration:', error);
    }
  }

  async getSystemStatus(): Promise<any> {
    const builderStats = await builderAPI.getStats();
    const allLeads = await leadAPI.getAllLeads();
    const settings = await settingsAPI.getSettings();

    return {
      initialized: this.initialized,
      builders: builderStats,
      leads: {
        total: allLeads.length,
        pending: allLeads.filter(l => l.status === 'pending').length,
        accepted: allLeads.filter(l => l.isAcceptedLead).length
      },
      settings: {
        smtpEnabled: settings.smtp?.enabled || false,
        smsEnabled: settings.sms?.enabled || false,
        stripeEnabled: settings.payments?.stripe?.enabled || false,
        razorpayEnabled: settings.payments?.razorpay?.enabled || false
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const dataInitializer = DataInitializer.getInstance();

// Auto-initialize on import (in development)
if (process.env.NODE_ENV === 'development') {
  dataInitializer.initialize().catch(console.error);
}