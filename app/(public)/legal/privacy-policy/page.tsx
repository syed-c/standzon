'use client';

import Navigation from '@/components/client/Navigation';
import Footer from '@/components/client/Footer';
import { Shield, Clock, Globe, Users } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-blue-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-blue-100 mb-4">
            Your privacy is our priority. Learn how we protect your data.
          </p>
          <div className="flex items-center justify-center space-x-2 text-blue-200">
            <Clock className="h-4 w-4" />
            <span>Last updated: December 2024</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 not-prose">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">GDPR Compliant</h3>
              <p className="text-sm text-blue-700">Full EU data protection compliance</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">Global Standards</h3>
              <p className="text-sm text-green-700">International privacy laws covered</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">Your Rights</h3>
              <p className="text-sm text-purple-700">Full control over your data</p>
            </div>
          </div>

          <h2>Introduction</h2>
          <p>StandsZone ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>

          <h2>Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <ul>
            <li><strong>Contact Details:</strong> Name, email address, phone number</li>
            <li><strong>Company Information:</strong> Company name, job title, industry</li>
            <li><strong>Project Requirements:</strong> Exhibition needs, specifications, preferences</li>
            <li><strong>Communication:</strong> Messages, feedback, support requests</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <ul>
            <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
            <li><strong>Usage Analytics:</strong> Page views, time spent, navigation patterns</li>
            <li><strong>Cookies:</strong> Preferences, session data, tracking information</li>
            <li><strong>Location:</strong> General geographic location (if consented)</li>
          </ul>

          <h2>How We Use Your Information</h2>
          
          <div className="bg-blue-50 p-6 rounded-lg not-prose mb-6">
            <h4 className="font-semibold text-blue-900 mb-3">Primary Uses</h4>
            <ul className="space-y-2 text-blue-800">
              <li>✅ <strong>Service Delivery:</strong> Connecting you with exhibition builders</li>
              <li>✅ <strong>Communication:</strong> Responding to inquiries and updates</li>
              <li>✅ <strong>Platform Improvement:</strong> Enhancing user experience</li>
              <li>✅ <strong>Customer Support:</strong> Resolving issues and questions</li>
            </ul>
          </div>

          <h2>Data Sharing and Disclosure</h2>
          <p>We may share your information with:</p>

          <h3>Service Providers</h3>
          <p>Trusted partners who assist in service delivery, including exhibition builders, technology providers, and customer support systems. All partners are bound by strict confidentiality agreements.</p>

          <h3>Legal Requirements</h3>
          <p>When required by law, regulation, or legal process, or to protect our rights, users, or the public from harm.</p>

          <h3>Business Partners</h3>
          <p>Exhibition builders and vendors in our network, but only with your explicit consent and for the purpose of fulfilling your project requirements.</p>

          <h2>Data Security</h2>
          <p>We implement comprehensive security measures:</p>
          
          <div className="bg-green-50 p-6 rounded-lg not-prose mb-6">
            <h4 className="font-semibold text-green-900 mb-3">Security Measures</h4>
            <ul className="space-y-2 text-green-800">
              <li>🔒 <strong>Encryption:</strong> SSL/TLS encryption for data transmission</li>
              <li>🛡️ <strong>Access Controls:</strong> Multi-factor authentication and role-based access</li>
              <li>📊 <strong>Monitoring:</strong> Continuous security monitoring and threat detection</li>
              <li>🔄 <strong>Backups:</strong> Regular encrypted backups and disaster recovery</li>
              <li>🔍 <strong>Audits:</strong> Regular security assessments and penetration testing</li>
            </ul>
          </div>

          <h2>Your Rights (GDPR Compliance)</h2>
          <p>Under GDPR and other privacy laws, you have comprehensive rights:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
            <div className="border border-purple-200 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Access & Portability</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Request access to your data</li>
                <li>• Download your data in portable format</li>
                <li>• Transfer data to another service</li>
              </ul>
            </div>
            <div className="border border-orange-200 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Control & Correction</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Correct inaccurate information</li>
                <li>• Update or modify your data</li>
                <li>• Restrict processing activities</li>
              </ul>
            </div>
            <div className="border border-red-200 p-4 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">Deletion & Objection</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Request complete data deletion</li>
                <li>• Object to data processing</li>
                <li>• Withdraw consent anytime</li>
              </ul>
            </div>
            <div className="border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Transparency</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Clear information about processing</li>
                <li>• Regular privacy notices</li>
                <li>• Data breach notifications</li>
              </ul>
            </div>
          </div>

          <h2>Cookie Policy</h2>
          <p>We use cookies to improve your experience:</p>
          
          <h3>Essential Cookies</h3>
          <p>Required for basic website functionality, security, and user authentication.</p>
          
          <h3>Analytics Cookies</h3>
          <p>Help us understand how visitors use our website to improve functionality and user experience.</p>
          
          <h3>Marketing Cookies</h3>
          <p>Used for personalized advertising and marketing communications (with your consent).</p>

          <h2>International Data Transfers</h2>
          <p>For international exhibition projects, we may transfer data across borders with appropriate safeguards:</p>
          
          <ul>
            <li><strong>EU-US Data Privacy Framework:</strong> Compliance with transatlantic data flows</li>
            <li><strong>Standard Contractual Clauses:</strong> EU-approved data transfer agreements</li>
            <li><strong>Adequacy Decisions:</strong> Transfers to countries with adequate protection</li>
            <li><strong>Your Consent:</strong> Explicit consent for necessary transfers</li>
          </ul>

          <h2>Data Retention</h2>
          <p>We retain your data only as long as necessary:</p>
          
          <ul>
            <li><strong>Active Projects:</strong> Duration of project plus 2 years for support</li>
            <li><strong>Marketing Communications:</strong> Until you unsubscribe</li>
            <li><strong>Legal Requirements:</strong> As required by applicable laws</li>
            <li><strong>Inactive Accounts:</strong> Automatically deleted after 3 years of inactivity</li>
          </ul>

          <h2>Children's Privacy</h2>
          <p>Our services are not intended for children under 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.</p>

          <h2>Changes to This Policy</h2>
          <p>We may update this privacy policy periodically to reflect changes in our practices or applicable laws. We will notify you of material changes by:</p>
          
          <ul>
            <li>Posting the updated policy on our website</li>
            <li>Sending email notifications for significant changes</li>
            <li>Displaying prominent notices on our platform</li>
            <li>Providing 30 days advance notice for material changes</li>
          </ul>

          <div className="bg-gray-50 p-6 rounded-lg not-prose mt-8">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Privacy Questions</h4>
                <p className="text-sm text-gray-600">
                  Email: <a href="mailto:privacy@standszone.com" className="text-blue-600 hover:underline">privacy@standszone.com</a><br />
                  Phone: <a href="tel:+15551234567" className="text-blue-600 hover:underline">+1 (555) 123-4567</a>
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Data Protection Officer</h4>
                <p className="text-sm text-gray-600">
                  Email: <a href="mailto:dpo@standszone.com" className="text-blue-600 hover:underline">dpo@standszone.com</a><br />
                  For GDPR-related inquiries
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Address:</strong> 123 Exhibition Ave, New York, NY 10001, United States
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}