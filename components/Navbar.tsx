'use client';

import { LogIn, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/animate-ui/components/';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ModeToggle } from './ModeToggle';
import { Logo } from './Logo';
import { signOut, useAuth } from '@/hooks/use-auth';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function LoginButton({ onClose }: { onClose?: () => void }) {
  return (
    <Button variant='outline' asChild>
      <Link href='/login' onClick={onClose}>
        <LogIn />
      </Link>
    </Button>
  );
}

function LogoutButton({ user, onClose }: { user: User; onClose?: () => void }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('You have been logged out.');
    } catch {
      toast.error('There was an issue logging you out.');
    }
    setDialogOpen(false);
    onClose?.();
    router.push('/login');
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          {user.email?.split('@')[0]} <LogOut />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle>Logout?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to logout from your account <strong>{user.email}</strong>?
        </DialogDescription>
        <DialogFooter>
          <Button variant='destructive' onClick={handleLogout}>
            Logout <LogOut />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const portfolioLinks = [
  { href: '/collection', label: 'Collection' },
  { href: '/series', label: 'Series' },
  { href: '/events', label: 'Events' },
  { href: '/videos', label: 'Videos' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className='fixed z-50 w-full border-b bg-background'>
      <div
        className='mx-auto flex max-w-11/12 items-center justify-between px-4 py-4 sm:px-6
          lg:px-8'
      >
        {/* Logo */}
        <Logo className='text-xl' onClick={() => setOpen(false)} />

        {/* Desktop Navigation */}
        <div className='hidden items-center gap-4 lg:flex'>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href='/' passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Portfolio</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='grid w-48 gap-3 p-4'>
                    {portfolioLinks.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink asChild>
                          <Link href={link.href}>
                            <div>{link.label}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href='/about' legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href='/contact' legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {user && (
                <NavigationMenuItem>
                  <Link href='/admin' legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Admin
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {user ? <LogoutButton user={user} /> : <LoginButton />}
          <ModeToggle />
        </div>

        {/* Mobile Navigation - Sheet */}
        <div className='lg:hidden'>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon'>
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-75 sm:w-100'>
              <SheetHeader>
                <SheetTitle>
                  <Logo onClick={() => setOpen(false)} />
                </SheetTitle>
              </SheetHeader>
              <div className='flex flex-col gap-6'>
                <nav className='flex flex-col gap-4 justify-center items-center'>
                  <Button variant='ghost' className='w-1/2' asChild>
                    <Link href='/' onClick={() => setOpen(false)}>
                      Home
                    </Link>
                  </Button>

                  <Accordion type='single' collapsible className='w-1/2'>
                    <AccordionItem value='portfolio' className='border-0'>
                      <AccordionTrigger
                        className='justify-center hover:bg-accent
                          hover:text-accent-foreground py-2 px-4 rounded-md
                          hover:no-underline'
                      >
                        Portfolio
                      </AccordionTrigger>
                      <AccordionContent className='pb-2'>
                        <div className='flex flex-col gap-2 pl-6 pr-2 mt-2'>
                          {portfolioLinks.map((link) => (
                            <Button
                              key={link.href}
                              variant='ghost'
                              size='sm'
                              className='w-full justify-end text-muted-foreground'
                              asChild
                            >
                              <Link href={link.href} onClick={() => setOpen(false)}>
                                {link.label}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Button variant='ghost' className='w-1/2' asChild>
                    <Link href='/about' onClick={() => setOpen(false)}>
                      About
                    </Link>
                  </Button>

                  <Button variant='ghost' className='w-1/2' asChild>
                    <Link href='/contact' onClick={() => setOpen(false)}>
                      Contact
                    </Link>
                  </Button>

                  {user && (
                    <Button variant='ghost' className='w-1/2' asChild>
                      <Link href='/admin' onClick={() => setOpen(false)}>
                        Admin
                      </Link>
                    </Button>
                  )}

                  {user ? (
                    <LogoutButton user={user} onClose={() => setOpen(false)} />
                  ) : (
                    <LoginButton onClose={() => setOpen(false)} />
                  )}
                  <ModeToggle />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
