'use client';

import Link from 'next/link';
import { Hemiciclo } from '@/components/visualizations/hemiciclo';
import { useEffect, useState } from 'react';
import type { Parlamentario } from '@/types/parlamentario';

interface Stats {
  total: number;
  por_camara: { Congreso: number; Senado: number };
  por_estudios_nivel: Record<string, number>;
  por_profesion_categoria: Record<string, number>;
  cobertura: {
    estudios_con_datos: number;
    profesion_con_datos: number;
  };
}

export default function HomePage() {
  const [parlamentarios, setParlamentarios] = useState<Parlamentario[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/representantes/parlamentarios?por_pagina=1000&camara=Congreso')
      .then((r) => r.json())
      .then((data) => setParlamentarios(data.parlamentarios || []));

    fetch('/api/representantes/stats')
      .then((r) => r.json())
      .then(setStats);
  }, []);

  const universitarios = stats
    ? stats.por_estudios_nivel.Universitario +
      stats.por_estudios_nivel.Universitario_inferido
    : 0;
  const politicosProfesionales = stats?.por_profesion_categoria.Politica || 0;
  const sinDatosEducacion = stats
    ? stats.total - stats.cobertura.estudios_con_datos
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero - datos crudos */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl md:text-6xl font-heading mb-2">
            615 Parlamentarios
          </h1>
          <p className="text-xl font-medium text-muted-foreground mb-8">
            XV Legislatura. Todos los datos públicos. Sin filtros.
          </p>

          {/* Big numbers grid */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
                <div className="text-4xl md:text-5xl font-heading text-main">
                  {stats.por_camara.Congreso}
                </div>
                <div className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Diputados
                </div>
              </div>
              <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
                <div className="text-4xl md:text-5xl font-heading text-main">
                  {stats.por_camara.Senado}
                </div>
                <div className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Senadores
                </div>
              </div>
              <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
                <div className="text-4xl md:text-5xl font-heading text-[#F59E0B]">
                  {Math.round((universitarios / stats.total) * 100)}%
                </div>
                <div className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Universitarios
                </div>
              </div>
              <div className="bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_#000]">
                <div className="text-4xl md:text-5xl font-heading text-[#DC2626]">
                  {politicosProfesionales}
                </div>
                <div className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Políticos Pro
                </div>
              </div>
            </div>
          )}

          {/* Quick facts - punchy */}
          <div className="bg-muted border-2 border-border p-4 mb-8 text-sm font-medium">
            <p className="mb-2">
              <strong>{universitarios}</strong> tienen título universitario.{' '}
              <strong>{stats?.por_estudios_nivel.FP_Tecnico || 0}</strong> tienen FP.{' '}
              <strong>{stats?.por_estudios_nivel.Secundario || 0}</strong> se quedaron en secundaria.
            </p>
            <p className="mb-2">
              <strong>{stats?.por_profesion_categoria.Profesional_liberal || 0}</strong> son abogados, médicos o similares.{' '}
              <strong>{stats?.por_profesion_categoria.Funcionario || 0}</strong> son funcionarios.{' '}
              <strong>{stats?.por_profesion_categoria.Manual || 0}</strong> han trabajado con las manos.
            </p>
            <p className="text-muted-foreground font-bold">
              De <strong className="text-foreground">{sinDatosEducacion}</strong> no tenemos datos de educación.
              Quizás no quieren que lo sepas.
            </p>
          </div>
        </div>
      </section>

      {/* Hemiciclo - el parlamento entero */}
      {parlamentarios.length > 0 && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#000]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading uppercase tracking-tight">
                  Congreso de los Diputados
                </h2>
                <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  350 diputados
                </span>
              </div>
              <Hemiciclo parlamentarios={parlamentarios} />
            </div>
          </div>
        </section>
      )}

      {/* Breakdown por categorías */}
      {stats && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Educación */}
              <div>
                <h3 className="text-lg font-heading uppercase tracking-tight mb-4">
                  Nivel de Estudios
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.por_estudios_nivel)
                    .sort(([, a], [, b]) => b - a)
                    .map(([nivel, count]) => (
                      <div key={nivel} className="flex items-center gap-2">
                        <div
                          className="h-6 bg-main border-2 border-border"
                          style={{
                            width: `${(count / stats.total) * 100}%`,
                            minWidth: count > 0 ? '20px' : '0',
                          }}
                        />
                        <span className="text-sm font-medium whitespace-nowrap">
                          {nivel.replace(/_/g, ' ')} ({count})
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Profesión */}
              <div>
                <h3 className="text-lg font-heading uppercase tracking-tight mb-4">
                  Categoría Profesional
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.por_profesion_categoria)
                    .sort(([, a], [, b]) => b - a)
                    .map(([categoria, count]) => (
                      <div key={categoria} className="flex items-center gap-2">
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
          </div>
        </section>
      )}

      {/* Links directos */}
      <section className="py-8 border-t-3 border-border">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap gap-4">
            <Link
              href="/representantes/parlamentarios"
              className="px-5 py-2.5 bg-main text-white border-2 border-border font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
            >
              Ver todos los parlamentarios →
            </Link>
            <Link
              href="/representantes/explorar"
              className="px-5 py-2.5 bg-background border-2 border-border font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
            >
              Explorar datos interactivo →
            </Link>
            <a
              href="/api/representantes/export?format=json"
              className="px-5 py-2.5 bg-background border-2 border-border font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
            >
              Descargar JSON →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
