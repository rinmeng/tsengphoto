import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Navbar } from '@/components/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { Toaster } from '@/components/ui/sonner';
import { Libre_Baskerville, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const fontSans = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

const fontMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Event Photography in Vancouver and Kelowna | Tseng Photography',
  description:
    'Professional event photography services in Vancouver and Kelowna. Capturing your special moments with creativity and precision. Book now for unforgettable memories.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <ToastProvider>
              <Navbar />
              <main>{children}</main>
              <Toaster />
              <Analytics />
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
