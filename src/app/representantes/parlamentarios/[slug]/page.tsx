import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getParlamentarios, getParlamentarioBySlug } from '@/projects/representantes/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all parlamentarios
export async function generateStaticParams() {
  const parlamentarios = getParlamentarios();
  return parlamentarios.map((p) => ({
    slug: p.slug,
  }));
}

// Generate metadata for each parlamentario
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parlamentario = getParlamentarioBySlug(slug);

  if (!parlamentario) {
    return {
      title: 'Parlamentario no encontrado',
    };
  }

  return {
    title: parlamentario.nombre_completo,
    description: `Perfil de ${parlamentario.nombre_completo}, ${parlamentario.partido} - ${parlamentario.camara}. Educación y profesión.`,
  };
}

// Labels for display
const ESTUDIOS_LABELS: Record<string, string> = {
  Universitario: 'Universitario',
  Universitario_inferido: 'Universitario (inferido)',
  FP_Tecnico: 'Formación Profesional / Técnico',
  Secundario: 'Secundario',
  No_consta: 'No consta',
};

const PROFESION_LABELS: Record<string, string> = {
  Profesional_liberal: 'Profesional liberal',
  Funcionario: 'Funcionario',
  Empresario: 'Empresario',
  Politica: 'Carrera política',
  Oficina: 'Trabajo de oficina',
  Manual: 'Trabajo manual',
  No_consta: 'No consta',
};

export default async function ParlamentarioPage({ params }: PageProps) {
  const { slug } = await params;
  const parlamentario = getParlamentarioBySlug(slug);

  if (!parlamentario) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/representantes" className="hover:text-foreground">
            Educación Profesional
          </Link>
          {' / '}
          <Link
            href="/representantes/parlamentarios"
            className="hover:text-foreground"
          >
            Parlamentarios
          </Link>
          {' / '}
          <span className="text-foreground">{parlamentario.nombre_completo}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start gap-4">
            <div
              className="h-4 w-4 rounded-full mt-2"
              style={{ backgroundColor: parlamentario.partido_color }}
            />
            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
                {parlamentario.nombre_completo}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{parlamentario.partido}</Badge>
                <Badge variant="outline">{parlamentario.camara}</Badge>
                <span className="text-muted-foreground">
                  {parlamentario.circunscripcion}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Educación</CardTitle>
              <CardDescription>Formación académica declarada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nivel clasificado
                </p>
                <p className="text-lg">
                  {ESTUDIOS_LABELS[parlamentario.estudios_nivel]}
                </p>
              </div>
              {parlamentario.estudios_raw && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Descripción completa
                  </p>
                  <p className="text-base leading-relaxed">
                    {parlamentario.estudios_raw}
                  </p>
                </div>
              )}
              {!parlamentario.estudios_raw && (
                <p className="text-muted-foreground italic">
                  No hay información adicional disponible.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Profession */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Profesión</CardTitle>
              <CardDescription>
                Trayectoria profesional previa a la política
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Categoría clasificada
                </p>
                <p className="text-lg">
                  {PROFESION_LABELS[parlamentario.profesion_categoria]}
                </p>
              </div>
              {parlamentario.profesion_raw && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Descripción completa
                  </p>
                  <p className="text-base leading-relaxed">
                    {parlamentario.profesion_raw}
                  </p>
                </div>
              )}
              {!parlamentario.profesion_raw && (
                <p className="text-muted-foreground italic">
                  No hay información adicional disponible.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-serif text-lg">
              Información adicional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Cámara
                </dt>
                <dd>{parlamentario.camara}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Grupo parlamentario
                </dt>
                <dd>{parlamentario.grupo_parlamentario}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Circunscripción
                </dt>
                <dd>{parlamentario.circunscripcion}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Fecha de alta
                </dt>
                <dd>{parlamentario.fecha_alta}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Source Link */}
        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            Datos obtenidos de la ficha oficial del{' '}
            {parlamentario.camara === 'Congreso' ? 'Congreso de los Diputados' : 'Senado'}.
          </p>
          <Button asChild variant="link" className="mt-1 h-auto p-0 text-sm">
            <a
              href={parlamentario.url_ficha}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver ficha oficial →
            </a>
          </Button>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/representantes/parlamentarios">
              ← Volver a la lista
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
