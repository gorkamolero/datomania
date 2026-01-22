import { Suspense } from 'react';
import { InteractiveDashboard } from './interactive-dashboard';
import { getParlamentarios, getPartidosFromData, compareLegislatures } from '@/projects/representantes/lib/data';
import type { Camara } from '@/projects/representantes/types/parlamentario';

export const metadata = {
  title: 'Explorar Parlamentarios - Dashboard Interactivo',
  description:
    'Dashboard interactivo: filtra por partido, cámara, educación. Visualiza flujos de educación a profesión. Compara 1979 vs 2023.',
};

export default function ExplorarPage() {
  // Load both legislatures
  const parlamentariosXV = getParlamentarios('XV');
  const parlamentariosI = getParlamentarios('I');
  const partidosXV = getPartidosFromData('XV');
  const partidosI = getPartidosFromData('I');

  // Pre-compute comparison stats
  const comparison = compareLegislatures('I', 'XV');

  const camaras: Camara[] = ['Congreso', 'Senado'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Explorar datos</h1>
        <p className="text-lg text-muted-foreground">
          Compara la composición del Parlamento español entre la I Legislatura (1979-1982)
          y la XV Legislatura (2023-presente). Analiza la evolución en educación,
          profesión y representación política.
        </p>
      </div>

      <Suspense fallback={<div>Cargando datos...</div>}>
        <InteractiveDashboard
          dataByLegislature={{
            I: parlamentariosI,
            XV: parlamentariosXV,
          }}
          partidosByLegislature={{
            I: partidosI,
            XV: partidosXV,
          }}
          comparison={comparison}
          camaras={camaras}
        />
      </Suspense>
    </div>
  );
}
