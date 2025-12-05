// Registration synchronization utilities for real-time builder management

export interface BuilderRegistration {
  id: string;
  companyName: string;
  fullName: string;
  email: string;
  mobile: string;
  country: string;
  city: string;
  services: string[];
  website: string;
  socialLinks: string;
  description: string;
  logo: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  registrationDate: string;
  approvedDate?: string;
  approvedBy?: string;
  rejectionReason?: string;
  notes?: string;
  slug: string;
  verified: boolean;
  emailVerified: boolean;
  otpCode?: string;
  otpExpiry?: string;
}

export interface AdminNotification {
  id: string;
  type: 'new_registration' | 'quote_request' | 'review_submitted' | 'payment_received';
  title: string;
  message: string;
  data: any;
  createdAt: string;
  readAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// In-memory storage (in production, use database)
let registrations: BuilderRegistration[] = [];
let notifications: AdminNotification[] = [];

export class RegistrationService {
  static async submitRegistration(formData: any): Promise<BuilderRegistration> {
    console.log('Processing builder registration:', formData);

    const registration: BuilderRegistration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyName: formData.companyName,
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      country: formData.country,
      city: formData.city,
      services: formData.services,
      website: formData.website || '',
      socialLinks: formData.socialLinks || '',
      description: formData.description,
      logo: formData.logo ? `logo-${Date.now()}.jpg` : null,
      status: 'pending',
      registrationDate: new Date().toISOString(),
      slug: formData.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      verified: false,
      emailVerified: true // Already verified via OTP
    };

    // Check for duplicates
    const existingReg = registrations.find(r => 
      r.email === registration.email && r.companyName === registration.companyName
    );

    if (existingReg) {
      throw new Error('Company with this email already registered');
    }

    registrations.push(registration);

    // Create admin notification
    const notification: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: 'new_registration',
      title: 'New Builder Registration',
      message: `${registration.companyName} has submitted a registration for approval`,
      data: { registrationId: registration.id },
      createdAt: new Date().toISOString(),
      priority: 'medium'
    };

    notifications.push(notification);

    console.log('Registration submitted successfully:', registration.id);
    console.log('Admin notification created:', notification.id);

    return registration;
  }

  static async getAllRegistrations(): Promise<BuilderRegistration[]> {
    console.log('Fetching all registrations:', registrations.length);
    return [...registrations].sort((a, b) => 
      new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
    );
  }

  static async getPendingRegistrations(): Promise<BuilderRegistration[]> {
    const pending = registrations.filter(r => r.status === 'pending');
    console.log('Fetching pending registrations:', pending.length);
    return pending;
  }

  static async approveRegistration(registrationId: string, adminId: string, notes?: string): Promise<void> {
    console.log('Approving registration:', registrationId);
    const registration = registrations.find(r => r.id === registrationId);
    
    if (!registration) {
      throw new Error('Registration not found');
    }

    registration.status = 'approved';
    registration.approvedDate = new Date().toISOString();
    registration.approvedBy = adminId;
    registration.verified = true;
    if (notes) registration.notes = notes;

    // Create success notification
    const notification: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: 'new_registration',
      title: 'Registration Approved',
      message: `${registration.companyName} has been approved and is now live on the platform`,
      data: { registrationId, builderSlug: registration.slug },
      createdAt: new Date().toISOString(),
      priority: 'low'
    };

    notifications.push(notification);

    console.log('Registration approved successfully');
  }

  static async rejectRegistration(registrationId: string, reason: string, adminId: string): Promise<void> {
    console.log('Rejecting registration:', registrationId);
    const registration = registrations.find(r => r.id === registrationId);
    
    if (!registration) {
      throw new Error('Registration not found');
    }

    registration.status = 'rejected';
    registration.rejectionReason = reason;
    registration.approvedBy = adminId;

    console.log('Registration rejected successfully');
  }

  static async bulkImportRegistrations(data: any[]): Promise<{ success: number; errors: string[] }> {
    console.log('Processing bulk import:', data.length, 'registrations');
    
    let success = 0;
    const errors: string[] = [];

    for (const item of data) {
      try {
        // Validate required fields
        if (!item.companyName || !item.email || !item.country || !item.city) {
          errors.push(`Row ${data.indexOf(item) + 1}: Missing required fields`);
          continue;
        }

        // Check for duplicates
        const exists = registrations.find(r => 
          r.email === item.email && r.companyName === item.companyName
        );

        if (exists) {
          errors.push(`Row ${data.indexOf(item) + 1}: Company ${item.companyName} already exists`);
          continue;
        }

        const registration: BuilderRegistration = {
          id: `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          companyName: item.companyName,
          fullName: item.fullName || item.contactPerson || 'Import User',
          email: item.email,
          mobile: item.phone || item.mobile || '',
          country: item.country,
          city: item.city,
          services: item.services ? item.services.split(',').map((s: string) => s.trim()) : [],
          website: item.website || '',
          socialLinks: item.socialLinks || '',
          description: item.description || item.bio || '',
          logo: null,
          status: item.status === 'published' ? 'approved' : 'pending',
          registrationDate: new Date().toISOString(),
          slug: item.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          verified: item.status === 'published',
          emailVerified: true
        };

        registrations.push(registration);
        success++;

      } catch (error: any) {
        errors.push(`Row ${data.indexOf(item) + 1}: ${error.message}`);
      }
    }

    console.log('Bulk import completed:', { success, errors: errors.length });
    return { success, errors };
  }

  static getRegistrationStats() {
    const stats = {
      total: registrations.length,
      pending: registrations.filter(r => r.status === 'pending').length,
      approved: registrations.filter(r => r.status === 'approved').length,
      rejected: registrations.filter(r => r.status === 'rejected').length,
      suspended: registrations.filter(r => r.status === 'suspended').length,
      todayRegistrations: registrations.filter(r => {
        const today = new Date().toDateString();
        return new Date(r.registrationDate).toDateString() === today;
      }).length,
      countryBreakdown: registrations.reduce((acc: Record<string, number>, reg) => {
        acc[reg.country] = (acc[reg.country] || 0) + 1;
        return acc;
      }, {})
    };

    console.log('Registration statistics:', stats);
    return stats;
  }
}

export class NotificationService {
  static async getNotifications(): Promise<AdminNotification[]> {
    return [...notifications].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  static async markAsRead(notificationId: string): Promise<void> {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.readAt = new Date().toISOString();
    }
  }

  static getUnreadCount(): number {
    return notifications.filter(n => !n.readAt).length;
  }
}

// OTP Service for email verification
export class OTPService {
  private static otpStorage: Map<string, { code: string; expiry: Date }> = new Map();

  static generateOTP(email: string): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    this.otpStorage.set(email, { code, expiry });
    
    console.log('OTP generated for', email, ':', code);
    console.log('OTP expires at:', expiry);

    // In production, send email here
    return code;
  }

  static verifyOTP(email: string, code: string): boolean {
    const stored = this.otpStorage.get(email);
    
    if (!stored) {
      console.log('No OTP found for email:', email);
      return false;
    }

    if (new Date() > stored.expiry) {
      console.log('OTP expired for email:', email);
      this.otpStorage.delete(email);
      return false;
    }

    if (stored.code === code) {
      console.log('OTP verified successfully for:', email);
      this.otpStorage.delete(email);
      return true;
    }

    console.log('Invalid OTP for email:', email);
    return false;
  }
}

// CSV processing utilities
export class CSVProcessor {
  static generateTemplate(): string {
    const headers = [
      'companyName',
      'contactPerson',
      'email',
      'phone',
      'country',
      'city',
      'services',
      'website',
      'description',
      'status'
    ];

    const sampleData = [
      'Smart Stands LLC,John Smith,john@smartstands.com,+1-555-0123,United States,Las Vegas,"Custom Stands, Modular Systems",https://smartstands.com,Premium exhibition stand builder,published',
      'Euro Expo Design,Maria Garcia,info@euroexpo.es,+34-123-456789,Spain,Barcelona,"Custom Design, Installation",https://euroexpodesign.com,Creative exhibition solutions,pending',
      'Global Events Co,David Chen,contact@globalevents.com,+44-20-1234567,United Kingdom,London,"Full Service, Project Management",https://globalevents.co.uk,Complete event management services,published'
    ];

    return [headers.join(','), ...sampleData].join('\n');
  }

  static parseCSV(csvContent: string): Record<string, string>[] {
    console.log('Parsing CSV content:', csvContent.length, 'characters');
    
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must contain headers and at least one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const data: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      data.push(row);
    }

    console.log('CSV parsed successfully:', data.length, 'rows');
    return data;
  }

  static exportToCSV(registrations: BuilderRegistration[]): string {
    const headers = [
      'ID',
      'Company Name',
      'Contact Person',
      'Email',
      'Phone',
      'Country',
      'City',
      'Services',
      'Website',
      'Status',
      'Registration Date',
      'Approved Date'
    ];

    const rows = registrations.map(reg => [
      reg.id,
      reg.companyName,
      reg.fullName,
      reg.email,
      reg.mobile,
      reg.country,
      reg.city,
      reg.services.join('; '),
      reg.website,
      reg.status,
      new Date(reg.registrationDate).toLocaleDateString(),
      reg.approvedDate ? new Date(reg.approvedDate).toLocaleDateString() : ''
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}

console.log('Registration sync utilities loaded successfully');