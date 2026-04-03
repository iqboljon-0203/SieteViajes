'use client';

import { useState, useEffect, ReactNode } from 'react';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/ui/FloatingButtons';
import NextTopLoader from 'nextjs-toploader';

import { usePathname } from 'next/navigation';

export function Providers({ children, isAdmin = false }: { children: ReactNode, isAdmin?: boolean }) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <LanguageProvider>
          <SettingsProvider>
            <NextTopLoader color="#D4A853" showSpinner={false} shadow="0 0 10px #D4A853,0 0 5px #D4A853" />
            {!isAdmin && <Navbar />}
            <main>{children}</main>
            {!isAdmin && <Footer />}
            {!isAdmin && <FloatingButtons />}
          </SettingsProvider>
        </LanguageProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
