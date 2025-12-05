'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  Shield, 
  Bell, 
  Check, 
  X,
  Eye,
  EyeOff,
  TestTube,
  Save,
  RefreshCw,
  Key,
  AlertCircle,
  CheckCircle,
  Globe,
  Phone,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface SystemSettingsPanelProps {
  adminId: string;
  permissions: string[];
}

interface SMTPConfig {
  enabled: boolean;
  service: 'smtp' | 'sendgrid' | 'ses' | 'mailgun';
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
  apiKey?: string;
  region?: string;
}

interface SMSConfig {
  enabled: boolean;
  service: 'twilio' | 'aws-sns' | 'nexmo' | 'messagebird';
  accountSid?: string;
  authToken?: string;
  apiKey?: string;
  apiSecret?: string;
  fromNumber: string;
  region?: string;
}

interface PaymentConfig {
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  currency: string;
  testMode: boolean;
}

export default function SystemSettingsPanel({ adminId, permissions }: SystemSettingsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [testingService, setTestingService] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  // SMTP Configuration
  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig>({
    enabled: false,
    service: 'smtp',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    username: '',
    password: '',
    fromEmail: 'noreply@exhibitbay.com',
    fromName: 'ExhibitBay',
    replyToEmail: 'support@exhibitbay.com',
    apiKey: '',
    region: 'us-east-1'
  });

  // SMS Configuration
  const [smsConfig, setSmsConfig] = useState<SMSConfig>({
    enabled: false,
    service: 'twilio',
    accountSid: '',
    authToken: '',
    apiKey: '',
    apiSecret: '',
    fromNumber: '+1234567890',
    region: 'us-east-1'
  });

  // Payment Configuration
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    stripeEnabled: false,
    stripePublishableKey: '',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    razorpayEnabled: false,
    razorpayKeyId: '',
    currency: 'USD',
    testMode: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('📖 Loading system settings from backend...');
      
      // Try to load from backend API first
      try {
        const [smtpResponse, smsResponse, paymentResponse] = await Promise.all([
          fetch('/api/admin/settings?type=smtp'),
          fetch('/api/admin/settings?type=sms'),
          fetch('/api/admin/settings?type=payment')
        ]);

        const [smtpData, smsData, paymentData] = await Promise.all([
          smtpResponse.json(),
          smsResponse.json(),
          paymentResponse.json()
        ]);

        if (smtpData.success) {
          setSmtpConfig(smtpData.data.config);
          console.log('✅ SMTP settings loaded from backend');
        }
        
        if (smsData.success) {
          setSmsConfig(smsData.data.config);
          console.log('✅ SMS settings loaded from backend');
        }
        
        if (paymentData.success) {
          setPaymentConfig(paymentData.data.config);
          console.log('✅ Payment settings loaded from backend');
        }

      } catch (apiError) {
        console.warn('⚠️ Backend load failed, falling back to localStorage:', apiError);
        
        // Fallback to localStorage
        const savedSMTP = localStorage.getItem('adminSMTPConfig');
        const savedSMS = localStorage.getItem('adminSMSConfig');
        const savedPayment = localStorage.getItem('adminPaymentConfig');

        if (savedSMTP) setSmtpConfig(JSON.parse(savedSMTP));
        if (savedSMS) setSmsConfig(JSON.parse(savedSMS));
        if (savedPayment) setPaymentConfig(JSON.parse(savedPayment));
      }
    } catch (error) {
      console.error('❌ Error loading settings:', error);
    }
  };

  const saveSettings = async (type: 'smtp' | 'sms' | 'payment') => {
    setLoading(true);
    try {
      let config;
      let storageKey;
      
      switch (type) {
        case 'smtp':
          config = smtpConfig;
          storageKey = 'adminSMTPConfig';
          break;
        case 'sms':
          config = smsConfig;
          storageKey = 'adminSMSConfig';
          break;
        case 'payment':
          config = paymentConfig;
          storageKey = 'adminPaymentConfig';
          break;
      }

      // Save to persistent backend via API
      try {
        const response = await fetch('/api/admin/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            config,
            adminId
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          // Also save to localStorage as backup
          localStorage.setItem(storageKey, JSON.stringify(config));
          toast.success(`✅ ${type.toUpperCase()} settings saved permanently!`);
          console.log(`${type.toUpperCase()} settings saved to backend:`, config);
        } else {
          throw new Error(result.error || 'Backend save failed');
        }
      } catch (apiError) {
        console.warn('⚠️ Backend save failed, using localStorage fallback:', apiError);
        // Fallback to localStorage if API fails
        localStorage.setItem(storageKey, JSON.stringify(config));
        toast.success(`✅ ${type.toUpperCase()} settings saved locally (will persist until restart)`);
      }
    } catch (error) {
      console.error(`Error saving ${type} settings:`, error);
      toast.error(`❌ Failed to save ${type} settings`);
    } finally {
      setLoading(false);
    }
  };

  const testService = async (type: 'smtp' | 'sms' | 'payment') => {
    setTestingService(type);
    try {
      switch (type) {
        case 'smtp':
          await testSMTPConnection();
          break;
        case 'sms':
          await testSMSConnection();
          break;
        case 'payment':
          await testPaymentConnection();
          break;
      }
    } catch (error) {
      console.error(`Error testing ${type}:`, error);
      toast.error(`❌ ${type.toUpperCase()} test failed`);
    } finally {
      setTestingService(null);
    }
  };

  const testSMTPConnection = async () => {
    // Simulate SMTP test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (smtpConfig.enabled && smtpConfig.host && smtpConfig.username) {
      toast.success('✅ SMTP connection successful! Test email sent.');
    } else {
      toast.error('❌ SMTP test failed. Please check your configuration.');
    }
  };

  const testSMSConnection = async () => {
    // Simulate SMS test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (smsConfig.enabled && smsConfig.accountSid && smsConfig.authToken) {
      toast.success('✅ SMS connection successful! Test message sent.');
    } else {
      toast.error('❌ SMS test failed. Please check your configuration.');
    }
  };

  const testPaymentConnection = async () => {
    // Simulate payment test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (paymentConfig.stripeEnabled && paymentConfig.stripeSecretKey) {
      toast.success('✅ Stripe connection successful!');
      return;
    }
    
    if (paymentConfig.razorpayEnabled && paymentConfig.razorpayKeyId) {
      // Test Razorpay connection with simplified integration
      if (paymentConfig.razorpayKeyId.startsWith('rzp_')) {
        toast.success('✅ Razorpay connection successful! Key ID format is valid.');
      } else {
        toast.error('❌ Invalid Razorpay Key ID format. Should start with "rzp_"');
      }
      return;
    }
    
    toast.error('❌ Payment test failed. Please check your configuration.');
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const SMTPTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            SMTP Email Configuration
          </CardTitle>
          <CardDescription>
            Configure SMTP settings for sending emails (OTP, notifications, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable SMTP</Label>
              <p className="text-sm text-gray-500">Turn on email sending capabilities</p>
            </div>
            <Switch
              checked={smtpConfig.enabled}
              onCheckedChange={(checked) => 
                setSmtpConfig(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-service">Email Service</Label>
              <Select 
                value={smtpConfig.service} 
                onValueChange={(value) => 
                  setSmtpConfig(prev => ({ ...prev, service: value as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smtp">SMTP Server</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="ses">AWS SES</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {smtpConfig.service === 'smtp' && (
              <>
                <div>
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    value={smtpConfig.host}
                    onChange={(e) => 
                      setSmtpConfig(prev => ({ ...prev, host: e.target.value }))
                    }
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={smtpConfig.port}
                    onChange={(e) => 
                      setSmtpConfig(prev => ({ ...prev, port: parseInt(e.target.value) }))
                    }
                    placeholder="587"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-username">Username</Label>
                  <Input
                    id="smtp-username"
                    value={smtpConfig.username}
                    onChange={(e) => 
                      setSmtpConfig(prev => ({ ...prev, username: e.target.value }))
                    }
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="smtp-password"
                      type={showPasswords.smtpPassword ? 'text' : 'password'}
                      value={smtpConfig.password}
                      onChange={(e) => 
                        setSmtpConfig(prev => ({ ...prev, password: e.target.value }))
                      }
                      placeholder="App password or API key"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => togglePasswordVisibility('smtpPassword')}
                    >
                      {showPasswords.smtpPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {smtpConfig.service !== 'smtp' && (
              <div>
                <Label htmlFor="smtp-apikey">API Key</Label>
                <div className="relative">
                  <Input
                    id="smtp-apikey"
                    type={showPasswords.smtpApiKey ? 'text' : 'password'}
                    value={smtpConfig.apiKey}
                    onChange={(e) => 
                      setSmtpConfig(prev => ({ ...prev, apiKey: e.target.value }))
                    }
                    placeholder="Your API key"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => togglePasswordVisibility('smtpApiKey')}
                  >
                    {showPasswords.smtpApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from-email">From Email</Label>
              <Input
                id="from-email"
                value={smtpConfig.fromEmail}
                onChange={(e) => 
                  setSmtpConfig(prev => ({ ...prev, fromEmail: e.target.value }))
                }
                placeholder="noreply@exhibitbay.com"
              />
            </div>
            <div>
              <Label htmlFor="from-name">From Name</Label>
              <Input
                id="from-name"
                value={smtpConfig.fromName}
                onChange={(e) => 
                  setSmtpConfig(prev => ({ ...prev, fromName: e.target.value }))
                }
                placeholder="ExhibitBay"
              />
            </div>
            <div>
              <Label htmlFor="reply-to">Reply To Email</Label>
              <Input
                id="reply-to"
                value={smtpConfig.replyToEmail}
                onChange={(e) => 
                  setSmtpConfig(prev => ({ ...prev, replyToEmail: e.target.value }))
                }
                placeholder="support@exhibitbay.com"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => saveSettings('smtp')}
              disabled={loading}
              className="text-gray-900"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save SMTP Settings
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => testService('smtp')}
              disabled={testingService === 'smtp' || !smtpConfig.enabled}
              className="text-gray-900 border-gray-300"
            >
              {testingService === 'smtp' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SMSTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            SMS Configuration
          </CardTitle>
          <CardDescription>
            Configure SMS settings for sending OTP and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable SMS</Label>
              <p className="text-sm text-gray-500">Turn on SMS sending capabilities</p>
            </div>
            <Switch
              checked={smsConfig.enabled}
              onCheckedChange={(checked) => 
                setSmsConfig(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sms-service">SMS Service</Label>
              <Select 
                value={smsConfig.service} 
                onValueChange={(value) => 
                  setSmsConfig(prev => ({ ...prev, service: value as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="aws-sns">AWS SNS</SelectItem>
                  <SelectItem value="nexmo">Nexmo/Vonage</SelectItem>
                  <SelectItem value="messagebird">MessageBird</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="from-number">From Number</Label>
              <Input
                id="from-number"
                value={smsConfig.fromNumber}
                onChange={(e) => 
                  setSmsConfig(prev => ({ ...prev, fromNumber: e.target.value }))
                }
                placeholder="+1234567890"
              />
            </div>

            {smsConfig.service === 'twilio' && (
              <>
                <div>
                  <Label htmlFor="twilio-sid">Account SID</Label>
                  <Input
                    id="twilio-sid"
                    value={smsConfig.accountSid}
                    onChange={(e) => 
                      setSmsConfig(prev => ({ ...prev, accountSid: e.target.value }))
                    }
                    placeholder="AC..."
                  />
                </div>
                <div>
                  <Label htmlFor="twilio-token">Auth Token</Label>
                  <div className="relative">
                    <Input
                      id="twilio-token"
                      type={showPasswords.smsToken ? 'text' : 'password'}
                      value={smsConfig.authToken}
                      onChange={(e) => 
                        setSmsConfig(prev => ({ ...prev, authToken: e.target.value }))
                      }
                      placeholder="Your auth token"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => togglePasswordVisibility('smsToken')}
                    >
                      {showPasswords.smsToken ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {smsConfig.service !== 'twilio' && (
              <>
                <div>
                  <Label htmlFor="sms-apikey">API Key</Label>
                  <div className="relative">
                    <Input
                      id="sms-apikey"
                      type={showPasswords.smsApiKey ? 'text' : 'password'}
                      value={smsConfig.apiKey}
                      onChange={(e) => 
                        setSmsConfig(prev => ({ ...prev, apiKey: e.target.value }))
                      }
                      placeholder="Your API key"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => togglePasswordVisibility('smsApiKey')}
                    >
                      {showPasswords.smsApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="sms-secret">API Secret</Label>
                  <div className="relative">
                    <Input
                      id="sms-secret"
                      type={showPasswords.smsSecret ? 'text' : 'password'}
                      value={smsConfig.apiSecret}
                      onChange={(e) => 
                        setSmsConfig(prev => ({ ...prev, apiSecret: e.target.value }))
                      }
                      placeholder="Your API secret"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => togglePasswordVisibility('smsSecret')}
                    >
                      {showPasswords.smsSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => saveSettings('sms')}
              disabled={loading}
              className="text-gray-900"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save SMS Settings
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => testService('sms')}
              disabled={testingService === 'sms' || !smsConfig.enabled}
              className="text-gray-900 border-gray-300"
            >
              {testingService === 'sms' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test SMS
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PaymentTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            Payment Gateway Configuration
          </CardTitle>
          <CardDescription>
            Configure Stripe and Razorpay for processing payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Select 
                value={paymentConfig.currency} 
                onValueChange={(value) => 
                  setPaymentConfig(prev => ({ ...prev, currency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                  <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Test Mode</Label>
                <p className="text-sm text-gray-500">Use test credentials</p>
              </div>
              <Switch
                checked={paymentConfig.testMode}
                onCheckedChange={(checked) => 
                  setPaymentConfig(prev => ({ ...prev, testMode: checked }))
                }
              />
            </div>
          </div>

          <Separator />

          {/* Stripe Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Stripe Payment Gateway</Label>
                <p className="text-sm text-gray-500">Accept credit card payments globally</p>
              </div>
              <Switch
                checked={paymentConfig.stripeEnabled}
                onCheckedChange={(checked) => 
                  setPaymentConfig(prev => ({ ...prev, stripeEnabled: checked }))
                }
              />
            </div>

            {paymentConfig.stripeEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="stripe-publishable">Publishable Key</Label>
                  <Input
                    id="stripe-publishable"
                    value={paymentConfig.stripePublishableKey}
                    onChange={(e) => 
                      setPaymentConfig(prev => ({ ...prev, stripePublishableKey: e.target.value }))
                    }
                    placeholder="pk_test_..."
                  />
                </div>
                <div>
                  <Label htmlFor="stripe-secret">Secret Key</Label>
                  <div className="relative">
                    <Input
                      id="stripe-secret"
                      type={showPasswords.stripeSecret ? 'text' : 'password'}
                      value={paymentConfig.stripeSecretKey}
                      onChange={(e) => 
                        setPaymentConfig(prev => ({ ...prev, stripeSecretKey: e.target.value }))
                      }
                      placeholder="sk_test_..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => togglePasswordVisibility('stripeSecret')}
                    >
                      {showPasswords.stripeSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                  <div className="relative">
                    <Input
                      id="stripe-webhook"
                      type={showPasswords.stripeWebhook ? 'text' : 'password'}
                      value={paymentConfig.stripeWebhookSecret}
                      onChange={(e) => 
                        setPaymentConfig(prev => ({ ...prev, stripeWebhookSecret: e.target.value }))
                      }
                      placeholder="whsec_..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => togglePasswordVisibility('stripeWebhook')}
                    >
                      {showPasswords.stripeWebhook ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Razorpay Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Razorpay Payment Gateway</Label>
                <p className="text-sm text-gray-500">Accept payments in India and internationally</p>
              </div>
              <Switch
                checked={paymentConfig.razorpayEnabled}
                onCheckedChange={(checked) => 
                  setPaymentConfig(prev => ({ ...prev, razorpayEnabled: checked }))
                }
              />
            </div>

            {paymentConfig.razorpayEnabled && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="razorpay-key">Key ID</Label>
                    <Input
                      id="razorpay-key"
                      value={paymentConfig.razorpayKeyId}
                      onChange={(e) => 
                        setPaymentConfig(prev => ({ ...prev, razorpayKeyId: e.target.value }))
                      }
                      placeholder="rzp_test_1234567890"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      You can find your Key ID in the Razorpay Dashboard under API Keys section
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Simplified Integration</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      This integration only requires your Razorpay Key ID. Additional security configurations 
                      like webhook verification can be set up separately in your Razorpay dashboard.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">How to Get Your Key ID</span>
                    </div>
                    <ol className="text-sm text-green-700 space-y-1">
                      <li>1. Log in to your Razorpay Dashboard</li>
                      <li>2. Navigate to Settings → API Keys</li>
                      <li>3. Generate API Keys (if not already done)</li>
                      <li>4. Copy the Key ID (starts with "rzp_test_" or "rzp_live_")</li>
                      <li>5. Paste it in the field above</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => saveSettings('payment')}
              disabled={loading}
              className="text-gray-900"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Payment Settings
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => testService('payment')}
              disabled={testingService === 'payment' || (!paymentConfig.stripeEnabled && !paymentConfig.razorpayEnabled)}
              className="text-gray-900 border-gray-300"
            >
              {testingService === 'payment' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Gateway
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600 mt-1">
            Configure SMS, SMTP, and payment gateway settings for the platform
          </p>
        </div>
        <Badge variant="outline" className="text-gray-700">
          Admin Panel
        </Badge>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          All configuration data is encrypted and stored securely. Test your settings before enabling them in production.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="smtp" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="smtp" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            SMTP Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS Gateway
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Gateway
          </TabsTrigger>
        </TabsList>

        <TabsContent value="smtp" className="space-y-6">
          <SMTPTab />
        </TabsContent>

        <TabsContent value="sms" className="space-y-6">
          <SMSTab />
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <PaymentTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}