'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { Textarea } from '@/components/shared/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Globe, 
  FileText, 
  Edit, 
  Save, 
  Eye, 
  Users, 
  Coffee, 
  CreditCard, 
  Database,
  Bookmark
} from 'lucide-react';

interface PolicyPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  lastModified: string;
  icon: any;
  priority: 'high' | 'medium' | 'low';
  isPublished: boolean;
}

const defaultPolicyPages: PolicyPage[] = [
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    description: 'How we collect, use, and protect your personal information',
    content: `# Privacy Policy

**Last Updated: December 2024**

## Introduction

StandsZone ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.

## Information We Collect

### Personal Information
- Name, email address, phone number
- Company information and job title
- Project requirements and specifications
- Communication preferences

### Automatically Collected Information
- IP address and browser information
- Website usage analytics
- Cookie data and preferences
- Device and location information

## How We Use Your Information

- **Service Delivery**: To provide exhibition stand building services
- **Communication**: To respond to inquiries and provide updates
- **Improvement**: To enhance our website and services
- **Marketing**: To send relevant updates (with consent)
- **Legal Compliance**: To meet regulatory requirements

## Data Sharing and Disclosure

We may share your information with:
- **Service Providers**: Trusted partners who assist in service delivery
- **Legal Requirements**: When required by law or to protect rights
- **Business Partners**: Exhibition builders and vendors (with consent)

## Data Security

We implement appropriate security measures including:
- Encryption of sensitive data
- Regular security assessments
- Access controls and authentication
- Secure data storage and transmission

## Your Rights (GDPR Compliance)

Under GDPR, you have the right to:
- **Access**: Request access to your personal data
- **Rectification**: Correct inaccurate personal data
- **Erasure**: Request deletion of your data
- **Portability**: Receive your data in a portable format
- **Objection**: Object to processing of your data
- **Restriction**: Request restriction of processing

## Cookie Policy

We use cookies to:
- Improve website functionality
- Analyze website usage
- Provide personalized content
- Remember your preferences

You can control cookies through your browser settings.

## International Data Transfers

For international projects, we may transfer data across borders with appropriate safeguards in place, including:
- EU-US Data Privacy Framework compliance
- Standard Contractual Clauses
- Adequacy decisions

## Children's Privacy

Our services are not intended for children under 16. We do not knowingly collect personal information from children.

## Changes to This Policy

We may update this policy periodically. Changes will be posted on this page with an updated date.

## Contact Information

For privacy-related questions:
- **Email**: privacy@standszone.com
- **Address**: 123 Exhibition Ave, NYC, NY 10001
- **Phone**: +1 (555) 123-4567

## Data Protection Officer

For GDPR inquiries, contact our DPO at dpo@standszone.com`,
    lastModified: new Date().toISOString(),
    icon: Shield,
    priority: 'high',
    isPublished: true
  },
  {
    id: 'terms-of-service',
    title: 'Terms of Service',
    slug: 'terms-of-service',
    description: 'Legal terms governing the use of our platform and services',
    content: `# Terms of Service

**Effective Date: December 2024**

## Agreement to Terms

By accessing StandsZone, you agree to be bound by these Terms of Service and all applicable laws and regulations.

## Use of Service

### Permitted Use
- Search and connect with exhibition builders
- Submit project requirements
- Communicate with service providers
- Access platform features and content

### Prohibited Activities
- Fraudulent or misleading information
- Harassment or abuse of other users
- Violation of intellectual property rights
- Unauthorized access to systems

## User Accounts

- You must provide accurate information
- You are responsible for account security
- One person per account policy
- Age requirement: 18 years or older

## Platform Services

### For Clients
- Free access to builder directory
- Quote request services
- Project management tools
- Customer support

### For Builders
- Profile creation and management
- Lead generation services
- Premium membership options
- Marketing and promotional tools

## Payments and Fees

- Platform access is free for clients
- Builder membership fees apply
- Transaction fees for platform services
- Refund policy applies to eligible services

## Intellectual Property

- StandsZone owns platform content and technology
- Users retain rights to their submitted content
- Limited license granted for platform use
- Respect for third-party intellectual property

## Privacy and Data Protection

Your privacy is governed by our Privacy Policy, which is incorporated by reference.

## Disclaimers

- Services provided "as is" without warranties
- No guarantee of project outcomes
- Third-party content not endorsed by us
- Platform availability not guaranteed

## Limitation of Liability

StandsZone's liability is limited to the amount paid for services in the preceding 12 months.

## Indemnification

Users agree to indemnify StandsZone against claims arising from their use of the platform.

## Dispute Resolution

- Governing law: New York State
- Dispute resolution through arbitration
- Class action waiver applies
- Informal resolution preferred

## Termination

We may terminate accounts for:
- Violation of these terms
- Fraudulent activity
- Non-payment of fees
- Upon user request

## Changes to Terms

We reserve the right to modify these terms with notice to users.

## Contact Information

For questions about these terms:
- **Email**: legal@standszone.com
- **Address**: 123 Exhibition Ave, NYC, NY 10001`,
    lastModified: new Date().toISOString(),
    icon: FileText,
    priority: 'high',
    isPublished: true
  },
  {
    id: 'cookie-policy',
    title: 'Cookie Policy',
    slug: 'cookie-policy',
    description: 'Information about cookies and tracking technologies we use',
    content: `# Cookie Policy

**Last Updated: December 2024**

## What Are Cookies?

Cookies are small text files stored on your device when you visit websites. They help us provide better user experience and analyze website usage.

## Types of Cookies We Use

### Essential Cookies
Required for basic website functionality:
- User authentication
- Security features
- Shopping cart functionality
- Form submissions

### Analytics Cookies
Help us understand website usage:
- Page views and traffic sources
- User behavior patterns
- Performance optimization
- Error tracking

### Marketing Cookies
Used for advertising and personalization:
- Targeted advertisements
- Social media integration
- Conversion tracking
- Retargeting campaigns

### Preference Cookies
Remember your choices:
- Language preferences
- Display settings
- Notification preferences
- Customization options

## Third-Party Cookies

We work with trusted partners who may set cookies:
- **Google Analytics**: Website analytics
- **Facebook Pixel**: Social media marketing
- **LinkedIn Insight**: Professional networking
- **HubSpot**: Customer relationship management

## Managing Cookies

### Browser Settings
You can control cookies through your browser:
- Block all cookies
- Delete existing cookies
- Set preferences by site
- Receive cookie notifications

### Opt-Out Options
- Google Analytics: [Google Analytics Opt-out](https://tools.google.com/dlpage/gaoptout)
- Facebook: [Facebook Ad Settings](https://www.facebook.com/settings?tab=ads)
- Network Advertising Initiative: [NAI Opt-out](http://www.networkadvertising.org/choices/)

## Cookie Consent

When you first visit our website, we'll ask for your consent to use non-essential cookies. You can:
- Accept all cookies
- Customize your preferences
- Decline non-essential cookies
- Change preferences anytime

## Impact of Disabling Cookies

Disabling cookies may affect:
- Website functionality
- Personalized experience
- Analytics and improvements
- Marketing relevance

## Contact Us

For cookie-related questions: privacy@standszone.com`,
    lastModified: new Date().toISOString(),
    icon: Coffee,
    priority: 'high',
    isPublished: true
  },
  {
    id: 'refund-policy',
    title: 'Refund Policy',
    slug: 'refund-policy',
    description: 'Terms and conditions for refunds and cancellations',
    content: `# Refund Policy

**Effective Date: December 2024**

## Overview

StandsZone is committed to customer satisfaction. This policy outlines our refund and cancellation terms.

## Refund Eligibility

### Platform Services
- Premium memberships: 30-day money-back guarantee
- Subscription services: Pro-rated refunds available
- One-time fees: Case-by-case evaluation

### Project Services
Refunds for exhibition projects depend on:
- Project stage and completion percentage
- Custom work and materials ordered
- Timeline and contractual agreements
- Force majeure circumstances

## Refund Process

### How to Request
1. Contact our support team
2. Provide order/project details
3. Explain reason for refund request
4. Submit within eligible timeframe

### Processing Time
- Platform refunds: 5-10 business days
- Project refunds: 10-30 business days
- Bank processing may add 2-5 days

## Non-Refundable Items

- Custom design work (completed)
- Materials purchased/manufactured
- Third-party services delivered
- Services used beyond trial period

## Cancellation Policy

### Subscription Cancellations
- Cancel anytime before next billing cycle
- No cancellation fees
- Access continues until period end
- Automatic renewal can be disabled

### Project Cancellations
Cancellation fees may apply based on:
- Work completed percentage
- Materials ordered/purchased
- Vendor commitments made
- Timeline proximity to event

## Special Circumstances

### Force Majeure
Refunds may be provided for:
- Event cancellations beyond control
- Government restrictions
- Natural disasters
- Pandemic-related disruptions

### Quality Issues
We guarantee service quality and will:
- Investigate all complaints
- Provide remedial action
- Offer refunds for unresolved issues
- Work toward mutually satisfactory solutions

## Contact Information

For refund requests:
- **Email**: refunds@standszone.com
- **Phone**: +1 (555) 123-4567
- **Hours**: Monday-Friday, 9 AM - 6 PM EST

## Dispute Resolution

If unsatisfied with refund decision:
1. Request supervisor review
2. Escalate to management
3. Consider mediation
4. Legal action as last resort`,
    lastModified: new Date().toISOString(),
    icon: CreditCard,
    priority: 'medium',
    isPublished: true
  },
  {
    id: 'data-policy',
    title: 'Data Protection Policy',
    slug: 'data-policy',
    description: 'Comprehensive data protection and security measures',
    content: `# Data Protection Policy

**Version: 2.0 | Date: December 2024**

## Commitment to Data Protection

StandsZone is committed to protecting personal data in accordance with GDPR, CCPA, and other applicable data protection laws.

## Data Protection Principles

### Lawfulness, Fairness, and Transparency
- Legal basis for all data processing
- Clear privacy notices
- Transparent data practices
- Fair processing standards

### Purpose Limitation
- Data collected for specific purposes
- No processing beyond stated purposes
- Regular purpose reviews
- Clear retention policies

### Data Minimization
- Collect only necessary data
- Regular data audits
- Automatic data deletion
- Minimal data sharing

### Accuracy
- Regular data updates
- Correction mechanisms
- Data validation processes
- User self-service options

### Storage Limitation
- Defined retention periods
- Automatic deletion schedules
- Secure data destruction
- Regular storage reviews

### Security
- Industry-standard encryption
- Access controls and authentication
- Regular security assessments
- Incident response procedures

### Accountability
- Documentation of processing activities
- Privacy impact assessments
- Data protection officer appointment
- Regular compliance audits

## Data Subject Rights

### Right to Information
- Clear privacy notices
- Processing purpose explanations
- Data sharing disclosures
- Contact information provision

### Right of Access
- Personal data access requests
- Information about processing
- Copy of data provided
- Response within 30 days

### Right to Rectification
- Correction of inaccurate data
- Completion of incomplete data
- Update mechanisms
- Notification to third parties

### Right to Erasure
- Deletion request processing
- Right to be forgotten
- Legal obligation assessment
- Technical implementation

### Right to Restrict Processing
- Processing limitation requests
- Temporary restrictions
- Notification requirements
- Appeal processes

### Right to Data Portability
- Structured data formats
- Machine-readable formats
- Direct transmission options
- Technical feasibility assessment

### Right to Object
- Direct marketing opt-out
- Processing objections
- Legitimate interest balancing
- Automated decision-making

## International Data Transfers

### Adequacy Decisions
- EU Commission approved countries
- Adequate protection standards
- Regular monitoring
- Update notifications

### Appropriate Safeguards
- Standard contractual clauses
- Binding corporate rules
- Certification schemes
- Approved codes of conduct

### Derogations
- Explicit consent
- Contract performance
- Legal claims
- Vital interests

## Data Breach Response

### Breach Detection
- Automated monitoring systems
- Staff training programs
- Partner notification requirements
- Regular security assessments

### Response Procedures
- 72-hour authority notification
- Risk assessment protocols
- Individual notifications
- Documentation requirements

### Remedial Actions
- Immediate containment
- Impact minimization
- Security improvements
- Process updates

## Compliance Monitoring

### Regular Audits
- Annual compliance reviews
- Process assessments
- Documentation updates
- Training program evaluation

### Performance Metrics
- Response time tracking
- Breach incident analysis
- User satisfaction monitoring
- Compliance score reporting

## Contact Information

### Data Protection Officer
- **Email**: dpo@standszone.com
- **Phone**: +1 (555) 123-4567
- **Address**: 123 Exhibition Ave, NYC, NY 10001

### Supervisory Authority
- Report concerns to relevant data protection authority
- Contact information varies by jurisdiction
- Appeal processes available
- Independent oversight provided`,
    lastModified: new Date().toISOString(),
    icon: Database,
    priority: 'high',
    isPublished: true
  }
];

export default function WebsitePagesManager() {
  const [policies, setPolicies] = useState<PolicyPage[]>(defaultPolicyPages);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePolicy = () => {
    if (!selectedPolicy) return;

    setPolicies(prev => prev.map(p => 
      p.id === selectedPolicy.id 
        ? { ...selectedPolicy, lastModified: new Date().toISOString() }
        : p
    ));

    setIsEditing(false);
    toast({
      title: "Policy Updated",
      description: `${selectedPolicy.title} has been successfully updated.`,
    });
  };

  const handleTogglePublish = (policyId: string) => {
    setPolicies(prev => prev.map(p => 
      p.id === policyId 
        ? { ...p, isPublished: !p.isPublished, lastModified: new Date().toISOString() }
        : p
    ));

    const policy = policies.find(p => p.id === policyId);
    toast({
      title: policy?.isPublished ? "Policy Unpublished" : "Policy Published",
      description: `${policy?.title} is now ${policy?.isPublished ? 'unpublished' : 'published'}.`,
    });
  };

  const stats = {
    total: policies.length,
    published: policies.filter(p => p.isPublished).length,
    high: policies.filter(p => p.priority === 'high').length,
    lastUpdate: policies.reduce((latest, policy) => {
      return new Date(policy.lastModified) > new Date(latest) ? policy.lastModified : latest;
    }, policies[0]?.lastModified || new Date().toISOString())
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Pages Manager</h1>
          <p className="text-gray-600 mt-1">
            Manage policy pages, legal documents, and website content
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={() => {
              setSelectedPolicy(null);
              setIsEditing(false);
            }}
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{stats.high}</p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Update</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(stats.lastUpdate).toLocaleDateString()}
                </p>
              </div>
              <Edit className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Policy Pages</CardTitle>
              <CardDescription>
                Select a page to view or edit
              </CardDescription>
              <div className="pt-2">
                <Input
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPolicies.map((policy) => {
                  const IconComponent = policy.icon;
                  return (
                    <div
                      key={policy.id}
                      onClick={() => {
                        setSelectedPolicy(policy);
                        setIsEditing(false);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPolicy?.id === policy.id 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <IconComponent className="h-5 w-5 text-gray-600 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">
                              {policy.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {policy.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                policy.priority === 'high' 
                                  ? 'bg-red-100 text-red-800'
                                  : policy.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {policy.priority}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                policy.isPublished 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {policy.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policy Editor */}
        <div className="lg:col-span-2">
          {selectedPolicy ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{selectedPolicy.title}</CardTitle>
                    <CardDescription>
                      Last modified: {new Date(selectedPolicy.lastModified).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTogglePublish(selectedPolicy.id)}
                      className={selectedPolicy.isPublished 
                        ? "text-red-700 border-red-300 hover:bg-red-50" 
                        : "text-green-700 border-green-300 hover:bg-green-50"
                      }
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {selectedPolicy.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    {isEditing ? (
                      <Button size="sm" onClick={handleSavePolicy}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <Input
                        value={selectedPolicy.title}
                        onChange={(e) => setSelectedPolicy(prev => 
                          prev ? { ...prev, title: e.target.value } : null
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <Input
                        value={selectedPolicy.description}
                        onChange={(e) => setSelectedPolicy(prev => 
                          prev ? { ...prev, description: e.target.value } : null
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content (Markdown supported)
                      </label>
                      <Textarea
                        value={selectedPolicy.content}
                        onChange={(e) => setSelectedPolicy(prev => 
                          prev ? { ...prev, content: e.target.value } : null
                        )}
                        rows={20}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Page Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">URL:</span>
                          <span className="ml-2 font-mono text-blue-600">
                            /legal/{selectedPolicy.slug}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Priority:</span>
                          <span className="ml-2 capitalize">{selectedPolicy.priority}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className="ml-2">
                            {selectedPolicy.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Word Count:</span>
                          <span className="ml-2">
                            {selectedPolicy.content.split(' ').length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div 
                      className="prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: selectedPolicy.content.replace(/\n/g, '<br>') 
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Policy Page
                </h3>
                <p className="text-gray-500">
                  Choose a policy page from the list to view or edit its content
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}