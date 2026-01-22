import { getParlamentarios, getCircunscripciones, getPartidosFromData } from '@/projects/representantes/lib/data';
import { RepresentantesTabs } from './representantes-tabs';

export const metadata = {
  title: 'Representantes XV Legislatura',
  description:
    '615 parlamentarios de la XV Legislatura. Datos de educación, profesión, partido y circunscripción.',
};

export default function RepresentantesPage() {
  const parlamentarios = getParlamentarios();
  const circunscripciones = getCircunscripciones();
  const partidos = getPartidosFromData();

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-heading mb-2">
            615 Parlamentarios
          </h1>
          <p className="text-xl font-medium text-muted-foreground">
            XV Legislatura. Todos los datos públicos. Sin filtros.
          </p>
        </div>

        <RepresentantesTabs
          parlamentarios={parlamentarios}
          circunscripciones={circunscripciones}
          partidos={partidos}
        />
      </div>
    </div>
  );
}
