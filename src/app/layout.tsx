import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Playfair_Display } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Datocracia',
    template: '%s | Datocracia',
  },
  description:
    'Datos públicos que deberían existir en España. Proyectos de datos abiertos sobre transparencia, política, y más.',
  keywords: [
    'parlamentarios',
    'españa',
    'congreso',
    'senado',
    'datos abiertos',
    'transparencia',
  ],
  authors: [{ name: 'Spanish Flu' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Datocracia',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
