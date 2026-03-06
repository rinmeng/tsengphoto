import * as z from 'zod';

const SERVICES = ['Events', 'Photoshoot'] as const;

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.email('Invalid email format.'),
  phone: z.string().optional(),
  services: z.array(z.enum(SERVICES)).optional(),
  preferredDate: z.date().optional(),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export async function sendContactForm(values: ContactFormValues): Promise<void> {
  const formattedValues = {
    ...values,
    preferredDate: values.preferredDate?.toISOString(),
  };
  console.info('To be implemented: sendContactForm', formattedValues);
}
