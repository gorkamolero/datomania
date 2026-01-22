import type { Metadata } from 'next';
import { Archivo_Black, Space_Grotesk } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const archivoBlack = Archivo_Black({
  variable: '--font-archivo-black',
  subsets: ['latin'],
  weight: '400',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Datomania',
    template: '%s | Datomania',
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
    siteName: 'Datomania',
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
        className={`${archivoBlack.variable} ${spaceGrotesk.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
