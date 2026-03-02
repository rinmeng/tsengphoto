import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photography Series & Projects | Tseng Photography',
  description:
    'Explore our exclusive photography series and ongoing projects. Curated collections showcasing artistic vision and storytelling through professional photography in Vancouver and Kelowna.',
  keywords: [
    'photography series',
    'photo projects',
    'artistic photography',
    'Vancouver photographer',
    'Kelowna photographer',
    'photography portfolio',
    'creative photography',
    'photo exhibition',
  ],
  openGraph: {
    title: 'Photography Series & Projects | Tseng Photography',
    description:
      'Explore our exclusive photography series and ongoing projects showcasing artistic vision and storytelling.',
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: '/landing/carousel/carousel_2.jpg',
        width: 1200,
        height: 630,
        alt: 'Tseng Photography Series',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photography Series & Projects | Tseng Photography',
    description:
      'Explore our exclusive photography series and ongoing projects showcasing artistic vision and storytelling.',
    images: ['/landing/carousel/carousel_2.jpg'],
  },
  alternates: {
    canonical: '/series',
  },
};

export default function SeriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
