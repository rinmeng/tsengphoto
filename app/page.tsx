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
  return (
    <div className='container mx-auto px-4 nb-padding fade-in-from-bottom'>
      <div className='mx-auto max-w-6xl gap-6 flex flex-col'>
        <div className='text-center'>
          <h1 className='mb-4 text-5xl font-bold tracking-tight fade-in-from-bottom'>
            Next.js Starter Template
          </h1>
          <p
            className='mx-auto max-w-2xl text-lg text-muted-foreground fade-in-from-bottom
              delay-[100ms]'
          >
            A modern boilerplate with Next.js, Shadcn UI, and Supabase. Get started
            building your next project with this production-ready starter, beautifully
            designed by rin.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-3 delay-[300ms]'>
          {cards.map((card, idx) => (
            <Card
              key={card.title}
              className={`fade-in-from-bottom ${getDelayClass(idx + 5)}`}
            >
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>{card.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='text-center'>
          <div className='flex flex-wrap justify-center gap-4'>
            <Link href='/features'>
              <Button size='lg' className='fade-in-from-bottom delay-[550ms]'>
                Check out the features <ArrowRight />
              </Button>
            </Link>
            <Button
              size='lg'
              variant='outline'
              className='fade-in-from-bottom delay-[600ms]'
              asChild
            >
              <a
                href='https://github.com/rinmeng/next-shadcn-supabase-starter'
                target='_blank'
                rel='noopener noreferrer'
              >
                View on GitHub <SquareArrowOutUpRight />
              </a>
            </Button>
          </div>
        </div>
        {/* if you want a quick test for data base stuff, make sure you uncomment this and check the component.*/}
        {/* <div className='fade-in-from-bottom delay-[700ms]'>
          <Messages />
        </div> */}
      </div>
    </div>
  );
}
