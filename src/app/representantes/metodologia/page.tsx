import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { computeStats } from '@/projects/representantes/lib/data';

export const metadata: Metadata = {
  title: 'Metodología - Educación y Profesiones',
  description:
    'Metodología de recopilación y clasificación de datos sobre educación y profesiones de los parlamentarios de la XV Legislatura de España.',
};

export default function MetodologiaPage() {
  const stats = computeStats();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-brand/5 to-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/representantes">
                ← Volver a Educación y Profesiones
              </Link>
            </Button>
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Metodología
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Cómo se recopilaron y categorizaron los datos sobre educación y
            profesiones de los parlamentarios de la XV Legislatura.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Data Sources */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-semibold">
                Fuentes de datos
              </h2>
              <p className="mt-4 text-muted-foreground">
                Los datos se obtuvieron de las páginas web oficiales del
                Congreso de los Diputados y el Senado, que publican la
                información biográfica de cada parlamentario:
              </p>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="https://www.congreso.es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline"
                  >
                    Congreso de los Diputados
                  </a>{' '}
                  - Fichas biográficas de diputados
                </li>
                <li>
                  <a
                    href="https://www.senado.es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline"
                  >
                    Senado
                  </a>{' '}
                  - Fichas biográficas de senadores
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Los datos se recopilaron mediante scraping automatizado de las
                páginas oficiales, extrayendo la información de educación y
                trayectoria profesional publicada en cada ficha.
              </p>
            </div>

            {/* Nivel de Estudios */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-semibold">
                Clasificación de nivel educativo
              </h2>
              <p className="mt-4 text-muted-foreground">
                Los estudios de cada parlamentario se clasificaron en cinco
                categorías según el nivel educativo declarado:
              </p>
              <div className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Universitario</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Parlamentarios que han completado estudios universitarios
                      de grado, licenciatura, máster o doctorado. Incluye
                      títulos de universidades españolas y extranjeras
                      homologados.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Universitario (inferido)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Parlamentarios cuya profesión declarada requiere
                      necesariamente estudios universitarios (por ejemplo,
                      abogados, médicos, ingenieros) pero cuya ficha biográfica
                      no especifica explícitamente el título universitario. Esta
                      categoría permite capturar información cuando la fuente no
                      está completa.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">FP / Técnico</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Formación profesional, técnico superior, técnico
                      especialista, o equivalentes. Incluye ciclos formativos de
                      grado medio y superior, así como formaciones técnicas no
                      universitarias.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Secundario</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Educación secundaria, bachillerato, graduado escolar, ESO
                      o equivalente como máximo nivel de estudios declarado.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">No consta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      No se dispone de información sobre el nivel de estudios en
                      la ficha biográfica oficial, o la información es
                      insuficiente para realizar una clasificación.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Categoría Profesional */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-semibold">
                Clasificación de categoría profesional
              </h2>
              <p className="mt-4 text-muted-foreground">
                Las profesiones previas a la carrera política se agruparon en
                siete categorías según el tipo de actividad:
              </p>
              <div className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Profesionales liberales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Abogados, médicos, economistas, arquitectos, ingenieros,
                      consultores, psicólogos y otras profesiones que requieren
                      titulación universitaria y generalmente se ejercen de
                      forma autónoma o en despachos profesionales.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Funcionarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Empleados públicos: funcionarios de la administración
                      central, autonómica o local, profesores de educación
                      pública, policías, militares, jueces y fiscales.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Empresarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Propietarios o directivos de empresas, autónomos en
                      sectores comerciales, industriales o de servicios,
                      agricultores y ganaderos propietarios de explotaciones.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Carrera política</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Personas cuya actividad principal ha sido la política o
                      cargos en partidos políticos, sindicatos u organizaciones
                      sociales. Se incluyen asesores políticos y trabajadores de
                      estructuras partidarias.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trabajo de oficina</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Empleados en trabajos administrativos, técnicos o de
                      gestión en el sector privado que no son profesionales
                      liberales. Incluye administrativos, técnicos, empleados de
                      banca y seguros.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trabajo manual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Trabajadores manuales cualificados y no cualificados:
                      obreros, mecánicos, electricistas, albañiles, trabajadores
                      del sector servicios (hostelería, comercio, limpieza,
                      etc.).
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">No consta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      No se dispone de información suficiente sobre la profesión
                      previa en la ficha biográfica oficial.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Limitaciones */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-semibold">
                Limitaciones y cobertura de datos
              </h2>
              <p className="mt-4 text-muted-foreground">
                La calidad y completitud de los datos dependen de la información
                publicada en las fichas oficiales. Algunas limitaciones a tener
                en cuenta:
              </p>
              <div className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Información incompleta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      No todos los parlamentarios proporcionan información
                      completa sobre su educación y trayectoria profesional. El{' '}
                      {Math.round(
                        (stats.cobertura.estudios_sin_datos / stats.total) * 100
                      )}
                      % de los parlamentarios no tienen datos de nivel educativo
                      disponibles.
                    </p>
                    <p>
                      En el caso de las profesiones, el{' '}
                      {Math.round(
                        (stats.cobertura.profesion_sin_datos / stats.total) * 100
                      )}
                      % no tienen información suficiente para clasificar.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Heterogeneidad de formatos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Las fichas biográficas no siguen un formato estandarizado.
                    Algunos parlamentarios proporcionan información muy
                    detallada (títulos, universidades, fechas), mientras que
                    otros solo mencionan brevemente su profesión o estudios.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Clasificación subjetiva
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    La asignación de categorías profesionales implica cierto
                    grado de interpretación, especialmente para trayectorias
                    complejas o múltiples profesiones. En estos casos se ha
                    priorizado la actividad más reciente o más relevante según
                    el contexto.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Inferencias en educación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    La categoría &quot;Universitario (inferido)&quot; se basa en
                    el supuesto de que ciertas profesiones colegiadas requieren
                    titulación universitaria. Aunque esto es generalmente
                    correcto, puede haber excepciones o casos donde el título se
                    obtuvo en otro país con regulaciones diferentes.
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Update Info */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-semibold">
                Actualización de datos
              </h2>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Última actualización</CardTitle>
                  <CardDescription>
                    Los datos se actualizaron por última vez el{' '}
                    <span className="font-medium text-foreground">
                      21 de enero de 2026
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Los datos corresponden a los parlamentarios activos en la XV
                    Legislatura de las Cortes Generales (2023-actualidad). La
                    información se recopila de las fichas oficiales publicadas
                    en el momento de la actualización y puede cambiar si los
                    parlamentarios actualizan sus perfiles.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Transparency */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-semibold">
                Transparencia y código abierto
              </h2>
              <p className="mt-4 text-muted-foreground">
                Este proyecto es de código abierto. Los scripts de recopilación
                y clasificación de datos están disponibles para revisión,
                permitiendo verificar la metodología y reproducir el análisis.
              </p>
              <p className="mt-4 text-muted-foreground">
                Si detectas algún error o inconsistencia en los datos, puedes
                reportarlo a través del repositorio del proyecto.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-12 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/representantes/parlamentarios">
                  Ver parlamentarios
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/representantes/explorar">
                  Explorar datos
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/api/representantes/parlamentarios">
                  Acceder a la API
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
