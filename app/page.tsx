import Link from 'next/link';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
// import Messages from '@/components/Messages';
import { getDelayClass } from '@/utils/animations';
import { ArrowRight, SquareArrowOutUpRight } from 'lucide-react';

const cards = [
  {
    title: 'Fast Development',
    description: 'Start building immediately',
    content:
      'Pre-configured with all the tools you need. Beautiful UI components, authentication, and database ready to go.',
  },
  {
    title: 'Type Safe',
    description: 'Full TypeScript support',
    content:
      'End-to-end type safety with TypeScript, ensuring fewer bugs and better developer experience.',
  },
  {
    title: 'Production Ready',
    description: 'Deploy with confidence',
    content:
      'Optimized for performance and ready to deploy to Vercel, Netlify, or any platform.',
  },
];

export default function Home() {
  return <div className='container mx-auto px-4 nb-padding fade-in-from-bottom'></div>;
}
