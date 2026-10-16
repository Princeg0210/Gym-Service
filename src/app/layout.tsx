import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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
  title: 'GymPRO India — Commercial Gym Engine & Athlete Arena',
  description:
    'High-velocity athletic gym operating ecosystem with automated UPI dues recovery, WhatsApp passes, peak-hour machine swap, and high-protein Indian nutrition.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
