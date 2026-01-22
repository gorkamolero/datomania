'use client';

import { useState, useMemo } from 'react';
import type { Parlamentario, Camara, ParlamentarioFilters } from '@/types/parlamentario';
import { EducationBarChart } from '@/components/charts/education-bar-chart';
import { ProfessionPieChart } from '@/components/charts/profession-pie-chart';
import { PartyDistribution } from '@/components/charts/party-distribution';
import { Hemiciclo, EducationProfessionSankey } from '@/components/visualizations';
import { computeStatsFromData } from './compute-stats';

interface InteractiveDashboardProps {
  initialData: Parlamentario[];
  camaras: Camara[];
  partidos: string[];
}

export function InteractiveDashboard({
  initialData,
  camaras,
  partidos,
}: InteractiveDashboardProps) {
  const [filters, setFilters] = useState<ParlamentarioFilters>({});

  // Compute filtered data and stats
  const { filteredData, stats } = useMemo(() => {
    let filtered = initialData;

    if (filters.camara) {
      filtered = filtered.filter((p) => p.camara === filters.camara);
    }

    if (filters.partido) {
      filtered = filtered.filter((p) => p.partido === filters.partido);
    }

    const statsData = computeStatsFromData(filtered);

    return { filteredData: filtered, stats: statsData };
  }, [initialData, filters]);

  // Handler functions
  const handleCamaraChange = (camara: string) => {
    setFilters((prev) => ({
      ...prev,
      camara: camara === 'todas' ? undefined : (camara as Camara),
    }));
  };

  const handlePartidoChange = (partido: string) => {
    setFilters((prev) => ({
      ...prev,
      partido: partido === 'todos' ? undefined : partido,
    }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = filters.camara || filters.partido;

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Filtros</h2>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Camara Filter */}
            <div className="space-y-2">
              <label
                htmlFor="camara-select"
                className="text-sm font-medium block"
              >
                Cámara
              </label>
              <select
                id="camara-select"
                value={filters.camara ?? 'todas'}
                onChange={(e) => handleCamaraChange(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="todas">Todas las cámaras</option>
                {camaras.map((camara) => (
                  <option key={camara} value={camara}>
                    {camara}
                  </option>
                ))}
              </select>
            </div>

            {/* Partido Filter */}
            <div className="space-y-2">
              <label
                htmlFor="partido-select"
                className="text-sm font-medium block"
              >
                Partido
              </label>
              <select
                id="partido-select"
                value={filters.partido ?? 'todos'}
                onChange={(e) => handlePartidoChange(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="todos">Todos los partidos</option>
                {partidos
                  .sort((a, b) => a.localeCompare(b))
                  .map((partido) => (
                    <option key={partido} value={partido}>
                      {partido}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total"
          value={stats.total}
          description="Parlamentarios"
        />
        <StatCard
          title="Con datos educativos"
          value={stats.cobertura.estudios_con_datos}
          description={`${((stats.cobertura.estudios_con_datos / stats.total) * 100).toFixed(1)}% del total`}
        />
        <StatCard
          title="Con datos profesionales"
          value={stats.cobertura.profesion_con_datos}
          description={`${((stats.cobertura.profesion_con_datos / stats.total) * 100).toFixed(1)}% del total`}
        />
        <StatCard
          title="Partidos representados"
          value={Object.keys(stats.por_partido).length}
          description="Grupos parlamentarios"
        />
      </div>

      {/* Hemiciclo Visualization */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-serif font-semibold mb-4">
          Composición del hemiciclo
        </h3>
        <Hemiciclo parlamentarios={filteredData} />
      </div>

      {/* Sankey Diagram */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-serif font-semibold mb-4">
          Flujo de educación a profesión
        </h3>
        <EducationProfessionSankey parlamentarios={filteredData} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Education Chart */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Distribución por nivel educativo
          </h3>
          <EducationBarChart data={stats.por_estudios_nivel} />
        </div>

        {/* Profession Chart */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Distribución por categoría profesional
          </h3>
          <ProfessionPieChart data={stats.por_profesion_categoria} />
        </div>

        {/* Party Distribution Chart */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Distribución por partido
          </h3>
          <PartyDistribution data={stats.por_partido} />
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-muted/50 border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">
          Resumen de datos filtrados
        </h3>
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredData.length} de {initialData.length}{' '}
          parlamentarios
          {filters.camara && ` en ${filters.camara}`}
          {filters.partido && ` del partido ${filters.partido}`}.
        </p>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold mb-1">{value.toLocaleString('es-ES')}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
