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
    default: 'Datomania! - Datos públicos que deberían existir',
    template: '%s | Datomania!',
  },
  description:
    'Los datos públicos que deberían existir en España pero no existen. Parlamentarios, educación, profesiones, partidos. Transparencia radical.',
  keywords: [
    'parlamentarios españa',
    'congreso diputados',
    'senado españa',
    'datos abiertos',
    'transparencia política',
    'educación parlamentarios',
    'I legislatura',
    'XV legislatura',
    'democracia españa',
  ],
  authors: [{ name: 'Gorka Fernández Molero' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Datomania!',
    title: 'Datomania! - Datos públicos que deberían existir',
    description: 'Los datos públicos que deberían existir en España pero no existen. Parlamentarios, educación, profesiones, partidos.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Datomania!',
    description: 'Los datos públicos que deberían existir en España pero no existen.',
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
