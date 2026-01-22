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
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
            615 parlamentarios
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            XV Legislatura. Todos los datos públicos. Sin filtros.
          </p>

          {/* Big numbers grid */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-4xl md:text-5xl font-bold text-brand">
                  {stats.por_camara.Congreso}
                </div>
                <div className="text-sm text-muted-foreground">
                  diputados
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-4xl md:text-5xl font-bold text-brand">
                  {stats.por_camara.Senado}
                </div>
                <div className="text-sm text-muted-foreground">
                  senadores
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-4xl md:text-5xl font-bold text-amber-500">
                  {Math.round((universitarios / stats.total) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  universitarios
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-4xl md:text-5xl font-bold text-rose-500">
                  {politicosProfesionales}
                </div>
                <div className="text-sm text-muted-foreground">
                  políticos profesionales
                </div>
              </div>
            </div>
          )}

          {/* Quick facts - punchy */}
          <div className="bg-muted/50 rounded-lg p-4 mb-8 text-sm">
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
            <p className="text-muted-foreground">
              De <strong>{sinDatosEducacion}</strong> no tenemos datos de educación.
              Quizás no quieren que lo sepas.
            </p>
          </div>
        </div>
      </section>

      {/* Hemiciclo - el parlamento entero */}
      {parlamentarios.length > 0 && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Congreso de los Diputados</h2>
                <span className="text-sm text-muted-foreground">
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
                <h3 className="text-lg font-semibold mb-4">Nivel de estudios</h3>
                <div className="space-y-2">
                  {Object.entries(stats.por_estudios_nivel)
                    .sort(([, a], [, b]) => b - a)
                    .map(([nivel, count]) => (
                      <div key={nivel} className="flex items-center gap-2">
                        <div
                          className="h-6 bg-brand/80 rounded"
                          style={{
                            width: `${(count / stats.total) * 100}%`,
                            minWidth: count > 0 ? '20px' : '0',
                          }}
                        />
                        <span className="text-sm whitespace-nowrap">
                          {nivel.replace(/_/g, ' ')} ({count})
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Profesión */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Categoría profesional</h3>
                <div className="space-y-2">
                  {Object.entries(stats.por_profesion_categoria)
                    .sort(([, a], [, b]) => b - a)
                    .map(([categoria, count]) => (
                      <div key={categoria} className="flex items-center gap-2">
                        <div
                          className="h-6 bg-amber-500/80 rounded"
                          style={{
                            width: `${(count / stats.total) * 100}%`,
                            minWidth: count > 0 ? '20px' : '0',
                          }}
                        />
                        <span className="text-sm whitespace-nowrap">
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
      <section className="py-8 border-t border-border">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap gap-4">
            <Link
              href="/representantes/parlamentarios"
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
            >
              Ver todos los parlamentarios →
            </Link>
            <Link
              href="/representantes/explorar"
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Explorar datos interactivo →
            </Link>
            <a
              href="/api/representantes/export?format=json"
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Descargar JSON →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
