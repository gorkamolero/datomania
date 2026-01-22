import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Manifiesto - Datomania',
  description: 'Datos públicos que deberían existir pero no existen.',
};

export default function ManifiestoPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-main mb-8 inline-block"
        >
          &larr; Volver
        </Link>

        <h1 className="text-4xl md:text-5xl font-heading mb-8">Manifiesto</h1>

        <div className="prose prose-lg max-w-none space-y-6 text-foreground">
          <p className="text-xl font-medium">
            Hay datos públicos que deberían estar organizados pero no lo están.
          </p>

          <p>
            La información existe, dispersa en webs oficiales, portales de
            transparencia, registros públicos. Nosotros la juntamos, rellenamos
            los huecos con agentes de investigación, y la publicamos en formatos
            abiertos.
          </p>

          <p>
            Con las herramientas actuales esto es trivial. Código abierto, datos
            descargables, fuentes verificables.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-border">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-main text-background font-bold uppercase tracking-wide border-2 border-border shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
          >
            Ver proyectos &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
