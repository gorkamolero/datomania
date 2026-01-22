import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Metodología Datomania! - Principios y estándares',
  description:
    'Cómo trabajamos en Datomania!: fuentes oficiales, código abierto, datos verificables. Nuestros principios de transparencia radical.',
};

export default function MetodologiaPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-brand/5 to-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Metodología
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Transparencia absoluta en el proceso de investigación, recopilación
            y verificación de datos sobre parlamentarios españoles.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="prose prose-slate max-w-none">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Principios generales
            </h2>
            <p className="mt-4 text-muted-foreground">
              Parlamentarios España es una plataforma de investigación dedicada
              a la transparencia y el acceso público a datos verificados sobre
              los representantes del Congreso de los Diputados y el Senado de
              España.
            </p>
            <p className="mt-4 text-muted-foreground">
              Nuestro trabajo se basa en tres pilares fundamentales:
            </p>
          </div>

          {/* Principles */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Fuentes oficiales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Todos los datos provienen exclusivamente de fuentes oficiales
                  y públicas: fichas parlamentarias del Congreso y Senado,
                  boletines oficiales y registros públicos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Metodología documentada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cada conjunto de datos incluye su propia metodología
                  detallada, documentando criterios de categorización,
                  limitaciones conocidas y decisiones de diseño.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Datos abiertos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acceso público y gratuito a todos los datos mediante API REST.
                  El código fuente es abierto y está disponible para auditoría
                  y contribuciones.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Methodology per data dump */}
          <div className="mt-16">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Metodología por conjunto de datos
            </h2>
            <p className="mt-4 text-muted-foreground">
              Cada investigación publicada en esta plataforma constituye un{' '}
              <strong>conjunto de datos independiente</strong> con su propia
              metodología específica. Esto garantiza rigor y transparencia
              adaptados al tipo de información recopilada.
            </p>

            <div className="mt-8 space-y-6">
              {/* Education & Professions */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">
                    Educación y Profesiones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Análisis de la formación académica y trayectorias
                    profesionales de los 615 parlamentarios de la XV
                    Legislatura.
                  </p>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Cobertura:
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-amber" />
                        350 diputados del Congreso
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-amber" />
                        265 senadores
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-amber" />
                        Aproximadamente 85% de cobertura completa
                      </li>
                    </ul>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/representantes/metodologia">
                      Ver metodología completa →
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Future data dumps placeholder */}
              <Card className="border-dashed bg-muted/20">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-muted-foreground">
                    Próximos conjuntos de datos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Estamos desarrollando nuevas investigaciones sobre actividad
                    parlamentaria, declaraciones de bienes, votaciones y más.
                    Cada una incluirá su metodología específica documentada.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Transparency & Open Data */}
          <div className="mt-16">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Compromiso con la transparencia
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                La transparencia no es solo un valor, es el fundamento de
                nuestra credibilidad. Por eso:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-amber" />
                  <span>
                    <strong className="text-foreground">
                      Documentamos decisiones:
                    </strong>{' '}
                    Cada categorización, normalización o interpretación está
                    justificada y documentada.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-amber" />
                  <span>
                    <strong className="text-foreground">
                      Reconocemos limitaciones:
                    </strong>{' '}
                    Somos explícitos sobre lo que no sabemos, los datos faltantes
                    y las áreas de incertidumbre.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-amber" />
                  <span>
                    <strong className="text-foreground">
                      Código abierto:
                    </strong>{' '}
                    Todo el código de scraping, procesamiento y API está
                    disponible en GitHub para revisión pública.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-amber" />
                  <span>
                    <strong className="text-foreground">
                      Versionado de datos:
                    </strong>{' '}
                    Cada conjunto de datos incluye información de versión,
                    última actualización y changelog.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* API Access */}
          <div className="mt-16">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Acceso a los datos
            </h2>
            <p className="mt-4 text-muted-foreground">
              Todos los datos están disponibles de forma pública y gratuita a
              través de:
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">
                    API REST
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Acceso programático completo a todos los conjuntos de datos
                    con endpoints documentados y ejemplos de uso.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">
                    Explorador web
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Interfaz visual para explorar, filtrar y visualizar los
                    datos sin necesidad de programación.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-16 rounded-lg border border-border bg-muted/30 p-6">
            <h3 className="font-serif text-xl font-semibold text-foreground">
              ¿Preguntas sobre la metodología?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Si tienes dudas sobre nuestro proceso de investigación, has
              detectado errores en los datos o quieres proponer mejoras, abre un
              issue en nuestro{' '}
              <a
                href="https://github.com/gorkamolero/datomania"
                className="text-brand underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                repositorio de GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
