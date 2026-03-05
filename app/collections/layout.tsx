import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://tsengphoto.vercel.app'),
  title: 'Collections | Tseng Photography',
  description:
    'Browse our collection of event photography, video projects, and photo series. Professional photography services in Vancouver and Kelowna.',
  keywords: [
    'photography collections',
    'event photography',
    'photo series',
    'Vancouver photographer',
    'Kelowna photographer',
    'photography portfolio',
    'professional photography',
    'photo gallery',
  ],
  openGraph: {
    title: 'Collections | Tseng Photography',
    description:
      'Browse our collection of event photography, video projects, and photo series. Professional photography services in Vancouver and Kelowna.',
    url: 'https://tsengphoto.vercel.app/collections',
    siteName: 'Tseng Photography',
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: '/landing/carousel/carousel_1.jpg',
        width: 1200,
        height: 630,
        alt: 'Tseng Photography Collections',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collections | Tseng Photography',
    description:
      'Browse our collection of event photography, video projects, and photo series. Professional photography services in Vancouver and Kelowna.',
    images: ['/landing/carousel/carousel_1.jpg'],
  },
  alternates: {
    canonical: '/collections',
  },
};

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
