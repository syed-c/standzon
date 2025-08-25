
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertCircle, Mail, Send, Settings, TestTube, Loader2, Clock, User, MessageSquare } from 'lucide-react';

interface EmailTestResult {
  success: boolean;
  message: string;
  details?: any;
  timestamp: string;
}

export default function EmailTestingClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<EmailTestResult[]>([]);
  const [testEmail, setTestEmail] = useState('');
  const [emailType, setEmailType] = useState('lead-notification');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const emailTemplates = {
    'lead-notification': {
      name: 'Lead Notification',
      description: 'Email sent to builders when they receive a new lead',
      defaultSubject: 'New Lead Received - Exhibition Stand Project',
      defaultMessage: 'You have received a new lead for an exhibition stand project. Please check your dashboard for details.'
    },
    'profile-claim': {
      name: 'Profile Claim Verification',
      description: 'Email sent when a builder claims their profile',
      defaultSubject: 'Verify Your Profile Claim - StandsZone',
      defaultMessage: 'Please verify your profile claim by clicking the verification link.'
    },
    'welcome': {
      name: 'Welcome Email',
      description: 'Welcome email for new users',
      defaultSubject: 'Welcome to StandsZone - Your Exhibition Partner',
      defaultMessage: 'Welcome to StandsZone! We\'re excited to help you connect with the best exhibition stand builders worldwide.'
    },
    'quote-request': {
      name: 'Quote Request Confirmation',
      description: 'Confirmation email for quote requests',
      defaultSubject: 'Quote Request Received - We\'ll Connect You Soon',
      defaultMessage: 'Thank you for your quote request. We\'ll connect you with suitable builders within 24 hours.'
    },
    'custom': {
      name: 'Custom Email',
      description: 'Send a custom test email',
      defaultSubject: 'Test Email from StandsZone Admin',
      defaultMessage: 'This is a test email sent from the StandsZone admin panel to verify email functionality.'
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      addTestResult(false, 'Please enter a test email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const template = emailTemplates[emailType as keyof typeof emailTemplates];
      const subject = customSubject || template.defaultSubject;
      const message = customMessage || template.defaultMessage;

      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testEmail,
          subject,
          message,
          template: emailType,
          isTest: true
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        addTestResult(true, `Test email sent successfully to ${testEmail}`, result);
      } else {
        addTestResult(false, result.message || 'Failed to send test email', result);
      }
    } catch (error) {
      addTestResult(false, `Error sending test email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSMTPConnection = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/test-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        addTestResult(true, 'SMTP connection test successful', result);
      } else {
        addTestResult(false, result.message || 'SMTP connection test failed', result);
      }
    } catch (error) {
      addTestResult(false, `SMTP connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addTestResult = (success: boolean, message: string, details?: any) => {
    const result: EmailTestResult = {
      success,
      message,
      details,
      timestamp: new Date().toLocaleString()
    };
    setTestResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const selectedTemplate = emailTemplates[emailType as keyof typeof emailTemplates];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Testing</h1>
          <p className="text-muted-foreground mt-2">
            Test and verify email notification system with production SMTP configuration
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Mail className="w-4 h-4 mr-2" />
          Email System
        </Badge>
      </div>

      {/* SMTP Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            SMTP Connection Test
          </CardTitle>
          <CardDescription>
            Test the SMTP server connection and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleTestSMTPConnection}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 mr-2" />
                Test SMTP Connection
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Email Template Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Email Template Testing
          </CardTitle>
          <CardDescription>
            Send test emails using different templates to verify functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="admin@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailType">Email Template</Label>
              <Select value={emailType} onValueChange={setEmailType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select email template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(emailTemplates).map(([key, template]) => (
                    <SelectItem key={key} value={key}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Template Info */}
          {selectedTemplate && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900">{selectedTemplate.name}</h4>
              <p className="text-sm text-blue-700 mt-1">{selectedTemplate.description}</p>
            </div>
          )}

          {/* Custom Subject and Message */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customSubject">Subject (optional - leave blank to use default)</Label>
              <Input
                id="customSubject"
                placeholder={selectedTemplate?.defaultSubject}
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customMessage">Message (optional - leave blank to use default)</Label>
              <Textarea
                id="customMessage"
                placeholder={selectedTemplate?.defaultMessage}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Send Test Email Button */}
          <Button
            onClick={handleSendTestEmail}
            disabled={isLoading || !testEmail}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Test Email...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Test Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Test Results
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearResults}>
                Clear Results
              </Button>
            </div>
            <CardDescription>
              Recent email test results and SMTP connection tests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                        {result.success ? 'Success' : 'Failed'}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {result.timestamp}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                    {result.details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                          View Details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Email Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Email Configuration Info
          </CardTitle>
          <CardDescription>
            Current email system configuration and environment variables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">SMTP Host:</span>
                <span className="font-mono">{process.env.NEXT_PUBLIC_SMTP_HOST || 'Not configured'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SMTP Port:</span>
                <span className="font-mono">{process.env.NEXT_PUBLIC_SMTP_PORT || 'Not configured'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">From Email:</span>
                <span className="font-mono">{process.env.NEXT_PUBLIC_FROM_EMAIL || 'Not configured'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">SMTP User:</span>
                <span className="font-mono">{process.env.NEXT_PUBLIC_SMTP_USER ? '***configured***' : 'Not configured'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SMTP Password:</span>
                <span className="font-mono">{process.env.NEXT_PUBLIC_SMTP_PASS ? '***configured***' : 'Not configured'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TLS Enabled:</span>
                <span className="font-mono">{process.env.NEXT_PUBLIC_SMTP_TLS || 'true'}</span>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Email configuration should be set in your environment variables or Macaly settings. 
              Ensure SMTP credentials are properly configured for production email delivery.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
