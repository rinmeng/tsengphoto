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
  services: z.array(z.nativeEnum(SERVICES)).min(1, 'Please select at least one service.'),
  preferredDate: z.date().optional(),
  message: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

const RATE_LIMIT_KEY = 'contact_last_sent';
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

function canSendEmail(skipRateLimit?: boolean): boolean {
  if (skipRateLimit) return true;
  const last = localStorage.getItem(RATE_LIMIT_KEY);
  if (!last) return true;
  return Date.now() - parseInt(last) > COOLDOWN_MS;
}

function getRemainingCooldown(): number {
  const last = localStorage.getItem(RATE_LIMIT_KEY);
  if (!last) return 0;
  return Math.max(0, COOLDOWN_MS - (Date.now() - parseInt(last)));
}

function markEmailSent(): void {
  localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
}

export async function sendContactForm(
  values: ContactFormValues,
  skipRateLimit?: boolean
): Promise<void> {
  if (!canSendEmail(skipRateLimit)) {
    const minutes = Math.ceil(getRemainingCooldown() / 1000 / 60);
    throw new Error(
      `Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before sending another message.`
    );
  }

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

  markEmailSent();
}
