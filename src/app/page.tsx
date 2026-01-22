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
  // Future projects go here
];

export default function HomePage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-bold mb-2">Datocracia</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Datos públicos que deberían existir en España.
        </p>

        <div className="space-y-4">
          {dataProjects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className="block p-6 bg-card border border-border rounded-lg hover:border-brand transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{project.title}</h2>
                  <p className="text-muted-foreground mt-1">{project.description}</p>
                </div>
                <span className="text-3xl font-bold text-brand">{project.count}</span>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-12">
          Más proyectos de datos próximamente.
        </p>
      </div>
    </div>
  );
}
