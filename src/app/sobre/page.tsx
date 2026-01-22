import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Sobre el proyecto',
  description:
    'Sobre Parlamentarios España: plataforma de investigación para datos verificados sobre parlamentarios españoles. Misión, valores y cómo contribuir.',
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-brand/5 to-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Sobre el proyecto
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Una plataforma de investigación dedicada a la transparencia
            democrática mediante datos verificados y accesibles.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Mission */}
          <div>
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Nuestra misión
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">
                  Parlamentarios España
                </strong>{' '}
                es una plataforma de investigación independiente que recopila,
                verifica y publica datos sobre los parlamentarios del Congreso
                de los Diputados y el Senado de España.
              </p>
              <p>
                Nuestra misión es simple:{' '}
                <strong className="text-foreground">
                  proporcionar información rigurosa, verificable y accesible
                </strong>{' '}
                sobre quiénes son las personas que nos representan, sus
                trayectorias educativas y profesionales, y su actividad
                parlamentaria.
              </p>
              <p>
                Creemos que la democracia se fortalece con información
                transparente. Los datos que publicamos son siempre de fuentes
                oficiales, procesados con metodología documentada y accesibles
                para periodistas, investigadores, desarrolladores y ciudadanía
                en general.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mt-16">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Nuestros valores
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Rigor metodológico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Cada dato que publicamos está verificado con fuentes
                    oficiales. Cada decisión metodológica está documentada. Cada
                    limitación conocida está reconocida.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Transparencia absoluta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Metodología abierta, código abierto, datos abiertos. Nuestro
                    trabajo es auditable, reproducible y verificable por
                    cualquier persona.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Accesibilidad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Los datos son públicos y gratuitos. API REST sin
                    restricciones para acceso programático. Interfaz web
                    intuitiva para exploración visual.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Independencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sin afiliación política ni financiación partidista. Nuestro
                    único compromiso es con la veracidad de los datos y la
                    transparencia del proceso.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What we do */}
          <div className="mt-16">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Qué hacemos
            </h2>
            <div className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Recopilación de datos oficiales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Procesamos sistemáticamente las fichas parlamentarias
                    oficiales del Congreso de los Diputados y el Senado,
                    extrayendo información sobre educación, profesiones,
                    trayectorias y actividad parlamentaria.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Trabajamos únicamente con fuentes públicas y oficiales.
                    Nada de scraping opaco o datos de terceros sin verificar.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Verificación y estructuración
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Cada dato se verifica manualmente. Las ambigüedades se
                    documentan. La información incompleta se marca
                    explícitamente. Nada de inferencias sin fundamento.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Estructuramos los datos en formatos estandarizados para
                    facilitar análisis, visualizaciones y comparaciones.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Publicación abierta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Todos los datos se publican mediante API REST con
                    documentación completa. El código fuente está en GitHub bajo
                    licencia abierta.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cualquier persona puede usar, analizar, visualizar o
                    redistribuir los datos libremente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Open Source */}
          <div className="mt-16">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Código abierto
            </h2>
            <p className="mt-4 text-muted-foreground">
              Todo el código de esta plataforma es público y está disponible en
              GitHub. Incluye:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-amber" />
                <span>Scripts de scraping y procesamiento de datos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-amber" />
                <span>API REST (Next.js + Drizzle ORM + PostgreSQL)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-amber" />
                <span>Interfaz web (Next.js + Tailwind CSS)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-amber" />
                <span>
                  Tests automatizados y scripts de validación de datos
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <Button asChild>
                <a
                  href="https://github.com/spanishflu-est1918/parlamentarios-espana"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver en GitHub →
                </a>
              </Button>
            </div>
          </div>

          {/* Contribute */}
          <div className="mt-16">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Cómo contribuir
            </h2>
            <p className="mt-4 text-muted-foreground">
              Este es un proyecto comunitario y abierto. Hay muchas formas de
              contribuir:
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">
                    Reportar errores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Si encuentras datos incorrectos, inconsistencias o bugs en
                    la plataforma, abre un issue en GitHub con los detalles.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">
                    Mejorar datos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Si tienes información verificada que complete o corrija
                    nuestros datos, envía un pull request con las fuentes
                    oficiales.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">
                    Proponer mejoras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ideas para nuevas visualizaciones, análisis o conjuntos de
                    datos son bienvenidas. Discutámoslas en GitHub Issues.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">
                    Contribuir código
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Mejoras en la API, interfaz web, procesamiento de datos o
                    tests son siempre bienvenidas mediante pull requests.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-16">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Contacto y feedback
            </h2>
            <div className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    GitHub Issues
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Para reportar errores, proponer mejoras, hacer preguntas
                    sobre metodología o contribuir al proyecto, usa GitHub
                    Issues. Es el canal principal de comunicación para este
                    proyecto.
                  </p>
                  <Button asChild variant="outline">
                    <a
                      href="https://github.com/spanishflu-est1918/parlamentarios-espana/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abrir issue →
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <div className="rounded-lg border border-border bg-muted/30 p-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Nota:</strong> Este es un
                  proyecto independiente sin ánimo de lucro. No tenemos equipo
                  de soporte ni horarios de respuesta garantizados. Las
                  contribuciones son voluntarias y se gestionan según
                  disponibilidad.
                </p>
              </div>
            </div>
          </div>

          {/* Credits */}
          <div className="mt-16">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Créditos y licencia
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Datos:</strong> Todos los
                datos provienen de fuentes oficiales públicas del Congreso de
                los Diputados y el Senado de España. Los datos procesados se
                publican bajo licencia abierta para uso y redistribución libre.
              </p>
              <p>
                <strong className="text-foreground">Código:</strong> El código
                fuente está disponible en{' '}
                <a
                  href="https://github.com/spanishflu-est1918/parlamentarios-espana"
                  className="text-brand underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>{' '}
                bajo licencia MIT. Eres libre de usar, modificar y redistribuir
                el código.
              </p>
              <p>
                <strong className="text-foreground">Proyecto:</strong>{' '}
                Parlamentarios España es un proyecto independiente sin afiliación
                política ni financiación partidista.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
