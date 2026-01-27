import { Metadata } from 'next';
import { getParlamentarios, getCircunscripciones, getPartidosFromData } from '@/projects/representantes/lib/data';
import { ParlamentariosTable } from './parlamentarios-table';

export const metadata: Metadata = {
  title: 'Lista de Parlamentarios - Buscar y Filtrar',
  description:
    'Busca cualquier parlamentario español. Filtra por partido, cámara, circunscripción, nivel educativo. 1.257 perfiles con datos verificados.',
};

export default function ParlamentariosPage() {
  const parlamentarios = getParlamentarios();
  const circunscripciones = getCircunscripciones();
  const partidos = getPartidosFromData();

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading uppercase tracking-tight">
            Parlamentarios
          </h1>
          <p className="mt-2 text-muted-foreground font-medium">
            {parlamentarios.length} parlamentarios de la XV Legislatura del
            Congreso de los Diputados y el Senado.
          </p>
        </div>

        <ParlamentariosTable
          parlamentarios={parlamentarios}
          circunscripciones={circunscripciones}
          partidos={partidos}
        />
      </div>
    </div>
  );
}
