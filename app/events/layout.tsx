import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://tsengphoto.vercel.app'),
  title: 'Event Photography Services | Tseng Photography',
  description:
    'Professional event photography in Vancouver and Kelowna. From corporate events to private celebrations, we capture every moment with artistic precision. View our portfolio and book your event today.',
  keywords: [
    'event photography',
    'corporate events',
    'Vancouver events',
    'Kelowna events',
    'wedding photography',
    'celebration photography',
    'professional event photographer',
    'event coverage',
  ],
  openGraph: {
    title: 'Event Photography Services | Tseng Photography',
    description:
      'Professional event photography in Vancouver and Kelowna. Capturing your special moments with creativity and precision.',
    url: 'https://tsengphoto.vercel.app/events',
    siteName: 'Tseng Photography',
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: '/landing/carousel/carousel_1.jpg',
        width: 1200,
        height: 630,
        alt: 'Tseng Photography Events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Event Photography Services | Tseng Photography',
    description:
      'Professional event photography in Vancouver and Kelowna. Capturing your special moments with creativity and precision.',
    images: ['/landing/carousel/carousel_1.jpg'],
  },
  alternates: {
    canonical: '/events',
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
