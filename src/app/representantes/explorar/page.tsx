import { Suspense } from 'react';
import { InteractiveDashboard } from './interactive-dashboard';
import { getParlamentarios, getPartidosFromData } from '@/projects/representantes/lib/data';
import type { Camara } from '@/projects/representantes/types/parlamentario';

export const metadata = {
  title: 'Explorar datos - Educación y Profesión | Parlamentarios España',
  description:
    'Explora de forma interactiva los datos sobre educación y trayectorias profesionales de los parlamentarios españoles. Filtra por cámara, partido, nivel educativo y más.',
};

export default function ExplorarPage() {
  const parlamentarios = getParlamentarios();
  const partidos = getPartidosFromData();

  const camaras: Camara[] = ['Congreso', 'Senado'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Explorar datos</h1>
        <p className="text-lg text-muted-foreground">
          Utiliza los filtros para explorar y analizar los datos sobre educación
          y trayectorias profesionales de los parlamentarios españoles.
        </p>
      </div>

      <Suspense fallback={<div>Cargando datos...</div>}>
        <InteractiveDashboard
          initialData={parlamentarios}
          camaras={camaras}
          partidos={partidos}
        />
      </Suspense>
    </div>
  );
}
