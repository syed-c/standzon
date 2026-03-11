'use client';

import * as React from 'react';

// Placeholder for InputOTP as input-otp is missing and component is unused
const OTPInputContext = React.createContext<any>({});
const OTPInput = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const InputOTP = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const InputOTPGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const InputOTPSlot = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const InputOTPSeparator = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, OTPInputContext };
