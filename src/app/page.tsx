import Link from 'next/link';
import { getMetadata, formatLastUpdated, computeStats } from '@/projects/representantes/lib/data';

interface ProjectCard {
  id: string;
  title: string;
  description: string;
  href: string;
  status: 'live' | 'beta' | 'coming';
  stats: {
    total: number;
    completeness: number; // 0-100
    lastUpdated: string;
    sources: number;
  };
}

function getProjects(): ProjectCard[] {
  // Representantes project - pull real stats
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
        sources: 2, // Congreso + Senado
      },
    },
  ];
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

function ProjectCardComponent({ project }: { project: ProjectCard }) {
  const isClickable = project.status !== 'coming';

  const content = (
    <div className="p-8 bg-card border-3 border-border shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0px_0px_#000] transition-all">
      {/* Header */}
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
          {project.stats.total.toLocaleString('es-ES')}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        {/* Completeness */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-main rounded-full"
              style={{ width: `${project.stats.completeness}%` }}
            />
          </div>
          <span className="text-muted-foreground font-medium">
            {project.stats.completeness}% datos
          </span>
        </div>

        {/* Sources */}
        <span className="text-muted-foreground font-medium">
          {project.stats.sources} fuentes oficiales
        </span>

        {/* Last updated */}
        <span className="text-muted-foreground font-medium">
          Actualizado {project.stats.lastUpdated}
        </span>
      </div>
    </div>
  );

  if (!isClickable) {
    return <div className="opacity-60 cursor-not-allowed">{content}</div>;
  }

  return (
    <Link href={project.href} className="block">
      {content}
    </Link>
  );
}

export default function HomePage() {
  const projects = getProjects();

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        {/* Hero */}
        <h1 className="text-6xl md:text-8xl font-heading mb-4">
          Datomania!
        </h1>
        <p className="text-xl md:text-2xl font-medium text-muted-foreground mb-16 max-w-2xl">
          Datos públicos que deberían existir en España pero no existen. Los creamos nosotros.
        </p>

        {/* Projects */}
        <div className="space-y-8">
          {projects.map((project) => (
            <ProjectCardComponent key={project.id} project={project} />
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-16 flex flex-wrap items-center gap-6">
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
