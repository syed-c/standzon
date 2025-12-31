'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText, Clock, Scale, Shield, Users, Globe } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white py-20 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Scale className="h-16 w-16 text-gray-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl text-gray-100 mb-4">
            Legal terms and conditions governing your use of our platform
          </p>
          <div className="flex items-center justify-center space-x-2 text-gray-200">
            <Clock className="h-4 w-4" />
            <span>Effective: December 2024</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 not-prose">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Clear Terms</h3>
              <p className="text-sm text-blue-700">Simple, understandable conditions</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">User Protection</h3>
              <p className="text-sm text-green-700">Fair policies for all users</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">Global Platform</h3>
              <p className="text-sm text-purple-700">International compliance standards</p>
            </div>
          </div>

          <h2>Agreement to Terms</h2>
          <p>By accessing and using StandsZone ("we," "our," or "us"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

          <h2>Platform Services</h2>
          
          <h3>For Exhibition Organizers & Clients</h3>
          <div className="bg-blue-50 p-6 rounded-lg not-prose mb-6">
            <h4 className="font-semibold text-blue-900 mb-3">What We Provide</h4>
            <ul className="space-y-2 text-blue-800">
              <li>✅ <strong>Builder Directory:</strong> Access to verified exhibition stand builders</li>
              <li>✅ <strong>Quote System:</strong> Free quote requests and comparisons</li>
              <li>✅ <strong>Project Management:</strong> Tools to manage your exhibition projects</li>
              <li>✅ <strong>Support Services:</strong> Expert guidance and customer support</li>
              <li>✅ <strong>Global Network:</strong> International builder connections</li>
            </ul>
          </div>

          <h3>For Exhibition Builders</h3>
          <div className="bg-green-50 p-6 rounded-lg not-prose mb-6">
            <h4 className="font-semibold text-green-900 mb-3">Membership Benefits</h4>
            <ul className="space-y-2 text-green-800">
              <li>✅ <strong>Profile Creation:</strong> Showcase your services and portfolio</li>
              <li>✅ <strong>Lead Generation:</strong> Receive qualified project inquiries</li>
              <li>✅ <strong>Premium Features:</strong> Enhanced visibility and marketing tools</li>
              <li>✅ <strong>Analytics:</strong> Performance tracking and insights</li>
              <li>✅ <strong>Payment Processing:</strong> Secure transaction handling</li>
            </ul>
          </div>

          <h2>User Accounts and Responsibilities</h2>
          
          <h3>Account Requirements</h3>
          <ul>
            <li><strong>Age Requirement:</strong> Users must be 18 years or older</li>
            <li><strong>Accurate Information:</strong> You must provide truthful and current information</li>
            <li><strong>Account Security:</strong> You are responsible for maintaining account security</li>
            <li><strong>Single Account Policy:</strong> One person per account, no multiple registrations</li>
          </ul>

          <h3>Prohibited Activities</h3>
          <div className="bg-red-50 p-6 rounded-lg not-prose mb-6">
            <h4 className="font-semibold text-red-900 mb-3">Strictly Forbidden</h4>
            <ul className="space-y-2 text-red-800">
              <li>❌ Fraudulent or misleading business information</li>
              <li>❌ Harassment, abuse, or inappropriate behavior</li>
              <li>❌ Violation of intellectual property rights</li>
              <li>❌ Unauthorized access to platform systems</li>
              <li>❌ Spam, unsolicited marketing, or bulk messaging</li>
              <li>❌ Circumventing platform fees or payment systems</li>
            </ul>
          </div>

          <h2>Financial Terms</h2>
          
          <h3>Platform Access</h3>
          <ul>
            <li><strong>Free Services:</strong> Basic platform access is free for clients</li>
            <li><strong>Builder Memberships:</strong> Subscription fees apply for enhanced features</li>
            <li><strong>Transaction Fees:</strong> Service fees may apply to platform transactions</li>
            <li><strong>Payment Processing:</strong> Secure payment handling with trusted providers</li>
          </ul>

          <h3>Refund Policy</h3>
          <p>Our comprehensive refund policy ensures fair treatment for all users. Please refer to our <a href="/legal/refund-policy" className="text-pink-600 hover:underline">Refund Policy</a> for detailed terms and conditions.</p>

          <h2>Intellectual Property Rights</h2>
          
          <h3>Platform Content</h3>
          <ul>
            <li><strong>StandsZone Ownership:</strong> We own the platform, technology, and original content</li>
            <li><strong>User Content:</strong> You retain rights to content you submit</li>
            <li><strong>License Grant:</strong> Limited license to use platform features</li>
            <li><strong>Third-Party Content:</strong> Respect for external intellectual property</li>
          </ul>

          <h3>User-Generated Content</h3>
          <p>By submitting content to our platform, you grant us a non-exclusive, worldwide license to use, display, and distribute your content in connection with our services.</p>

          <h2>Privacy and Data Protection</h2>
          <p>Your privacy is important to us. Our data handling practices are governed by our comprehensive <a href="/legal/privacy-policy" className="text-pink-600 hover:underline">Privacy Policy</a>, which forms an integral part of these terms.</p>

          <h2>Service Disclaimers</h2>
          
          <div className="bg-yellow-50 p-6 rounded-lg not-prose mb-6">
            <h4 className="font-semibold text-yellow-900 mb-3">Important Disclaimers</h4>
            <ul className="space-y-2 text-yellow-800">
              <li>⚠️ <strong>"As Is" Service:</strong> Platform provided without warranties</li>
              <li>⚠️ <strong>No Outcome Guarantee:</strong> Success depends on various factors</li>
              <li>⚠️ <strong>Third-Party Services:</strong> We don't control external providers</li>
              <li>⚠️ <strong>Availability:</strong> Platform uptime not guaranteed 100%</li>
            </ul>
          </div>

          <h2>Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, StandsZone's total liability to you for any damages shall not exceed the amount you paid us in the twelve months preceding the claim, or $100, whichever is greater.</p>

          <h3>Excluded Damages</h3>
          <p>We are not liable for indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities.</p>

          <h2>Dispute Resolution</h2>
          
          <h3>Governing Law</h3>
          <p>These terms are governed by the laws of New York State, without regard to conflict of law principles.</p>

          <h3>Resolution Process</h3>
          <ol>
            <li><strong>Informal Resolution:</strong> Contact us first to resolve disputes amicably</li>
            <li><strong>Mediation:</strong> Attempt mediation before formal proceedings</li>
            <li><strong>Arbitration:</strong> Binding arbitration for unresolved disputes</li>
            <li><strong>Class Action Waiver:</strong> Individual claims only, no class actions</li>
          </ol>

          <h2>Account Termination</h2>
          
          <h3>Termination by Us</h3>
          <p>We may terminate or suspend accounts for:</p>
          <ul>
            <li>Violation of these terms of service</li>
            <li>Fraudulent or illegal activity</li>
            <li>Non-payment of applicable fees</li>
            <li>Abuse of platform or other users</li>
          </ul>

          <h3>Termination by You</h3>
          <p>You may terminate your account at any time by:</p>
          <ul>
            <li>Contacting our support team</li>
            <li>Using account deletion features</li>
            <li>Following our data removal procedures</li>
          </ul>

          <h2>Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Material changes will be communicated through:</p>
          
          <ul>
            <li><strong>Email Notifications:</strong> Direct communication to users</li>
            <li><strong>Platform Notices:</strong> Prominent announcements on our website</li>
            <li><strong>Advance Notice:</strong> 30 days notice for significant changes</li>
            <li><strong>Continued Use:</strong> Using the platform after changes constitutes acceptance</li>
          </ul>

          <h2>International Considerations</h2>
          
          <h3>Global Platform</h3>
          <p>StandsZone operates internationally, and users may be subject to local laws and regulations in their jurisdiction.</p>

          <h3>Compliance</h3>
          <ul>
            <li><strong>GDPR Compliance:</strong> European data protection standards</li>
            <li><strong>CCPA Compliance:</strong> California privacy rights</li>
            <li><strong>Industry Standards:</strong> Exhibition and trade show regulations</li>
            <li><strong>Local Laws:</strong> Users must comply with applicable local laws</li>
          </ul>

          <div className="bg-gray-50 p-6 rounded-lg not-prose mt-8">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Legal Questions</h4>
                <p className="text-sm text-gray-600">
                  Email: <a href="mailto:legal@standszone.com" className="text-pink-600 hover:underline">legal@standszone.com</a><br />
                  Phone: <a href="tel:+15551234567" className="text-pink-600 hover:underline">+1 (555) 123-4567</a>
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Support Team</h4>
                <p className="text-sm text-gray-600">
                  Email: <a href="mailto:support@standszone.com" className="text-pink-600 hover:underline">support@standszone.com</a><br />
                  Hours: Monday-Friday, 9 AM - 6 PM EST
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