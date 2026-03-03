import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://tsengphoto.vercel.app'),
  title: 'Event Videography & Video Production | Tseng Photography',
  description:
    'Professional event videography services in Vancouver and Kelowna. Cinematic video production for weddings, corporate events, and special occasions. Capture your memories in motion.',
  keywords: [
    'event videography',
    'video production',
    'wedding videography',
    'corporate videos',
    'Vancouver videographer',
    'Kelowna videographer',
    'cinematic video',
    'event coverage',
  ],
  openGraph: {
    title: 'Event Videography & Video Production | Tseng Photography',
    description:
      'Professional event videography services in Vancouver and Kelowna. Cinematic video production for all occasions.',
    url: 'https://tsengphoto.vercel.app/videos',
    siteName: 'Tseng Photography',
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: '/landing/carousel/carousel_3.jpg',
        width: 1200,
        height: 630,
        alt: 'Tseng Photography Video Production',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Event Videography & Video Production | Tseng Photography',
    description:
      'Professional event videography services in Vancouver and Kelowna. Cinematic video production for all occasions.',
    images: ['/landing/carousel/carousel_3.jpg'],
  },
  alternates: {
    canonical: '/videos',
  },
};

export default function VideosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
