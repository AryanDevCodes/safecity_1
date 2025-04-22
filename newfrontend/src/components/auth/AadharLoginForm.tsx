import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Loader2, Fingerprint, Key, CheckCircle2, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/api';
import { useToast } from '../ui/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../ui/card';

// Form schema for validation
const aadhaarSchema = z.object({
  aadhaarNumber: z.string().length(12, { message: 'Aadhaar number must be 12 digits' }).regex(/^\d+$/, { message: 'Aadhaar number must contain only digits' }),
});
const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }).regex(/^\d+$/, { message: 'OTP must contain only digits' }),
});

const AadharLoginForm = () => {
  const [step, setStep] = useState<'aadhaar' | 'otp' | 'success'>('aadhaar');
  const [isLoading, setIsLoading] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const { toast } = useToast();

  // Timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendDisabled) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 30;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendDisabled]);

  const aadhaarForm = useForm<z.infer<typeof aadhaarSchema>>({
    resolver: zodResolver(aadhaarSchema),
    defaultValues: {
      aadhaarNumber: '',
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Stepper
  const steps = [
    { label: 'Enter Aadhaar', icon: <ShieldCheck className="w-5 h-5" /> },
    { label: 'Enter OTP', icon: <Key className="w-5 h-5" /> },
    { label: 'Success', icon: <CheckCircle2 className="w-5 h-5" /> },
  ];
  const currentStep = step === 'aadhaar' ? 0 : step === 'otp' ? 1 : 2;

  const handleAadhaarSubmit = async (values: z.infer<typeof aadhaarSchema>) => {
    setIsLoading(true);
    try {
      await authService.requestAadhaarOtp(values.aadhaarNumber);
      setAadhaarNumber(values.aadhaarNumber);
      setStep('otp');
      setResendDisabled(true);
      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your registered mobile number.",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Could not send OTP. Please check your Aadhaar number and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    setIsLoading(true);
    try {
      await authService.loginWithAadhaar(aadhaarNumber, values.otp);
      setStep('success');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1200);
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Invalid OTP or expired. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await authService.requestAadhaarOtp(aadhaarNumber);
      setResendDisabled(true);
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your registered mobile number.",
      });
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: "Could not resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/90 shadow-xl border-2 border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Fingerprint className="w-6 h-6 text-blue-600" />
          Aadhaar Login
        </CardTitle>
        <CardDescription className="text-xs text-blue-500">
          Secure login with your Aadhaar number and OTP
        </CardDescription>
        {/* Stepper */}
        <div className="flex justify-between mt-4 mb-2">
          {steps.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center flex-1">
              <div className={`rounded-full p-2 ${i === currentStep ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-400'}`}>{s.icon}</div>
              <span className={`text-xs mt-1 ${i === currentStep ? 'font-semibold text-blue-700' : 'text-blue-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {step === 'aadhaar' && (
          <Form {...aadhaarForm}>
            <form onSubmit={aadhaarForm.handleSubmit(handleAadhaarSubmit)} className="space-y-6">
              <FormField
                control={aadhaarForm.control}
                name="aadhaarNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800">Aadhaar Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          maxLength={12}
                          inputMode="numeric"
                          autoFocus
                          className="pl-10 tracking-widest text-lg font-mono border-blue-300 focus:border-blue-600 focus:ring-blue-200"
                          placeholder="Enter 12-digit Aadhaar"
                          disabled={isLoading}
                        />
                        <ShieldCheck className="absolute left-2 top-2.5 w-5 h-5 text-blue-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Request OTP"}
              </Button>
            </form>
          </Form>
        )}
        {step === 'otp' && (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-800">Enter OTP</span>
                <span className="text-xs text-gray-500">Sent to: {aadhaarNumber}</span>
              </div>
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800">OTP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={6}
                        inputMode="numeric"
                        autoFocus
                        className="tracking-widest text-center text-lg font-mono border-blue-300 focus:border-blue-600 focus:ring-blue-200"
                        placeholder="------"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify OTP"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full mt-2 text-blue-600 hover:text-blue-800"
                onClick={handleResendOtp}
                disabled={resendDisabled || isLoading}
              >
                {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full text-xs"
                onClick={() => setStep('aadhaar')}
                disabled={isLoading}
              >
                Back to Aadhaar entry
              </Button>
            </form>
          </Form>
        )}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce mb-4" />
            <div className="text-lg font-semibold text-green-700 mb-2">Login Successful!</div>
            <div className="text-sm text-gray-500">Redirecting to dashboard...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AadharLoginForm;
