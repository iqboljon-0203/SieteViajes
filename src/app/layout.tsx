import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sieteviajes.com'),
  title: 'SieteViajes Silk Road — Viajes Exclusivos por Uzbekistán',
  description:
    'Descubre la magia de la Ruta de la Seda con SieteViajes. Tours exclusivos por Samarcanda, Bujará y Jiva con guías hispanohablantes. Reserva tu aventura hoy.',
  keywords: [
    'Uzbekistán',
    'Ruta de la Seda',
    'viajes a Uzbekistán',
    'tours Samarcanda',
    'Bujará tours',
    'Silk Road travel',
    'SieteViajes',
  ],
  openGraph: {
    title: 'SieteViajes Silk Road — Viajes Exclusivos por Uzbekistán',
    description:
      'Tours exclusivos por la Ruta de la Seda. Samarcanda, Bujará, Jiva con guías hispanohablantes.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'SieteViajes Silk Road',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

import { headers } from 'next/headers';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const isAdmin = headersList.get('x-is-admin') === 'true';

  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://rtqsffcbkrwlwkvtsplp.supabase.co" />
      </head>
      <body className="antialiased" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <Providers isAdmin={isAdmin}>{children}</Providers>
      </body>
    </html>
  );
}
