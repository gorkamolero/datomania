import Link from 'next/link';

const dataProjects = [
  {
    id: 'representantes',
    title: 'Representantes XV Legislatura',
    description: '615 parlamentarios. Educación, profesión, partido, circunscripción.',
    count: 615,
    href: '/representantes',
    status: 'live',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-5xl md:text-7xl font-heading mb-4">
          Datomania
        </h1>
        <p className="text-xl font-medium text-muted-foreground mb-16">
          Datos públicos que deberían existir en España.
        </p>

        <div className="space-y-6">
          {dataProjects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className="block p-6 bg-card border-2 border-border shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-heading uppercase tracking-tight">
                    {project.title}
                  </h2>
                  <p className="text-muted-foreground mt-2 font-medium">
                    {project.description}
                  </p>
                </div>
                <span className="text-4xl md:text-5xl font-heading text-main">
                  {project.count}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-6">
          <Link
            href="/manifiesto"
            className="text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-main transition-colors"
          >
            Por qué hacemos esto &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
