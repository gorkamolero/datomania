import { Metadata } from 'next';
import { getParlamentarios, getCircunscripciones, getPartidosFromData } from '@/projects/representantes/lib/data';
import { RepresentantesTabs } from './representantes-tabs';
import type { Legislature } from '@/projects/representantes/types/parlamentario';

export async function generateMetadata(): Promise<Metadata> {
  const total = getParlamentarios('I').length + getParlamentarios('XV').length;
  const formatted = total.toLocaleString('es-ES');
  return {
    title: `${formatted} Parlamentarios de España - I vs XV Legislatura`,
    description:
      '45 años de democracia comparados: I Legislatura (1979) vs XV Legislatura (2023). Educación, profesión, partidos. ¿Cuántos tienen carrera? ¿Cuántos son políticos profesionales?',
  };
}

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
