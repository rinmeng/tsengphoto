import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { getDelayClass } from '@/utils/animations';
import Image from 'next/image';
import Link from 'next/link';

const techStack = [
  {
    name: 'Next.js',
    description: 'React framework for production',
    icon: '/icons/nextjs.svg',
    category: 'Framework',
    url: 'https://nextjs.org',
  },
  {
    name: 'React',
    description: 'UI library for building interfaces',
    icon: '/icons/react.svg',
    category: 'Library',
    url: 'https://react.dev',
  },
  {
    name: 'TypeScript',
    description: 'Typed JavaScript at scale',
    icon: '/icons/typescript.svg',
    category: 'Language',
    url: 'https://www.typescriptlang.org',
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
    icon: '/icons/tailwind.svg',
    category: 'Styling',
    url: 'https://tailwindcss.com',
  },
  {
    name: 'Shadcn UI',
    description: 'Re-usable component library',
    icon: '/icons/shadcn.svg',
    category: 'Components',
    url: 'https://ui.shadcn.com',
  },
  {
    name: 'Supabase',
    description: 'Open source Firebase alternative',
    icon: '/icons/supabase.svg',
    category: 'Backend',
    url: 'https://supabase.com',
  },
  {
    name: 'PostgreSQL',
    description: 'Advanced open source database',
    icon: '/icons/postgres.svg',
    category: 'Database',
    url: 'https://www.postgresql.org',
  },
  {
    name: 'ESLint',
    description: 'Pluggable linting utility',
    icon: '/icons/eslint.svg',
    category: 'Code Quality',
    url: 'https://eslint.org',
  },
  {
    name: 'Prettier',
    description: 'Opinionated code formatter',
    icon: '/icons/prettier.svg',
    category: 'Code Quality',
    url: 'https://prettier.io',
  },
];

export default function TechStack() {
  return (
    <div className='container nb-padding mx-auto px-4'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-12 text-center fade-in-from-top'>
          <h1 className='mb-4 text-5xl font-bold'>Tech Stack</h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Built with modern, battle-tested technologies for optimal performance and
            developer experience
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {techStack.map((tech, index) => (
            <Card
              key={tech.name}
              className={`fade-in-from-bottom ${getDelayClass(index + 1)}`}
            >
              <CardHeader>
                <a
                  className='flex items-center gap-4'
                  href={tech.url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <div className='relative h-12 w-12 shrink-0'>
                    <Image
                      src={tech.icon}
                      alt={`${tech.name} logo`}
                      width={48}
                      height={48}
                      className='object-contain dark:invert not-dark:invert-0'
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <CardTitle className='text-lg'>{tech.name}</CardTitle>
                    <CardDescription className='text-xs'>{tech.category}</CardDescription>
                  </div>
                </a>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>{tech.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
