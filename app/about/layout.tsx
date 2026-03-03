import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://tsengphoto.vercel.app'),
  title: 'About | Tseng Photography',
  description:
    'Learn more about Tseng Photography, our mission, and the team behind the lens. Discover our story and what drives our passion for capturing unforgettable moments in Vancouver and Kelowna.',
  keywords: [
    'about Tseng Photography',
    'photography team',
    'photography mission',
    'event photos',
    'Vancouver photographer',
    'Kelowna photographer',
    'wedding photography',
    'professional photography',
    'photo portfolio',
  ],
  openGraph: {
    title: 'About | Tseng Photography',
    description:
      'Learn more about Tseng Photography, our mission, and the team behind the lens. Discover our story and what drives our passion for capturing unforgettable moments in Vancouver and Kelowna.',
    url: 'https://tsengphoto.vercel.app/about',
    siteName: 'Tseng Photography',
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: '/landing/carousel/carousel_5.jpg',
        width: 1200,
        height: 630,
        alt: 'Tseng Photography About',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Tseng Photography',
    description:
      'Learn more about Tseng Photography, our mission, and the team behind the lens. Discover our story and what drives our passion for capturing unforgettable moments in Vancouver and Kelowna.',
    images: ['/landing/carousel/carousel_5.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
