import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://tsengphoto.vercel.app'),
  title: 'Video Collections | Tseng Photography',
  description:
    'Explore our curated collections of videography projects. Professional video production and editing services in Vancouver and Kelowna.',
  keywords: [
    'video collections',
    'videography',
    'video production',
    'video editing',
    'Vancouver videographer',
    'Kelowna videographer',
    'professional videography',
    'video portfolio',
    'event videography',
  ],
  openGraph: {
    title: 'Video Collections | Tseng Photography',
    description:
      'Explore our curated collections of videography projects. Professional video production and editing services in Vancouver and Kelowna.',
    url: 'https://tsengphoto.vercel.app/video-collections',
    siteName: 'Tseng Photography',
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: '/landing/carousel/carousel_1.jpg',
        width: 1200,
        height: 630,
        alt: 'Tseng Photography Video Collections',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video Collections | Tseng Photography',
    description:
      'Explore our curated collections of videography projects. Professional video production and editing services in Vancouver and Kelowna.',
    images: ['/landing/carousel/carousel_1.jpg'],
  },
  alternates: {
    canonical: '/video-collections',
  },
};

export default function VideoCollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
