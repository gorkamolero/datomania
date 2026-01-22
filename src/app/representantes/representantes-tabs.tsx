'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Hemiciclo } from '@/components/visualizations/hemiciclo';
import { EducationProfessionSankey } from '@/components/visualizations/education-profession-sankey';
import { LegislatureComparisonFlow } from '@/components/visualizations/legislature-comparison-flow';
import { EducationBarChart } from '@/components/charts/education-bar-chart';
import { ProfessionPieChart } from '@/components/charts/profession-pie-chart';
import { PartyDistribution } from '@/components/charts/party-distribution';
import { ParlamentariosTable } from './parlamentarios/parlamentarios-table';
import { computeStatsFromData } from './explorar/compute-stats';
import type { Parlamentario, Legislature } from '@/projects/representantes/types/parlamentario';
import { LEGISLATURE_INFO } from '@/projects/representantes/types/parlamentario';
interface RepresentantesTabsProps {
  dataByLegislature: Record<Legislature, {
    parlamentarios: Parlamentario[];
    circunscripciones: string[];
    partidos: string[];
  }>;
}

export function RepresentantesTabs({
  dataByLegislature,
}: RepresentantesTabsProps) {
  const [selectedLegislature, setSelectedLegislature] = useState<Legislature>('XV');

  // Get data for selected legislature
  const { parlamentarios, circunscripciones, partidos } = dataByLegislature[selectedLegislature];
  const legislatureInfo = LEGISLATURE_INFO[selectedLegislature];

  // Compute stats for selected legislature
  const stats = useMemo(
    () => computeStatsFromData(parlamentarios),
    [parlamentarios]
  );

  // Compute stats for both legislatures (for comparison)
  const statsI = useMemo(
    () => computeStatsFromData(dataByLegislature.I.parlamentarios),
    [dataByLegislature.I.parlamentarios]
  );
  const statsXV = useMemo(
    () => computeStatsFromData(dataByLegislature.XV.parlamentarios),
    [dataByLegislature.XV.parlamentarios]
  );

  // Filter only Congreso for hemiciclo
  const congresoMembers = useMemo(
    () => parlamentarios.filter((p) => p.camara === 'Congreso'),
    [parlamentarios]
  );

  const universitarios =
    stats.por_estudios_nivel.Universitario +
    stats.por_estudios_nivel.Universitario_inferido;
  const politicosProfesionales = stats.por_profesion_categoria.Politica || 0;
  const sinDatosEducacion = stats.total - stats.cobertura.estudios_con_datos;

  return (
    <>
      {/* Header with Legislature Selector */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-heading mb-2">
              {stats.total} Parlamentarios
            </h1>
            <p className="text-xl font-medium text-muted-foreground">
              {legislatureInfo.name} ({legislatureInfo.years}). Todos los datos públicos.
            </p>
          </div>

          {/* Legislature Selector */}
          <div className="flex gap-2">
            {(['I', 'XV'] as Legislature[]).map((leg) => (
              <button
                key={leg}
                onClick={() => setSelectedLegislature(leg)}
                className={`px-4 py-2 border-2 border-border font-bold uppercase tracking-wide text-sm transition-all ${
                  selectedLegislature === leg
                    ? 'bg-main text-white shadow-[4px_4px_0px_0px_#000]'
                    : 'bg-background hover:bg-muted shadow-[2px_2px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000]'
                }`}
              >
                {LEGISLATURE_INFO[leg].roman} ({LEGISLATURE_INFO[leg].years})
              </button>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="resumen" className="w-full">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="educacion">Educación</TabsTrigger>
          <TabsTrigger value="profesion">Profesión</TabsTrigger>
          <TabsTrigger value="partidos">Partidos</TabsTrigger>
          <TabsTrigger value="datos">Datos</TabsTrigger>
          <TabsTrigger value="comparar" className="ml-2 sm:ml-4 bg-main/10">I vs XV</TabsTrigger>
        </TabsList>

        {/* RESUMEN TAB */}
        <TabsContent value="resumen">
          <div className="space-y-8">
            {/* Big numbers grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                value={stats.por_camara.Congreso}
                label="Diputados"
                color="text-main"
              />
              <StatCard
                value={stats.por_camara.Senado}
                label="Senadores"
                color="text-main"
              />
              <StatCard
                value={`${Math.round((universitarios / stats.total) * 100)}%`}
                label="Universitarios"
                color="text-[#F59E0B]"
              />
              <StatCard
                value={politicosProfesionales}
                label="Políticos Pro"
                color="text-[#DC2626]"
              />
            </div>

            {/* Quick facts */}
            <div className="bg-muted border-2 border-border p-4 text-sm font-medium">
              <p className="mb-2">
                <strong>{universitarios}</strong> tienen título universitario.{' '}
                <strong>{stats.por_estudios_nivel.FP_Tecnico || 0}</strong> tienen
                FP.{' '}
                <strong>{stats.por_estudios_nivel.Secundario || 0}</strong> se
                quedaron en secundaria.
              </p>
              <p className="mb-2">
                <strong>
                  {stats.por_profesion_categoria.Profesional_liberal || 0}
                </strong>{' '}
                son abogados, médicos o similares.{' '}
                <strong>{stats.por_profesion_categoria.Funcionario || 0}</strong>{' '}
                son funcionarios.{' '}
                <strong>{stats.por_profesion_categoria.Manual || 0}</strong> han
                trabajado con las manos.
              </p>
              <p className="text-muted-foreground font-bold">
                De{' '}
                <strong className="text-foreground">{sinDatosEducacion}</strong>{' '}
                no tenemos datos de educación. Quizás no quieren que lo sepas.
              </p>
            </div>

            {/* Hemiciclo */}
            <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading uppercase tracking-tight">
                  Congreso de los Diputados
                </h2>
                <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {stats.por_camara.Congreso} diputados
                </span>
              </div>
              <Hemiciclo parlamentarios={congresoMembers} />
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Haz clic en un escaño para ver el perfil del parlamentario
              </p>
            </div>
          </div>
        </TabsContent>

        {/* EDUCACIÓN TAB */}
        <TabsContent value="educacion">
          <div className="space-y-8">
            {/* Stats summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.por_estudios_nivel)
                .sort(([, a], [, b]) => b - a)
                .map(([nivel, count]) => (
                  <StatCard
                    key={nivel}
                    value={count}
                    label={nivel.replace(/_/g, ' ')}
                    color="text-main"
                    small
                  />
                ))}
            </div>

            {/* Bar Chart */}
            <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000]">
              <h2 className="text-lg font-heading uppercase tracking-tight mb-4">
                Distribución por Nivel Educativo
              </h2>
              <EducationBarChart data={stats.por_estudios_nivel} />
            </div>

            {/* Sankey Diagram */}
            <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000]">
              <h2 className="text-lg font-heading uppercase tracking-tight mb-4">
                Flujo: Educación → Profesión
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                ¿A qué se dedican según su nivel de estudios?
              </p>
              <EducationProfessionSankey parlamentarios={parlamentarios} />
            </div>
          </div>
        </TabsContent>

        {/* PROFESIÓN TAB */}
        <TabsContent value="profesion">
          <div className="space-y-8">
            {/* Stats summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.por_profesion_categoria)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([categoria, count]) => (
                  <StatCard
                    key={categoria}
                    value={count}
                    label={categoria.replace(/_/g, ' ')}
                    color="text-[#F59E0B]"
                  />
                ))}
            </div>

            {/* Pie Chart */}
            <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000]">
              <h2 className="text-lg font-heading uppercase tracking-tight mb-4">
                Distribución por Categoría Profesional
              </h2>
              <ProfessionPieChart data={stats.por_profesion_categoria} />
            </div>

            {/* Breakdown */}
            <div className="bg-muted border-2 border-border p-6">
              <h3 className="text-lg font-heading uppercase tracking-tight mb-4">
                Desglose Completo
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.por_profesion_categoria)
                  .sort(([, a], [, b]) => b - a)
                  .map(([categoria, count]) => (
                    <div key={categoria} className="flex items-center gap-3">
                      <div
                        className="h-6 bg-[#F59E0B] border-2 border-border"
                        style={{
                          width: `${(count / stats.total) * 100}%`,
                          minWidth: count > 0 ? '20px' : '0',
                        }}
                      />
                      <span className="text-sm font-medium whitespace-nowrap">
                        {categoria.replace(/_/g, ' ')} ({count})
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* COMPARAR TAB */}
        <TabsContent value="comparar">
          <div className="space-y-8">
            {/* Intro */}
            <div className="bg-muted border-2 border-border p-4">
              <h2 className="text-lg font-heading uppercase tracking-tight mb-2">
                45 Años de Democracia
              </h2>
              <p className="text-sm text-muted-foreground">
                Compara la composición del Parlamento entre la I Legislatura (1979-1982)
                y la XV Legislatura (2023-presente). ¿Cómo ha cambiado el perfil de
                nuestros representantes?
              </p>
            </div>

            {/* Big numbers comparison */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ComparisonCard
                label="Total"
                valueI={statsI.total}
                valueXV={statsXV.total}
              />
              <ComparisonCard
                label="Universitarios"
                valueI={Math.round(((statsI.por_estudios_nivel.Universitario + statsI.por_estudios_nivel.Universitario_inferido) / statsI.total) * 100)}
                valueXV={Math.round(((statsXV.por_estudios_nivel.Universitario + statsXV.por_estudios_nivel.Universitario_inferido) / statsXV.total) * 100)}
                suffix="%"
              />
              <ComparisonCard
                label="Políticos Pro"
                valueI={Math.round(((statsI.por_profesion_categoria.Politica || 0) / statsI.total) * 100)}
                valueXV={Math.round(((statsXV.por_profesion_categoria.Politica || 0) / statsXV.total) * 100)}
                suffix="%"
              />
              <ComparisonCard
                label="Sin datos edu."
                valueI={Math.round(((statsI.total - statsI.cobertura.estudios_con_datos) / statsI.total) * 100)}
                valueXV={Math.round(((statsXV.total - statsXV.cobertura.estudios_con_datos) / statsXV.total) * 100)}
                suffix="%"
              />
            </div>

            {/* Education Flow Comparison */}
            <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000]">
              <h2 className="text-lg font-heading uppercase tracking-tight mb-2">
                Nivel Educativo: 1979 → 2023
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Cómo ha evolucionado la formación académica de los parlamentarios
              </p>
              <LegislatureComparisonFlow
                dataI={statsI.por_estudios_nivel}
                dataXV={statsXV.por_estudios_nivel}
                type="education"
                totalI={statsI.total}
                totalXV={statsXV.total}
              />
            </div>

            {/* Profession Flow Comparison */}
            <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000]">
              <h2 className="text-lg font-heading uppercase tracking-tight mb-2">
                Profesión: 1979 → 2023
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Cómo ha cambiado el perfil profesional de los representantes
              </p>
              <LegislatureComparisonFlow
                dataI={statsI.por_profesion_categoria}
                dataXV={statsXV.por_profesion_categoria}
                type="profession"
                totalI={statsI.total}
                totalXV={statsXV.total}
              />
            </div>
          </div>
        </TabsContent>

        {/* PARTIDOS TAB */}
        <TabsContent value="partidos">
          <div className="space-y-8">
            {/* Top parties */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.por_partido)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([partido, count]) => (
                  <StatCard
                    key={partido}
                    value={count}
                    label={partido}
                    color="text-main"
                  />
                ))}
            </div>

            {/* Party Distribution Chart */}
            <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000]">
              <h2 className="text-lg font-heading uppercase tracking-tight mb-4">
                Distribución por Partido
              </h2>
              <PartyDistribution data={stats.por_partido} />
            </div>

            {/* All parties list */}
            <div className="bg-muted border-2 border-border p-6">
              <h3 className="text-lg font-heading uppercase tracking-tight mb-4">
                Todos los Partidos ({Object.keys(stats.por_partido).length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.entries(stats.por_partido)
                  .sort(([, a], [, b]) => b - a)
                  .map(([partido, count]) => (
                    <div
                      key={partido}
                      className="flex justify-between text-sm font-medium p-2 bg-background border-2 border-border"
                    >
                      <span className="truncate">{partido}</span>
                      <span className="font-bold text-main">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* DATOS TAB */}
        <TabsContent value="datos">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground font-medium">
                {parlamentarios.length} parlamentarios de la {legislatureInfo.name}
              </p>
              <a
                href={`/api/representantes/export?format=json&legislature=${selectedLegislature}`}
                className="px-4 py-2 bg-background border-2 border-border font-bold uppercase tracking-wide text-sm shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
              >
                Descargar JSON
              </a>
            </div>

            <ParlamentariosTable
              parlamentarios={parlamentarios}
              circunscripciones={circunscripciones}
              partidos={partidos}
            />

            <div className="text-center pt-4">
              <Link
                href="/representantes/metodologia"
                className="text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-main"
              >
                Ver metodología de recolección de datos →
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

interface StatCardProps {
  value: number | string;
  label: string;
  color?: string;
  small?: boolean;
}

function StatCard({
  value,
  label,
  color = 'text-foreground',
  small = false,
}: StatCardProps) {
  return (
    <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
      <div
        className={`font-heading ${small ? 'text-2xl' : 'text-4xl md:text-5xl'} ${color}`}
      >
        {typeof value === 'number' ? value.toLocaleString('es-ES') : value}
      </div>
      <div className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

interface ComparisonCardProps {
  label: string;
  valueI: number;
  valueXV: number;
  suffix?: string;
}

function ComparisonCard({ label, valueI, valueXV, suffix = '' }: ComparisonCardProps) {
  const diff = valueXV - valueI;
  const isPositive = diff > 0;

  return (
    <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">I</span>
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">XV</span>
      </div>
      <div className="flex justify-between items-baseline gap-2">
        <span className="font-heading text-2xl text-muted-foreground">
          {valueI.toLocaleString('es-ES')}{suffix}
        </span>
        <span className="text-xl">→</span>
        <span className="font-heading text-2xl text-main">
          {valueXV.toLocaleString('es-ES')}{suffix}
        </span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {diff !== 0 && (
          <span className={`text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{diff}{suffix}
          </span>
        )}
      </div>
    </div>
  );
}
