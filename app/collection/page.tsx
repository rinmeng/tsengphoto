import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { getDelayClass } from '@/utils/animations';
import {
  Shield,
  Lock,
  Mail,
  Route,
  Zap,
  Code2,
  Layers,
  Paintbrush,
  Box,
  Server,
  FileCode,
  Workflow,
  Rocket,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Authentication & Security',
    description: 'Enterprise-grade security built-in',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    items: [
      { icon: Lock, label: 'Supabase Auth' },
      { icon: Mail, label: 'Email Verification' },
      { icon: Route, label: 'Protected Routes' },
      { icon: Workflow, label: 'Auth Callbacks' },
      { icon: Shield, label: 'Middleware Proxy' },
    ],
  },
  {
    icon: Code2,
    title: 'Modern Tech Stack',
    description: 'Cutting-edge technologies for peak performance',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    items: [
      { icon: Zap, label: 'Next.js 15' },
      { icon: Route, label: 'App Router' },
      { icon: Code2, label: 'TypeScript' },
      { icon: Paintbrush, label: 'Tailwind CSS' },
      { icon: Box, label: 'Shadcn UI' },
    ],
  },
  {
    icon: Layers,
    title: 'Scalable Architecture',
    description: 'Future-proof project structure',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    items: [
      { icon: Server, label: 'API Versioning' },
      { icon: FileCode, label: 'Server Components' },
      { icon: Box, label: 'Client Components' },
      { icon: Route, label: 'Route Handlers' },
      { icon: Layers, label: 'Modular Design' },
    ],
  },
  {
    icon: Rocket,
    title: 'Developer Experience',
    description: 'Tools that boost productivity',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    items: [
      { icon: Zap, label: 'Hot Reload' },
      { icon: CheckCircle2, label: 'ESLint' },
      { icon: Sparkles, label: 'Prettier' },
      { icon: AlertCircle, label: 'Type Safety' },
      { icon: CheckCircle2, label: 'Form Validation' },
    ],
  },
];

export default function Features() {
  return (
    <div className='container nb-padding mx-auto px-4'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold fade-in-from-right'>Features</h1>
          <p
            className='text-xl text-muted-foreground max-w-2xl mx-auto fade-in-from-right
              delay-[100ms]'
          >
            A comprehensive starter template with everything you need to build modern web
            applications
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className='grid gap-6 md:grid-cols-2'>
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={`fade-in-from-right ${getDelayClass(idx + 2)}`}
              >
                <CardHeader>
                  <div className='flex items-start gap-4'>
                    <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div className='flex-1'>
                      <CardTitle className='text-xl'>{feature.title}</CardTitle>
                      <CardDescription className='mt-1'>
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {feature.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <Badge
                          variant='outline'
                          key={item.label}
                          className='flex items-center gap-2 rounded-md'
                        >
                          <ItemIcon className='text-muted-foreground' />
                          <span className='text-sm'>{item.label}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
