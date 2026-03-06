'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Loader2, SendHorizonal } from 'lucide-react';

import { Text } from '@/components/Text';
import { Button } from '@/components/animate-ui/components/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox, CheckboxIndicator } from '@/components/animate-ui/components';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useLoading } from '@/hooks/use-loading';
import { sendContactForm } from '@/services/contact.service';
import Image from 'next/image';
import { format } from 'date-fns';
import { Separator } from '@/components/ui';
import { toast } from 'sonner';
import { getDelayClass } from '@/utils/animations';

const PHOTO_URL =
  'https://images.squarespace-cdn.com/content/v1/666391f3d3944106358f8cf5/8c2f490a-3a4c-4229-bb1a-41415a7db68d/DSC_3864.jpg';

const SERVICES = ['Events', 'Photoshoot'] as const;

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Invalid email format.'),
  phone: z.string().optional(),
  services: z.array(z.enum(SERVICES)).optional(),
  preferredDate: z.date().optional(),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

function Required() {
  return <Text variant='caption'>*</Text>;
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className={'flex flex-col justify-center text-center items-center gap-6 py-8'}>
      <Separator
        className={`w-12 h-px fade-in-from-right fade-in-from-left ${getDelayClass(1)}`}
      />
      {/* make this swipe left to right */}
      <div className='relative flex items-center justify-center'>
        {/* Icon sweeps across the full width of the text */}
        <SendHorizonal className='absolute sweep-across' />
        <Text variant='hd-md' className={`fade-in-from-0 ${getDelayClass(15)}`}>
          Message received.
        </Text>
      </div>
      <Text variant='bd-md' className={`fade-in-from-left ${getDelayClass(16)}`}>
        Thank you for reaching out. I&lsquo;ll be in touch with you shortly to discuss
        your project.
      </Text>
      <Button
        variant='link'
        onClick={onReset}
        className={`fade-in-from-left ${getDelayClass(17)}`}
      >
        Send another message
      </Button>
    </div>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { setLoading, isLoading } = useLoading();
  const loading = isLoading('contact:submit');

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      services: [],
      preferredDate: undefined,
      message: '',
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setLoading('contact:submit', true);
    try {
      await sendContactForm(values);
      setSubmitted(true);
      toast.success('Message sent', {
        description: 'Your message has been sent successfully.',
      });
    } finally {
      setLoading('contact:submit', false);
    }
  }

  return (
    <section className='min-h-screen flex flex-col lg:flex-row fade-in-from-bottom'>
      {/* ── Left: Photo panel ── */}
      <div
        className='relative h-[50vh] lg:sticky lg:top-0 lg:h-screen w-full lg:w-[65%]
          overflow-hidden shrink-0'
      >
        <Image
          src={PHOTO_URL}
          alt='Crowd celebrating at a welcome center event'
          className='w-full h-full object-cover'
          fill
        />
        <div
          className='absolute inset-0 bg-linear-to-t from-black/60 via-black/10
            to-transparent'
        />
        <div className='absolute bottom-10 left-8 right-8'>
          <Text variant='caption'>Let&lsquo;s make some memories.</Text>

          <Text variant='hd-lg'>
            Book a session with
            <br />
            <Text variant='hd-xl'>Tseng Photography.</Text>
          </Text>
        </div>
      </div>

      {/* ── Right: Form panel ── */}
      <div
        className='flex-1 flex flex-col justify-center px-8 md:px-14 lg:px-16 py-20
          lg:py-24'
      >
        <div className='max-w-130 w-full mx-auto lg:mx-0'>
          {!submitted ? (
            <SuccessMessage
              onReset={() => {
                form.reset();
                setSubmitted(false);
              }}
            />
          ) : (
            <>
              <div className='mb-12'>
                <Text>Contact</Text>
                <Text variant='hd-lg' className='leading-tight'>
                  Tell me about your project
                </Text>
                <Text variant='caption'>
                  Fill out the form below and I&apos;ll be in touch shortly.
                </Text>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  {/* Name row */}
                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='firstName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            First Name <Required />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='Jane' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='lastName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Last Name <Required />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='Doe' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email <Required />
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type='email' placeholder='jane@example.com' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} type='tel' placeholder='(XXX) XXX-XXXX' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Services */}
                  <FormField
                    control={form.control}
                    name='services'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Services</FormLabel>
                        <div className='flex gap-6'>
                          {SERVICES.map((service) => (
                            <FormItem
                              key={service}
                              className='flex items-center gap-2.5 space-y-0'
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value ?? [];
                                    field.onChange(
                                      checked
                                        ? [...current, service]
                                        : current.filter((s) => s !== service)
                                    );
                                  }}
                                >
                                  <CheckboxIndicator />
                                </Checkbox>
                              </FormControl>
                              <FormLabel>{service}</FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Preferred Date */}
                  <FormField
                    control={form.control}
                    name='preferredDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                className={`w-full justify-start text-left font-normal
                                  ${!field.value && 'text-muted-foreground'} `}
                              >
                                <CalendarIcon />
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name='message'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder='Tell me a bit about your vision...'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <div className='pt-2'>
                    <Button type='submit' disabled={loading} className='w-full h-12'>
                      {loading ? (
                        <>
                          <Loader2 className='size-4 animate-spin' />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
