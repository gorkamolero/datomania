'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs font-medium bg-foreground text-background border-2 border-border shadow-[2px_2px_0px_0px_#000] z-50 whitespace-normal min-w-[200px] max-w-[300px]">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent border-t-foreground" />
        </span>
      )}
    </span>
  );
}

function InfoIcon() {
  return (
    <svg
      className="w-4 h-4 text-muted-foreground cursor-help ml-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

interface DataStats {
  totalEntries: number;
  xvTotal: number;
  xvCongresoActive: number;
  xvSenadoActive: number;
  xvSenadoBaja: number;
  iTotal: number;
  educationCoverage: {
    withData: number;
    withoutData: number;
  };
  professionCoverage: {
    withData: number;
    withoutData: number;
  };
}

interface DataExplanationBoxProps {
  stats: DataStats;
}

export function DataExplanationBox({ stats }: DataExplanationBoxProps) {
  const educationPercent = Math.round(
    (stats.educationCoverage.withData / stats.totalEntries) * 100
  );
  const professionPercent = Math.round(
    (stats.professionCoverage.withData / stats.totalEntries) * 100
  );

  return (
    <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000]">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-heading uppercase tracking-tight">
          Sobre estos datos
        </h2>
        <Badge variant="outline">Open Data</Badge>
      </div>

      {/* Total entries breakdown */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total */}
          <div className="bg-muted border-2 border-border p-4">
            <div className="text-3xl font-heading text-main">
              {stats.totalEntries.toLocaleString('es-ES')}
            </div>
            <div className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Entradas totales
            </div>
          </div>

          {/* XV Legislature */}
          <div className="bg-muted border-2 border-border p-4">
            <div className="text-2xl font-heading">{stats.xvTotal}</div>
            <div className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center">
              XV Legislatura
              <Tooltip
                content={
                  <span>
                    <strong>Desglose:</strong>
                    <br />
                    {stats.xvCongresoActive} Congreso (activos)
                    <br />
                    {stats.xvSenadoActive} Senado (activos)
                    <br />
                    {stats.xvSenadoBaja} Senado (bajas)
                    <br />
                    <em className="text-xs opacity-80">
                      Las bajas son senadores que cesaron pero forman parte del
                      registro historico.
                    </em>
                  </span>
                }
              >
                <InfoIcon />
              </Tooltip>
            </div>
          </div>

          {/* I Legislature */}
          <div className="bg-muted border-2 border-border p-4">
            <div className="text-2xl font-heading">{stats.iTotal}</div>
            <div className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              I Legislatura
            </div>
          </div>
        </div>

        {/* XV Legislature detailed breakdown */}
        <div className="bg-background border-2 border-border p-4">
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3">
            XV Legislatura - Desglose
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex justify-between">
              <span>Congreso activos:</span>
              <span className="font-bold">{stats.xvCongresoActive}</span>
            </div>
            <div className="flex justify-between">
              <span>Senado activos:</span>
              <span className="font-bold">{stats.xvSenadoActive}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                Senado bajas:
                <Tooltip
                  content={
                    <span>
                      Los <strong>{stats.xvSenadoBaja}</strong> senadores de baja
                      fueron registrados antes de cesar. Mantenemos su informacion
                      para completitud historica.
                    </span>
                  }
                >
                  <InfoIcon />
                </Tooltip>
              </span>
              <span className="font-bold">{stats.xvSenadoBaja}</span>
            </div>
            <div className="flex justify-between font-bold border-t-2 border-border pt-2 md:border-t-0 md:pt-0">
              <span>Total XV:</span>
              <span className="text-main">{stats.xvTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data coverage */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wide">
          Cobertura de datos
        </h3>

        {/* Education coverage */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="flex items-center">
              Educacion
              <Tooltip
                content={
                  <span>
                    <strong>Fuentes de datos de educacion:</strong>
                    <br />
                    1. Datos oficiales del Congreso/Senado
                    <br />
                    2. Investigacion via Perplexity AI cuando faltan datos oficiales
                    <br />
                    <br />
                    <em>
                      &quot;No_consta&quot; significa que no hemos podido encontrar
                      informacion verificable sobre los estudios del parlamentario.
                    </em>
                  </span>
                }
              >
                <InfoIcon />
              </Tooltip>
            </span>
            <span className="font-bold">
              {educationPercent}% ({stats.educationCoverage.withData}/
              {stats.totalEntries})
            </span>
          </div>
          <div className="h-4 bg-muted border-2 border-border">
            <div
              className="h-full bg-main transition-all"
              style={{ width: `${educationPercent}%` }}
            />
          </div>
        </div>

        {/* Profession coverage */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="flex items-center">
              Profesion
              <Tooltip
                content={
                  <span>
                    <strong>Fuentes de datos de profesion:</strong>
                    <br />
                    1. Declaracion oficial en Congreso/Senado
                    <br />
                    2. Investigacion via Perplexity AI
                    <br />
                    <br />
                    <em>
                      Categorizamos las profesiones en: Manual, Oficina, Funcionario,
                      Profesional liberal, Empresario, Politica.
                    </em>
                  </span>
                }
              >
                <InfoIcon />
              </Tooltip>
            </span>
            <span className="font-bold">
              {professionPercent}% ({stats.professionCoverage.withData}/
              {stats.totalEntries})
            </span>
          </div>
          <div className="h-4 bg-muted border-2 border-border">
            <div
              className="h-full bg-[#F59E0B] transition-all"
              style={{ width: `${professionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Data sources explanation */}
      <div className="bg-muted border-2 border-border p-4 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wide mb-2 flex items-center">
          Fuentes de datos
          <Tooltip
            content={
              <span>
                Cada dato incluye trazabilidad de su origen. Puedes ver la fuente
                especifica en la ficha de cada parlamentario.
              </span>
            }
          >
            <InfoIcon />
          </Tooltip>
        </h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>
            <strong className="text-foreground">Congreso:</strong>{' '}
            <a
              href="https://www.congreso.es/opendata"
              target="_blank"
              rel="noopener noreferrer"
              className="text-main hover:underline"
            >
              congreso.es/opendata
            </a>
          </li>
          <li>
            <strong className="text-foreground">Senado:</strong>{' '}
            <a
              href="https://www.senado.es/web/ficopencuestam/opendata"
              target="_blank"
              rel="noopener noreferrer"
              className="text-main hover:underline"
            >
              senado.es/opendata
            </a>
          </li>
          <li>
            <strong className="text-foreground">Investigacion:</strong> Perplexity
            AI (con citas verificables)
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <a
          href="/api/representantes/export?format=csv"
          className="inline-flex items-center gap-2 px-4 py-2 bg-main text-white border-2 border-border font-bold uppercase tracking-wide text-sm shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Descargar CSV
        </a>
        <Link
          href="/representantes/api-docs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-background border-2 border-border font-bold uppercase tracking-wide text-sm shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          Documentacion API
        </Link>
      </div>
    </div>
  );
}
