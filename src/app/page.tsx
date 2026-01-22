import Link from 'next/link';
import { getMetadata, formatLastUpdated, computeStats } from '@/projects/representantes/lib/data';
import { GitHubCard } from '@/components/ui/github-card';

export default function HomePage() {
  const representantesMetadata = getMetadata();
  const statsI = computeStats('I');
  const statsXV = computeStats('XV');
  const totalParlamentarios = statsI.total + statsXV.total;
  const totalConDatos = statsI.cobertura.estudios_con_datos + statsXV.cobertura.estudios_con_datos;
  const completeness = Math.round((totalConDatos / totalParlamentarios) * 100);

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        {/* Hero */}
        <h1 className="text-6xl md:text-8xl font-heading mb-4">
          Datomania!
        </h1>
        <p className="text-xl md:text-2xl font-medium text-muted-foreground mb-8 max-w-2xl">
          Datos públicos que deberían existir en España pero no existen.
        </p>

        {/* GitHub Card */}
        <div className="mb-12">
          <GitHubCard href="https://github.com/gorkamolero/datomania" />
        </div>

        {/* Project Card */}
        <Link href="/representantes" className="block mb-12">
          <div className="p-8 bg-card border-3 border-border shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0px_0px_#000] transition-all">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl md:text-3xl font-heading uppercase tracking-tight">
                    Representantes
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded bg-green-500/20 text-green-700 border-green-500/50">
                    Disponible
                  </span>
                </div>
                <p className="text-muted-foreground font-medium max-w-md">
                  Educación y profesión de los parlamentarios españoles. Congreso y Senado, I y XV legislatura.
                </p>
              </div>
              <span className="text-5xl md:text-6xl font-heading text-main leading-none">
                {totalParlamentarios.toLocaleString('es-ES')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-24 h-3 bg-muted/50 border-2 border-border overflow-hidden">
                  <div
                    className="h-full bg-main"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
                <span className="text-muted-foreground font-medium">
                  {completeness}% datos
                </span>
              </div>
              <span className="text-muted-foreground font-medium">
                Actualizado {formatLastUpdated(representantesMetadata.lastUpdated)}
              </span>
            </div>
          </div>
        </Link>

        {/* Footer links */}
        <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-border">
          <Link
            href="/manifiesto"
            className="text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-main transition-colors"
          >
            Por qué hacemos esto →
          </Link>
          <a
            href="https://github.com/gorkamolero/datomania"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-main transition-colors"
          >
            GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
