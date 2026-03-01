'use client';

import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
} from '@/components/ui';

import { signInWithEmail, signUpWithEmail } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus } from 'lucide-react';
import { DURATIONS } from '@/lib';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signupSchema = z
  .object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const { email, password } = data;
      const { error } = await signInWithEmail(email, password);
      if (error) {
        // Show email-specific errors on email field, others on password field
        if (error.message.toLowerCase().includes('email not confirmed')) {
          loginForm.setError('email', { message: error.message });
        } else {
          loginForm.setError('password', { message: error.message });
        }
        toast.error('Login failed', { description: 'Please check your credentials and try again.' });
      } else {
        toast.success('Login successful', { description: 'You are now signed in.' });
        router.push('/');
      }
    } catch (err) {
      toast.error('Login failed', {
        description: 'Unexpected error occurred.',
      });
      throw err;
    }
    setLoading(false);
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      const { email, password } = data;
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        signupForm.setError('password', { message: 'Please check your information and try again.' });
        toast.error('Signup failed', { description: 'Please check your information and try again.' });
      } else {
        toast.success('Check your email!', {
          description: 'We sent you a verification link. Please check your inbox.',
          duration: DURATIONS.TOAST_LONG,
        });
        // Auto-fill login form and switch to login mode after email sent
        loginForm.setValue('email', email);
        loginForm.setValue('password', password);
        setIsLogin(true);
      }
    } catch (err) {
      toast.error('Signup failed', {
        description: 'Unexpected error occurred.',
      });

      throw err;
    }
    setLoading(false);
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    loginForm.reset();
    signupForm.reset();
  };

  return (
    <div className='flex min-h-screen'>
      {/* Left Side - Logo */}
      <div
        className='hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12
          fade-in-from-left-full'
      >
        <div className='text-center space-y-6'>
          <Logo iconSize={40} className='text-4xl fade-in-from-left delay-[300ms]' />
          <p
            className='text-muted-foreground text-lg max-w-md fade-in-from-left
              delay-[400ms]'
          >
            Welcome the admin demo, here you will be able to create an account and test
            logins for admin control over the message board.
          </p>
        </div>
      </div>

      {/* Right Side - Login/Signup Form */}
      <div
        className='flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12
          fade-in-from-top'
      >
        <Card className='w-full max-w-md'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl font-bold fade-in-from-top delay-[100ms]'>
              {isLogin ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription className='fade-in-from-top delay-[200ms]'>
              {isLogin
                ? 'Enter your credentials to sign in to your account'
                : 'Enter your information to create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <Form {...loginForm} key='login-form'>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={loginForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='fade-in-from-top delay-[250ms]'>
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='m@example.com'
                            autoComplete='email'
                            {...field}
                            className='fade-in-from-top delay-[300ms]'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='fade-in-from-top delay-[350ms]'>
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='Enter password'
                            autoComplete='current-password'
                            {...field}
                            className='fade-in-from-top delay-[400ms]'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    className='w-full fade-in-from-top delay-[450ms]'
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner /> Signing In...
                      </>
                    ) : (
                      <>
                        Sign In <LogIn />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...signupForm} key='signup-form'>
                <form
                  onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={signupForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='m@example.com'
                            autoComplete='email'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='Enter password'
                            autoComplete='new-password'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='Confirm password'
                            autoComplete='new-password'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' className='w-full' disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner /> Signing Up...
                      </>
                    ) : (
                      <>
                        Sign Up <UserPlus />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className='flex flex-col space-y-4 fade-in-from-top delay-[600ms]'>
            <div className='text-sm text-center text-muted-foreground'>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={handleToggleMode}
                className='text-primary hover:underline font-medium'
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
