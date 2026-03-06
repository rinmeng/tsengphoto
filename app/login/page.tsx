'use client';

import { Logo } from '@/components/Logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/animate-ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
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

import { signInWithEmail } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLoading } from '@/hooks/use-loading';
import { useRouter } from 'next/navigation';
import { Text } from '@/components/Text';
import { LogIn } from 'lucide-react';
import { getDelayClass } from '@/utils/animations';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const { setLoading, isLoading } = useLoading();
  const router = useRouter();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setLoading('auth:login', true);
    try {
      const { email, password } = data;
      const { error } = await signInWithEmail(email, password);
      if (error) {
        loginForm.setError('root', {
          message: 'Invalid email or password',
        });
        toast.error('Login failed', {
          description: 'Please check your credentials and try again.',
        });
        setLoading('auth:login', false);
      } else {
        router.push('/admin');
        toast.success('Login successful', {
          description: 'You are now signed in as ' + email.split('@')[0],
        });
        setLoading('auth:login', false);
      }
    } catch (err) {
      toast.error('Login failed', {
        description: 'Unexpected error occurred.',
      });
      setLoading('auth:login', false);
      throw err;
    }
  };

  return (
    <div className='flex min-h-screen'>
      {/* Left Side - Logo */}
      <div
        className='hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12
          fade-in-from-left-full'
      >
        <div className='text-center space-y-6 max-w-md'>
          <Logo
            iconSize={40}
            className={`text-4xl fade-in-from-left ${getDelayClass(0)}`}
          />
          <Text
            variant='muted'
            className={`fade-in-from-left w-full text-center ${getDelayClass(1)}`}
          >
            Professional event photography services in Vancouver and Kelowna. Capturing
            your special moments with creativity and precision. Book now for unforgettable
            memories.
          </Text>
        </div>
      </div>

      {/* Right Side - Login/Signup Form */}
      <div
        className='flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12
          fade-in-from-top'
      >
        <Card className='w-full max-w-md'>
          <CardHeader className='space-y-1'>
            <CardTitle
              className={`text-2xl font-bold fade-in-from-top ${getDelayClass(2)}`}
            >
              Welcome back
            </CardTitle>
            <CardDescription className={`fade-in-from-top ${getDelayClass(3)}`}>
              Enter your credentials to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      <FormLabel className={`fade-in-from-top ${getDelayClass(4)}`}>
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='m@example.com'
                          autoComplete='email'
                          {...field}
                          className={`fade-in-from-top ${getDelayClass(5)}`}
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
                      <FormLabel className={`fade-in-from-top ${getDelayClass(6)}`}>
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Enter password'
                          autoComplete='current-password'
                          {...field}
                          className={`fade-in-from-top ${getDelayClass(7)}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loginForm.formState.errors.root && (
                  <div className='text-sm text-destructive'>
                    {loginForm.formState.errors.root.message}
                  </div>
                )}
                <Button
                  type='submit'
                  className={`w-full fade-in-from-top ${getDelayClass(8)}`}
                  disabled={isLoading('auth:login')}
                >
                  {isLoading('auth:login') ? (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
