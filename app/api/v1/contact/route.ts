// app/api/contact/route.ts

import { Resend } from 'resend';
import { buildEmailHtml } from '@/lib/email';
import { Logger } from '@/lib/logger';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.NEXT_PUBLIC_RESEND_EMAIL_TO || 'mail@rinm.dev';
const FROM_EMAIL = process.env.NEXT_PUBLIC_RESEND_EMAIL_FROM || 'mail@rinm.dev';

export async function POST(req: Request) {
  const body = await req.json();
  const { firstName, lastName, email, phone, services, preferredDate, message } = body;

  try {
    await resend.emails.send({
      from: `Tseng Photography <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${firstName} ${lastName}`,
      html: buildEmailHtml({
        firstName,
        lastName,
        email,
        phone,
        services,
        preferredDate,
        message,
      }),
    });
  } catch (error) {
    Logger.error('Error sending email:', error);
    return Response.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }

  return Response.json({ success: true }, { status: 200 });
}
