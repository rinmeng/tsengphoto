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
} from '@/components/ui';
import { ModeToggle } from './ModeToggle';
import { Logo } from './Logo';
import { signOut, useAuth } from '@/hooks/use-auth';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

function LoginButton({ onClose }: { onClose?: () => void }) {
  return (
    <Button variant='outline' asChild>
      <Link href='/login' onClick={onClose}>
        <LogIn /> Login
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
      <DialogContent className='sm:max-w-[425px]'>
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

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/tech-stack', label: 'Tech Stack' },
  { href: '/admin', label: 'Admin' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const filteredNavLinks = navLinks.filter((link) => link.href !== '/admin' || user);

  return (
    <nav className='fixed z-50 w-full border-b bg-background'>
      <div
        className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6
          lg:px-8'
      >
        {/* Logo */}
        <Logo onClick={() => setOpen(false)} />

        {/* Desktop Navigation */}
        <div className='hidden items-center gap-4 md:flex'>
          {filteredNavLinks.map((link) => (
            <Button key={link.href} variant='ghost' asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          {user ? <LogoutButton user={user} /> : <LoginButton />}
          <ModeToggle />
        </div>

        {/* Mobile Navigation - Sheet */}
        <div className='md:hidden'>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon'>
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
              <SheetHeader>
                <SheetTitle>
                  <Logo onClick={() => setOpen(false)} />
                </SheetTitle>
              </SheetHeader>
              <div className='flex flex-col gap-6'>
                <nav className='flex flex-col gap-4 justify-center items-center'>
                  {filteredNavLinks.map((link) => (
                    <Button key={link.href} variant='ghost' className='w-1/2' asChild>
                      <Link href={link.href} onClick={() => setOpen(false)}>
                        {link.label}
                      </Link>
                    </Button>
                  ))}
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
