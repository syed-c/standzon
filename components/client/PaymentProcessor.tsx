'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { Badge } from '@/components/shared/badge';
import { Alert, AlertDescription } from '@/components/shared/alert';
import { Separator } from '@/components/shared/separator';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Crown,
  Zap,
  Star,
  Download,
  Calendar,
  Lock
} from 'lucide-react';

interface PaymentProcessorProps {
  userType: 'client' | 'builder';
  userId: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular: boolean;
  builderSpecific?: {
    leadCredits: number;
    profileViews: number;
    featuredListings: number;
    prioritySupport: boolean;
    analyticsAccess: boolean;
  };
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export default function PaymentProcessor({ userType, userId }: PaymentProcessorProps) {
  const [activeTab, setActiveTab] = useState<'plans' | 'billing' | 'methods'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [processing, setProcessing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [billingHistory, setBillingHistory] = useState<any[]>([]);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      const userDataStr = localStorage.getItem('builderUserData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setCurrentPlan(userData.profile.subscriptionPlan || 'free');
        setBillingHistory(userData.billing || []);
      }
    };
    
    loadUserData();
  }, []);

  // Mock subscription plans
  const subscriptionPlans: SubscriptionPlan[] = userType === 'builder' ? [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      interval: 'monthly',
      features: [
        'Basic profile listing',
        '3 quote responses per month',
        'Standard support',
        'Basic analytics'
      ],
      popular: false,
      builderSpecific: {
        leadCredits: 3,
        profileViews: 1000,
        featuredListings: 0,
        prioritySupport: false,
        analyticsAccess: false
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingInterval === 'monthly' ? 49 : 490,
      currency: 'USD',
      interval: billingInterval,
      features: [
        'Enhanced profile with gallery',
        '25 quote responses per month',
        'Priority support',
        'Advanced analytics',
        'Customer reviews management',
        '3 featured listings per month'
      ],
      popular: true,
      builderSpecific: {
        leadCredits: 25,
        profileViews: 10000,
        featuredListings: 3,
        prioritySupport: true,
        analyticsAccess: true
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingInterval === 'monthly' ? 149 : 1490,
      currency: 'USD',
      interval: billingInterval,
      features: [
        'Premium profile with custom branding',
        'Unlimited quote responses',
        'Dedicated account manager',
        'Full analytics suite',
        'API access',
        'Unlimited featured listings',
        'Custom integrations'
      ],
      popular: false,
      builderSpecific: {
        leadCredits: 999,
        profileViews: 100000,
        featuredListings: 999,
        prioritySupport: true,
        analyticsAccess: true
      }
    }
  ] : [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      interval: 'monthly',
      features: [
        '3 quote requests per month',
        'Basic builder search',
        'Standard support',
        'Project management tools'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Client',
      price: billingInterval === 'monthly' ? 29 : 290,
      currency: 'USD',
      interval: billingInterval,
      features: [
        'Unlimited quote requests',
        'Priority matching',
        'Advanced filtering',
        'Priority support',
        'Detailed analytics',
        'Save favorite builders'
      ],
      popular: true
    }
  ];

  const handlePlanSelection = async (planId: string) => {
    if (planId === 'free' || planId === currentPlan) return;
    
    setProcessing(true);
    setSelectedPlan(planId);
    
    try {
      // Simulate payment processing with credit card details
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Save subscription data to user profile
      const userDataStr = localStorage.getItem('builderUserData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userData.profile.subscriptionPlan = planId;
        userData.profile.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now
        
        // Add billing record
        const billingRecord = {
          date: new Date().toISOString(),
          planId,
          amount: subscriptionPlans.find(p => p.id === planId)?.price || 0,
          status: 'paid',
          invoice: `INV-${Date.now()}`,
          paymentMethod: 'Credit Card ending in 4242'
        };
        
        if (!userData.billing) userData.billing = [];
        userData.billing.unshift(billingRecord);
        
        localStorage.setItem('builderUserData', JSON.stringify(userData));
      }
      
      setCurrentPlan(planId);
      console.log('Payment processed successfully:', { userId, planId, billingInterval });
      
      // Show success message and redirect
      alert('🎉 Payment processed successfully! Your plan has been upgraded.');
      
      // Redirect back to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/builder/dashboard?tab=subscription&upgraded=true';
      }, 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  const handleDownloadInvoice = (invoice: string) => {
    // Generate a simple invoice PDF (in production, this would be a real PDF)
    const invoiceData = billingHistory.find(b => b.invoice === invoice);
    if (invoiceData) {
      const content = `
INVOICE: ${invoice}
Date: ${new Date(invoiceData.date).toLocaleDateString()}
Amount: $${invoiceData.amount}
Plan: ${invoiceData.planId}
Status: ${invoiceData.status}
Payment Method: ${invoiceData.paymentMethod}

Thank you for your business!
ExhibitBay Team
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const PlansTab = () => (
    <div className="space-y-6">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={billingInterval === 'monthly' ? 'font-medium' : 'text-gray-500'}>
          Monthly
        </span>
        <button
          onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              billingInterval === 'yearly' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={billingInterval === 'yearly' ? 'font-medium' : 'text-gray-500'}>
          Yearly (Save 17%)
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.id} className={`relative ${
            plan.popular ? 'border-blue-500 border-2' : ''
          } ${currentPlan === plan.id ? 'bg-blue-50' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-2">
                {plan.id === 'free' && <Zap className="h-6 w-6 text-gray-400" />}
                {plan.id === 'professional' || plan.id === 'premium' && <Star className="h-6 w-6 text-blue-600" />}
                {plan.id === 'enterprise' && <Crown className="h-6 w-6 text-purple-600" />}
              </div>
              
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-500">
                    /{plan.interval}
                  </span>
                )}
              </div>
              
              {currentPlan === plan.id && (
                <Badge variant="outline" className="mt-2">
                  Current Plan
                </Badge>
              )}
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {userType === 'builder' && plan.builderSpecific && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <h4 className="text-sm font-medium mb-2">Includes:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {plan.builderSpecific.leadCredits} quote responses</li>
                    <li>• {plan.builderSpecific.profileViews.toLocaleString()} profile views</li>
                    <li>• {plan.builderSpecific.featuredListings} featured listings</li>
                  </ul>
                </div>
              )}
              
              <Button
                onClick={() => handlePlanSelection(plan.id)}
                disabled={processing || currentPlan === plan.id}
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
              >
                {processing && selectedPlan === plan.id ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : currentPlan === plan.id ? (
                  'Current Plan'
                ) : plan.price === 0 ? (
                  'Get Started'
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const BillingTab = () => (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">
                {subscriptionPlans.find(p => p.id === currentPlan)?.name} Plan
              </h3>
              <p className="text-sm text-gray-500">
                ${subscriptionPlans.find(p => p.id === currentPlan)?.price || 0}/month
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Next billing date</p>
              <p className="text-sm text-gray-500">January 19, 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View and download your invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingHistory.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No billing history yet</p>
                <p className="text-sm text-gray-400">
                  Your payment history will appear here after your first subscription
                </p>
              </div>
            ) : (
              billingHistory.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Invoice {transaction.invoice}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${transaction.amount}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          transaction.status === 'paid' ? 'text-green-600 border-green-200' : 
                          transaction.status === 'pending' ? 'text-yellow-600 border-yellow-200' :
                          'text-red-600 border-red-200'
                        }`}
                      >
                        {transaction.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {transaction.planId.charAt(0).toUpperCase() + transaction.planId.slice(1)} Plan
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadInvoice(transaction.invoice)}
                      title="Download Invoice"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PaymentMethodsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No payment methods added</p>
                <Button>Add Payment Method</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {method.type === 'credit_card' ? (
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {method.type === 'credit_card' 
                            ? `${method.brand} ending in ${method.last4}`
                            : 'PayPal Account'
                          }
                        </p>
                        {method.isDefault && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Your payment information is secured with 256-bit SSL encryption and PCI DSS compliance.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {userType === 'builder' ? 'Builder Subscription' : 'Premium Features'}
        </h1>
        <p className="text-gray-600 mt-2">
          {userType === 'builder' 
            ? 'Grow your business with premium features and unlimited leads'
            : 'Get access to premium features and priority support'
          }
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {['plans', 'billing', 'methods'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'plans' && 'Subscription Plans'}
              {tab === 'billing' && 'Billing History'}
              {tab === 'methods' && 'Payment Methods'}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'plans' && <PlansTab />}
      {activeTab === 'billing' && <BillingTab />}
      {activeTab === 'methods' && <PaymentMethodsTab />}
    </div>
  );
}