import * as z from 'zod';

export enum SERVICES {
  GENERAL_INQUIRIES = 'General Inquiries',
  EVENTS = 'Events',
  PHOTOSHOOT = 'Photoshoot',
}

export const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.email('Invalid email format.'),
  phone: z.string().optional(),
  services: z.array(z.enum(SERVICES)).optional(),
  preferredDate: z.date().optional(),
  message: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export async function sendContactForm(values: ContactFormValues): Promise<void> {
  const formattedValues = {
    ...values,
    preferredDate: values.preferredDate?.toISOString(),
  };

  const res = await fetch('/api/v1/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formattedValues),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? 'Failed to send message');
  }
}
