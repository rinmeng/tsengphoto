'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, LogIn, XCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

function AuthResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const success = searchParams.get('success') === 'true';
  const error = searchParams.get('error');

  useEffect(() => {
    if (!success && !error) {
      // No params, redirect to home
      router.push('/');
      return;
    }

    if (success) {
      // Auto-redirect on success
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [success, error, router]);

  if (!success && !error) {
    return null;
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4 fade-in-from-bottom'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center
              rounded-full ${
                success ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
              }`}
          >
            {success ? (
              <CheckCircle2 className='h-10 w-10 text-green-600 dark:text-green-400' />
            ) : (
              <XCircle className='h-10 w-10 text-red-600 dark:text-red-400' />
            )}
          </div>
          <CardTitle className='text-2xl'>
            {success ? 'Email Verified!' : 'Verification Failed'}
          </CardTitle>
          <CardDescription>
            {success
              ? 'Your email has been successfully verified. You are now logged in.'
              : error || 'An error occurred during verification.'}
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center'>
          {success ? (
            <p className='text-sm text-muted-foreground'>
              Redirecting to home page in {countdown} seconds...
            </p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              The verification link may have expired or is invalid. Please try signing up
              again.
            </p>
          )}
        </CardContent>
        <CardFooter className='flex justify-center gap-2'>
          {success ? (
            <Button onClick={() => router.push('/')}>Go to Home Now</Button>
          ) : (
            <>
              <Button onClick={() => router.push('/login')} variant='outline'>
                Back to Login <LogIn />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthResultPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <Spinner className='h-8 w-8' />
        </div>
      }
    >
      <AuthResultContent />
    </Suspense>
  );
}
