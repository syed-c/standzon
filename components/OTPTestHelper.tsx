'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OTPTestHelperProps {
  demoOTP?: string;
  note?: string;
  email: string;
}

export default function OTPTestHelper({ demoOTP, note, email }: OTPTestHelperProps) {
  if (!demoOTP) return null;

  const copyOTP = () => {
    navigator.clipboard.writeText(demoOTP);
    toast.success('OTP copied to clipboard!');
  };

  return (
    <Alert className="border-blue-200 bg-blue-50 mt-4">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="space-y-3">
          <div>
            <strong>Development Mode - OTP Helper</strong>
          </div>
          <div className="bg-white border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Your verification code:</div>
                <div className="text-2xl font-mono font-bold text-blue-900">{demoOTP}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyOTP}
                className="ml-4"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>
          {note && (
            <div className="text-sm text-blue-700">
              <strong>Note:</strong> {note}
            </div>
          )}
          <div className="text-sm text-blue-700">
            <strong>Email:</strong> {email}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}