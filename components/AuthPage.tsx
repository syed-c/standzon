'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import PhoneInput from '@/components/PhoneInput';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Globe,
  Users,
  Star,
  Clock,
  Send
} from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'register';
  userType: 'admin' | 'builder' | 'client';
}

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  phone: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

interface OTPForm {
  email: string;
  otp: string;
  step: 'email' | 'verify';
}

export default function AuthPage({ mode, userType }: AuthPageProps) {
  console.log('AuthPage: Component loaded for', mode, userType);
  
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<'login' | 'register' | 'otp'>(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [otpForm, setOTPForm] = useState<OTPForm>({
    email: '',
    otp: '',
    step: 'email'
  });

  const [otpExpiry, setOTPExpiry] = useState<Date | null>(null);

  const updateLoginForm = (field: keyof LoginForm, value: any) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateRegisterForm = (field: keyof RegisterForm, value: any) => {
    setRegisterForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateLogin = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!loginForm.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!loginForm.password) {
      newErrors.password = 'Password is required';
    } else if (loginForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!registerForm.firstName) newErrors.firstName = 'First name is required';
    if (!registerForm.lastName) newErrors.lastName = 'Last name is required';
    
    if (!registerForm.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!registerForm.password) {
      newErrors.password = 'Password is required';
    } else if (registerForm.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (userType === 'builder' && !registerForm.companyName) {
      newErrors.companyName = 'Company name is required for builders';
    }

    if (!registerForm.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(registerForm.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!registerForm.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    setIsLoading(true);
    setErrors({});

    try {
      console.log('🔐 Authenticating user:', loginForm.email, 'as', userType);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
          userType
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Login successful:', data.data.user);
        
        // Store user session
        localStorage.setItem('currentUser', JSON.stringify({
          ...data.data.user,
          isLoggedIn: true,
          loginMethod: 'password'
        }));

        // Redirect based on user type
        switch (userType) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'builder':
            router.push('/builder/dashboard');
            break;
          case 'client':
            router.push('/dashboard');
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        setErrors({ submit: data.error || 'Login failed. Please try again.' });
      }
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;

    setIsLoading(true);
    setErrors({});

    try {
      console.log('📝 Registering user:', registerForm.email, 'as', userType);
      
      // Only allow builder registration - redirect clients to quote page
      if (userType === 'client') {
        router.push('/quote');
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerForm.email,
          password: registerForm.password,
          firstName: registerForm.firstName,
          lastName: registerForm.lastName,
          phone: registerForm.phone,
          userType,
          companyName: registerForm.companyName
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Registration successful:', data.data.user);
        setSuccessMessage('Registration successful! Please sign in to continue.');
        
        // Switch to login mode
        setTimeout(() => {
          setCurrentMode('login');
          setSuccessMessage('');
          // Pre-fill email
          setLoginForm(prev => ({ ...prev, email: registerForm.email }));
        }, 2000);
      } else {
        setErrors({ submit: data.error || 'Registration failed. Please try again.' });
      }
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPRequest = async () => {
    if (!otpForm.email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(otpForm.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('📧 Requesting OTP for:', otpForm.email);
      
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate',
          email: otpForm.email,
          userType
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ OTP sent successfully');
        setOTPForm(prev => ({ ...prev, step: 'verify' }));
        setOTPExpiry(new Date(data.data.expiresAt));
        setSuccessMessage(`OTP sent to ${otpForm.email}. Please check your email.`);
        
        // Show demo OTP in development
        if (data.data.demoOTP && process.env.NODE_ENV === 'development') {
          setSuccessMessage(`OTP sent! Demo OTP: ${data.data.demoOTP}`);
        }
      } else {
        setErrors({ submit: data.error || 'Failed to send OTP. Please try again.' });
      }
      
    } catch (error) {
      console.error('❌ OTP request failed:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async () => {
    if (!otpForm.otp) {
      setErrors({ otp: 'OTP code is required' });
      return;
    }

    if (otpForm.otp.length !== 6) {
      setErrors({ otp: 'OTP must be 6 digits' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('🔐 Verifying OTP for:', otpForm.email);
      
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify',
          email: otpForm.email,
          otp: otpForm.otp,
          userType
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ OTP verification successful:', data.data.user);
        
        // Store user session
        localStorage.setItem('currentUser', JSON.stringify({
          ...data.data.user,
          isLoggedIn: true,
          loginMethod: 'otp'
        }));

        // Redirect based on user type
        switch (userType) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'builder':
            router.push('/builder/dashboard');
            break;
          default:
            router.push('/quote');
        }
      } else {
        setErrors({ submit: data.error || 'Invalid OTP. Please try again.' });
      }
      
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTypeInfo = () => {
    switch (userType) {
      case 'admin':
        return {
          title: 'Admin Portal',
          description: 'Manage the entire platform',
          icon: <Shield className="w-6 h-6" />,
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200'
        };
      case 'builder':
        return {
          title: 'Builder Portal', 
          description: 'Grow your exhibition business',
          icon: <Building className="w-6 h-6" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 border-blue-200'
        };
      case 'client':
        return {
          title: 'Client Portal',
          description: 'Find the perfect exhibition stand',
          icon: <User className="w-6 h-6" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200'
        };
      default:
        return {
          title: 'Welcome',
          description: '',
          icon: <User className="w-6 h-6" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const typeInfo = getUserTypeInfo();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ExhibitBay</h1>
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${typeInfo.bgColor}`}>
            <span className={typeInfo.color}>{typeInfo.icon}</span>
            <span className={`font-medium ${typeInfo.color}`}>{typeInfo.title}</span>
          </div>
          <p className="text-gray-600 mt-2">{typeInfo.description}</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="p-6">
            <Tabs value={currentMode} onValueChange={(value) => setCurrentMode(value as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="otp">OTP Login</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => updateLoginForm('email', e.target.value)}
                        placeholder="your.email@company.com"
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => updateLoginForm('password', e.target.value)}
                        placeholder="Enter your password"
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={loginForm.rememberMe}
                        onChange={(e) => updateLoginForm('rememberMe', e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <Label htmlFor="remember-me" className="ml-2 text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Button 
                      variant="link" 
                      className="text-sm p-0 text-gray-900"
                      onClick={() => setCurrentMode('otp')}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </div>

                {errors.submit && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">
                      {errors.submit}
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </TabsContent>

              {/* OTP Login Tab */}
              <TabsContent value="otp" className="space-y-6 mt-6">
                {otpForm.step === 'email' ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-medium text-gray-900">Login with OTP</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Enter your email to receive a one-time password
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="otp-email">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="otp-email"
                          type="email"
                          value={otpForm.email}
                          onChange={(e) => setOTPForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your.email@company.com"
                          className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    {errors.submit && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-red-800">
                          {errors.submit}
                        </AlertDescription>
                      </Alert>
                    )}

                    {successMessage && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-green-800">
                          {successMessage}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      onClick={handleOTPRequest}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                      {!isLoading && <Send className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Mail className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <h3 className="font-medium text-gray-900">Enter OTP</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        We sent a 6-digit code to {otpForm.email}
                      </p>
                      {otpExpiry && (
                        <p className="text-xs text-gray-500 mt-1">
                          Expires in 5 minutes
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="otp-code">OTP Code</Label>
                      <Input
                        id="otp-code"
                        type="text"
                        value={otpForm.otp}
                        onChange={(e) => setOTPForm(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        placeholder="000000"
                        className={`text-center text-2xl tracking-widest ${errors.otp ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                        maxLength={6}
                      />
                      {errors.otp && (
                        <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                      )}
                    </div>

                    {errors.submit && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-red-800">
                          {errors.submit}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setOTPForm(prev => ({ ...prev, step: 'email', otp: '' }));
                          setErrors({});
                        }}
                        disabled={isLoading}
                        className="text-gray-900"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleOTPVerify}
                        disabled={isLoading || otpForm.otp.length !== 6}
                      >
                        {isLoading ? 'Verifying...' : 'Verify'}
                      </Button>
                    </div>

                    <Button 
                      variant="link" 
                      className="w-full text-sm text-gray-900"
                      onClick={handleOTPRequest}
                      disabled={isLoading}
                    >
                      Resend OTP
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-6 mt-6">
                {userType === 'builder' ? (
                  <div className="text-center space-y-4">
                    <Building className="w-16 h-16 text-blue-600 mx-auto" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Builder Registration</h3>
                      <p className="text-sm text-gray-600">
                        Complete builder registration includes business verification, portfolio setup, and service configuration.
                      </p>
                    </div>
                    <Button 
                      onClick={() => router.push('/builder/register')}
                      className="w-full"
                    >
                      Start Builder Registration
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          value={registerForm.firstName}
                          onChange={(e) => updateRegisterForm('firstName', e.target.value)}
                          placeholder="John"
                          className={errors.firstName ? 'border-red-500' : ''}
                          disabled={isLoading}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          value={registerForm.lastName}
                          onChange={(e) => updateRegisterForm('lastName', e.target.value)}
                          placeholder="Doe"
                          className={errors.lastName ? 'border-red-500' : ''}
                          disabled={isLoading}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="register-email">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="register-email"
                          type="email"
                          value={registerForm.email}
                          onChange={(e) => updateRegisterForm('email', e.target.value)}
                          placeholder="your.email@company.com"
                          className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <PhoneInput
                        value={registerForm.phone}
                        onChange={(value) => updateRegisterForm('phone', value)}
                        label="Phone Number"
                        placeholder="123 456 7890"
                        required
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="register-password"
                          type={showPassword ? 'text' : 'password'}
                          value={registerForm.password}
                          onChange={(e) => updateRegisterForm('password', e.target.value)}
                          placeholder="Create a strong password"
                          className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={registerForm.confirmPassword}
                          onChange={(e) => updateRegisterForm('confirmPassword', e.target.value)}
                          placeholder="Confirm your password"
                          className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <input
                          id="agree-terms"
                          type="checkbox"
                          checked={registerForm.agreeToTerms}
                          onChange={(e) => updateRegisterForm('agreeToTerms', e.target.checked)}
                          className="mt-1 h-4 w-4 text-blue-600 rounded"
                        />
                        <div>
                          <Label htmlFor="agree-terms" className="text-sm cursor-pointer">
                            I agree to the <Button variant="link" className="p-0 h-auto text-sm text-gray-900">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-sm text-gray-900">Privacy Policy</Button>
                          </Label>
                          {errors.agreeToTerms && (
                            <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          id="agree-marketing"
                          type="checkbox"
                          checked={registerForm.agreeToMarketing}
                          onChange={(e) => updateRegisterForm('agreeToMarketing', e.target.checked)}
                          className="mt-1 h-4 w-4 text-blue-600 rounded"
                        />
                        <Label htmlFor="agree-marketing" className="text-sm cursor-pointer">
                          I agree to receive marketing communications and updates
                        </Label>
                      </div>
                    </div>

                    {errors.submit && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-red-800">
                          {errors.submit}
                        </AlertDescription>
                      </Alert>
                    )}

                    {successMessage && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-green-800">
                          {successMessage}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      onClick={handleRegister}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                      {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            {/* Security Notice */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-green-600" />
                <h3 className="font-medium text-gray-900">Enterprise Security</h3>
              </div>
              <p className="text-xs text-gray-600">
                Your data is protected with bank-level encryption and security measures.
                All passwords are securely hashed and never stored in plain text.
              </p>
            </div>

            {/* Platform Benefits */}
            <div className="mt-6 text-center">
              <h3 className="font-medium text-gray-900 mb-3">Why Choose ExhibitBay?</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Globe className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Global Network</p>
                </div>
                <div>
                  <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Verified Partners</p>
                </div>
                <div>
                  <Star className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Top Quality</p>
                </div>
              </div>
            </div>

            {/* Additional Info for Non-Builders */}
            {userType !== 'builder' && userType !== 'admin' && (
              <div className="mt-6 text-center space-y-4">
                <Separator />
                <div>
                  <User className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">Looking for Exhibition Stands?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    No registration required! Get instant quotes from verified builders in your location.
                  </p>
                  <Button 
                    onClick={() => router.push('/quote')}
                    className="w-full"
                    variant="outline"
                  >
                    Get Free Quotes Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Builder Registration Info */}
            {userType === 'builder' && (
              <div className="mt-6 text-center space-y-4">
                <Separator />
                <div>
                  <Building className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">New Builder?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Join our network of verified exhibition stand builders worldwide.
                  </p>
                  <Button 
                    onClick={() => router.push('/builder/register')}
                    className="w-full"
                    variant="outline"
                  >
                    Start Builder Registration
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}