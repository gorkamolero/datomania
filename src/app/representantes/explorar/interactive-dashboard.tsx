'use client';

import { useState, useMemo } from 'react';
import type { Parlamentario, Camara, ParlamentarioFilters, Legislature } from '@/projects/representantes/types/parlamentario';
import { LEGISLATURE_INFO } from '@/projects/representantes/types/parlamentario';
import type { LegislatureComparison } from '@/projects/representantes/lib/data';
import { EducationBarChart } from '@/components/charts/education-bar-chart';
import { ProfessionPieChart } from '@/components/charts/profession-pie-chart';
import { PartyDistribution } from '@/components/charts/party-distribution';
import { Hemiciclo, EducationProfessionSankey } from '@/components/visualizations';
import { computeStatsFromData } from './compute-stats';

type ViewMode = 'explore' | 'compare';

interface InteractiveDashboardProps {
  dataByLegislature: Record<Legislature, Parlamentario[]>;
  partidosByLegislature: Record<Legislature, string[]>;
  comparison: LegislatureComparison;
  camaras: Camara[];
}

export function InteractiveDashboard({
  dataByLegislature,
  partidosByLegislature,
  comparison,
  camaras,
}: InteractiveDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [selectedLegislature, setSelectedLegislature] = useState<Legislature>('XV');
  const [filters, setFilters] = useState<ParlamentarioFilters>({});

  const currentData = dataByLegislature[selectedLegislature];
  const currentPartidos = partidosByLegislature[selectedLegislature];

  // Compute filtered data and stats
  const { filteredData, stats } = useMemo(() => {
    let filtered = currentData;

    if (filters.camara) {
      filtered = filtered.filter((p) => p.camara === filters.camara);
    }

    if (filters.partido) {
      filtered = filtered.filter((p) => p.partido === filters.partido);
    }

    const statsData = computeStatsFromData(filtered);

    return { filteredData: filtered, stats: statsData };
  }, [currentData, filters]);

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

  const handleLegislatureChange = (leg: Legislature) => {
    setSelectedLegislature(leg);
    setFilters({}); // Reset filters when changing legislature
  };

  const hasActiveFilters = filters.camara || filters.partido;

  return (
    <div className="space-y-8">
      {/* View Mode Tabs */}
      <div className="flex gap-2 border-b pb-4">
        <button
          onClick={() => setViewMode('explore')}
          className={`px-4 py-2 rounded-t-md font-medium transition-colors ${
            viewMode === 'explore'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Explorar
        </button>
        <button
          onClick={() => setViewMode('compare')}
          className={`px-4 py-2 rounded-t-md font-medium transition-colors ${
            viewMode === 'compare'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Comparar legislaturas
        </button>
      </div>

      {viewMode === 'explore' ? (
        <>
          {/* Legislature Selector */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Selecciona legislatura</h2>
            <div className="flex gap-4">
              {(['I', 'XV'] as Legislature[]).map((leg) => (
                <button
                  key={leg}
                  onClick={() => handleLegislatureChange(leg)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    selectedLegislature === leg
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="font-bold text-lg">{LEGISLATURE_INFO[leg].name}</div>
                  <div className="text-sm text-muted-foreground">
                    {LEGISLATURE_INFO[leg].years}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {dataByLegislature[leg].length} parlamentarios
                  </div>
                </button>
              ))}
            </div>
          </div>

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
                    {currentPartidos
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
              Composición del hemiciclo - {LEGISLATURE_INFO[selectedLegislature].name}
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
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Distribución por nivel educativo
              </h3>
              <EducationBarChart data={stats.por_estudios_nivel} />
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Distribución por categoría profesional
              </h3>
              <ProfessionPieChart data={stats.por_profesion_categoria} />
            </div>

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
              Mostrando {filteredData.length} de {currentData.length}{' '}
              parlamentarios de la {LEGISLATURE_INFO[selectedLegislature].name}
              {filters.camara && ` en ${filters.camara}`}
              {filters.partido && ` del partido ${filters.partido}`}.
            </p>
          </div>
        </>
      ) : (
        /* Comparison View */
        <ComparisonView comparison={comparison} dataByLegislature={dataByLegislature} />
      )}
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

interface ComparisonViewProps {
  comparison: LegislatureComparison;
  dataByLegislature: Record<Legislature, Parlamentario[]>;
}

function ComparisonView({ comparison, dataByLegislature }: ComparisonViewProps) {
  const { stats1, stats2, changes } = comparison;

  // Calculate percentages for comparison
  const uni1Pct = ((stats1.por_estudios_nivel.Universitario / stats1.total) * 100).toFixed(1);
  const uni2Pct = ((stats2.por_estudios_nivel.Universitario / stats2.total) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6 text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            I Legislatura (1979-1982)
          </h3>
          <p className="text-4xl font-bold">{stats1.total}</p>
          <p className="text-sm text-muted-foreground">parlamentarios</p>
        </div>

        <div className="bg-card border rounded-lg p-6 text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Cambio en 45 años
          </h3>
          <p className="text-4xl font-bold">
            {changes.total_change > 0 ? '+' : ''}{changes.total_change}
          </p>
          <p className="text-sm text-muted-foreground">parlamentarios</p>
        </div>

        <div className="bg-card border rounded-lg p-6 text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            XV Legislatura (2023-presente)
          </h3>
          <p className="text-4xl font-bold">{stats2.total}</p>
          <p className="text-sm text-muted-foreground">parlamentarios</p>
        </div>
      </div>

      {/* Education Comparison */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-6">
          Evolución del nivel educativo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* I Legislature */}
          <div>
            <h4 className="text-lg font-medium mb-4">I Legislatura (1979)</h4>
            <div className="space-y-3">
              <EducationComparisonBar
                label="Universitario"
                value={stats1.por_estudios_nivel.Universitario}
                total={stats1.total}
                color="bg-blue-500"
              />
              <EducationComparisonBar
                label="FP/Técnico"
                value={stats1.por_estudios_nivel.FP_Tecnico}
                total={stats1.total}
                color="bg-green-500"
              />
              <EducationComparisonBar
                label="Secundario"
                value={stats1.por_estudios_nivel.Secundario}
                total={stats1.total}
                color="bg-yellow-500"
              />
              <EducationComparisonBar
                label="Sin datos"
                value={stats1.por_estudios_nivel.No_consta}
                total={stats1.total}
                color="bg-gray-400"
              />
            </div>
          </div>

          {/* XV Legislature */}
          <div>
            <h4 className="text-lg font-medium mb-4">XV Legislatura (2023)</h4>
            <div className="space-y-3">
              <EducationComparisonBar
                label="Universitario"
                value={stats2.por_estudios_nivel.Universitario}
                total={stats2.total}
                color="bg-blue-500"
              />
              <EducationComparisonBar
                label="FP/Técnico"
                value={stats2.por_estudios_nivel.FP_Tecnico}
                total={stats2.total}
                color="bg-green-500"
              />
              <EducationComparisonBar
                label="Secundario"
                value={stats2.por_estudios_nivel.Secundario}
                total={stats2.total}
                color="bg-yellow-500"
              />
              <EducationComparisonBar
                label="Sin datos"
                value={stats2.por_estudios_nivel.No_consta}
                total={stats2.total}
                color="bg-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Key Insight */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>Dato clave:</strong> El porcentaje de parlamentarios con estudios
            universitarios ha pasado del {uni1Pct}% en 1979 al {uni2Pct}% en 2023
            {changes.universitario_pct_change > 0 ? ', un aumento' : ', una disminución'} de{' '}
            {Math.abs(changes.universitario_pct_change).toFixed(1)} puntos porcentuales.
          </p>
        </div>
      </div>

      {/* Chamber Comparison */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-6">
          Composición por cámara
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-medium mb-4">I Legislatura</h4>
            <div className="flex gap-4">
              <div className="flex-1 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
                <p className="text-2xl font-bold">{stats1.por_camara.Congreso}</p>
                <p className="text-sm text-muted-foreground">Congreso</p>
              </div>
              <div className="flex-1 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg text-center">
                <p className="text-2xl font-bold">{stats1.por_camara.Senado}</p>
                <p className="text-sm text-muted-foreground">Senado</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">XV Legislatura</h4>
            <div className="flex gap-4">
              <div className="flex-1 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
                <p className="text-2xl font-bold">{stats2.por_camara.Congreso}</p>
                <p className="text-sm text-muted-foreground">Congreso</p>
              </div>
              <div className="flex-1 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg text-center">
                <p className="text-2xl font-bold">{stats2.por_camara.Senado}</p>
                <p className="text-sm text-muted-foreground">Senado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-side Hemiciclos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Hemiciclo - I Legislatura (1979)
          </h3>
          <Hemiciclo parlamentarios={dataByLegislature.I.filter(p => p.camara === 'Congreso')} />
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Hemiciclo - XV Legislatura (2023)
          </h3>
          <Hemiciclo parlamentarios={dataByLegislature.XV.filter(p => p.camara === 'Congreso')} />
        </div>
      </div>

      {/* Data Coverage Note */}
      <div className="bg-muted/50 border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Nota sobre los datos</h3>
        <p className="text-sm text-muted-foreground">
          Los datos de la I Legislatura provienen de las biografías oficiales del Congreso
          y los registros del Senado. El {((stats1.cobertura.estudios_con_datos / stats1.total) * 100).toFixed(0)}%
          tiene información educativa documentada. Para la XV Legislatura, la cobertura es del{' '}
          {((stats2.cobertura.estudios_con_datos / stats2.total) * 100).toFixed(0)}%.
        </p>
      </div>
    </div>
  );
}

interface EducationComparisonBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

function EducationComparisonBar({ label, value, total, color }: EducationComparisonBarProps) {
  const percentage = (value / total) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {value} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
