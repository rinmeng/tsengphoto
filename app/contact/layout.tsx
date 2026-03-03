import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Tseng Photography',
  description:
    'Get in touch with Tseng Photography for professional event and portrait photography services in Vancouver and Kelowna. Book a session or discuss your photography needs with our experienced team.',
  keywords: [
    'contact photographer',
    'photography inquiry',
    'book photographer',
    'Vancouver photographer contact',
    'Kelowna photographer contact',
    'wedding photographer inquiry',
    'event photography booking',
    'portrait photography contact',
    'photography consultation',
  ],
  openGraph: {
    title: 'Contact Us | Tseng Photography',
    description:
      'Get in touch with Tseng Photography for professional event and portrait photography services in Vancouver and Kelowna.',
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: '/landing/carousel/carousel_1.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Tseng Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Tseng Photography',
    description:
      'Get in touch with Tseng Photography for professional event and portrait photography services in Vancouver and Kelowna.',
    images: ['/landing/carousel/carousel_1.jpg'],
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
