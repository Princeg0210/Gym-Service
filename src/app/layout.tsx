import { Poppins, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { PortalLoadingProvider } from '@/components/PortalLoadingScreen';

export const metadata: Metadata = {
  title: 'GymPRO India - Commercial Gym Engine & Athlete Arena',
  description:
    'High-velocity athletic gym operating ecosystem with automated UPI dues recovery, WhatsApp passes, peak-hour machine swap, and high-protein Indian nutrition.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#060709] text-zinc-100">
        <Suspense fallback={null}>
          <PortalLoadingProvider>
            {children}
          </PortalLoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}
