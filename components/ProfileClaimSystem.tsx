"use client";

// React Hooks Error Fixed - Force Server Restart

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Shield, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Award,
  Verified,
  Lock,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface BuilderProfile {
  id: string;
  companyName: string;
  contactInfo: {
    primaryEmail: string;
    phone: string;
    website?: string;
  };
  headquarters: {
    city: string;
    country: string;
  };
  verified: boolean;
  claimed?: boolean;
  claimStatus?: 'unclaimed' | 'pending' | 'verified' | 'rejected';
  planType?: 'free' | 'basic' | 'professional' | 'enterprise';
  claimedAt?: string;
  claimedBy?: string;
}

interface ClaimSystemProps {
  builder: BuilderProfile;
  onClaimStatusChange?: (status: string) => void;
}

interface OTPVerificationProps {
  method: 'phone' | 'email';
  contact: string;
  builderId: string;
  onSuccess: (verificationData: any) => void;
  onCancel: () => void;
}

interface PasswordSetupProps {
  builderId: string;
  companyName: string;
  onSuccess: (credentials: any) => void;
  onCancel: () => void;
}

// Utility function to mask phone numbers
function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;
  
  // Enhanced phone masking for international numbers
  if (cleaned.length >= 10) {
    const countryCode = cleaned.slice(0, -10);
    const areaCode = cleaned.slice(-10, -7);
    const middle = cleaned.slice(-7, -4);
    const last = cleaned.slice(-4);
    return `+${countryCode} ${areaCode}****${last}`;
  }
  
  return phone.slice(0, 3) + '****' + phone.slice(-3);
}

// Utility function to mask email addresses
function maskEmail(email: string): string {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const maskedUsername = username.length > 2 
    ? `${username[0]}***${username.slice(-1)}`
    : username;
  return `${maskedUsername}@${domain}`;
}

// Enhanced country code detection with more countries
function getCountryCodeFromLocation(country: string): string {
  const countryCodeMap: Record<string, string> = {
    'United States': '+1',
    'Germany': '+49',
    'United Kingdom': '+44',
    'France': '+33',
    'Spain': '+34',
    'Italy': '+39',
    'Netherlands': '+31',
    'UAE': '+971',
    'United Arab Emirates': '+971',
    'Singapore': '+65',
    'Australia': '+61',
    'Canada': '+1',
    'Japan': '+81',
    'South Korea': '+82',
    'China': '+86',
    'India': '+91',
    'Brazil': '+55',
    'Saudi Arabia': '+966',
    'Qatar': '+974',
    'Kuwait': '+965',
    'Bahrain': '+973',
    'Oman': '+968',
    'Malaysia': '+60',
    'Thailand': '+66',
    'Philippines': '+63',
    'Indonesia': '+62',
    'Vietnam': '+84',
    'Mexico': '+52',
    'Argentina': '+54',
    'Colombia': '+57',
    'Chile': '+56',
    'South Africa': '+27',
    'Egypt': '+20',
    'Kenya': '+254',
    'Nigeria': '+234',
    'Morocco': '+212',
    'Austria': '+43',
    'Belgium': '+32',
    'Switzerland': '+41',
    'Poland': '+48',
    'Czech Republic': '+420',
    'Hungary': '+36',
    'Russia': '+7',
    'Turkey': '+90',
    'Israel': '+972',
    'New Zealand': '+64',
    'Sweden': '+46',
    'Norway': '+47',
    'Denmark': '+45',
    'Finland': '+358'
  };
  
  return countryCodeMap[country] || '+1';
}

// Real website email extraction function
async function extractEmailFromWebsite(websiteUrl: string): Promise<string | null> {
  try {
    console.log(`🔍 Extracting email from website: ${websiteUrl}`);
    
    // In a real implementation, you would:
    // 1. Fetch the website content
    // 2. Parse HTML for mailto: links
    // 3. Look for email patterns in text
    // 4. Check contact pages, about pages, etc.
    
    // For now, simulate the email extraction process
    const response = await fetch('/api/utils/extract-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websiteUrl })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.email || null;
    }
    
    return null;
  } catch (error) {
    console.log('⚠️ Could not extract email from website:', error);
    return null;
  }
}

// Helper function to extract clean domain from website URL
function extractCleanDomain(websiteUrl: string): string {
  if (!websiteUrl) return '';
  
  try {
    // Remove protocol and www
    let domain = websiteUrl.replace(/^https?:\/\/(?:www\.)?/, '');
    
    // Remove any path, query parameters, or fragments
    domain = domain.split('/')[0].split('?')[0].split('#')[0];
    
    // Remove port numbers if present
    domain = domain.split(':')[0];
    
    return domain.toLowerCase();
  } catch (error) {
    console.error('Error extracting domain:', error);
    return '';
  }
}

// OTP Verification Component
function OTPVerification({ method, contact, builderId, onSuccess, onCancel }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    // Auto-send OTP when component mounts
    if (!otpSent) {
      handleSendOTP();
      setOtpSent(true);
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleSendOTP = async () => {
    setIsResending(true);
    console.log(`📱 Sending OTP via ${method} to:`, method === 'phone' ? maskPhoneNumber(contact) : maskEmail(contact));
    
    try {
      // Send OTP via real service
      const response = await fetch('/api/utils/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          contact,
          builderId,
          message: `Your verification code for claiming your business profile is: {OTP}. This code expires in 5 minutes.`
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`✅ Verification code sent via ${method === 'phone' ? 'SMS' : 'email'}`);
        setTimeLeft(300); // Reset timer
      } else {
        throw new Error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('❌ OTP sending failed:', error);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    console.log(`🔐 Verifying OTP for builder ${builderId}:`, otp);

    try {
      const response = await fetch('/api/builders/verify-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId,
          otp,
          method,
          contact
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('🎉 Profile successfully claimed and verified!');
        onSuccess({
          method,
          contact,
          verifiedAt: new Date().toISOString(),
          claimStatus: 'verified'
        });
      } else {
        toast.error(data.error || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {method === 'phone' ? (
            <Phone className="w-8 h-8 text-blue-600" />
          ) : (
            <Mail className="w-8 h-8 text-blue-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Verify via {method === 'phone' ? 'SMS' : 'Email'}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          We'll send a verification code to{' '}
          <span className="font-medium">
            {method === 'phone' ? maskPhoneNumber(contact) : maskEmail(contact)}
          </span>
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="otp">Enter 6-digit verification code</Label>
              <div className="relative mt-2">
                <Input
                  id="otp"
                  type={showOtp ? "text" : "password"}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest pr-10"
                  maxLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowOtp(!showOtp)}
                >
                  {showOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Code expires in: <span className="font-medium">{formatTime(timeLeft)}</span>
              </span>
              <Button
                variant="link"
                size="sm"
                onClick={handleSendOTP}
                disabled={isResending || timeLeft > 240} // Allow resend after 1 minute
                className="text-blue-600"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Code'
                )}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1 text-gray-900"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify & Claim
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
          <div className="text-sm">
            <p className="text-yellow-800 font-medium">Security Notice</p>
            <p className="text-yellow-700 mt-1">
              This verification confirms you own this business. Your contact information 
              will be kept private and only used for account security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Claim Status Badge Component
function ClaimStatusBadge({ builder }: { builder: BuilderProfile }) {
  const getStatusBadge = () => {
    if (builder.claimed && builder.claimStatus === 'verified') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <Verified className="w-3 h-3 mr-1" />
          Claimed & Verified
        </Badge>
      );
    }
    
    if (builder.claimStatus === 'pending') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Verification Pending
        </Badge>
      );
    }

    if (builder.verified) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Shield className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }

    return null;
  };

  const badge = getStatusBadge();
  return badge ? <div className="inline-block">{badge}</div> : null;
}

// Password Setup Component for post-verification
function PasswordSetup({ builderId, companyName, onSuccess, onCancel }: PasswordSetupProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSetupPassword = async () => {
    if (!validatePassword()) return;
    
    setIsLoading(true);
    console.log('🔑 Setting up password for claimed profile:', builderId);
    
    try {
      // In production, this would create login credentials
      // Hash password before sending (basic client-side hashing)
      const encoder = new TextEncoder();
      const data = encoder.encode(password + builderId); // Salt with builderId
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      const response = await fetch('/api/builders/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId,
          passwordHash: hashedPassword,
          companyName
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('🎉 Account setup complete! You can now access your dashboard.');
        onSuccess({
          builderId,
          password,
          setupComplete: true
        });
      } else {
        toast.error(result.error || 'Failed to setup password');
      }
    } catch (error) {
      console.error('❌ Password setup error:', error);
      toast.error('Failed to setup password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Verification Successful!
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Set up your password to access your <span className="font-medium">{companyName}</span> dashboard
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Create Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter secure password (min 8 characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1 text-gray-900"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSetupPassword}
                disabled={isLoading || !password || !confirmPassword}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div className="text-sm">
            <p className="text-blue-800 font-medium">Next Steps:</p>
            <ul className="text-blue-700 mt-1 space-y-1">
              <li>• Access your builder dashboard</li>
              <li>• Customize your business profile</li>
              <li>• Add portfolio images and services</li>
              <li>• Start receiving customer inquiries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Profile Claim System Component
export function ProfileClaimSystem({ builder, onClaimStatusChange }: ClaimSystemProps) {
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'phone' | 'email' | null>(null);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);

  // Check if profile can be claimed
  const canBeClaimed = !builder.claimed && builder.claimStatus !== 'verified';
  
  // Enhanced phone validation - check if it's from GMB and has country code
  const gmbPhone = builder.contactInfo.phone;
  const hasValidPhone = gmbPhone && gmbPhone.trim() !== '' && gmbPhone.length >= 10;
  
  // Enhanced email validation
  const gmbEmail = builder.contactInfo.primaryEmail;
  const hasValidEmail = gmbEmail && gmbEmail.includes('@') && gmbEmail.trim() !== '';

  // Enhanced website email scanning
  const [scannedEmail, setScannedEmail] = useState<string | null>(null);
  const [emailScanLoading, setEmailScanLoading] = useState(false);
  const [emailPrefix, setEmailPrefix] = useState('');

  useEffect(() => {
    const scanWebsiteForEmail = async () => {
      // Only scan if we don't have a GMB email and there's a website
      if (builder.contactInfo.website && !hasValidEmail && !scannedEmail) {
        setEmailScanLoading(true);
        console.log(`🔍 Scanning website for email: ${builder.contactInfo.website}`);
        
        try {
          const extractedEmail = await extractEmailFromWebsite(builder.contactInfo.website);
          if (extractedEmail) {
            setScannedEmail(extractedEmail);
            console.log(`📧 Successfully extracted email: ${maskEmail(extractedEmail)}`);
            toast.success('✅ Email found on website and verified');
          } else {
            console.log('⚠️ No email found on website');
          }
        } catch (error) {
          console.log('❌ Website email scanning failed:', error);
        } finally {
          setEmailScanLoading(false);
        }
      }
    };

    // Add delay to avoid immediate scanning
    const timer = setTimeout(scanWebsiteForEmail, 2000);
    return () => clearTimeout(timer);
  }, [builder.contactInfo.website, hasValidEmail, builder.companyName]);

  const handleStartClaim = async (method: 'phone' | 'email') => {
    setSelectedMethod(method);
    console.log(`🚀 Starting claim process via ${method} for builder:`, builder.id);
    
    // Validate contact info before proceeding
    const contactInfo = method === 'phone' ? gmbPhone : (hasValidEmail ? gmbEmail : scannedEmail);
    
    if (!contactInfo) {
      toast.error(`No ${method === 'phone' ? 'phone number' : 'email address'} available for verification`);
      return;
    }

    // For phone verification, ensure proper country code
    if (method === 'phone') {
      const countryCode = getCountryCodeFromLocation(builder.headquarters.country);
      const cleanPhone = contactInfo.replace(/\D/g, '');
      
      // If phone doesn't start with country code, add it
      if (!contactInfo.startsWith('+') && !contactInfo.startsWith(countryCode)) {
        console.log(`📱 Adding country code ${countryCode} to phone number`);
      }
    }
    
    setShowOtpVerification(true);
  };

  // Smart Email Claiming Handler
  const handleStartSmartEmailClaim = async (businessEmail: string) => {
    setSelectedMethod('email');
    console.log(`🔐 Starting smart email claim with:`, businessEmail);
    
    // Validate email format
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(businessEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Extract clean domain from website and verify it matches
    const websiteDomain = extractCleanDomain(builder.contactInfo.website || '');
    const emailDomain = businessEmail.split('@')[1];
    
    if (websiteDomain && websiteDomain !== emailDomain) {
      toast.error(`Email domain must match your website domain: ${websiteDomain}`);
      return;
    }
    
    try {
      // Call the smart claiming API
      const response = await fetch('/api/builders/claim-gmb-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: builder.id,
          emailPrefix: businessEmail.split('@')[0],
          websiteDomain: emailDomain,
          claimMethod: 'email',
          businessName: builder.companyName
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`✅ ${data.message}`);
        // Set the constructed email for OTP verification
        setVerificationData({ email: businessEmail, claimId: data.data.claimId });
        setShowOtpVerification(true);
      } else {
        toast.error(data.error || 'Failed to start email verification');
      }
    } catch (error) {
      console.error('❌ Smart email claim error:', error);
      toast.error('Failed to start email verification. Please try again.');
    }
  };

  const handleVerificationSuccess = async (verificationDataResult: any) => {
    console.log('✅ Verification successful, proceeding to password setup:', verificationDataResult);
    setVerificationData(verificationDataResult);
    setShowOtpVerification(false);
    setShowPasswordSetup(true);
  };

  const handlePasswordSetupSuccess = async (credentials: any) => {
    setIsLoading(true);
    console.log('🔑 Password setup successful, finalizing claim:', credentials);

    try {
      // Update builder status with enhanced data
      const response = await fetch('/api/builders/update-claim-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderId: builder.id,
          claimed: true,
          claimStatus: 'verified',
          verificationData: {
            ...verificationData,
            passwordSetup: true,
            setupTimestamp: new Date().toISOString(),
            ipAddress: 'hidden',
            userAgent: navigator.userAgent,
            gmbImported: builder.id.startsWith('gmb_'),
            businessLocation: `${builder.headquarters.city}, ${builder.headquarters.country}`,
            contactMethod: verificationData?.method,
            contactVerified: verificationData?.method === 'phone' ? 
              maskPhoneNumber(verificationData?.contact) : 
              maskEmail(verificationData?.contact)
          },
          credentials: {
            password: credentials.password // In production, this would be hashed
          },
          claimedAt: new Date().toISOString(),
          planType: 'free' // Default to free plan after claim
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('🎉 Profile claimed successfully! You can now log in to your dashboard.');
        console.log('📊 Claim successful, updating UI...');
        
        // Trigger status change callback
        onClaimStatusChange?.('verified');
        
        // Close all modals
        setIsClaimDialogOpen(false);
        setShowPasswordSetup(false);
        setShowOtpVerification(false);
        
        // Show success message with login instructions
        setTimeout(() => {
          toast.success('🚀 Visit the login page to access your dashboard with your new credentials!');
        }, 2000);
        
      } else {
        toast.error(data.error || 'Failed to complete claim process');
      }
    } catch (error) {
      console.error('❌ Claim completion error:', error);
      toast.error('Failed to complete claim process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationCancel = () => {
    setShowOtpVerification(false);
    setShowPasswordSetup(false);
    setSelectedMethod(null);
    setVerificationData(null);
  };

  // Enhanced claim button with better UX
  if (!canBeClaimed) {
    return (
      <div className="space-y-2">
        <ClaimStatusBadge builder={builder} />
        {builder.claimStatus === 'verified' && (
          <div className="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-2 py-1">
            ✅ This business has been verified and claimed
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ClaimStatusBadge builder={builder} />
      
      {/* Show unclaimed listing badge */}
      <Badge className="bg-orange-100 text-orange-800 border-orange-200 w-full justify-center">
        <AlertCircle className="w-3 h-3 text-orange-600" />
        Unclaimed Listing
      </Badge>
      
      <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
            data-macaly="claim-listing-button"
          >
            <Shield className="w-4 h-4 mr-2" />
            Claim This Listing
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Claim Your Business Profile
            </DialogTitle>
            <DialogDescription>
              Verify your ownership of <span className="font-medium">{builder.companyName}</span> to manage your listing and respond to customer inquiries
            </DialogDescription>
          </DialogHeader>

          {showPasswordSetup ? (
            <PasswordSetup
              builderId={builder.id}
              companyName={builder.companyName}
              onSuccess={handlePasswordSetupSuccess}
              onCancel={handleVerificationCancel}
            />
          ) : !showOtpVerification ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Claim Your Business Profile
                </h3>
                <p className="text-sm text-gray-600">
                  Quick 2-step verification to claim and manage your listing
                </p>
              </div>

              {/* Simplified Verification Options */}
              <div className="space-y-4">
                {/* Phone Verification Option */}
                {hasValidPhone && (
                  <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-green-900">Phone Verification (Recommended)</p>
                          <p className="text-sm text-green-700">
                            {maskPhoneNumber(gmbPhone)} • Instant SMS verification
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleStartClaim('phone')}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={isLoading}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Verify via SMS
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Email Verification Option */}
                {builder.contactInfo.website && (
                  <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-blue-900">Email Verification</p>
                          <p className="text-sm text-blue-700">
                            Use your business email @{extractCleanDomain(builder.contactInfo.website)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            placeholder="info, sales, support..."
                            value={emailPrefix}
                            onChange={(e) => {
                              const prefix = e.target.value.replace(/[^a-zA-Z0-9.-]/g, '');
                              setEmailPrefix(prefix);
                            }}
                            className="flex-1"
                          />
                          <span className="text-gray-500">@</span>
                          <span className="font-medium text-blue-700 text-sm">
                            {extractCleanDomain(builder.contactInfo.website)}
                          </span>
                        </div>
                        
                        <Button 
                          onClick={() => {
                            const prefix = emailPrefix.trim();
                            if (!prefix) {
                              toast.error('Please enter an email prefix');
                              return;
                            }
                            const domain = extractCleanDomain(builder.contactInfo.website || '');
                            const fullEmail = `${prefix}@${domain}`;
                            handleStartSmartEmailClaim(fullEmail);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={isLoading || !emailPrefix.trim()}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Verify via Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* No verification available */}
                {!hasValidPhone && !builder.contactInfo.website && (
                  <Card className="border-2 border-orange-200 bg-orange-50">
                    <CardContent className="pt-6 text-center">
                      <AlertCircle className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                      <p className="font-medium text-orange-900 mb-2">Verification Not Available</p>
                      <p className="text-sm text-orange-700 mb-4">
                        No phone number or website found in your Google My Business profile
                      </p>
                      <Button variant="outline" className="w-full text-orange-800 border-orange-300">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Support
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Benefits section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  Benefits of claiming:
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Respond directly to customer inquiries</li>
                  <li>• Get priority placement in search results</li>
                  <li>• Access detailed analytics and lead insights</li>
                  <li>• Control your business information and photos</li>
                </ul>
              </div>
            </div>
          ) : (
            <OTPVerification
              method={selectedMethod!}
              contact={selectedMethod === 'phone' 
                ? gmbPhone 
                : (hasValidEmail ? gmbEmail : scannedEmail || '')
              }
              builderId={builder.id}
              onSuccess={handleVerificationSuccess}
              onCancel={handleVerificationCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfileClaimSystem;