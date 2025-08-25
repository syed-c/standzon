'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CreditCard, IndianRupee, CheckCircle, AlertCircle } from 'lucide-react';

interface RazorpayPaymentExampleProps {
  amount: number;
  currency: string;
  description: string;
  customerEmail?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export default function RazorpayPaymentExample({
  amount,
  currency = 'INR',
  description,
  customerEmail,
  onSuccess,
  onError
}: RazorpayPaymentExampleProps) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Step 1: Create payment order
      const orderResponse = await fetch('/api/payments/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_order',
          amount: amount * 100, // Convert to smallest unit (paise)
          currency,
          orderId: `order_${Date.now()}`,
          description,
          customerEmail
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Step 2: Initialize Razorpay payment
      const options = {
        key: orderData.data.keyId,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'ExhibitBay',
        description: description,
        order_id: orderData.data.orderId,
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment
            const verificationResponse = await fetch('/api/payments/razorpay', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'verify_payment',
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            });

            const verificationData = await verificationResponse.json();

            if (verificationData.success) {
              setPaymentStatus('success');
              onSuccess?.(response.razorpay_payment_id);
            } else {
              throw new Error(verificationData.error || 'Payment verification failed');
            }
          } catch (error) {
            setPaymentStatus('error');
            const errorMsg = error instanceof Error ? error.message : 'Payment verification failed';
            setErrorMessage(errorMsg);
            onError?.(errorMsg);
          }
        },
        prefill: {
          email: customerEmail,
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus('idle');
            setLoading(false);
          }
        }
      };

      // Check if Razorpay is loaded
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback: Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      }

    } catch (error) {
      setPaymentStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Payment failed';
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Razorpay Payment
        </CardTitle>
        <CardDescription>
          Simplified integration using only Key ID
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Details */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Amount:</Label>
            <span className="font-medium">{formatAmount(amount, currency)}</span>
          </div>
          <div className="flex justify-between items-center">
            <Label>Description:</Label>
            <span className="text-sm text-gray-600">{description}</span>
          </div>
          <div className="flex justify-between items-center">
            <Label>Currency:</Label>
            <Badge variant="outline">{currency}</Badge>
          </div>
        </div>

        {/* Status Display */}
        {paymentStatus === 'processing' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Processing payment... Please complete the payment in the Razorpay checkout.
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Payment successful! Thank you for your purchase.
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Payment failed: {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={loading || paymentStatus === 'processing'}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Pay {formatAmount(amount, currency)}
            </div>
          )}
        </Button>

        {/* Integration Notes */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>✅ Only requires Razorpay Key ID</p>
          <p>✅ Automatic payment verification</p>
          <p>✅ Secure checkout experience</p>
          <p>✅ Mobile-friendly interface</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Example usage component
export function RazorpayPaymentExampleUsage() {
  const [paymentResult, setPaymentResult] = useState<string>('');

  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentResult(`Payment successful! ID: ${paymentId}`);
    console.log('✅ Payment successful:', paymentId);
  };

  const handlePaymentError = (error: string) => {
    setPaymentResult(`Payment failed: ${error}`);
    console.error('❌ Payment failed:', error);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Razorpay Integration Example</h2>
        <p className="text-gray-600">
          This example demonstrates the simplified Razorpay integration using only the Key ID
        </p>
      </div>

      <div className="flex justify-center">
        <RazorpayPaymentExample
          amount={999}
          currency="INR"
          description="ExhibitBay Premium Subscription"
          customerEmail="customer@example.com"
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>

      {paymentResult && (
        <div className="text-center">
          <Alert className="max-w-md mx-auto">
            <AlertDescription>{paymentResult}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}