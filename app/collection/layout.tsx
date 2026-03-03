import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://tsengphoto.vercel.app'),
  title: 'Photo Collection Gallery | Tseng Photography',
  description:
    'Browse our curated collection of professional event photography. Explore stunning images from weddings, corporate events, and special occasions captured in Vancouver and Kelowna by Tseng Photography.',
  keywords: [
    'photo collection',
    'photography gallery',
    'event photos',
    'Vancouver photographer',
    'Kelowna photographer',
    'wedding photography',
    'professional photography',
    'photo portfolio',
  ],
  openGraph: {
    title: 'Photo Collection Gallery | Tseng Photography',
    description:
      'Browse our curated collection of professional event photography from Vancouver and Kelowna.',
    url: 'https://tsengphoto.vercel.app/collection',
    siteName: 'Tseng Photography',
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: '/landing/carousel/carousel_4.jpg',
        width: 1200,
        height: 630,
        alt: 'Tseng Photography Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo Collection Gallery | Tseng Photography',
    description:
      'Browse our curated collection of professional event photography from Vancouver and Kelowna.',
    images: ['/landing/carousel/carousel_4.jpg'],
  },
  alternates: {
    canonical: '/collection',
  },
};

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
