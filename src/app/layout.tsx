
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { GameProvider } from '@/contexts/GameContext';
import { Toaster } from '@/components/ui/toaster';
import { AppShell } from '@/components/AppShell';
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BizTycoon Idle',
  description: 'Manage businesses, invest in stocks, and become a tycoon!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <GameProvider>
            <AppShell>
              {children}
            </AppShell>
            <Toaster />
          </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
