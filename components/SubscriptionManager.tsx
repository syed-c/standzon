'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Target, 
  BarChart3, 
  Shield,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Gift,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'free' | 'professional' | 'enterprise';
  monthlyPrice: number;
  yearlyPrice: number;
  leadCredits: number;
  features: string[];
  popular?: boolean;
  color: string;
  icon: React.ReactNode;
}

interface SubscriptionUsage {
  leadsUsed: number;
  leadsTotal: number;
  profileViews: number;
  quotesSubmitted: number;
  planExpiry: string;
  billingCycle: 'monthly' | 'yearly';
}

interface SubscriptionManagerProps {
  currentPlan: 'free' | 'professional' | 'enterprise';
  usage: SubscriptionUsage;
  builderId: string;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    type: 'free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    leadCredits: 3,
    features: [
      '3 lead unlocks per month',
      'Basic profile visibility',
      'Standard support',
      'Basic analytics'
    ],
    color: 'bg-gray-100 text-gray-800',
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 'professional',
    name: 'Professional',
    type: 'professional',
    monthlyPrice: 49,
    yearlyPrice: 490,
    leadCredits: 25,
    features: [
      '25 lead unlocks per month',
      'Priority profile listing',
      'Advanced analytics dashboard',
      'Priority customer support',
      'Quote templates',
      'Client communication tools'
    ],
    popular: true,
    color: 'bg-blue-100 text-blue-800',
    icon: <Star className="h-5 w-5" />
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    type: 'enterprise',
    monthlyPrice: 149,
    yearlyPrice: 1490,
    leadCredits: 100,
    features: [
      '100 lead unlocks per month',
      'Featured profile placement',
      'Advanced analytics & insights',
      'Dedicated account manager',
      'Custom branding options',
      'API access',
      'White-label solutions'
    ],
    color: 'bg-purple-100 text-purple-800',
    icon: <Crown className="h-5 w-5" />
  }
];

export default function SubscriptionManager({ currentPlan, usage, builderId }: SubscriptionManagerProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const currentPlanData = SUBSCRIPTION_PLANS.find(plan => plan.type === currentPlan);
  const usagePercentage = (usage.leadsUsed / usage.leadsTotal) * 100;

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(true);
    setSelectedPlan(planId);
    console.log('💳 Initiating subscription upgrade:', { planId, billingCycle, builderId });

    try {
      // In production, this would integrate with Stripe
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId,
          planId,
          billingCycle,
          currentPlan
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('🎉 Subscription upgraded successfully!');
        console.log('✅ Subscription upgraded:', result.data);
        
        // In production, redirect to success page or refresh data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(result.error || 'Failed to upgrade subscription');
      }
    } catch (error) {
      console.error('❌ Subscription upgrade error:', error);
      toast.error('Failed to process subscription upgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
      setSelectedPlan(null);
    }
  };

  const calculateSavings = (plan: SubscriptionPlan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    const savingsPercentage = Math.round((savings / monthlyTotal) * 100);
    return { savings, savingsPercentage };
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              {currentPlanData?.icon}
              <span>Current Plan: {currentPlanData?.name}</span>
            </span>
            <Badge className={currentPlanData?.color}>
              {currentPlan === 'free' ? 'Free' : currentPlan}
            </Badge>
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Lead Credits</span>
                <span className="text-sm text-gray-600">{usage.leadsUsed}/{usage.leadsTotal}</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-gray-500">
                {usage.leadsTotal - usage.leadsUsed} credits remaining
              </p>
            </div>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Profile Views</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{usage.profileViews}</p>
                <p className="text-xs text-blue-600">This month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Quotes Sent</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{usage.quotesSubmitted}</p>
                <p className="text-xs text-green-600">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Plan Expiry */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">Plan Status</p>
                <p className="text-sm text-gray-600">
                  {currentPlan === 'free' 
                    ? 'Free plan - no expiry' 
                    : `Expires on ${new Date(usage.planExpiry).toLocaleDateString()}`
                  }
                </p>
              </div>
            </div>
            {currentPlan !== 'free' && (
              <Badge className="bg-green-100 text-green-800">
                Active
              </Badge>
            )}
          </div>

          {/* Low Credits Warning */}
          {usagePercentage > 80 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Low on credits!</strong> You've used {usage.leadsUsed} of {usage.leadsTotal} lead credits this month.
                {currentPlan === 'free' && ' Consider upgrading for more monthly credits.'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <span className={`font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
          Yearly
        </span>
        {billingCycle === 'yearly' && (
          <Badge className="bg-green-100 text-green-800">
            <Gift className="h-3 w-3 mr-1" />
            Save up to 17%
          </Badge>
        )}
      </div>

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrentPlan = plan.type === currentPlan;
          const { savings, savingsPercentage } = calculateSavings(plan);
          const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          const displayPrice = billingCycle === 'yearly' ? price / 12 : price;

          return (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''} ${
                isCurrentPlan ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {plan.icon}
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>
                
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    ${displayPrice.toFixed(0)}
                    <span className="text-lg text-gray-600">/month</span>
                  </div>
                  {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                    <p className="text-sm text-green-600">
                      Save ${savings} ({savingsPercentage}%) yearly
                    </p>
                  )}
                </div>
                
                <Badge className={plan.color}>
                  {plan.leadCredits} leads/month
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {isCurrentPlan ? (
                  <Button className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Current Plan
                  </Button>
                ) : plan.type === 'free' ? (
                  <Button variant="outline" className="w-full" disabled>
                    Downgrade Not Available
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Upgrade to {plan.name}
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upgrade to {plan.name} Plan</DialogTitle>
                        <DialogDescription>
                          Confirm your subscription upgrade and unlock more features
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">Upgrade Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Current Plan:</span>
                              <span className="font-medium">{currentPlanData?.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>New Plan:</span>
                              <span className="font-medium">{plan.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Billing:</span>
                              <span className="font-medium">
                                ${displayPrice.toFixed(0)}/month ({billingCycle})
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Lead Credits:</span>
                              <span className="font-medium text-green-600">
                                {usage.leadsTotal} → {plan.leadCredits} (+{plan.leadCredits - usage.leadsTotal})
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription>
                            Your upgrade will be processed securely via Stripe. You can cancel anytime.
                          </AlertDescription>
                        </Alert>
                        
                        <Button
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isUpgrading}
                          className="w-full"
                        >
                          {isUpgrading && selectedPlan === plan.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Confirm Upgrade - ${billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Billing History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPlan === 'free' ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No billing history on free plan</p>
              <p className="text-sm text-gray-400">Upgrade to a paid plan to see your billing history</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{currentPlanData?.name} Plan</p>
                  <p className="text-sm text-gray-600">
                    {new Date().toLocaleDateString()} - {new Date(usage.planExpiry).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${currentPlanData?.monthlyPrice}/month</p>
                  <Badge className="bg-green-100 text-green-800">Paid</Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}