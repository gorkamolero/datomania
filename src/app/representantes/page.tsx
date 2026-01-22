import { getParlamentarios, getCircunscripciones, getPartidosFromData } from '@/projects/representantes/lib/data';
import { RepresentantesTabs } from './representantes-tabs';
import type { Legislature } from '@/projects/representantes/types/parlamentario';

export const metadata = {
  title: 'Representantes - Parlamentarios España',
  description:
    'Parlamentarios de España. Compara la I Legislatura (1979) con la XV Legislatura (2023). Datos de educación, profesión, partido y circunscripción.',
};

export default function RepresentantesPage() {
  // Load both legislatures
  const parlamentariosI = getParlamentarios('I');
  const parlamentariosXV = getParlamentarios('XV');
  const circunscripcionesI = getCircunscripciones('I');
  const circunscripcionesXV = getCircunscripciones('XV');
  const partidosI = getPartidosFromData('I');
  const partidosXV = getPartidosFromData('XV');

  const dataByLegislature: Record<Legislature, {
    parlamentarios: ReturnType<typeof getParlamentarios>;
    circunscripciones: string[];
    partidos: string[];
  }> = {
    I: {
      parlamentarios: parlamentariosI,
      circunscripciones: circunscripcionesI,
      partidos: partidosI,
    },
    XV: {
      parlamentarios: parlamentariosXV,
      circunscripciones: circunscripcionesXV,
      partidos: partidosXV,
    },
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <RepresentantesTabs dataByLegislature={dataByLegislature} />
      </div>
    </div>
  );
}
