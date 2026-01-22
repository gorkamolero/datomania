import Link from 'next/link';
import { getMetadata, formatLastUpdated, computeStats, compareLegislatures } from '@/projects/representantes/lib/data';

interface ProjectCard {
  id: string;
  title: string;
  description: string;
  href: string;
  status: 'live' | 'beta' | 'coming';
  stats?: {
    total: number;
    completeness: number;
    lastUpdated: string;
    sources: number;
  };
}

function getProjects(): ProjectCard[] {
  const representantesMetadata = getMetadata();
  const representantesStats = computeStats('XV');
  const completeness = Math.round(
    (representantesStats.cobertura.estudios_con_datos / representantesStats.total) * 100
  );

  return [
    {
      id: 'representantes',
      title: 'Representantes',
      description: 'Educación y profesión de los parlamentarios españoles. Congreso y Senado, I y XV legislatura.',
      href: '/representantes',
      status: 'live',
      stats: {
        total: representantesStats.total,
        completeness,
        lastUpdated: formatLastUpdated(representantesMetadata.lastUpdated),
        sources: 2,
      },
    },
    {
      id: 'ayuntamientos',
      title: 'Ayuntamientos',
      description: 'Concejales de los principales municipios españoles.',
      href: '#',
      status: 'coming',
    },
    {
      id: 'contratos',
      title: 'Contratos Públicos',
      description: 'Adjudicaciones y licitaciones del sector público.',
      href: '#',
      status: 'coming',
    },
  ];
}

function getHighlight() {
  const comparison = compareLegislatures('I', 'XV');
  const statsI = comparison.stats1;
  const statsXV = comparison.stats2;

  const uniI = Math.round((statsI.por_estudios_nivel.Universitario / statsI.total) * 100);
  const uniXV = Math.round((statsXV.por_estudios_nivel.Universitario / statsXV.total) * 100);

  return {
    statI: uniI,
    statXV: uniXV,
    label: 'universitarios',
  };
}

function StatusBadge({ status }: { status: 'live' | 'beta' | 'coming' }) {
  const styles = {
    live: 'bg-green-500/20 text-green-700 border-green-500/50',
    beta: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50',
    coming: 'bg-muted text-muted-foreground border-border',
  };
  const labels = {
    live: 'Disponible',
    beta: 'Beta',
    coming: 'Próximamente',
  };

  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function ProjectCardLive({ project }: { project: ProjectCard }) {
  return (
    <Link href={project.href} className="block">
      <div className="p-8 bg-card border-3 border-border shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0px_0px_#000] transition-all">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-heading uppercase tracking-tight">
                {project.title}
              </h2>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-muted-foreground font-medium max-w-md">
              {project.description}
            </p>
          </div>
          <span className="text-5xl md:text-6xl font-heading text-main leading-none">
            {project.stats?.total.toLocaleString('es-ES')}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-main rounded-full"
                style={{ width: `${project.stats?.completeness}%` }}
              />
            </div>
            <span className="text-muted-foreground font-medium">
              {project.stats?.completeness}% datos
            </span>
          </div>
          <span className="text-muted-foreground font-medium">
            {project.stats?.sources} fuentes oficiales
          </span>
          <span className="text-muted-foreground font-medium">
            Actualizado {project.stats?.lastUpdated}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProjectCardComing({ project }: { project: ProjectCard }) {
  return (
    <div className="p-6 border-2 border-dashed border-border/50 opacity-50">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-heading uppercase tracking-tight text-muted-foreground">
          {project.title}
        </h3>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-sm text-muted-foreground/70 mt-1">
        {project.description}
      </p>
    </div>
  );
}

function HighlightSection({ highlight }: { highlight: ReturnType<typeof getHighlight> }) {
  return (
    <div className="border-3 border-border p-8 bg-main/5">
      <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">
        1979 → 2023
      </p>
      <div className="flex items-baseline gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl md:text-5xl font-heading">{highlight.statI}%</span>
          <span className="text-2xl text-muted-foreground">→</span>
          <span className="text-4xl md:text-5xl font-heading text-main">{highlight.statXV}%</span>
        </div>
        <span className="text-lg text-muted-foreground font-medium">
          {highlight.label}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        En 1979, el {highlight.statI}% de los parlamentarios tenían estudios universitarios.
        Hoy son el {highlight.statXV}%.
      </p>
    </div>
  );
}

export default function HomePage() {
  const projects = getProjects();
  const highlight = getHighlight();
  const liveProjects = projects.filter((p) => p.status === 'live');
  const comingProjects = projects.filter((p) => p.status === 'coming');

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        {/* Hero */}
        <h1 className="text-6xl md:text-8xl font-heading mb-4">
          Datomania!
        </h1>
        <p className="text-xl md:text-2xl font-medium text-muted-foreground mb-12 max-w-2xl">
          Datos públicos que deberían existir en España pero no existen. Los creamos nosotros.
        </p>

        {/* Highlight */}
        <div className="mb-12">
          <HighlightSection highlight={highlight} />
        </div>

        {/* Live Projects */}
        <div className="space-y-6 mb-12">
          {liveProjects.map((project) => (
            <ProjectCardLive key={project.id} project={project} />
          ))}
        </div>

        {/* Coming Soon */}
        {comingProjects.length > 0 && (
          <div className="mb-12">
            <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">
              En desarrollo
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comingProjects.map((project) => (
                <ProjectCardComing key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Footer links */}
        <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-border">
          <Link
            href="/manifiesto"
            className="text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-main transition-colors"
          >
            Por qué hacemos esto →
          </Link>
          <Link
            href="/metodologia"
            className="text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-main transition-colors"
          >
            Metodología →
          </Link>
        </div>
      </div>
    </div>
  );
}
